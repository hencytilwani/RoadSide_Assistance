import SOSAlert from '../Models/SOSAlertsModel.js';
import User from '../Models/Users.js';
import Vehicle from '../Models/Vehicle.js';
import Notification from '../Models/NotificationsModel.js';

// Get all SOS alerts
export const getAllSOSAlerts = async (req, res) => {
  try {
    const alerts = await SOSAlert.findAll({
      include: [
        { model: User, attributes: ['name', 'email', 'phone_number'] },
        { model: Vehicle, attributes: ['make', 'model', 'year', 'license_plate'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching SOS alerts:', error);
    res.status(500).json({ message: 'Server error while fetching SOS alerts', error: error.message });
  }
};

// Get SOS alerts by user
export const getUserSOSAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const alerts = await SOSAlert.findAll({
      where: { user_id: userId },
      include: [
        { model: Vehicle, attributes: ['make', 'model', 'year', 'license_plate'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching user SOS alerts:', error);
    res.status(500).json({ message: 'Server error while fetching user SOS alerts', error: error.message });
  }
};

// Get single SOS alert by ID
export const getSOSAlertById = async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alert = await SOSAlert.findByPk(alertId, {
      include: [
        { model: User, attributes: ['name', 'email', 'phone_number'] },
        { model: Vehicle, attributes: ['make', 'model', 'year', 'license_plate'] }
      ]
    });
    
    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }
    
    res.status(200).json(alert);
  } catch (error) {
    console.error('Error fetching SOS alert:', error);
    res.status(500).json({ message: 'Server error while fetching SOS alert', error: error.message });
  }
};

// Create new SOS alert
export const createSOSAlert = async (req, res) => {
  try {
    const { 
      user_id, 
      vehicle_id, 
      location_latitude, 
      location_longitude, 
      location_address, 
      alert_type, 
      notified_contacts,
      notified_authorities 
    } = req.body;
    
    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify vehicle exists and belongs to user
    const vehicle = await Vehicle.findOne({
      where: { 
        vehicle_id: vehicle_id,
        user_id: user_id
      }
    });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or does not belong to this user' });
    }
    
    // Create SOS alert
    const newAlert = await SOSAlert.create({
      user_id,
      vehicle_id,
      location_latitude,
      location_longitude,
      location_address,
      timestamp: new Date(),
      alert_type,
      status: 'active',
      notified_contacts: notified_contacts || [],
      notified_authorities: notified_authorities || false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create notification for user
    await Notification.create({
      user_id,
      title: 'SOS Alert Created',
      message: `Your ${alert_type} alert has been created and is being processed.`,
      type: 'emergency',
      related_entity_type: 'sos_alert',
      related_entity_id: newAlert.sos_id,
      is_read: false,
      timestamp: new Date(),
      created_at: new Date()
    });
    
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating SOS alert:', error);
    res.status(500).json({ message: 'Server error while creating SOS alert', error: error.message });
  }
};

// Update SOS alert status
export const updateSOSAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, resolved_at } = req.body;
    
    const alert = await SOSAlert.findByPk(alertId);
    
    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }
    
    // Update status
    await alert.update({
      status,
      resolved_at: status === 'resolved' ? (resolved_at || new Date()) : alert.resolved_at,
      updated_at: new Date()
    });
    
    // Create notification about status change
    if (status === 'resolved') {
      await Notification.create({
        user_id: alert.user_id,
        title: 'SOS Alert Resolved',
        message: `Your ${alert.alert_type} alert has been resolved.`,
        type: 'emergency',
        related_entity_type: 'sos_alert',
        related_entity_id: alertId,
        is_read: false,
        timestamp: new Date(),
        created_at: new Date()
      });
    }
    
    res.status(200).json(alert);
  } catch (error) {
    console.error('Error updating SOS alert:', error);
    res.status(500).json({ message: 'Server error while updating SOS alert', error: error.message });
  }
};

// Delete SOS alert
export const deleteSOSAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alert = await SOSAlert.findByPk(alertId);
    
    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }
    
    // Check if alert is still active
    if (alert.status === 'active') {
      return res.status(400).json({ message: 'Cannot delete an active SOS alert' });
    }
    
    await alert.destroy();
    
    res.status(200).json({ message: 'SOS alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting SOS alert:', error);
    res.status(500).json({ message: 'Server error while deleting SOS alert', error: error.message });
  }
};

// Get active SOS alerts count
export const getActiveSOSAlertsCount = async (req, res) => {
  try {
    const count = await SOSAlert.count({
      where: { status: 'active' }
    });
    
    res.status(200).json({ active_alerts_count: count });
  } catch (error) {
    console.error('Error counting active SOS alerts:', error);
    res.status(500).json({ message: 'Server error while counting active SOS alerts', error: error.message });
  }
};

// Mark authorities as notified
export const markAuthoritiesNotified = async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alert = await SOSAlert.findByPk(alertId);
    
    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }
    
    await alert.update({
      notified_authorities: true,
      updated_at: new Date()
    });
    
    res.status(200).json(alert);
  } catch (error) {
    console.error('Error updating authorities notification status:', error);
    res.status(500).json({ message: 'Server error while updating authorities notification status', error: error.message });
  }
};

// Update notified contacts
export const updateNotifiedContacts = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notified_contacts } = req.body;
    
    const alert = await SOSAlert.findByPk(alertId);
    
    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }
    
    await alert.update({
      notified_contacts,
      updated_at: new Date()
    });
    
    res.status(200).json(alert);
  } catch (error) {
    console.error('Error updating notified contacts:', error);
    res.status(500).json({ message: 'Server error while updating notified contacts', error: error.message });
  }
};