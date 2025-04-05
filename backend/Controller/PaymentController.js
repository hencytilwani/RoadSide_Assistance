import Payment from '../Models/Payment.js';
import User from '../Models/Users.js';
import ServicesProvided from '../Models/ServiceProvidedModel.js';
import Subscription from '../Models/SubscriptionModel.js';

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const {
      user_id,
      service_id,
      subscription_id,
      amount,
      payment_method,
      transaction_id,
      status
    } = req.body;

    // Validate user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate service exists if service_id is provided
    if (service_id) {
      const service = await ServicesProvided.findByPk(service_id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
    }

    // Validate subscription exists if subscription_id is provided
    if (subscription_id) {
      const subscription = await Subscription.findByPk(subscription_id);
      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }
    }

    // Create new payment
    const newPayment = await Payment.create({
      user_id,
      service_id,
      subscription_id,
      amount,
      payment_method,
      transaction_id,
      status: status || 'pending',
      payment_date: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });

    // Generate invoice URL (this would typically be handled by a separate service)
    const invoiceUrl = `https://yourdomain.com/invoices/${newPayment.payment_id}`;
    
    // Update the payment with the invoice URL
    await newPayment.update({
      invoice_url: invoiceUrl
    });

    // If this is a subscription payment, update the subscription
    if (subscription_id) {
      await Subscription.update(
        { 
          payment_id: newPayment.payment_id,
          status: status === 'successful' ? 'active' : 'pending',
          updated_at: new Date()
        },
        { where: { subscription_id } }
      );
    }

    res.status(201).json({
      message: 'Payment created successfully',
      payment: newPayment
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Server error during payment creation', error: error.message });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: User, attributes: ['user_id', 'name', 'email'] },
        { model: ServicesProvided, attributes: ['service_id', 'service_type', 'total_cost'] },
        { model: Subscription, attributes: ['subscription_id', 'plan_id', 'start_date', 'end_date'] }
      ]
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error while fetching payments', error: error.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findByPk(id, {
      include: [
        { model: User, attributes: ['user_id', 'name', 'email'] },
        { model: ServicesProvided, attributes: ['service_id', 'service_type', 'total_cost'] },
        { model: Subscription, attributes: ['subscription_id', 'plan_id', 'start_date', 'end_date'] }
      ]
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Server error while fetching payment', error: error.message });
  }
};

