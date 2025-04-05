import SubscriptionPlan from '../Models/SubscriptionPlanModel.js';
import User from '../Models/Users.js';
import Subscription from '../Models/SubscriptionModel.js';

// Get all subscription plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      where: { is_active: true },
      order: [['price', 'ASC']]
    });
    
    res.status(200).json({ plans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Server error while fetching subscription plans', error: error.message });
  }
};

// Get plan by ID
export const getPlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await SubscriptionPlan.findByPk(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    res.status(200).json({ plan });
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
    res.status(500).json({ message: 'Server error while fetching subscription plan', error: error.message });
  }
};

// Create new subscription plan
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      billing_cycle,
      features,
      max_free_towing_distance,
      priority_level
    } = req.body;
    
    // Validate required fields
    if (!name || !price || !billing_cycle) {
      return res.status(400).json({ message: 'Name, price, and billing cycle are required' });
    }
    
    // Check if plan with same name already exists
    const existingPlan = await SubscriptionPlan.findOne({ where: { name } });
    if (existingPlan) {
      return res.status(400).json({ message: 'A plan with this name already exists' });
    }
    
    // Create new plan
    const newPlan = await SubscriptionPlan.create({
      name,
      description,
      price,
      billing_cycle,
      features: features || [],
      max_free_towing_distance,
      priority_level,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.status(201).json({ 
      message: 'Subscription plan created successfully', 
      plan: newPlan 
    });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ message: 'Server error while creating subscription plan', error: error.message });
  }
};

// Update subscription plan
export const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const {
      name,
      description,
      price,
      billing_cycle,
      features,
      max_free_towing_distance,
      priority_level,
      is_active
    } = req.body;
    
    // Find the plan
    const plan = await SubscriptionPlan.findByPk(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    // Check if name is being changed and if new name already exists
    if (name && name !== plan.name) {
      const existingPlan = await SubscriptionPlan.findOne({ where: { name } });
      if (existingPlan) {
        return res.status(400).json({ message: 'A plan with this name already exists' });
      }
    }
    
    // Update plan
    await plan.update({
      name: name || plan.name,
      description: description || plan.description,
      price: price || plan.price,
      billing_cycle: billing_cycle || plan.billing_cycle,
      features: features || plan.features,
      max_free_towing_distance: max_free_towing_distance || plan.max_free_towing_distance,
      priority_level: priority_level || plan.priority_level,
      is_active: is_active !== undefined ? is_active : plan.is_active,
      updated_at: new Date()
    });
    
    res.status(200).json({ 
      message: 'Subscription plan updated successfully', 
      plan 
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ message: 'Server error while updating subscription plan', error: error.message });
  }
};

// Delete subscription plan (soft delete by setting is_active to false)
export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await SubscriptionPlan.findByPk(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    // Check if users are currently subscribed to this plan
    const activeSubscriptions = await Subscription.findOne({
      where: {
        plan_id: planId,
        status: 'active'
      }
    });
    
    if (activeSubscriptions) {
      return res.status(400).json({ 
        message: 'Cannot delete plan with active subscriptions. Deactivate the plan instead.' 
      });
    }
    
    // Soft delete by setting is_active to false
    await plan.update({
      is_active: false,
      updated_at: new Date()
    });
    
    res.status(200).json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ message: 'Server error while deleting subscription plan', error: error.message });
  }
};

// Get users with a specific subscription plan
export const getPlanUsers = async (req, res) => {
  try {
    const { planId } = req.params;
    
    // Check if plan exists
    const plan = await SubscriptionPlan.findByPk(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    // Find users with this subscription plan
    const users = await User.findAll({
      where: { subscription_plan_id: planId },
      attributes: ['user_id', 'name', 'email', 'phone_number', 'account_status'],
      include: [
        {
          model: Subscription,
          attributes: ['subscription_id', 'start_date', 'end_date', 'status', 'auto_renewal']
        }
      ]
    });
    
    res.status(200).json({ 
      plan: {
        id: plan.plan_id,
        name: plan.name
      },
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching plan users:', error);
    res.status(500).json({ message: 'Server error while fetching plan users', error: error.message });
  }
};

// Compare multiple subscription plans
export const comparePlans = async (req, res) => {
  try {
    const { planIds } = req.body;
    
    if (!planIds || !Array.isArray(planIds) || planIds.length < 2) {
      return res.status(400).json({ message: 'Please provide at least two plan IDs for comparison' });
    }
    
    const plans = await SubscriptionPlan.findAll({
      where: { 
        plan_id: planIds,
        is_active: true
      }
    });
    
    if (plans.length !== planIds.length) {
      return res.status(404).json({ message: 'One or more subscription plans not found or inactive' });
    }
    
    res.status(200).json({ plans });
  } catch (error) {
    console.error('Error comparing subscription plans:', error);
    res.status(500).json({ message: 'Server error while comparing subscription plans', error: error.message });
  }
};

// Get subscription plan statistics
export const getPlanStats = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      where: { is_active: true }
    });
    
    const planStats = await Promise.all(plans.map(async (plan) => {
      const activeSubscriptions = await Subscription.count({
        where: {
          plan_id: plan.plan_id,
          status: 'active'
        }
      });
      
      const expiredSubscriptions = await Subscription.count({
        where: {
          plan_id: plan.plan_id,
          status: 'expired'
        }
      });
      
      const cancelledSubscriptions = await Subscription.count({
        where: {
          plan_id: plan.plan_id,
          status: 'cancelled'
        }
      });
      
      return {
        plan_id: plan.plan_id,
        name: plan.name,
        price: plan.price,
        billing_cycle: plan.billing_cycle,
        activeSubscriptions,
        expiredSubscriptions,
        cancelledSubscriptions,
        totalSubscriptions: activeSubscriptions + expiredSubscriptions + cancelledSubscriptions
      };
    }));
    
    res.status(200).json({ planStats });
  } catch (error) {
    console.error('Error fetching subscription plan statistics:', error);
    res.status(500).json({ message: 'Server error while fetching plan statistics', error: error.message });
  }
};