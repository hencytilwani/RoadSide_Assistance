import ServicesProvided from '../Models/ServiceProvidedModel.js';
import ServiceAssignment from '../Models/ServiceAssignmentModel.js';
import Payment from '../Models/Payment.js';
import ReviewsRating from '../Models/Review.js';

// Create a new service record
export const createService = async (req, res) => {
  try {
    const {
      assignment_id,
      service_type,
      description,
      parts_used,
      labor_cost,
      parts_cost,
      additional_charges,
      total_cost,
      warranty_information
    } = req.body;

    // Check if the assignment exists
    const existingAssignment = await ServiceAssignment.findByPk(assignment_id);
    if (!existingAssignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }

    // Create new service record
    const newService = await ServicesProvided.create({
      assignment_id,
      service_type,
      description,
      parts_used: parts_used ? JSON.stringify(parts_used) : null,
      labor_cost,
      parts_cost,
      additional_charges,
      total_cost,
      warranty_information,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      message: 'Service record created successfully',
      service: newService
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error while creating service record', error: error.message });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await ServicesProvided.findAll({
      include: [
        {
          model: ServiceAssignment,
          attributes: ['assignment_id', 'request_id', 'provider_id', 'mechanic_id', 'status']
        }
      ]
    });

    res.status(200).json(services);
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ message: 'Server error while fetching services', error: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await ServicesProvided.findByPk(id, {
      include: [
        {
          model: ServiceAssignment,
          attributes: ['assignment_id', 'request_id', 'provider_id', 'mechanic_id', 'status']
        },
        {
          model: Payment,
          attributes: ['payment_id', 'amount', 'payment_method', 'status']
        },
        {
          model: ReviewsRating,
          attributes: ['review_id', 'rating', 'review_text', 'review_date']
        }
      ]
    });

    if (!service) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching service', error: error.message });
  }
};

// Get services by assignment ID
export const getServicesByAssignmentId = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const services = await ServicesProvided.findAll({
      where: { assignment_id: assignmentId },
      include: [
        {
          model: Payment,
          attributes: ['payment_id', 'amount', 'status']
        }
      ]
    });

    res.status(200).json(services);
  } catch (error) {
    console.error('Get services by assignment ID error:', error);
    res.status(500).json({ message: 'Server error while fetching services', error: error.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      service_type,
      description,
      parts_used,
      labor_cost,
      parts_cost,
      additional_charges,
      total_cost,
      warranty_information
    } = req.body;

    const service = await ServicesProvided.findByPk(id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    // Update service fields
    await service.update({
      service_type: service_type || service.service_type,
      description: description || service.description,
      parts_used: parts_used ? JSON.stringify(parts_used) : service.parts_used,
      labor_cost: labor_cost !== undefined ? labor_cost : service.labor_cost,
      parts_cost: parts_cost !== undefined ? parts_cost : service.parts_cost,
      additional_charges: additional_charges !== undefined ? additional_charges : service.additional_charges,
      total_cost: total_cost !== undefined ? total_cost : service.total_cost,
      warranty_information: warranty_information || service.warranty_information,
      updated_at: new Date()
    });

    res.status(200).json({
      message: 'Service record updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error while updating service', error: error.message });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await ServicesProvided.findByPk(id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    // Check if there are related payments or reviews
    const relatedPayments = await Payment.findOne({ where: { service_id: id } });
    const relatedReviews = await ReviewsRating.findOne({ where: { service_id: id } });

    if (relatedPayments || relatedReviews) {
      return res.status(400).json({ 
        message: 'Cannot delete service with related payments or reviews. Consider setting it as inactive instead.'
      });
    }

    await service.destroy();
    
    res.status(200).json({ message: 'Service record deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error while deleting service', error: error.message });
  }
};

// Get service statistics
export const getServiceStatistics = async (req, res) => {
  try {
    // Count total services
    const totalServices = await ServicesProvided.count();
    
    // Calculate average costs
    const services = await ServicesProvided.findAll({
      attributes: [
        'service_type',
        [ServicesProvided.sequelize.fn('AVG', ServicesProvided.sequelize.col('labor_cost')), 'avg_labor_cost'],
        [ServicesProvided.sequelize.fn('AVG', ServicesProvided.sequelize.col('parts_cost')), 'avg_parts_cost'],
        [ServicesProvided.sequelize.fn('AVG', ServicesProvided.sequelize.col('total_cost')), 'avg_total_cost'],
        [ServicesProvided.sequelize.fn('COUNT', ServicesProvided.sequelize.col('service_id')), 'service_count']
      ],
      group: ['service_type']
    });
    
    // Calculate total revenue
    const totalRevenue = await ServicesProvided.sum('total_cost');

    res.status(200).json({
      totalServices,
      servicesByType: services,
      totalRevenue
    });
  } catch (error) {
    console.error('Get service statistics error:', error);
    res.status(500).json({ message: 'Server error while fetching service statistics', error: error.message });
  }
};

// Get services by date range
export const getServicesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const services = await ServicesProvided.findAll({
      where: {
        created_at: {
          [ServicesProvided.sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        {
          model: ServiceAssignment,
          attributes: ['assignment_id', 'request_id', 'provider_id', 'mechanic_id']
        }
      ]
    });

    res.status(200).json(services);
  } catch (error) {
    console.error('Get services by date range error:', error);
    res.status(500).json({ message: 'Server error while fetching services by date range', error: error.message });
  }
};