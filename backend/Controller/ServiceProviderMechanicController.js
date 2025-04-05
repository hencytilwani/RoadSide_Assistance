import ServiceProviderMechanic from '../Models/ServiceProviderMechanicModel.js';
import ServiceProvider from '../Models/ServiceProviderModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Get all mechanics
export const getAllMechanics = async (req, res) => {
  try {
    const mechanics = await ServiceProviderMechanic.findAll({
      include: [{ model: ServiceProvider }]
    });
    
    res.status(200).json({ mechanics });
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    res.status(500).json({ message: 'Server error while fetching mechanics', error: error.message });
  }
};

// Get mechanics by provider
export const getMechanicsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const mechanics = await ServiceProviderMechanic.findAll({
      where: { provider_id: providerId },
      include: [{ model: ServiceProvider }]
    });
    
    res.status(200).json({ mechanics });
  } catch (error) {
    console.error('Error fetching mechanics by provider:', error);
    res.status(500).json({ message: 'Server error while fetching mechanics', error: error.message });
  }
};

// Get mechanic by ID
export const getMechanicById = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    
    const mechanic = await ServiceProviderMechanic.findByPk(mechanicId, {
      include: [{ model: ServiceProvider }]
    });
    
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    res.status(200).json({ mechanic });
  } catch (error) {
    console.error('Error fetching mechanic:', error);
    res.status(500).json({ message: 'Server error while fetching mechanic', error: error.message });
  }
};

// Create new mechanic
export const createMechanic = async (req, res) => {
  try {
    const {
      provider_id,
      name,
      specialization,
      experience_years,
      certification_details,
      profile_image_url,
      availability_status
    } = req.body;
    
    // Check if provider exists
    const provider = await ServiceProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    
    // Create mechanic
    const newMechanic = await ServiceProviderMechanic.create({
      provider_id,
      name,
      specialization: JSON.stringify(specialization),
      experience_years,
      certification_details: JSON.stringify(certification_details),
      profile_image_url,
      availability_status: availability_status || 'offline',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.status(201).json({ 
      message: 'Mechanic created successfully',
      mechanic: newMechanic 
    });
  } catch (error) {
    console.error('Error creating mechanic:', error);
    res.status(500).json({ message: 'Server error while creating mechanic', error: error.message });
  }
};

// Update mechanic
export const updateMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const {
      name,
      specialization,
      experience_years,
      certification_details,
      profile_image_url,
      availability_status
    } = req.body;
    
    // Find the mechanic
    const mechanic = await ServiceProviderMechanic.findByPk(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    // Update mechanic details
    await mechanic.update({
      name: name || mechanic.name,
      specialization: specialization ? JSON.stringify(specialization) : mechanic.specialization,
      experience_years: experience_years || mechanic.experience_years,
      certification_details: certification_details ? JSON.stringify(certification_details) : mechanic.certification_details,
      profile_image_url: profile_image_url || mechanic.profile_image_url,
      availability_status: availability_status || mechanic.availability_status,
      updated_at: new Date()
    });
    
    res.status(200).json({ 
      message: 'Mechanic updated successfully',
      mechanic
    });
  } catch (error) {
    console.error('Error updating mechanic:', error);
    res.status(500).json({ message: 'Server error while updating mechanic', error: error.message });
  }
};

// Update mechanic availability
export const updateMechanicAvailability = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const { availability_status } = req.body;
    
    if (!['available', 'busy', 'offline'].includes(availability_status)) {
      return res.status(400).json({ message: 'Invalid availability status. Must be available, busy, or offline' });
    }
    
    const mechanic = await ServiceProviderMechanic.findByPk(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    await mechanic.update({
      availability_status,
      updated_at: new Date()
    });
    
    res.status(200).json({ 
      message: 'Mechanic availability updated successfully',
      availability_status
    });
  } catch (error) {
    console.error('Error updating mechanic availability:', error);
    res.status(500).json({ message: 'Server error while updating availability', error: error.message });
  }
};

// Delete mechanic
export const deleteMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    
    const mechanic = await ServiceProviderMechanic.findByPk(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    await mechanic.destroy();
    
    res.status(200).json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    console.error('Error deleting mechanic:', error);
    res.status(500).json({ message: 'Server error while deleting mechanic', error: error.message });
  }
};

// Get available mechanics by specialization
export const getAvailableMechanicsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    
    const mechanics = await ServiceProviderMechanic.findAll({
      where: {
        availability_status: 'available'
      },
      include: [{ model: ServiceProvider }]
    });
    
    // Filter mechanics by specialization
    const filteredMechanics = mechanics.filter(mechanic => {
      const specializationArray = JSON.parse(mechanic.specialization);
      return specializationArray.includes(specialization);
    });
    
    res.status(200).json({ mechanics: filteredMechanics });
  } catch (error) {
    console.error('Error fetching mechanics by specialization:', error);
    res.status(500).json({ message: 'Server error while fetching mechanics', error: error.message });
  }
};

