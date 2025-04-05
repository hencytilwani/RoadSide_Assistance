import VehicleMaintenanceRecord from '../Models/VehicleMaintenanceRecordModel.js';
import Vehicle from '../Models/Vehicle.js';
import User from '../Models/Users.js';
import Notification from '../Models/NotificationsModel.js';

// Get all maintenance records for a specific vehicle
export const getVehicleMaintenanceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user owns this vehicle
    if (vehicle.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to access these records' });
    }
    
    const maintenanceRecords = await VehicleMaintenanceRecord.findAll({
      where: { vehicle_id: vehicleId },
      order: [['date_performed', 'DESC']]
    });
    
    res.status(200).json(maintenanceRecords);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ message: 'Server error while fetching maintenance records', error: error.message });
  }
};

// Get a specific maintenance record by ID
export const getMaintenanceRecordById = async (req, res) => {
  try {
    const { recordId } = req.params;
    
    const record = await VehicleMaintenanceRecord.findByPk(recordId, {
      include: [
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate']
        }
      ]
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    
    // Check if user owns the vehicle associated with this record
    const vehicle = await Vehicle.findByPk(record.vehicle_id);
    if (vehicle.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to access this record' });
    }
    
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching maintenance record:', error);
    res.status(500).json({ message: 'Server error while fetching maintenance record', error: error.message });
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
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user owns this vehicle
    if (vehicle.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to add records to this vehicle' });
    }
    
    // Create new maintenance record
    const newRecord = await VehicleMaintenanceRecord.create({
      vehicle_id,
      maintenance_type,
      description,
      date_performed,
      mileage_at_service,
      service_provider,
      cost,
      next_service_date,
      next_service_mileage,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create a maintenance reminder notification if next service date is specified
    if (next_service_date) {
      await Notification.create({
        user_id: vehicle.user_id,
        title: `Maintenance Reminder: ${vehicle.make} ${vehicle.model}`,
        message: `Your ${vehicle.make} ${vehicle.model} is due for ${maintenance_type} on ${next_service_date}`,
        type: 'maintenance reminder',
        related_entity_type: 'maintenance',
        related_entity_id: newRecord.record_id,
        is_read: false,
        timestamp: new Date(),
        created_at: new Date()
      });
    }
    
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    res.status(500).json({ message: 'Server error while creating maintenance record', error: error.message });
  }
};

// Update an existing maintenance record
export const updateMaintenanceRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updateData = req.body;
    
    // Check if record exists
    const record = await VehicleMaintenanceRecord.findByPk(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    
    // Check if user owns the vehicle associated with this record
    const vehicle = await Vehicle.findByPk(record.vehicle_id);
    if (vehicle.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to update this record' });
    }
    
    // Update fields
    updateData.updated_at = new Date();
    
    await record.update(updateData);
    
    // Update or create notification if next_service_date changed
    if (updateData.next_service_date) {
      const existingNotification = await Notification.findOne({
        where: {
          related_entity_type: 'maintenance',
          related_entity_id: recordId
        }
      });
      
      if (existingNotification) {
        await existingNotification.update({
          title: `Maintenance Reminder: ${vehicle.make} ${vehicle.model}`,
          message: `Your ${vehicle.make} ${vehicle.model} is due for ${updateData.maintenance_type || record.maintenance_type} on ${updateData.next_service_date}`,
          is_read: false,
          updated_at: new Date()
        });
      } else {
        await Notification.create({
          user_id: vehicle.user_id,
          title: `Maintenance Reminder: ${vehicle.make} ${vehicle.model}`,
          message: `Your ${vehicle.make} ${vehicle.model} is due for ${updateData.maintenance_type || record.maintenance_type} on ${updateData.next_service_date}`,
          type: 'maintenance reminder',
          related_entity_type: 'maintenance',
          related_entity_id: recordId,
          is_read: false,
          timestamp: new Date(),
          created_at: new Date()
        });
      }
    }
    
    const updatedRecord = await VehicleMaintenanceRecord.findByPk(recordId);
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    res.status(500).json({ message: 'Server error while updating maintenance record', error: error.message });
  }
};

// Delete a maintenance record
export const deleteMaintenanceRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    
    // Check if record exists
    const record = await VehicleMaintenanceRecord.findByPk(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    
    // Check if user owns the vehicle associated with this record
    const vehicle = await Vehicle.findByPk(record.vehicle_id);
    if (vehicle.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this record' });
    }
    
    // Delete related notifications
    await Notification.destroy({
      where: {
        related_entity_type: 'maintenance',
        related_entity_id: recordId
      }
    });
    
    // Delete the record
    await record.destroy();
    
    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(500).json({ message: 'Server error while deleting maintenance record', error: error.message });
  }
};

// Get upcoming maintenance for a user (across all their vehicles)
export const getUpcomingMaintenance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all user's vehicles
    const userVehicles = await Vehicle.findAll({
      where: { user_id: userId },
      attributes: ['vehicle_id', 'make', 'model', 'year', 'license_plate']
    });
    
    if (userVehicles.length === 0) {
      return res.status(200).json({ message: 'No vehicles found for this user', upcomingMaintenance: [] });
    }
    
    const vehicleIds = userVehicles.map(vehicle => vehicle.vehicle_id);
    
    // Get upcoming maintenance records (where next_service_date is in the future)
    const upcomingMaintenance = await VehicleMaintenanceRecord.findAll({
      where: {
        vehicle_id: vehicleIds,
        next_service_date: {
          [Op.gte]: new Date()
        }
      },
      order: [['next_service_date', 'ASC']],
      include: [
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate']
        }
      ]
    });
    
    res.status(200).json({
      count: upcomingMaintenance.length,
      upcomingMaintenance
    });
  } catch (error) {
    console.error('Error fetching upcoming maintenance:', error);
    res.status(500).json({ message: 'Server error while fetching upcoming maintenance', error: error.message });
  }
};

// Get maintenance history summary for a vehicle
export const getMaintenanceSummary = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user owns this vehicle
    if (vehicle.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to access these records' });
    }
    
    // Get maintenance records for this vehicle
    const maintenanceRecords = await VehicleMaintenanceRecord.findAll({
      where: { vehicle_id: vehicleId },
      attributes: [
        'maintenance_type',
        [sequelize.fn('COUNT', sequelize.col('record_id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('cost')), 'total_cost'],
        [sequelize.fn('MAX', sequelize.col('date_performed')), 'last_performed']
      ],
      group: ['maintenance_type']
    });
    
    // Calculate total maintenance cost
    const totalCost = await VehicleMaintenanceRecord.sum('cost', {
      where: { vehicle_id: vehicleId }
    });
    
    res.status(200).json({
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license_plate: vehicle.license_plate
      },
      maintenance_summary: maintenanceRecords,
      total_cost: totalCost,
      total_records: maintenanceRecords.reduce((sum, record) => sum + parseInt(record.dataValues.count), 0)
    });
  } catch (error) {
    console.error('Error generating maintenance summary:', error);
    res.status(500).json({ message: 'Server error while generating maintenance summary', error: error.message });
  }
};