import User from '../Models/User.js';

/**
 * Middleware to verify if the authenticated user has admin privileges
 * This middleware should be used after the authenticate middleware
 * which attaches the user ID to the request object
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find user in database
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has admin role
    // Note: You may need to modify this based on how admin status is stored in your database
    // This assumes there's a role field or can be determined from the Admin_Users table
    const isAdmin = await checkAdminStatus(userId);
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    // If user is admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ message: 'Server error during authorization check', error: error.message });
  }
};

/**
 * Helper function to check if a user has admin privileges
 * This implementation should be adapted based on your database structure
 */
const checkAdminStatus = async (userId) => {
  try {
    // Option 1: If you have a role field in the User model
    // const user = await User.findByPk(userId);
    // return user && user.role === 'admin';
    
    // Option 2: If you have a separate Admin_Users table
    const AdminUser = await import('../Models/AdminUser.js');
    const adminUser = await AdminUser.default.findOne({
      where: { user_id: userId }
    });
    
    return !!adminUser; // Return true if admin record exists
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false; // Default to no admin privileges on error
  }
};

export default adminAuth;