// Assign mechanic to service assignment
export const assignMechanicToService = async (req, res) => {
  try {
    const { mechanicId, assignmentId } = req.params;
    
    // Verify mechanic exists
    const mechanic = await ServiceProviderMechanic.findByPk(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    // Import the ServiceAssignment model dynamically
    const ServiceAssignment = (await import('../Models/ServiceAssignmentModel.js')).default;
    
    // Find the service assignment
    const assignment = await ServiceAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }
    
    // Update the assignment with the mechanic ID
    await assignment.update({
      mechanic_id: mechanicId,
      updated_at: new Date()
    });
    
    // Update mechanic availability
    await mechanic.update({
      availability_status: 'busy',
      updated_at: new Date()
    });
    
    res.status(200).json({ 
      message: 'Mechanic assigned to service successfully',
      assignment
    });
  } catch (error) {
    console.error('Error assigning mechanic to service:', error);
    res.status(500).json({ message: 'Server error while assigning mechanic', error: error.message });
  }
};

// Get mechanic service history
export const getMechanicServiceHistory = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    
    // Verify mechanic exists
    const mechanic = await ServiceProviderMechanic.findByPk(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    // Import models dynamically
    const ServiceAssignment = (await import('../Models/ServiceAssignmentModel.js')).default;
    const BreakdownRequest = (await import('../Models/BreakdownRequestModel.js')).default;
    const ServicesProvided = (await import('../Models/ServiceProvidedModel.js')).default;
    
    // Get all service assignments for the mechanic
    const assignments = await ServiceAssignment.findAll({
      where: { mechanic_id: mechanicId },
      include: [
        { model: BreakdownRequest },
        { model: ServicesProvided }
      ],
      order: [['assigned_at', 'DESC']]
    });
    
    res.status(200).json({ 
      mechanic: {
        id: mechanic.mechanic_id,
        name: mechanic.name,
        specialization: JSON.parse(mechanic.specialization),
        experience_years: mechanic.experience_years
      },
      serviceHistory: assignments
    });
  } catch (error) {
    console.error('Error fetching mechanic service history:', error);
    res.status(500).json({ message: 'Server error while fetching service history', error: error.message });
  }
};

// Get mechanic performance metrics
export const getMechanicPerformanceMetrics = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    
    // Verify mechanic exists
    const mechanic = await ServiceProviderMechanic.findByPk(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    // Import models dynamically
    const ServiceAssignment = (await import('../Models/ServiceAssignmentModel.js')).default;
    const ReviewsRating = (await import('../Models/Review.js')).default;
    const VideoConsultation = (await import('../Models/VideoConsultationModel.js')).default;
    
    // Get service assignments
    const assignments = await ServiceAssignment.findAll({
      where: { mechanic_id: mechanicId },
      attributes: ['status', 'estimated_service_duration', 'actual_service_duration', 'created_at']
    });
    
    // Get review ratings
    const reviews = await ReviewsRating.findAll({
      include: [
        {
          model: (await import('../Models/ServiceProvidedModel.js')).default,
          include: [
            {
              model: ServiceAssignment,
              where: { mechanic_id: mechanicId }
            }
          ]
        }
      ]
    });
    
    // Get video consultations
    const consultations = await VideoConsultation.findAll({
      where: { mechanic_id: mechanicId }
    });
    
    // Calculate metrics
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
    const totalConsultations = consultations.length;
    
    // Calculate average service time
    let totalServiceTime = 0;
    let serviceTimeEntries = 0;
    
    assignments.forEach(assignment => {
      if (assignment.actual_service_duration) {
        totalServiceTime += assignment.actual_service_duration;
        serviceTimeEntries++;
      }
    });
    
    const averageServiceTime = serviceTimeEntries > 0 ? totalServiceTime / serviceTimeEntries : 0;
    
    // Calculate service efficiency (estimated vs actual time)
    let totalEfficiency = 0;
    let efficiencyEntries = 0;
    
    assignments.forEach(assignment => {
      if (assignment.estimated_service_duration && assignment.actual_service_duration) {
        totalEfficiency += assignment.estimated_service_duration / assignment.actual_service_duration;
        efficiencyEntries++;
      }
    });
    
    const serviceEfficiency = efficiencyEntries > 0 ? (totalEfficiency / efficiencyEntries) * 100 : 0;
    
    // Return performance metrics
    res.status(200).json({
      mechanic: {
        id: mechanic.mechanic_id,
        name: mechanic.name
      },
      metrics: {
        completedAssignments,
        averageRating,
        totalConsultations,
        averageServiceTime,
        serviceEfficiency: parseFloat(serviceEfficiency.toFixed(2)),
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    console.error('Error fetching mechanic performance metrics:', error);
    res.status(500).json({ message: 'Server error while fetching performance metrics', error: error.message });
  }
};