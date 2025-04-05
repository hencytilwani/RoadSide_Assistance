import db from '../Models/index.js';
import { Op } from 'sequelize';

const VideoConsultation = db.Video_Consultation;
const BreakdownRequest = db.Breakdown_Request;
const ServiceProviderMechanic = db.Service_Provider_Mechanic;
const User = db.User;
const Vehicle = db.Vehicle;

// Create a new video consultation
export const createVideoConsultation = async (req, res) => {
  try {
    const { 
      request_id, 
      mechanic_id, 
      start_time, 
      status,
      diagnosis_notes,
      recommended_actions
    } = req.body;

    // Validate input
    if (!request_id || !mechanic_id || !start_time || !status) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Check if breakdown request exists
    const breakdownRequest = await BreakdownRequest.findByPk(request_id);
    if (!breakdownRequest) {
      return res.status(404).json({ message: 'Breakdown request not found' });
    }

    // Check if mechanic exists
    const mechanic = await ServiceProviderMechanic.findByPk(mechanic_id);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    // Create new video consultation
    const newConsultation = await VideoConsultation.create({
      request_id,
      mechanic_id,
      start_time,
      status,
      diagnosis_notes: diagnosis_notes || null,
      recommended_actions: recommended_actions || null,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update breakdown request status if needed
    if (status === 'scheduled' && breakdownRequest.status === 'pending') {
      await breakdownRequest.update({ 
        status: 'in_progress',
        updated_at: new Date()
      });
    }

    res.status(201).json({
      message: 'Video consultation created successfully',
      consultation: newConsultation
    });
  } catch (error) {
    console.error('Error creating video consultation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all video consultations with optional filtering
export const getAllVideoConsultations = async (req, res) => {
  try {
    const { 
      status, 
      mechanic_id, 
      request_id,
      start_date,
      end_date 
    } = req.query;

    // Build filter conditions
    const whereConditions = {};
    
    if (status) whereConditions.status = status;
    if (mechanic_id) whereConditions.mechanic_id = mechanic_id;
    if (request_id) whereConditions.request_id = request_id;
    
    // Date range filter
    if (start_date && end_date) {
      whereConditions.start_time = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    } else if (start_date) {
      whereConditions.start_time = {
        [Op.gte]: new Date(start_date)
      };
    } else if (end_date) {
      whereConditions.start_time = {
        [Op.lte]: new Date(end_date)
      };
    }

    // Get consultations with related data
    const consultations = await VideoConsultation.findAll({
      where: whereConditions,
      include: [
        {
          model: BreakdownRequest,
          include: [
            { model: User, attributes: ['user_id', 'name', 'email', 'phone_number'] },
            { model: Vehicle, attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate'] }
          ]
        },
        { 
          model: ServiceProviderMechanic,
          attributes: ['mechanic_id', 'name', 'specialization', 'experience_years']
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.status(200).json({ consultations });
  } catch (error) {
    console.error('Error fetching video consultations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single video consultation by ID
export const getVideoConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await VideoConsultation.findByPk(id, {
      include: [
        {
          model: BreakdownRequest,
          include: [
            { model: User, attributes: ['user_id', 'name', 'email', 'phone_number'] },
            { model: Vehicle, attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate'] }
          ]
        },
        { 
          model: ServiceProviderMechanic,
          attributes: ['mechanic_id', 'name', 'specialization', 'experience_years']
        }
      ]
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Video consultation not found' });
    }

    res.status(200).json({ consultation });
  } catch (error) {
    console.error('Error fetching video consultation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a video consultation
export const updateVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      start_time, 
      end_time, 
      status, 
      recording_url,
      diagnosis_notes,
      recommended_actions 
    } = req.body;

    // Check if consultation exists
    const consultation = await VideoConsultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ message: 'Video consultation not found' });
    }

    // Calculate duration if both start and end times are provided
    let duration = null;
    if (start_time && end_time) {
      const start = new Date(start_time);
      const end = new Date(end_time);
      duration = Math.round((end - start) / 60000); // Duration in minutes
    } else if (consultation.start_time && end_time) {
      const start = new Date(consultation.start_time);
      const end = new Date(end_time);
      duration = Math.round((end - start) / 60000);
    }

    // Update consultation
    const updatedConsultation = await consultation.update({
      start_time: start_time || consultation.start_time,
      end_time: end_time || consultation.end_time,
      duration: duration !== null ? duration : consultation.duration,
      status: status || consultation.status,
      recording_url: recording_url || consultation.recording_url,
      diagnosis_notes: diagnosis_notes !== undefined ? diagnosis_notes : consultation.diagnosis_notes,
      recommended_actions: recommended_actions !== undefined ? recommended_actions : consultation.recommended_actions,
      updated_at: new Date()
    });

    // If consultation is completed, update the breakdown request
    if (status === 'completed' && consultation.status !== 'completed') {
      const breakdownRequest = await BreakdownRequest.findByPk(consultation.request_id);
      if (breakdownRequest) {
        await breakdownRequest.update({
          updated_at: new Date()
        });
      }
    }

    res.status(200).json({
      message: 'Video consultation updated successfully',
      consultation: updatedConsultation
    });
  } catch (error) {
    console.error('Error updating video consultation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a video consultation
export const deleteVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if consultation exists
    const consultation = await VideoConsultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ message: 'Video consultation not found' });
    }

    // Only allow deletion of scheduled consultations
    if (consultation.status !== 'scheduled') {
      return res.status(400).json({ 
        message: 'Cannot delete consultations that are in progress, completed, or cancelled' 
      });
    }

    // Delete the consultation
    await consultation.destroy();

    res.status(200).json({ message: 'Video consultation deleted successfully' });
  } catch (error) {
    console.error('Error deleting video consultation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel a video consultation
export const cancelVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_reason } = req.body;

    // Check if consultation exists
    const consultation = await VideoConsultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ message: 'Video consultation not found' });
    }

    // Can only cancel scheduled or in_progress consultations
    if (consultation.status !== 'scheduled' && consultation.status !== 'in_progress') {
      return res.status(400).json({ 
        message: 'Cannot cancel consultations that are already completed or cancelled' 
      });
    }

    // Update consultation status to cancelled
    await consultation.update({
      status: 'cancelled',
      diagnosis_notes: consultation.diagnosis_notes 
        ? `${consultation.diagnosis_notes}\n\nCANCELLATION REASON: ${cancellation_reason || 'Not provided'}`
        : `CANCELLATION REASON: ${cancellation_reason || 'Not provided'}`,
      updated_at: new Date()
    });

    res.status(200).json({
      message: 'Video consultation cancelled successfully',
      consultation
    });
  } catch (error) {
    console.error('Error cancelling video consultation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get upcoming consultations for a mechanic
export const getMechanicUpcomingConsultations = async (req, res) => {
  try {
    const { mechanic_id } = req.params;
    
    // Check if mechanic exists
    const mechanic = await ServiceProviderMechanic.findByPk(mechanic_id);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    // Get upcoming consultations (scheduled and start time in the future)
    const consultations = await VideoConsultation.findAll({
      where: {
        mechanic_id,
        status: 'scheduled',
        start_time: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: BreakdownRequest,
          include: [
            { model: User, attributes: ['user_id', 'name', 'email', 'phone_number'] },
            { model: Vehicle, attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate'] }
          ]
        }
      ],
      order: [['start_time', 'ASC']]
    });

    res.status(200).json({ consultations });
  } catch (error) {
    console.error('Error fetching mechanic upcoming consultations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get consultations history for a user
export const getUserConsultationsHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's breakdown requests
    const breakdownRequests = await BreakdownRequest.findAll({
      where: { user_id },
      attributes: ['request_id']
    });

    const requestIds = breakdownRequests.map(request => request.request_id);

    // Get consultations for these breakdown requests
    const consultations = await VideoConsultation.findAll({
      where: {
        request_id: {
          [Op.in]: requestIds
        }
      },
      include: [
        {
          model: BreakdownRequest,
          include: [
            { model: Vehicle, attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate'] }
          ]
        },
        { 
          model: ServiceProviderMechanic,
          attributes: ['mechanic_id', 'name', 'specialization']
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.status(200).json({ consultations });
  } catch (error) {
    console.error('Error fetching user consultation history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Start a video consultation (update status to in_progress)
export const startVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if consultation exists
    const consultation = await VideoConsultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ message: 'Video consultation not found' });
    }

    // Only scheduled consultations can be started
    if (consultation.status !== 'scheduled') {
      return res.status(400).json({ 
        message: 'Only scheduled consultations can be started' 
      });
    }

    // Update consultation status to in_progress and set actual start time
    await consultation.update({
      status: 'in_progress',
      start_time: new Date(), // Update with actual start time
      updated_at: new Date()
    });

    res.status(200).json({
      message: 'Video consultation started successfully',
      consultation
    });
  } catch (error) {
    console.error('Error starting video consultation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete a video consultation
export const completeVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      diagnosis_notes, 
      recommended_actions,
      recording_url 
    } = req.body;

    // Check if consultation exists
    const consultation = await VideoConsultation.findByPk(id, {
      include: [{ model: BreakdownRequest }]
    });
    
    if (!consultation) {
      return res.status(404).json({ message: 'Video consultation not found' });
    }

    // Only in-progress consultations can be completed
    if (consultation.status !== 'in_progress') {
      return res.status(400).json({ 
        message: 'Only in-progress consultations can be completed' 
      });
    }

    const end_time = new Date();
    const start = new Date(consultation.start_time);
    const duration = Math.round((end_time - start) / 60000); // Duration in minutes

    // Update consultation
    await consultation.update({
      status: 'completed',
      end_time,
      duration,
      diagnosis_notes: diagnosis_notes || consultation.diagnosis_notes,
      recommended_actions: recommended_actions || consultation.recommended_actions,
      recording_url: recording_url || consultation.recording_url,
      updated_at: new Date()
    });

    // Update breakdown request if needed
    if (consultation.BreakdownRequest && consultation.BreakdownRequest.status === 'in_progress') {
      // If this is just a consultation and no physical service is assigned yet,
      // we can set the request to resolved
      const hasServiceAssignment = await db.Service_Assignment.findOne({
        where: { request_id: consultation.request_id }
      });

      if (!hasServiceAssignment) {
        await consultation.BreakdownRequest.update({
          status: 'resolved',
          updated_at: new Date()
        });
      }
    }

    res.status(200).json({
      message: 'Video consultation completed successfully',
      consultation
    });
  } catch (error) {
    console.error('Error completing video consultation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};