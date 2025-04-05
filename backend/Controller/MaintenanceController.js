import db from '../Models/index.js';
import { Op } from 'sequelize';

const VehicleMaintenanceRecord = db.Vehicle_Maintenance_Record;
const Vehicle = db.Vehicle;
const User = db.User;
const PredictiveMaintenanceAlert = db.Predictive_Maintenance_Alert;

// Get all maintenance records for a specific vehicle
export const getVehicleMaintenanceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Verify the vehicle exists and belongs to the authenticated user
    const vehicle = await Vehicle.findOne({
      where: { 
        vehicle_id: vehicleId,
        user_id: req.user // Assuming req.user is set by auth middleware
      }
    });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or access denied' });
    }
    
    const maintenanceRecords = await VehicleMaintenanceRecord.findAll({
      where: { vehicle_id: vehicleId },
      order: [['date_performed', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: maintenanceRecords
    });
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching maintenance records', 
      error: error.message 
    });
  }
};

// Get a specific maintenance record
export const getMaintenanceRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    
    const maintenanceRecord = await VehicleMaintenanceRecord.findOne({
      where: { record_id: recordId },
      include: [
        {
          model: Vehicle,
          where: { user_id: req.user }, // Ensure the vehicle belongs to authenticated user
          attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate']
        }
      ]
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({ 
        success: false,
        message: 'Maintenance record not found or access denied' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: maintenanceRecord
    });
  } catch (error) {
    console.error('Error fetching maintenance record:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching maintenance record', 
      error: error.message 
    });
  }
};

// Create a new maintenance record
export const createMaintenanceRecord = async (req, res) => {
  try {
    const { 
      vehicle_id, 
      maintenance_type, 
      description, 
      date_performed, 
      mileage_at_service, 
      service_provider, 
      cost, 
      next_service_date, 
      next_service_mileage 
    } = req.body;
    
    // Verify the vehicle exists and belongs to the authenticated user
    const vehicle = await Vehicle.findOne({
      where: { 
        vehicle_id,
        user_id: req.user
      }
    });
    
    // if (!vehicle) {
    //   return res.status(404).json({ 
    //     success: false,
    //     message: 'Vehicle not found or access denied' 
    //   });
    // }
    
    const newRecord = await VehicleMaintenanceRecord.create({
      vehicle_id,
      maintenance_type,
      description,
      date_performed: new Date(date_performed),
      mileage_at_service,
      service_provider,
      cost,
      next_service_date: next_service_date ? new Date(next_service_date) : null,
      next_service_mileage,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Check if there are any predictive maintenance alerts for this type of maintenance
    // and mark them as addressed if applicable
    if (maintenance_type) {
      await PredictiveMaintenanceAlert.update(
        { 
          is_dismissed: true,
          updated_at: new Date()
        },
        { 
          where: {
            vehicle_id,
            predicted_failure_component: {
              [Op.like]: `%${maintenance_type}%`
            },
            is_dismissed: false
          }
        }
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: newRecord
    });
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating maintenance record', 
      error: error.message 
    });
  }
};

// Update a maintenance record
export const updateMaintenanceRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updateData = req.body;
    
    // Ensure dates are properly formatted
    if (updateData.date_performed) {
      updateData.date_performed = new Date(updateData.date_performed);
    }
    if (updateData.next_service_date) {
      updateData.next_service_date = new Date(updateData.next_service_date);
    }
    
    // Add updated_at timestamp
    updateData.updated_at = new Date();
    
    // First get the record to verify ownership
    const record = await VehicleMaintenanceRecord.findOne({
      include: [
        {
          model: Vehicle,
          where: { user_id: req.user.id },
          attributes: ['vehicle_id', 'user_id']
        }
      ],
      where: { record_id: recordId }
    });
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'Maintenance record not found or access denied' 
      });
    }
    
    // Update the record
    await VehicleMaintenanceRecord.update(updateData, {
      where: { record_id: recordId }
    });
    
    // Fetch the updated record
    const updatedRecord = await VehicleMaintenanceRecord.findByPk(recordId);
    
    res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating maintenance record', 
      error: error.message 
    });
  }
};

