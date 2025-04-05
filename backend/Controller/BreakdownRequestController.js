import BreakdownRequest from '../Models/BreakdownRequestModel.js';
import Vehicle from '../Models/Vehicle.js';
import User from '../Models/Users.js';
import ServiceAssignment from '../Models/ServiceAssignmentModel.js';
import ServiceProvider from '../Models/ServiceProviderModel.js';
import Notification from '../Models/NotificationsModel.js';

// Create a new breakdown request
export const createBreakdownRequest = async (req, res) => {
  try {
    const {
      user_id,
      vehicle_id,
      request_type,
      description,
      location_latitude,
      location_longitude,
      location_address,
      is_emergency,
      ai_diagnosis_result,
      self_repair_attempted
    } = req.body;

    // Verify user and vehicle exist
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if vehicle belongs to user
    if (vehicle.user_id !== user_id) {
      return res.status(403).json({ message: 'Vehicle does not belong to this user' });
    }

    // Create breakdown request
    const newBreakdownRequest = await BreakdownRequest.create({
      user_id,
      vehicle_id,
      request_type,
      description,
      location_latitude,
      location_longitude,
      location_address,
      timestamp: new Date(),
      status: 'pending',
      is_emergency: is_emergency || false,
      ai_diagnosis_result: ai_diagnosis_result || null,
      self_repair_attempted: self_repair_attempted || false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create notification for the user
    await Notification.create({
      user_id,
      title: 'Breakdown Request Created',
      message: `Your ${request_type} request has been created and is awaiting assignment.`,
      type: 'service update',
      related_entity_type: 'request',
      related_entity_id: newBreakdownRequest.request_id,
      is_read: false,
      timestamp: new Date(),
      created_at: new Date()
    });

    // Return the created request
    res.status(201).json({
      message: 'Breakdown request created successfully',
      request: newBreakdownRequest
    });
  } catch (error) {
    console.error('Error creating breakdown request:', error);
    res.status(500).json({ message: 'Server error while creating breakdown request', error: error.message });
  }
};

// Get all breakdown requests for a user
export const getUserBreakdownRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const breakdownRequests = await BreakdownRequest.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate', 'color']
        },
        {
          model: ServiceAssignment,
          attributes: ['assignment_id', 'status', 'estimated_arrival_time', 'actual_arrival_time'],
          include: [
            {
              model: ServiceProvider,
              attributes: ['business_name', 'provider_type', 'rating']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ breakdownRequests });
  } catch (error) {
    console.error('Error fetching user breakdown requests:', error);
    res.status(500).json({ message: 'Server error while fetching user breakdown requests', error: error.message });
  }
};

// Get a specific breakdown request by ID
export const getBreakdownRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const breakdownRequest = await BreakdownRequest.findByPk(requestId, {
      include: [
        {
          model: Vehicle,
          attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate', 'color', 'vin_number']
        },
        {
          model: User,
          attributes: ['user_id', 'name', 'email', 'phone_number']
        },
        {
          model: ServiceAssignment,
          include: [
            {
              model: ServiceProvider,
              attributes: ['provider_id', 'business_name', 'provider_type', 'rating', 'phone_number', 'email']
            }
          ]
        }
      ]
    });

    if (!breakdownRequest) {
      return res.status(404).json({ message: 'Breakdown request not found' });
    }

    res.status(200).json({ breakdownRequest });
  } catch (error) {
    console.error('Error fetching breakdown request:', error);
    res.status(500).json({ message: 'Server error while fetching breakdown request', error: error.message });
  }
};

// Update a breakdown request
export const updateBreakdownRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const {
      request_type,
      description,
      location_latitude,
      location_longitude,
      location_address,
      status,
      is_emergency,
      ai_diagnosis_result,
      self_repair_attempted
    } = req.body;

    // Find the request
    const breakdownRequest = await BreakdownRequest.findByPk(requestId);

    if (!breakdownRequest) {
      return res.status(404).json({ message: 'Breakdown request not found' });
    }

    // Check if request can be updated based on current status
    const currentStatus = breakdownRequest.status;
    if (currentStatus !== 'pending' && status === 'cancelled') {
      // Can cancel a request at any stage
    } else if (currentStatus === 'completed' || currentStatus === 'cancelled') {
      return res.status(400).json({ message: `Cannot update request with status: ${currentStatus}` });
    }

    // Update the request
    await breakdownRequest.update({
      request_type: request_type || breakdownRequest.request_type,
      description: description || breakdownRequest.description,
      location_latitude: location_latitude || breakdownRequest.location_latitude,
      location_longitude: location_longitude || breakdownRequest.location_longitude,
      location_address: location_address || breakdownRequest.location_address,
      status: status || breakdownRequest.status,
      is_emergency: is_emergency !== undefined ? is_emergency : breakdownRequest.is_emergency,
      ai_diagnosis_result: ai_diagnosis_result || breakdownRequest.ai_diagnosis_result,
      self_repair_attempted: self_repair_attempted !== undefined ? self_repair_attempted : breakdownRequest.self_repair_attempted,
      updated_at: new Date()
    });

    // If status changed, create notification
    if (status && status !== currentStatus) {
      await Notification.create({
        user_id: breakdownRequest.user_id,
        title: 'Request Status Updated',
        message: `Your breakdown request status has been updated to: ${status}`,
        type: 'service update',
        related_entity_type: 'request',
        related_entity_id: requestId,
        is_read: false,
        timestamp: new Date(),
        created_at: new Date()
      });
    }

    res.status(200).json({
      message: 'Breakdown request updated successfully',
      request: await BreakdownRequest.findByPk(requestId)
    });
  } catch (error) {
    console.error('Error updating breakdown request:', error);
    res.status(500).json({ message: 'Server error while updating breakdown request', error: error.message });
  }
};

