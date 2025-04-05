import ServiceAssignment from '../Models/ServiceAssignmentModel.js';
import BreakdownRequest from '../Models/BreakdownRequestModel.js';
import ServiceProvider from '../Models/ServiceProviderModel.js';
import ServiceProviderMechanic from '../Models/ServiceProviderMechanicModel.js';

// Create a new service assignment
export const createServiceAssignment = async (req, res) => {
  try {
    const {
      request_id,
      provider_id,
      mechanic_id,
      estimated_arrival_time,
      estimated_service_duration,
      distance_to_customer
    } = req.body;

    // Check if the breakdown request exists
    const request = await BreakdownRequest.findByPk(request_id);
    if (!request) {
      return res.status(404).json({ message: 'Breakdown request not found' });
    }

    // Check if provider exists
    const provider = await ServiceProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    // Check if mechanic exists if provided
    if (mechanic_id) {
      const mechanic = await ServiceProviderMechanic.findByPk(mechanic_id);
      if (!mechanic) {
        return res.status(404).json({ message: 'Mechanic not found' });
      }
      
      // Verify mechanic belongs to the provider
      if (mechanic.provider_id !== provider_id) {
        return res.status(400).json({ message: 'Mechanic does not belong to this service provider' });
      }
    }

    // Check if assignment already exists for this request
    const existingAssignment = await ServiceAssignment.findOne({ 
      where: { request_id }
    });
    
    if (existingAssignment) {
      return res.status(400).json({ message: 'This breakdown request already has a service assignment' });
    }

    // Create new service assignment
    const newAssignment = await ServiceAssignment.create({
      request_id,
      provider_id,
      mechanic_id,
      assigned_at: new Date(),
      estimated_arrival_time,
      status: 'assigned',
      estimated_service_duration,
      distance_to_customer,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update the breakdown request status
    await request.update({
      status: 'accepted',
      updated_at: new Date()
    });

    res.status(201).json({
      message: 'Service assignment created successfully',
      assignment: newAssignment
    });
  } catch (error) {
    console.error('Service assignment creation error:', error);
    res.status(500).json({ 
      message: 'Server error during service assignment creation', 
      error: error.message 
    });
  }
};

// Get all service assignments
export const getAllServiceAssignments = async (req, res) => {
  try {
    const assignments = await ServiceAssignment.findAll({
      include: [
        { model: BreakdownRequest },
        { model: ServiceProvider },
        { model: ServiceProviderMechanic }
      ]
    });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching service assignments:', error);
    res.status(500).json({ 
      message: 'Server error while fetching service assignments', 
      error: error.message 
    });
  }
};

// Get service assignment by ID
export const getServiceAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await ServiceAssignment.findByPk(id, {
      include: [
        { model: BreakdownRequest },
        { model: ServiceProvider },
        { model: ServiceProviderMechanic }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }

    res.status(200).json({ assignment });
  } catch (error) {
    console.error('Error fetching service assignment:', error);
    res.status(500).json({ 
      message: 'Server error while fetching service assignment', 
      error: error.message 
    });
  }
};

// Get service assignments by request ID
export const getServiceAssignmentByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;
    const assignment = await ServiceAssignment.findOne({
      where: { request_id: requestId },
      include: [
        { model: BreakdownRequest },
        { model: ServiceProvider },
        { model: ServiceProviderMechanic }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'No service assignment found for this request' });
    }

    res.status(200).json({ assignment });
  } catch (error) {
    console.error('Error fetching service assignment by request:', error);
    res.status(500).json({ 
      message: 'Server error while fetching service assignment', 
      error: error.message 
    });
  }
};

// Get service assignments by provider ID
export const getServiceAssignmentsByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    const assignments = await ServiceAssignment.findAll({
      where: { provider_id: providerId },
      include: [
        { model: BreakdownRequest },
        { model: ServiceProvider },
        { model: ServiceProviderMechanic }
      ]
    });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching provider assignments:', error);
    res.status(500).json({ 
      message: 'Server error while fetching provider assignments', 
      error: error.message 
    });
  }
};

// Get service assignments by mechanic ID
export const getServiceAssignmentsByMechanicId = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const assignments = await ServiceAssignment.findAll({
      where: { mechanic_id: mechanicId },
      include: [
        { model: BreakdownRequest },
        { model: ServiceProvider },
        { model: ServiceProviderMechanic }
      ]
    });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching mechanic assignments:', error);
    res.status(500).json({ 
      message: 'Server error while fetching mechanic assignments', 
      error: error.message 
    });
  }
};

