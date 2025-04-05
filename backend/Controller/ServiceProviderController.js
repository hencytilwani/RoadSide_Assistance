import db from '../Models/index.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Get models from db object
const ServiceProvider = db.Service_Provider;
const ServiceProviderMechanic = db.Service_Provider_Mechanic;
const ReviewsRating = db.Reviews_Rating;

// Register a new service provider
export const registerProvider = async (req, res) => {
  try {
    const {
      business_name,
      provider_type,
      services_offered,
      address,
      latitude,
      longitude,
      contact_person,
      phone_number,
      email,
      password,
      working_hours,
      verification_documents,
      mechanics
    } = req.body;
    console.log("re3g3i24s452524534",password)
    // Check if provider already exists
    const existingProvider = await ServiceProvider.findOne({ 
      where: { email }
    });

    if (existingProvider) {
      return res.status(400).json({ 
        message: 'Service provider with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new service provider
    const newProvider = await ServiceProvider.create({
      business_name,
      provider_type,
      services_offered: JSON.stringify(services_offered),
      address,
      latitude,
      longitude,
      contact_person,
      phone_number,
      email,
      password_hash,
      working_hours: JSON.stringify(working_hours),
      rating: 0,
      is_verified: false,
      verification_documents: JSON.stringify(verification_documents || []),
      created_at: new Date(),
      updated_at: new Date()
    });

    // Add mechanics if provided
    if (mechanics && mechanics.length > 0) {
      const mechanicPromises = mechanics.map(mechanic => {
        return ServiceProviderMechanic.create({
          provider_id: newProvider.provider_id,
          name: mechanic.name,
          specialization: JSON.stringify(mechanic.specialization || []),
          experience_years: mechanic.experience_years,
          certification_details: JSON.stringify(mechanic.certification_details || {}),
          profile_image_url: mechanic.profile_image_url,
          availability_status: 'available',
          created_at: new Date(),
          updated_at: new Date()
        });
      });
      await Promise.all(mechanicPromises);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: newProvider.provider_id, email: newProvider.email, type: 'provider' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return provider info without password
    const providerResponse = {
      id: newProvider.provider_id,
      business_name: newProvider.business_name,
      provider_type: newProvider.provider_type,
      email: newProvider.email,
      is_verified: newProvider.is_verified
    };

    res.status(201).json({ provider: providerResponse, token });
  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({ 
      message: 'Server error during provider registration', 
      error: error.message 
    });
  }
};
export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find provider
    const provider = await ServiceProvider.findOne({ where: { email } });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Debugging logs
    console.log("Provider found:", provider);
    console.log("Password received:", password);
    console.log("Stored password hash:", provider.password_hash);

    // Ensure password hash exists
    if (!provider.password_hash) {
      return res.status(500).json({ message: 'Password hash is missing in database' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, provider.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: provider.provider_id, email: provider.email, type: 'provider' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return provider info
    const providerResponse = {
      id: provider.provider_id,
      business_name: provider.business_name,
      provider_type: provider.provider_type,
      email: provider.email,
      is_verified: provider.is_verified
    };

    res.status(200).json({ provider: providerResponse, token });
  } catch (error) {
    console.error('Provider login error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};


// Get provider profile
export const getProviderProfile = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;

    const provider = await ServiceProvider.findByPk(providerId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: ServiceProviderMechanic,
          as: 'Service_Provider_Mechanics'
        },
        {
          model: ReviewsRating,
          as: 'Reviews_Ratings',
          include: [{
            model: db.User,
            attributes: ['name', 'profile_image_url']
          }]
        }
      ]
    });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Parse JSON fields
    const responseProvider = {
      ...provider.toJSON(),
      services_offered: JSON.parse(provider.services_offered || '[]'),
      working_hours: JSON.parse(provider.working_hours || '{}'),
      verification_documents: JSON.parse(provider.verification_documents || '[]')
    };

    res.status(200).json({ provider: responseProvider });
  } catch (error) {
    console.error('Get provider profile error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching provider profile', 
      error: error.message 
    });
  }
};

// Update provider profile
export const updateProviderProfile = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;
    const {
      business_name,
      provider_type,
      services_offered,
      address,
      latitude,
      longitude,
      contact_person,
      phone_number,
      working_hours
    } = req.body;

    const provider = await ServiceProvider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Update fields
    await provider.update({
      business_name: business_name || provider.business_name,
      provider_type: provider_type || provider.provider_type,
      services_offered: services_offered ? JSON.stringify(services_offered) : provider.services_offered,
      address: address || provider.address,
      latitude: latitude || provider.latitude,
      longitude: longitude || provider.longitude,
      contact_person: contact_person || provider.contact_person,
      phone_number: phone_number || provider.phone_number,
      working_hours: working_hours ? JSON.stringify(working_hours) : provider.working_hours,
      updated_at: new Date()
    });

    // Return updated provider
    const updatedProvider = await ServiceProvider.findByPk(providerId, {
      attributes: { exclude: ['password_hash'] }
    });

    // Parse JSON fields
    const responseProvider = {
      ...updatedProvider.toJSON(),
      services_offered: JSON.parse(updatedProvider.services_offered || '[]'),
      working_hours: JSON.parse(updatedProvider.working_hours || '{}'),
      verification_documents: JSON.parse(updatedProvider.verification_documents || '[]')
    };

    res.status(200).json({ 
      message: 'Provider profile updated successfully', 
      provider: responseProvider 
    });
  } catch (error) {
    console.error('Update provider profile error:', error);
    res.status(500).json({ 
      message: 'Server error while updating provider profile', 
      error: error.message 
    });
  }
};

