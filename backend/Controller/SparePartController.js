import SparePartsInventory from '../Models/SparePartModel.js';
import { Op } from 'sequelize';

// Get all spare parts with optional filtering
export const getAllSpareParts = async (req, res) => {
  try {
    const { 
      category, 
      make, 
      model, 
      year, 
      inStock,
      searchTerm,
      limit = 10,
      offset = 0
    } = req.query;

    // Build filter conditions
    const whereConditions = {};
    
    if (category) {
      whereConditions.category = category;
    }
    
    if (make) {
      whereConditions.compatible_makes = { [Op.contains]: [make] };
    }
    
    if (model) {
      whereConditions.compatible_models = { [Op.contains]: [model] };
    }
    
    if (year) {
      whereConditions.compatible_years = { [Op.contains]: [parseInt(year)] };
    }
    
    if (inStock === 'true') {
      whereConditions.stock_quantity = { [Op.gt]: 0 };
    }
    
    if (searchTerm) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${searchTerm}%` } },
        { description: { [Op.iLike]: `%${searchTerm}%` } }
      ];
    }

    // Get parts with pagination
    const parts = await SparePartsInventory.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      total: parts.count,
      parts: parts.rows,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(parts.count / limit)
    });
  } catch (error) {
    console.error('Error fetching spare parts:', error);
    res.status(500).json({ message: 'Server error while fetching spare parts', error: error.message });
  }
};

// Get spare part by ID
export const getSparePartById = async (req, res) => {
  try {
    const { partId } = req.params;
    
    const part = await SparePartsInventory.findByPk(partId);
    
    if (!part) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    
    res.status(200).json(part);
  } catch (error) {
    console.error('Error fetching spare part:', error);
    res.status(500).json({ message: 'Server error while fetching spare part', error: error.message });
  }
};

// Create new spare part
export const createSparePart = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      compatible_makes,
      compatible_models,
      compatible_years,
      price,
      stock_quantity,
      supplier_id,
      image_url,
      specifications
    } = req.body;
    
    // Validate required fields
    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Name, category, and price are required fields' });
    }
    
    // Create new spare part
    const newPart = await SparePartsInventory.create({
      name,
      description,
      category,
      compatible_makes: compatible_makes || [],
      compatible_models: compatible_models || [],
      compatible_years: compatible_years || [],
      price,
      stock_quantity: stock_quantity || 0,
      supplier_id,
      image_url,
      specifications: specifications || {},
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.status(201).json(newPart);
  } catch (error) {
    console.error('Error creating spare part:', error);
    res.status(500).json({ message: 'Server error while creating spare part', error: error.message });
  }
};

// Update spare part
export const updateSparePart = async (req, res) => {
  try {
    const { partId } = req.params;
    const {
      name,
      description,
      category,
      compatible_makes,
      compatible_models,
      compatible_years,
      price,
      stock_quantity,
      supplier_id,
      image_url,
      specifications
    } = req.body;
    
    // Find the part
    const part = await SparePartsInventory.findByPk(partId);
    
    if (!part) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    
    // Update part
    await part.update({
      name: name || part.name,
      description: description || part.description,
      category: category || part.category,
      compatible_makes: compatible_makes || part.compatible_makes,
      compatible_models: compatible_models || part.compatible_models,
      compatible_years: compatible_years || part.compatible_years,
      price: price || part.price,
      stock_quantity: stock_quantity !== undefined ? stock_quantity : part.stock_quantity,
      supplier_id: supplier_id || part.supplier_id,
      image_url: image_url || part.image_url,
      specifications: specifications || part.specifications,
      updated_at: new Date()
    });
    
    res.status(200).json(part);
  } catch (error) {
    console.error('Error updating spare part:', error);
    res.status(500).json({ message: 'Server error while updating spare part', error: error.message });
  }
};

// Delete spare part
export const deleteSparePart = async (req, res) => {
  try {
    const { partId } = req.params;
    
    const part = await SparePartsInventory.findByPk(partId);
    
    if (!part) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    
    await part.destroy();
    
    res.status(200).json({ message: 'Spare part deleted successfully' });
  } catch (error) {
    console.error('Error deleting spare part:', error);
    res.status(500).json({ message: 'Server error while deleting spare part', error: error.message });
  }
};

// Update stock quantity
export const updateStockQuantity = async (req, res) => {
  try {
    const { partId } = req.params;
    const { quantity, operation } = req.body;
    
    if (!quantity || !['add', 'subtract', 'set'].includes(operation)) {
      return res.status(400).json({ 
        message: 'Invalid request. Provide quantity and operation (add, subtract, or set)' 
      });
    }
    
    const part = await SparePartsInventory.findByPk(partId);
    
    if (!part) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    
    let newQuantity;
    switch(operation) {
      case 'add':
        newQuantity = part.stock_quantity + parseInt(quantity);
        break;
      case 'subtract':
        newQuantity = Math.max(0, part.stock_quantity - parseInt(quantity));
        break;
      case 'set':
        newQuantity = parseInt(quantity);
        break;
    }
    
    await part.update({
      stock_quantity: newQuantity,
      updated_at: new Date()
    });
    
    res.status(200).json({ 
      message: 'Stock quantity updated successfully',
      part_id: part.part_id,
      name: part.name,
      new_quantity: part.stock_quantity
    });
  } catch (error) {
    console.error('Error updating stock quantity:', error);
    res.status(500).json({ message: 'Server error while updating stock quantity', error: error.message });
  }
};

// Get compatible parts for a specific vehicle
export const getCompatibleParts = async (req, res) => {
  try {
    const { make, model, year, category } = req.query;
    
    if (!make || !model) {
      return res.status(400).json({ message: 'Vehicle make and model are required' });
    }
    
    const whereConditions = {
      compatible_makes: { [Op.contains]: [make] },
      compatible_models: { [Op.contains]: [model] }
    };
    
    if (year) {
      whereConditions.compatible_years = { [Op.contains]: [parseInt(year)] };
    }
    
    if (category) {
      whereConditions.category = category;
    }
    
    const parts = await SparePartsInventory.findAll({
      where: whereConditions,
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json(parts);
  } catch (error) {
    console.error('Error fetching compatible parts:', error);
    res.status(500).json({ message: 'Server error while fetching compatible parts', error: error.message });
  }
};

// Bulk import spare parts
export const bulkImportParts = async (req, res) => {
  try {
    const { parts } = req.body;
    
    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Please provide an array of parts' });
    }
    
    // Prepare parts data with timestamps
    const partsWithTimestamps = parts.map(part => ({
      ...part,
      created_at: new Date(),
      updated_at: new Date(),
      compatible_makes: part.compatible_makes || [],
      compatible_models: part.compatible_models || [],
      compatible_years: part.compatible_years || [],
      specifications: part.specifications || {}
    }));
    
    // Bulk create parts
    const createdParts = await SparePartsInventory.bulkCreate(partsWithTimestamps);
    
    res.status(201).json({
      message: `Successfully imported ${createdParts.length} parts`,
      parts: createdParts
    });
  } catch (error) {
    console.error('Error bulk importing parts:', error);
    res.status(500).json({ message: 'Server error while importing parts', error: error.message });
  }
};

// Get low stock parts (for inventory management)
export const getLowStockParts = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;
    
    const lowStockParts = await SparePartsInventory.findAll({
      where: {
        stock_quantity: { [Op.lt]: parseInt(threshold) }
      },
      order: [['stock_quantity', 'ASC']]
    });
    
    res.status(200).json({
      count: lowStockParts.length,
      threshold: parseInt(threshold),
      parts: lowStockParts
    });
  } catch (error) {
    console.error('Error fetching low stock parts:', error);
    res.status(500).json({ message: 'Server error while fetching low stock parts', error: error.message });
  }
};