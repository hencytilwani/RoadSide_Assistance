import db from '../Models/index.js';
import stripe from 'stripe';
import { sendEmail } from '../Utils/emailService.js';

const { Subscription, Subscription_Plan, User, Payment } = db;

// Check if the Stripe API key is available in environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY environment variable is not set.');
  // We'll still initialize Stripe but it won't be functional
}

// Initialize Stripe with the API key from environment variables
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_development');

// Rest of your controller code remains the same...
// Get all available subscription plans
export const getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await Subscription_Plan.findAll({
      where: { is_active: true },
      attributes: [
        'plan_id',
        'name',
        'description',
        'price',
        'billing_cycle',
        'features',
        'max_free_towing_distance',
        'priority_level'
      ]
    });

    res.status(200).json({ plans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Server error while fetching subscription plans', error: error.message });
  }
};

// Get user's current subscription
export const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user; // Assuming user ID is available from auth middleware
    
    const subscription = await Subscription.findOne({
      where: { user_id: userId, status: 'active' },
      include: [{
        model: Subscription_Plan,
        attributes: ['name', 'description', 'features', 'max_free_towing_distance', 'priority_level']
      }]
    });
    
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({ message: 'Server error while fetching subscription details', error: error.message });
  }
};

// Subscribe to a plan
export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const { plan_id, payment_method, auto_renewal = true } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if plan exists and is active
    const plan = await Subscription_Plan.findOne({ 
      where: { plan_id, is_active: true } 
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found or inactive' });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      where: { user_id: userId, status: 'active' }
    });
    
    if (existingSubscription) {
      return res.status(400).json({ 
        message: 'User already has an active subscription',
        current_subscription: existingSubscription
      });
    }

    // Process payment
    const paymentData = {
      amount: plan.price,
      payment_method,
      status: 'pending',
      payment_date: new Date(),
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Create payment record
    const payment = await Payment.create(paymentData);

    // Calculate subscription end date based on billing cycle
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (plan.billing_cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billing_cycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create subscription record
    const newSubscription = await Subscription.create({
      user_id: userId,
      plan_id: plan.plan_id,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      payment_id: payment.payment_id,
      auto_renewal,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update user's subscription plan ID
    await User.update(
      { subscription_plan_id: plan.plan_id },
      { where: { user_id: userId } }
    );

    // Update payment with subscription ID
    await Payment.update(
      { 
        subscription_id: newSubscription.subscription_id,
        status: 'successful'
      },
      { where: { payment_id: payment.payment_id } }
    );

    // Send confirmation email
    sendEmail(user.email, 'Subscription Confirmation', `Thank you for subscribing to our ${plan.name} plan!`);

    res.status(201).json({ 
      message: 'Subscription created successfully',
      subscription: newSubscription,
      payment: {
        payment_id: payment.payment_id,
        amount: payment.amount,
        status: 'successful'
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Server error during subscription creation', error: error.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user;
    const { subscription_id } = req.params;

    // Find the subscription
    const subscription = await Subscription.findOne({
      where: { 
        subscription_id,
        user_id: userId,
        status: 'active'
      }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Active subscription not found' });
    }

    // Update subscription status
    await Subscription.update(
      { 
        status: 'cancelled',
        auto_renewal: false,
        updated_at: new Date()
      },
      { where: { subscription_id } }
    );

    // Send cancellation email
    const user = await User.findByPk(userId);
    sendEmail(user.email, 'Subscription Cancelled', 'Your subscription has been cancelled.');

    res.status(200).json({ 
      message: 'Subscription cancelled successfully',
      access_until: subscription.end_date
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Server error during subscription cancellation', error: error.message });
  }
};

// Renew subscription
export const renewSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_method } = req.body;

    // Find current subscription
    const currentSubscription = await Subscription.findOne({
      where: { 
        user_id: userId,
        status: { [db.Sequelize.Op.in]: ['active', 'expired'] }
      },
      include: [{
        model: Subscription_Plan,
        attributes: ['plan_id', 'price', 'billing_cycle']
      }]
    });

    if (!currentSubscription) {
      return res.status(404).json({ message: 'No subscription found to renew' });
    }

    // Process payment
    const paymentData = {
      amount: currentSubscription.Subscription_Plan.price,
      payment_method,
      status: 'successful',
      payment_date: new Date(),
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    };

    const payment = await Payment.create(paymentData);

    // Calculate new subscription dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (currentSubscription.Subscription_Plan.billing_cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (currentSubscription.Subscription_Plan.billing_cycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create new subscription record
    const newSubscription = await Subscription.create({
      user_id: userId,
      plan_id: currentSubscription.Subscription_Plan.plan_id,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      payment_id: payment.payment_id,
      auto_renewal: currentSubscription.auto_renewal,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update payment with subscription ID
    await Payment.update(
      { subscription_id: newSubscription.subscription_id },
      { where: { payment_id: payment.payment_id } }
    );

    // Update old subscription if needed
    if (currentSubscription.status === 'active') {
      await Subscription.update(
        { status: 'expired', updated_at: new Date() },
        { where: { subscription_id: currentSubscription.subscription_id } }
      );
    }

    // Send confirmation email
    const user = await User.findByPk(userId);
    sendEmail(user.email, 'Subscription Renewed', 'Your subscription has been successfully renewed.');

    res.status(200).json({
      message: 'Subscription renewed successfully',
      subscription: newSubscription
    });
  } catch (error) {
    console.error('Error renewing subscription:', error);
    res.status(500).json({ message: 'Server error during subscription renewal', error: error.message });
  }
};

// Toggle auto-renewal
export const toggleAutoRenewal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscription_id } = req.params;
    const { auto_renewal } = req.body;

    // Validate input
    if (auto_renewal === undefined) {
      return res.status(400).json({ message: 'auto_renewal field is required' });
    }

    // Find the subscription
    const subscription = await Subscription.findOne({
      where: { 
        subscription_id,
        user_id: userId,
        status: 'active'
      }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Active subscription not found' });
    }

    // Update auto-renewal setting
    await Subscription.update(
      { 
        auto_renewal,
        updated_at: new Date()
      },
      { where: { subscription_id } }
    );

    const updateType = auto_renewal ? 'enabled' : 'disabled';
    
    // Send notification email
    const user = await User.findByPk(userId);
    sendEmail(user.email, 'Auto-Renewal Update', `Auto-renewal has been ${updateType} for your subscription.`);

    res.status(200).json({ 
      message: `Auto-renewal ${updateType} successfully`
    });
  } catch (error) {
    console.error('Error updating auto-renewal:', error);
    res.status(500).json({ message: 'Server error while updating auto-renewal settings', error: error.message });
  }
};

// Get subscription history
export const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const subscriptionHistory = await Subscription.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Subscription_Plan,
          attributes: ['name', 'price', 'billing_cycle']
        },
        {
          model: Payment,
          attributes: ['payment_id', 'amount', 'payment_method', 'payment_date', 'status']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({ subscriptionHistory });
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ message: 'Server error while fetching subscription history', error: error.message });
  }
};

// Generate subscription invoice
export const generateInvoice = async (req, res) => {
  try {
    const { subscription_id } = req.params;
    
    const subscription = await Subscription.findByPk(subscription_id, {
      include: [
        {
          model: User,
          attributes: ['name', 'email', 'address']
        },
        {
          model: Subscription_Plan,
          attributes: ['name', 'price', 'billing_cycle', 'features']
        },
        {
          model: Payment,
          attributes: ['payment_id', 'amount', 'payment_method', 'payment_date']
        }
      ]
    });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Generate invoice logic would go here
    // This could involve creating a PDF or using a third-party service
    
    // For this example, we'll just return the data that would be in the invoice
    const invoiceData = {
      invoice_number: `INV-${subscription.subscription_id}-${Date.now()}`,
      issue_date: new Date(),
      customer: {
        name: subscription.User.name,
        email: subscription.User.email,
        address: subscription.User.address
      },
      subscription: {
        plan_name: subscription.Subscription_Plan.name,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        price: subscription.Subscription_Plan.price,
        billing_cycle: subscription.Subscription_Plan.billing_cycle
      },
      payment: {
        payment_id: subscription.Payment.payment_id,
        amount: subscription.Payment.amount,
        method: subscription.Payment.payment_method,
        date: subscription.Payment.payment_date
      }
    };
    
    res.status(200).json({ invoice: invoiceData });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Server error while generating invoice', error: error.message });
  }
};