// Add/update verification documents
export const updateVerificationDocuments = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;
    const { verification_documents } = req.body;

    if (!verification_documents || !Array.isArray(verification_documents)) {
      return res.status(400).json({ message: 'Valid verification documents required' });
    }

    const provider = await ServiceProvider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Update verification documents
    await provider.update({
      verification_documents: JSON.stringify(verification_documents),
      is_verified: false, // Reset verification status for admin review
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'Verification documents updated successfully. Awaiting verification.' 
    });
  } catch (error) {
    console.error('Update verification documents error:', error);
    res.status(500).json({ 
      message: 'Server error while updating verification documents', 
      error: error.message 
    });
  }
};

// Get all service providers with filtering
export const getAllProviders = async (req, res) => {
  try {
    const { 
      provider_type, 
      services_offered, 
      rating, 
      is_verified,
      latitude,
      longitude,
      radius,
      limit = 10,
      offset = 0
    } = req.query;
    
    // Build filter conditions
    const whereClause = {};
    
    if (provider_type) {
      whereClause.provider_type = provider_type;
    }
    
    if (services_offered) {
      // Search for services in the JSON array
      whereClause.services_offered = {
        [Op.like]: `%${services_offered}%`
      };
    }
    
    if (rating) {
      whereClause.rating = {
        [Op.gte]: parseFloat(rating)
      };
    }
    
    if (is_verified !== undefined) {
      whereClause.is_verified = is_verified === 'true';
    }
    
    // Location-based search if coordinates provided
    let locationQuery = {};
    if (latitude && longitude && radius) {
      // Using Haversine formula with Sequelize
      // Convert radius from kilometers to degrees (approximate)
      const radiusInDegrees = parseFloat(radius) / 111.12; // 1 degree ~ 111.12 km
      
      locationQuery = {
        attributes: {
          include: [
            [
              db.sequelize.literal(
                `6371 * acos(cos(radians(${parseFloat(latitude)})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${parseFloat(longitude)})) + sin(radians(${parseFloat(latitude)})) * sin(radians(latitude)))`
              ),
              'distance'
            ]
          ]
        },
        having: db.sequelize.literal(`distance <= ${parseFloat(radius)}`),
        order: [[db.sequelize.literal('distance'), 'ASC']]
      };
    }
    
    // Execute the query with pagination
    const providers = await ServiceProvider.findAndCountAll({
      where: whereClause,
      ...locationQuery,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: ServiceProviderMechanic,
          as: 'Service_Provider_Mechanics'
        }
      ]
    });
    
    // Parse JSON fields in results
    const parsedProviders = providers.rows.map(provider => {
      const providerData = provider.toJSON();
      return {
        ...providerData,
        services_offered: JSON.parse(providerData.services_offered || '[]'),
        working_hours: JSON.parse(providerData.working_hours || '{}')
      };
    });
    
    return res.status(200).json({
      success: true,
      count: providers.count,
      data: parsedProviders,
      pagination: {
        total: providers.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(providers.count / parseInt(limit)),
        currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1
      }
    });
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching service providers',
      error: error.message
    });
  }
};

// Get provider stats
export const getProviderStats = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;
    
    // Get service assignments
    const assignments = await db.Service_Assignment.findAndCountAll({
      where: { provider_id: providerId },
      include: [
        {
          model: db.Services_Provided,
          as: 'Services_Provideds'
        }
      ]
    });
    
    // Calculate total earnings
    let totalEarnings = 0;
    assignments.rows.forEach(assignment => {
      assignment.Services_Provideds.forEach(service => {
        totalEarnings += service.total_cost || 0;
      });
    });
    
    // Get ratings
    const ratings = await ReviewsRating.findAll({
      where: { provider_id: providerId },
      attributes: ['rating']
    });
    
    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;
    
    // Count completed services
    const completedServices = await db.Service_Assignment.count({
      where: { 
        provider_id: providerId,
        status: 'completed'
      }
    });
    
    // Count in-progress services
    const inProgressServices = await db.Service_Assignment.count({
      where: { 
        provider_id: providerId,
        status: {
          [Op.in]: ['assigned', 'on_the_way', 'arrived', 'in_progress']
        }
      }
    });
    
    res.status(200).json({
      totalEarnings,
      totalServices: assignments.count,
      completedServices,
      inProgressServices,
      averageRating,
      totalRatings
    });
  } catch (error) {
    console.error('Get provider stats error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching provider stats', 
      error: error.message 
    });
  }
};

