import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/Users.js';
import UserEmergencyContact from '../Models/UserEmergencyContactModel.js';
import Subscription from '../Models/SubscriptionModel.js';
import SubscriptionPlan from '../Models/SubscriptionPlanModel.js';

// Handle user registration
export const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone_number, 
      password, 
      address, 
      date_of_birth,
      emergency_contacts 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone_number,
      password_hash,
      address,
      date_of_birth,
      account_status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });

    // Add emergency contacts if provided
    if (emergency_contacts && emergency_contacts.length > 0) {
      const contactPromises = emergency_contacts.map(contact => {
        return UserEmergencyContact.create({
          user_id: newUser.user_id,
          name: contact.name,
          phone_number: contact.phone_number,
          relationship: contact.relationship,
          is_primary: contact.is_primary || false,
          created_at: new Date(),
          updated_at: new Date()
        });
      });
      await Promise.all(contactPromises);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: newUser.user_id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info without password
    const userResponse = {
      id: newUser.user_id,
      name: newUser.name,
      email: newUser.email,
      phone_number: newUser.phone_number,
      account_status: newUser.account_status
    };

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Handle user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if account is active
    if (user.account_status !== 'active') {
      return res.status(403).json({ message: `Your account is ${user.account_status}. Please contact support.` });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info without password
    const userResponse = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      account_status: user.account_status
    };

    res.status(200).json({ user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware

    // Find user and related data
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: UserEmergencyContact,
          as: 'user_emergency_contacts'
        },
        {
          model: Subscription,
          as: 'subscription',
          include: [
            {
              model: SubscriptionPlan,
              as: 'subscription_plans'
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile', error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const {
      name,
      phone_number,
      address,
      date_of_birth,
      profile_image_url
    } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    const updatedUser = await user.update({
      name: name || user.name,
      phone_number: phone_number || user.phone_number,
      address: address || user.address,
      date_of_birth: date_of_birth || user.date_of_birth,
      profile_image_url: profile_image_url || user.profile_image_url,
      updated_at: new Date()
    });

    // Return updated user info without password
    const userResponse = {
      id: updatedUser.user_id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone_number: updatedUser.phone_number,
      address: updatedUser.address,
      date_of_birth: updatedUser.date_of_birth,
      profile_image_url: updatedUser.profile_image_url,
      account_status: updatedUser.account_status
    };

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile', error: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({
      password_hash,
      updated_at: new Date()
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password', error: error.message });
  }
};

// Manage emergency contacts
export const addEmergencyContact = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const { name, phone_number, relationship, is_primary } = req.body;

    // Create new emergency contact
    const newContact = await UserEmergencyContact.create({
      user_id: userId,
      name,
      phone_number,
      relationship,
      is_primary: is_primary || false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // If this contact is primary, update other contacts to non-primary
    if (is_primary) {
      await UserEmergencyContact.update(
        { is_primary: false },
        { 
          where: { 
            user_id: userId, 
            contact_id: { [Op.ne]: newContact.contact_id } 
          } 
        }
      );
    }

    res.status(201).json({ contact: newContact });
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({ message: 'Server error while adding emergency contact', error: error.message });
  }
};

// Update emergency contact
export const updateEmergencyContact = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const contactId = req.params.contactId;
    const { name, phone_number, relationship, is_primary } = req.body;

    // Find contact
    const contact = await UserEmergencyContact.findOne({
      where: {
        contact_id: contactId,
        user_id: userId
      }
    });

    if (!contact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    // Update contact
    const updatedContact = await contact.update({
      name: name || contact.name,
      phone_number: phone_number || contact.phone_number,
      relationship: relationship || contact.relationship,
      is_primary: is_primary !== undefined ? is_primary : contact.is_primary,
      updated_at: new Date()
    });

    // If this contact is set as primary, update other contacts to non-primary
    if (is_primary) {
      await UserEmergencyContact.update(
        { is_primary: false },
        { 
          where: { 
            user_id: userId, 
            contact_id: { [Op.ne]: contactId } 
          } 
        }
      );
    }

    res.status(200).json({ contact: updatedContact });
  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({ message: 'Server error while updating emergency contact', error: error.message });
  }
};

// Delete emergency contact
export const deleteEmergencyContact = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const contactId = req.params.contactId;

    // Find and delete contact
    const contact = await UserEmergencyContact.findOne({
      where: {
        contact_id: contactId,
        user_id: userId
      }
    });

    if (!contact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    await contact.destroy();

    res.status(200).json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({ message: 'Server error while deleting emergency contact', error: error.message });
  }
};

// Get all emergency contacts
export const getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware

    // Find all contacts for user
    const contacts = await UserEmergencyContact.findAll({
      where: { user_id: userId },
      order: [['is_primary', 'DESC'], ['created_at', 'ASC']]
    });

    res.status(200).json({ contacts });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ message: 'Server error while fetching emergency contacts', error: error.message });
  }
};

// Update account status (for admin use)
export const updateAccountStatus = async (req, res) => {
  try {
    // This should be restricted to admin users only
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const userId = req.params.userId;
    const { account_status } = req.body;

    // Validate account status
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(account_status)) {
      return res.status(400).json({ message: 'Invalid account status' });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update status
    await user.update({
      account_status,
      updated_at: new Date()
    });

    res.status(200).json({ message: `User account status updated to ${account_status}` });
  } catch (error) {
    console.error('Update account status error:', error);
    res.status(500).json({ message: 'Server error while updating account status', error: error.message });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const { password } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Delete user (could alternatively set account_status to 'deleted')
    await user.destroy();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error while deleting account', error: error.message });
  }
};

// Get subscription details
export const getSubscription = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware

    // Find active subscription
    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
        status: 'active'
      },
      include: [
        {
          model: SubscriptionPlan,
          as: 'plan'
        }
      ]
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Server error while fetching subscription', error: error.message });
  }
};

// Forgot password - send reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Store reset token in user record
    await user.update({
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry,
      updated_at: new Date()
    });

    // In a real app, you would send an email with the reset token
    // For this example, we'll just return success message
    res.status(200).json({ 
      message: 'Password reset token generated successfully',
      // In production, do not return the token in response
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error in forgot password process', error: error.message });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token and check expiry
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await user.update({
      password_hash,
      reset_token: null,
      reset_token_expiry: null,
      updated_at: new Date()
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error in reset password process', error: error.message });
  }
};