// Cancel a breakdown request
export const cancelBreakdownRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { cancellation_reason } = req.body;

    // Find the request
    const breakdownRequest = await BreakdownRequest.findByPk(requestId, {
      include: [
        { model: ServiceAssignment }
      ]
    });

    if (!breakdownRequest) {
      return res.status(404).json({ message: 'Breakdown request not found' });
    }

    // Check if request can be cancelled
    if (breakdownRequest.status === 'completed' || breakdownRequest.status === 'cancelled') {
      return res.status(400).json({
        message: `Cannot cancel request with status: ${breakdownRequest.status}`
      });
    }

    // Update request status to cancelled
    await breakdownRequest.update({
      status: 'cancelled',
      description: breakdownRequest.description + `\n\nCancellation reason: ${cancellation_reason || 'Not provided'}`,
      updated_at: new Date()
    });

    // If there's an assignment, also update its status
    if (breakdownRequest.ServiceAssignment) {
      await breakdownRequest.ServiceAssignment.update({
        status: 'cancelled',
        updated_at: new Date()
      });
    }

    // Create notification
    await Notification.create({
      user_id: breakdownRequest.user_id,
      title: 'Request Cancelled',
      message: 'Your breakdown request has been cancelled.',
      type: 'service update',
      related_entity_type: 'request',
      related_entity_id: requestId,
      is_read: false,
      timestamp: new Date(),
      created_at: new Date()
    });

    res.status(200).json({
      message: 'Breakdown request cancelled successfully',
      request: await BreakdownRequest.findByPk(requestId)
    });
  } catch (error) {
    console.error('Error cancelling breakdown request:', error);
    res.status(500).json({ message: 'Server error while cancelling breakdown request', error: error.message });
  }
};

// Get all breakdown requests (for admin/service providers)
export const getAllBreakdownRequests = async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;
    
    const whereClause = {};
    
    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }
    
    const breakdownRequests = await BreakdownRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['name', 'email', 'phone_number']
        },
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate', 'color']
        },
        {
          model: ServiceAssignment,
          include: [
            {
              model: ServiceProvider,
              attributes: ['business_name']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.status(200).json({
      total: breakdownRequests.count,
      breakdownRequests: breakdownRequests.rows,
      currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
      totalPages: Math.ceil(breakdownRequests.count / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching all breakdown requests:', error);
    res.status(500).json({ message: 'Server error while fetching breakdown requests', error: error.message });
  }
};

// Create emergency breakdown request with SOS alert
export const createEmergencyRequest = async (req, res) => {
  try {
    const {
      user_id,
      vehicle_id,
      location_latitude,
      location_longitude,
      location_address,
      alert_type,
      description
    } = req.body;

    // Start a transaction
    const transaction = await BreakdownRequest.sequelize.transaction();

    try {
      // Create breakdown request first
      const newBreakdownRequest = await BreakdownRequest.create({
        user_id,
        vehicle_id,
        request_type: 'emergency',
        description: description || 'Emergency assistance needed',
        location_latitude,
        location_longitude,
        location_address,
        timestamp: new Date(),
        status: 'pending',
        is_emergency: true,
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });

      // Create SOS alert
      const sosAlert = await req.db.SOS_Alert.create({
        user_id,
        vehicle_id,
        location_latitude,
        location_longitude,
        location_address,
        timestamp: new Date(),
        alert_type: alert_type || 'breakdown',
        status: 'active',
        notified_contacts: JSON.stringify([]),
        notified_authorities: false,
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });

      // Create urgent notification
      await Notification.create({
        user_id,
        title: 'EMERGENCY ASSISTANCE REQUESTED',
        message: 'Your emergency request has been received. Help is on the way.',
        type: 'emergency',
        related_entity_type: 'request',
        related_entity_id: newBreakdownRequest.request_id,
        is_read: false,
        timestamp: new Date(),
        created_at: new Date()
      }, { transaction });

      // Commit transaction
      await transaction.commit();

      res.status(201).json({
        message: 'Emergency breakdown request created successfully',
        request: newBreakdownRequest,
        sosAlert: sosAlert
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating emergency breakdown request:', error);
    res.status(500).json({ message: 'Server error while creating emergency request', error: error.message });
  }
};

// Get nearby breakdown requests for service providers
export const getNearbyBreakdownRequests = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, providerId } = req.query; // radius in km
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Find pending requests
    const pendingRequests = await BreakdownRequest.findAll({
      where: {
        status: 'pending'
      },
      include: [
        {
          model: User,
          attributes: ['name', 'phone_number']
        },
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'color', 'license_plate']
        }
      ]
    });
    
    // Calculate distance and filter nearby requests
    // Using Haversine formula to calculate distance between two points on Earth
    const nearbyRequests = pendingRequests.filter(request => {
      const lat1 = parseFloat(latitude);
      const lon1 = parseFloat(longitude);
      const lat2 = parseFloat(request.location_latitude);
      const lon2 = parseFloat(request.location_longitude);
      
      const R = 6371; // Radius of Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      // Add distance to request object for sorting
      request.dataValues.distance = distance;
      
      return distance <= radius;
    });
    
    // Sort by distance, closest first
    nearbyRequests.sort((a, b) => a.dataValues.distance - b.dataValues.distance);
    
    res.status(200).json({
      count: nearbyRequests.length,
      nearbyRequests
    });
  } catch (error) {
    console.error('Error fetching nearby breakdown requests:', error);
    res.status(500).json({ message: 'Server error while fetching nearby requests', error: error.message });
  }
};