// Delete a maintenance record
export const deleteMaintenanceRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    
    // First get the record to verify ownership
    const record = await VehicleMaintenanceRecord.findOne({
      include: [
        {
          model: Vehicle,
          where: { user_id: req.user.id },
          attributes: ['vehicle_id', 'user_id']
        }
      ],
      where: { record_id: recordId }
    });
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'Maintenance record not found or access denied' 
      });
    }
    
    // Delete the record
    await VehicleMaintenanceRecord.destroy({
      where: { record_id: recordId }
    });
    
    res.status(200).json({
      success: true,
      message: 'Maintenance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting maintenance record', 
      error: error.message 
    });
  }
};

// Get upcoming maintenance based on date and mileage
export const getUpcomingMaintenance = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure the requested userId matches the authenticated user
    if (userId != req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to user data'
      });
    }
    
    // Get all vehicles belonging to the user
    const userVehicles = await Vehicle.findAll({
      where: { user_id: userId },
      attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate']
    });
    
    if (!userVehicles.length) {
      return res.status(404).json({
        success: false,
        message: 'No vehicles found for this user'
      });
    }
    
    const vehicleIds = userVehicles.map(vehicle => vehicle.vehicle_id);
    
    // Get current date and add threshold (e.g., 30 days in the future)
    const currentDate = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(currentDate.getDate() + 30); // 30 days in the future
    
    // Find maintenance records with upcoming service dates
    const upcomingMaintenance = await VehicleMaintenanceRecord.findAll({
      where: {
        vehicle_id: { [Op.in]: vehicleIds },
        next_service_date: {
          [Op.not]: null,
          [Op.lte]: thresholdDate,
          [Op.gte]: currentDate
        }
      },
      include: [
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate']
        }
      ],
      order: [['next_service_date', 'ASC']]
    });
    
    // Also get predictive maintenance alerts
    const maintenanceAlerts = await PredictiveMaintenanceAlert.findAll({
      where: {
        vehicle_id: { [Op.in]: vehicleIds },
        is_dismissed: false
      },
      include: [
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate']
        }
      ],
      order: [['severity', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: {
        upcomingScheduledMaintenance: upcomingMaintenance,
        predictiveMaintenance: maintenanceAlerts
      }
    });
  } catch (error) {
    console.error('Error fetching upcoming maintenance:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching upcoming maintenance', 
      error: error.message 
    });
  }
};

// Get maintenance history with filtering options
export const getMaintenanceHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { startDate, endDate, maintenanceType } = req.query;
    
    // Verify the vehicle exists and belongs to the authenticated user
    const vehicle = await Vehicle.findOne({
      where: { 
        vehicle_id: vehicleId,
        user_id: req.user.id
      }
    });
    
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        message: 'Vehicle not found or access denied' 
      });
    }
    
    // Build query filters
    const filters = { vehicle_id: vehicleId };
    
    if (startDate && endDate) {
      filters.date_performed = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      filters.date_performed = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      filters.date_performed = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    if (maintenanceType) {
      filters.maintenance_type = maintenanceType;
    }
    
    const maintenanceHistory = await VehicleMaintenanceRecord.findAll({
      where: filters,
      order: [['date_performed', 'DESC']]
    });
    
    // Calculate statistics
    const totalRecords = maintenanceHistory.length;
    const totalCost = maintenanceHistory.reduce((sum, record) => sum + (parseFloat(record.cost) || 0), 0);
    
    // Group by maintenance type
    const maintenanceByType = {};
    maintenanceHistory.forEach(record => {
      const type = record.maintenance_type || 'Other';
      if (!maintenanceByType[type]) {
        maintenanceByType[type] = {
          count: 0,
          totalCost: 0
        };
      }
      maintenanceByType[type].count += 1;
      maintenanceByType[type].totalCost += parseFloat(record.cost) || 0;
    });
    
    res.status(200).json({
      success: true,
      data: {
        records: maintenanceHistory,
        stats: {
          totalRecords,
          totalCost,
          maintenanceByType
        }
      }
    });
  } catch (error) {
    console.error('Error fetching maintenance history:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching maintenance history', 
      error: error.message 
    });
  }
};