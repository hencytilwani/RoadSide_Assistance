import ARRepairGuides from '../Models/ARRepairGuidesModel.js';
import Vehicle from '../Models/Vehicle.js';

// Get all repair guides
export const getAllRepairGuides = async (req, res) => {
  try {
    const guides = await ARRepairGuides.findAll();
    res.status(200).json(guides);
  } catch (error) {
    console.error('Error fetching repair guides:', error);
    res.status(500).json({ message: 'Server error while fetching repair guides', error: error.message });
  }
};

// Get a single repair guide by ID
export const getGuideById = async (req, res) => {
  try {
    const { guideId } = req.params;
    
    const guide = await ARRepairGuides.findByPk(guideId);
    
    if (!guide) {
      return res.status(404).json({ message: 'Repair guide not found' });
    }
    
    res.status(200).json(guide);
  } catch (error) {
    console.error('Error fetching repair guide:', error);
    res.status(500).json({ message: 'Server error while fetching repair guide', error: error.message });
  }
};

// Create a new repair guide
export const createRepairGuide = async (req, res) => {
  try {
    const {
      title,
      vehicle_make,
      vehicle_model,
      year_range,
      repair_type,
      difficulty_level,
      estimated_time,
      steps,
      required_tools,
      safety_warnings
    } = req.body;
    
    // Create new repair guide
    const newGuide = await ARRepairGuides.create({
      title,
      vehicle_make,
      vehicle_model,
      year_range,
      repair_type,
      difficulty_level,
      estimated_time,
      steps,
      required_tools,
      safety_warnings,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.status(201).json(newGuide);
  } catch (error) {
    console.error('Error creating repair guide:', error);
    res.status(500).json({ message: 'Server error while creating repair guide', error: error.message });
  }
};

// Update a repair guide
export const updateRepairGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    const {
      title,
      vehicle_make,
      vehicle_model,
      year_range,
      repair_type,
      difficulty_level,
      estimated_time,
      steps,
      required_tools,
      safety_warnings
    } = req.body;
    
    // Find guide by ID
    const guide = await ARRepairGuides.findByPk(guideId);
    
    if (!guide) {
      return res.status(404).json({ message: 'Repair guide not found' });
    }
    
    // Update guide
    await guide.update({
      title,
      vehicle_make,
      vehicle_model,
      year_range,
      repair_type,
      difficulty_level,
      estimated_time,
      steps,
      required_tools,
      safety_warnings,
      updated_at: new Date()
    });
    
    res.status(200).json(guide);
  } catch (error) {
    console.error('Error updating repair guide:', error);
    res.status(500).json({ message: 'Server error while updating repair guide', error: error.message });
  }
};

// Delete a repair guide
export const deleteRepairGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    
    // Find guide by ID
    const guide = await ARRepairGuides.findByPk(guideId);
    
    if (!guide) {
      return res.status(404).json({ message: 'Repair guide not found' });
    }
    
    // Delete guide
    await guide.destroy();
    
    res.status(200).json({ message: 'Repair guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting repair guide:', error);
    res.status(500).json({ message: 'Server error while deleting repair guide', error: error.message });
  }
};

// Find repair guides compatible with a specific vehicle
export const getCompatibleGuides = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Get vehicle details
    const vehicle = await Vehicle.findByPk(vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Find compatible guides
    const compatibleGuides = await ARRepairGuides.findAll({
      where: {
        vehicle_make: vehicle.make,
        vehicle_model: vehicle.model
      }
    });
    
    // Filter guides by year
    const yearCompatibleGuides = compatibleGuides.filter(guide => {
      const yearRange = JSON.parse(guide.year_range);
      return vehicle.year >= yearRange.min && vehicle.year <= yearRange.max;
    });
    
    res.status(200).json(yearCompatibleGuides);
  } catch (error) {
    console.error('Error finding compatible repair guides:', error);
    res.status(500).json({ message: 'Server error while finding compatible repair guides', error: error.message });
  }
};

// Search repair guides by keywords, repair type, and difficulty level
export const searchGuides = async (req, res) => {
  try {
    const { keyword, repair_type, difficulty_level, make, model } = req.query;
    
    // Build query conditions
    const whereConditions = {};
    
    if (repair_type) {
      whereConditions.repair_type = repair_type;
    }
    
    if (difficulty_level) {
      whereConditions.difficulty_level = difficulty_level;
    }
    
    if (make) {
      whereConditions.vehicle_make = make;
    }
    
    if (model) {
      whereConditions.vehicle_model = model;
    }
    
    // Search guides
    let guides;
    if (keyword) {
      guides = await ARRepairGuides.findAll({
        where: {
          ...whereConditions,
          [sequelize.Op.or]: [
            { title: { [sequelize.Op.like]: `%${keyword}%` } },
            { repair_type: { [sequelize.Op.like]: `%${keyword}%` } }
          ]
        }
      });
    } else {
      guides = await ARRepairGuides.findAll({ where: whereConditions });
    }
    
    res.status(200).json(guides);
  } catch (error) {
    console.error('Error searching repair guides:', error);
    res.status(500).json({ message: 'Server error while searching repair guides', error: error.message });
  }
};

// Get repair guides by repair type
export const getGuidesByRepairType = async (req, res) => {
  try {
    const { repairType } = req.params;
    
    const guides = await ARRepairGuides.findAll({
      where: { repair_type: repairType }
    });
    
    res.status(200).json(guides);
  } catch (error) {
    console.error('Error fetching guides by repair type:', error);
    res.status(500).json({ message: 'Server error while fetching guides by repair type', error: error.message });
  }
};

// Get repair guides by difficulty level
export const getGuidesByDifficulty = async (req, res) => {
  try {
    const { difficultyLevel } = req.params;
    
    const guides = await ARRepairGuides.findAll({
      where: { difficulty_level: difficultyLevel }
    });
    
    res.status(200).json(guides);
  } catch (error) {
    console.error('Error fetching guides by difficulty level:', error);
    res.status(500).json({ message: 'Server error while fetching guides by difficulty level', error: error.message });
  }
};