// Get payments by user ID
export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payments = await Payment.findAll({
      where: { user_id: userId },
      include: [
        { model: ServicesProvided, attributes: ['service_id', 'service_type', 'total_cost'] },
        { model: Subscription, attributes: ['subscription_id', 'plan_id', 'start_date', 'end_date'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Server error while fetching user payments', error: error.message });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'successful', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status
    payment.status = status;
    payment.updated_at = new Date();
    await payment.save();

    // If this is a subscription payment, update the subscription status accordingly
    if (payment.subscription_id) {
      let subscriptionStatus;
      switch (status) {
        case 'successful':
          subscriptionStatus = 'active';
          break;
        case 'failed':
          subscriptionStatus = 'expired';
          break;
        case 'refunded':
          subscriptionStatus = 'cancelled';
          break;
        default:
          subscriptionStatus = 'pending';
      }

      await Subscription.update(
        { 
          status: subscriptionStatus,
          updated_at: new Date()
        },
        { where: { subscription_id: payment.subscription_id } }
      );
    }

    res.status(200).json({ 
      message: 'Payment status updated successfully',
      payment 
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Server error while updating payment status', error: error.message });
  }
};

// Process payment webhook (for integration with payment gateways like Stripe/PayPal)
export const processPaymentWebhook = async (req, res) => {
  try {
    const { transaction_id, status, amount, metadata } = req.body;

    // Find the payment by transaction ID
    const payment = await Payment.findOne({ where: { transaction_id } });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment information
    payment.status = status;
    payment.amount = amount || payment.amount;
    payment.updated_at = new Date();
    await payment.save();

    // Handle subscription updates if this is a subscription payment
    if (payment.subscription_id && status === 'successful') {
      const subscription = await Subscription.findByPk(payment.subscription_id);
      if (subscription) {
        subscription.status = 'active';
        subscription.updated_at = new Date();
        await subscription.save();
      }
    }

    // Return success response (many payment webhooks expect a 200 response)
    res.status(200).json({ 
      message: 'Webhook processed successfully',
      updated: payment.payment_id
    });
  } catch (error) {
    console.error('Error processing payment webhook:', error);
    // Many payment webhook services expect a 200 status even on error
    res.status(200).json({ 
      message: 'Webhook received with errors',
      error: error.message 
    });
  }
};

// Generate invoice for a payment
export const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findByPk(id, {
      include: [
        { model: User, attributes: ['user_id', 'name', 'email', 'address'] },
        { model: ServicesProvided, attributes: ['service_id', 'service_type', 'description', 'parts_used', 'labor_cost', 'parts_cost', 'additional_charges', 'total_cost'] },
        { model: Subscription, include: [{ 
          model: SubscriptionPlan, 
          attributes: ['name', 'description', 'price', 'billing_cycle'] 
        }]}
      ]
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // In a real implementation, you would generate a PDF invoice here
    // For this example, we'll just return the payment details formatted for an invoice
    
    // Format the invoice data
    const invoiceData = {
      invoice_number: `INV-${payment.payment_id}`,
      date: new Date(payment.payment_date).toLocaleDateString(),
      customer: {
        name: payment.User.name,
        email: payment.User.email,
        address: payment.User.address
      },
      payment_details: {
        method: payment.payment_method,
        status: payment.status,
        transaction_id: payment.transaction_id
      },
      items: [],
      total_amount: payment.amount
    };

    // Add service details if this is a service payment
    if (payment.ServicesProvided) {
      invoiceData.items.push({
        type: 'Service',
        description: payment.ServicesProvided.description,
        details: {
          service_type: payment.ServicesProvided.service_type,
          labor_cost: payment.ServicesProvided.labor_cost,
          parts_cost: payment.ServicesProvided.parts_cost,
          additional_charges: payment.ServicesProvided.additional_charges
        },
        amount: payment.ServicesProvided.total_cost
      });
    }

    // Add subscription details if this is a subscription payment
    if (payment.Subscription && payment.Subscription.SubscriptionPlan) {
      invoiceData.items.push({
        type: 'Subscription',
        description: payment.Subscription.SubscriptionPlan.name,
        details: {
          plan_description: payment.Subscription.SubscriptionPlan.description,
          billing_cycle: payment.Subscription.SubscriptionPlan.billing_cycle,
          start_date: new Date(payment.Subscription.start_date).toLocaleDateString(),
          end_date: new Date(payment.Subscription.end_date).toLocaleDateString()
        },
        amount: payment.Subscription.SubscriptionPlan.price
      });
    }

    // Update invoice URL field
    await payment.update({
      invoice_url: `https://yourdomain.com/invoices/${payment.payment_id}`
    });

    res.status(200).json({ 
      message: 'Invoice generated successfully',
      invoice: invoiceData 
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Server error while generating invoice', error: error.message });
  }
};

// Get payment statistics
export const getPaymentStatistics = async (req, res) => {
  try {
    // Get overall payment stats
    const totalPayments = await Payment.count();
    
    // Calculate total revenue
    const revenueResult = await Payment.sum('amount', {
      where: { status: 'successful' }
    });
    const totalRevenue = revenueResult || 0;
    
    // Get payment counts by status
    const successfulPayments = await Payment.count({ where: { status: 'successful' } });
    const pendingPayments = await Payment.count({ where: { status: 'pending' } });
    const failedPayments = await Payment.count({ where: { status: 'failed' } });
    const refundedPayments = await Payment.count({ where: { status: 'refunded' } });
    
    // Get payment counts by type
    const servicePayments = await Payment.count({ where: { service_id: { [Payment.sequelize.Op.ne]: null } } });
    const subscriptionPayments = await Payment.count({ where: { subscription_id: { [Payment.sequelize.Op.ne]: null } } });
    
    // Get recent payments
    const recentPayments = await Payment.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [
        { model: User, attributes: ['name'] }
      ],
      attributes: ['payment_id', 'amount', 'status', 'payment_date']
    });

    res.status(200).json({
      totalPayments,
      totalRevenue,
      statusBreakdown: {
        successful: successfulPayments,
        pending: pendingPayments,
        failed: failedPayments,
        refunded: refundedPayments
      },
      typeBreakdown: {
        service: servicePayments,
        subscription: subscriptionPayments
      },
      recentPayments
    });
  } catch (error) {
    console.error('Error getting payment statistics:', error);
    res.status(500).json({ message: 'Server error while getting payment statistics', error: error.message });
  }
};

// Delete a payment (this might be limited to admin use or for failed payments)
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Only allow deletion of pending or failed payments
    if (payment.status === 'successful' || payment.status === 'refunded') {
      return res.status(400).json({ 
        message: 'Cannot delete successful or refunded payments' 
      });
    }
    
    await payment.destroy();
    
    res.status(200).json({ 
      message: 'Payment deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Server error while deleting payment', error: error.message });
  }
};