// Add/update mechanic
export const manageMechanic = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;
    const { mechanic_id } = req.params;
    const {
      name,
      specialization,
      experience_years,
      certification_details,
      profile_image_url,
      availability_status
    } = req.body;
    
    // Check if provider exists
    const provider = await ServiceProvider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    let mechanic;
    
    // Update existing mechanic or create new one
    if (mechanic_id) {
      mechanic = await ServiceProviderMechanic.findOne({
        where: {
          mechanic_id,
          provider_id: providerId
        }
      });
      
      if (!mechanic) {
        return res.status(404).json({ message: 'Mechanic not found' });
      }
      
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
        mechanic: {
          ...mechanic.toJSON(),
          specialization: JSON.parse(mechanic.specialization || '[]'),
          certification_details: JSON.parse(mechanic.certification_details || '{}')
        }
      });
    } else {
      // Create new mechanic
      mechanic = await ServiceProviderMechanic.create({
        provider_id: providerId,
        name,
        specialization: JSON.stringify(specialization || []),
        experience_years,
        certification_details: JSON.stringify(certification_details || {}),
        profile_image_url,
        availability_status: availability_status || 'available',
        created_at: new Date(),
        updated_at: new Date()
      });
      
      res.status(201).json({ 
        message: 'Mechanic added successfully',
        mechanic: {
          ...mechanic.toJSON(),
          specialization: JSON.parse(mechanic.specialization || '[]'),
          certification_details: JSON.parse(mechanic.certification_details || '{}')
        }
      });
    }
  } catch (error) {
    console.error('Manage mechanic error:', error);
    res.status(500).json({ 
      message: 'Server error while managing mechanic', 
      error: error.message 
    });
  }
};

// Delete mechanic
export const deleteMechanic = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;
    const { mechanic_id } = req.params;
    
    // Check if mechanic exists and belongs to provider
    const mechanic = await ServiceProviderMechanic.findOne({
      where: {
        mechanic_id,
        provider_id: providerId
      }
    });
    
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    // Check if mechanic has active assignments
    const activeAssignments = await db.Service_Assignment.count({
      where: {
        mechanic_id,
        status: {
          [Op.in]: ['assigned', 'on_the_way', 'arrived', 'in_progress']
        }
      }
    });
    
    if (activeAssignments > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete mechanic with active service assignments' 
      });
    }
    
    // Delete mechanic
    await mechanic.destroy();
    
    res.status(200).json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    console.error('Delete mechanic error:', error);
    res.status(500).json({ 
      message: 'Server error while deleting mechanic', 
      error: error.message 
    });
  }
};

// Get service history
export const getServiceHistory = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;
    const { status, start_date, end_date, limit = 10, offset = 0 } = req.query;
    
    // Build filter conditions
    const whereClause = { provider_id: providerId };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (start_date && end_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }
    
    // Execute query
    const serviceHistory = await db.Service_Assignment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Breakdown_Request,
          as: 'Breakdown_Request',
          include: [
            {
              model: db.User,
              as: 'User',
              attributes: ['user_id', 'name', 'phone_number']
            },
            {
              model: db.Vehicle,
              as: 'Vehicle',
              attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate']
            }
          ]
        },
        {
          model: db.Services_Provided,
          as: 'Services_Provideds'
        },
        {
          model: db.Service_Provider_Mechanic,
          as: 'Service_Provider_Mechanic',
          attributes: ['mechanic_id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: serviceHistory.count,
      data: serviceHistory.rows,
      pagination: {
        total: serviceHistory.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(serviceHistory.count / parseInt(limit)),
        currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1
      }
    });
  } catch (error) {
    console.error('Get service history error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching service history', 
      error: error.message 
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const providerId = req.params.id || req.provider.id;
    const { current_password, new_password } = req.body;
    
    if (!current_password || !new_password) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }
    
    // Find provider
    const provider = await ServiceProvider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(current_password, provider.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);
    
    // Update password
    await provider.update({
      password_hash,
      updated_at: new Date()
    });
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Server error while changing password', 
      error: error.message 
    });
  }
};

export default {
  registerProvider,
  loginProvider,
  getProviderProfile,
  updateProviderProfile,
  updateVerificationDocuments,
  getAllProviders,
  getProviderStats,
  manageMechanic,
  deleteMechanic,
  getServiceHistory,
  changePassword
};