// Update service assignment status
export const updateServiceAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_arrival_time, actual_service_duration } = req.body;

    const assignment = await ServiceAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }

    // Validate status
    const validStatuses = ['assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Status must be one of: assigned, on_the_way, arrived, in_progress, completed, cancelled' 
      });
    }

    const updateData = {
      status,
      updated_at: new Date()
    };

    // Add actual_arrival_time if status is 'arrived'
    if (status === 'arrived' || (status !== 'arrived' && actual_arrival_time)) {
      updateData.actual_arrival_time = actual_arrival_time || new Date();
    }

    // Add actual_service_duration if status is 'completed'
    if (status === 'completed' || (status !== 'completed' && actual_service_duration)) {
      updateData.actual_service_duration = actual_service_duration;
    }

    // Update assignment
    await assignment.update(updateData);

    // Update corresponding breakdown request status
    if (status === 'completed' || status === 'cancelled') {
      const requestStatus = status === 'completed' ? 'completed' : 'cancelled';
      await BreakdownRequest.update(
        { 
          status: requestStatus,
          updated_at: new Date()
        },
        { where: { request_id: assignment.request_id } }
      );
    } else if (status === 'in_progress') {
      await BreakdownRequest.update(
        { 
          status: 'in_progress',
          updated_at: new Date()
        },
        { where: { request_id: assignment.request_id } }
      );
    }

    res.status(200).json({
      message: 'Service assignment updated successfully',
      assignment: await ServiceAssignment.findByPk(id)
    });
  } catch (error) {
    console.error('Error updating service assignment:', error);
    res.status(500).json({ 
      message: 'Server error while updating service assignment', 
      error: error.message 
    });
  }
};

// Assign or reassign mechanic
export const assignMechanic = async (req, res) => {
  try {
    const { id } = req.params;
    const { mechanic_id } = req.body;

    const assignment = await ServiceAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }

    // Check if mechanic exists
    const mechanic = await ServiceProviderMechanic.findByPk(mechanic_id);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    // Verify mechanic belongs to the provider
    if (mechanic.provider_id !== assignment.provider_id) {
      return res.status(400).json({ message: 'Mechanic does not belong to the assigned service provider' });
    }

    // Update assignment with new mechanic
    await assignment.update({
      mechanic_id,
      updated_at: new Date()
    });

    res.status(200).json({
      message: 'Mechanic assigned successfully',
      assignment: await ServiceAssignment.findByPk(id)
    });
  } catch (error) {
    console.error('Error assigning mechanic:', error);
    res.status(500).json({ 
      message: 'Server error while assigning mechanic', 
      error: error.message 
    });
  }
};

// Update estimated arrival time
export const updateEstimatedArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const { estimated_arrival_time } = req.body;

    const assignment = await ServiceAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }

    // Update estimated arrival time
    await assignment.update({
      estimated_arrival_time,
      updated_at: new Date()
    });

    res.status(200).json({
      message: 'Estimated arrival time updated successfully',
      assignment: await ServiceAssignment.findByPk(id)
    });
  } catch (error) {
    console.error('Error updating estimated arrival time:', error);
    res.status(500).json({ 
      message: 'Server error while updating estimated arrival time', 
      error: error.message 
    });
  }
};

// Delete service assignment
export const deleteServiceAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await ServiceAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }

    // Don't allow deletion if there are services provided linked to this assignment
    // This would require importing your ServicesProvided model
    // const servicesProvided = await ServicesProvided.findOne({ where: { assignment_id: id } });
    // if (servicesProvided) {
    //   return res.status(400).json({ message: 'Cannot delete assignment with linked services provided' });
    // }

    // Reset breakdown request status to pending
    await BreakdownRequest.update(
      { 
        status: 'pending',
        updated_at: new Date()
      },
      { where: { request_id: assignment.request_id } }
    );

    // Delete the assignment
    await assignment.destroy();

    res.status(200).json({ message: 'Service assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting service assignment:', error);
    res.status(500).json({ 
      message: 'Server error while deleting service assignment', 
      error: error.message 
    });
  }
};

// Get service assignments by status
export const getServiceAssignmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ['assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Status must be one of: assigned, on_the_way, arrived, in_progress, completed, cancelled' 
      });
    }
    
    const assignments = await ServiceAssignment.findAll({
      where: { status },
      include: [
        { model: BreakdownRequest },
        { model: ServiceProvider },
        { model: ServiceProviderMechanic }
      ]
    });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments by status:', error);
    res.status(500).json({ 
      message: 'Server error while fetching assignments by status', 
      error: error.message 
    });
  }
};