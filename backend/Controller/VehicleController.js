import Vehicle from '../Models/Vehicle.js';
import User from '../Models/Users.js';
import VehicleMaintenanceRecord from '../Models/VehicleMaintenanceRecordModel.js';
import VehicleDiagnosticData from '../Models/VehicleDiagnosticDataModel.js';
import { Op, Sequelize } from 'sequelize';

// Get all vehicles for a specific user
export const getUserVehicles = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all vehicles for the user
    const vehicles = await Vehicle.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    res.status(500).json({ message: 'Server error while fetching vehicles', error: error.message });
  }
};

// Get a single vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    const vehicle = await Vehicle.findByPk(vehicleId, {
      include: [
        { model: VehicleMaintenanceRecord },
        { model: VehicleDiagnosticData, limit: 5, order: [['timestamp', 'DESC']] }
      ]
    });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    res.status(500).json({ message: 'Server error while fetching vehicle details', error: error.message });
  }
};

// Add a new vehicle
export const addVehicle = async (req, res) => {
  try {
    const { 
      user_id, 
      make, 
      model, 
      year, 
      license_plate, 
      color, 
      vin_number, 
      obd2_compatible, 
      fuel_type, 
      transmission_type 
    } = req.body;
    
    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if vehicle with same license plate already exists
    const existingVehicle = await Vehicle.findOne({ where: { license_plate } });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle with this license plate already exists' });
    }
    
    // Create new vehicle
    const newVehicle = await Vehicle.create({
      user_id,
      make,
      model,
      year,
      license_plate,
      color,
      vin_number,
      obd2_compatible: obd2_compatible || false,
      fuel_type,
      transmission_type,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ message: 'Server error while adding vehicle', error: error.message });
  }
};

// Update a vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const updateData = req.body;
    
    // Ensure updated_at is set
    updateData.updated_at = new Date();
    
    // Find vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user is authorized (vehicle belongs to requesting user)
    if (req.user !== vehicle.user_id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to update this vehicle' });
    }
    
    // Update vehicle
    await vehicle.update(updateData);
    
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Server error while updating vehicle', error: error.message });
  }
};

// Delete a vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Find vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user is authorized (vehicle belongs to requesting user)
    if (req.user !== vehicle.user_id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete this vehicle' });
    }
    
    // Delete vehicle
    await vehicle.destroy();
    
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Server error while deleting vehicle', error: error.message });
  }
};

// Get vehicle maintenance history
export const getVehicleMaintenanceHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Find vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Get maintenance records
    const maintenanceRecords = await VehicleMaintenanceRecord.findAll({
      where: { vehicle_id: vehicleId },
      order: [['date_performed', 'DESC']]
    });
    
    res.status(200).json(maintenanceRecords);
  } catch (error) {
    console.error('Error fetching maintenance history:', error);
    res.status(500).json({ message: 'Server error while fetching maintenance history', error: error.message });
  }
};

// Get vehicle diagnostic data
export const getVehicleDiagnosticData = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // Find vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Get diagnostic data
    const diagnosticData = await VehicleDiagnosticData.findAll({
      where: { vehicle_id: vehicleId },
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
    
    // Get count for pagination
    const totalCount = await VehicleDiagnosticData.count({
      where: { vehicle_id: vehicleId }
    });
    
    res.status(200).json({
      data: diagnosticData,
      pagination: {
        totalCount,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10)
      }
    });
  } catch (error) {
    console.error('Error fetching diagnostic data:', error);
    res.status(500).json({ message: 'Server error while fetching diagnostic data', error: error.message });
  }
};

// Add maintenance record to a vehicle
export const addMaintenanceRecord = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { 
      maintenance_type, 
      description, 
      date_performed, 
      mileage_at_service, 
      service_provider, 
      cost, 
      next_service_date, 
      next_service_mileage 
    } = req.body;
    
    // Verify vehicle exists
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user is authorized
    if (req.user.id !== vehicle.user_id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to add maintenance record for this vehicle' });
    }
    
    // Create maintenance record
    const maintenanceRecord = await VehicleMaintenanceRecord.create({
      vehicle_id: vehicleId,
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
    
    res.status(201).json(maintenanceRecord);
  } catch (error) {
    console.error('Error adding maintenance record:', error);
    res.status(500).json({ message: 'Server error while adding maintenance record', error: error.message });
  }
};

// Submit vehicle diagnostic data (typically from OBD2 device)
export const submitDiagnosticData = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { 
      obd2_data, 
      engine_status, 
      battery_level,
      oil_level,
      coolant_temperature,
      fuel_level,
      tire_pressure,
      error_codes,
      severity_level
    } = req.body;
    
    // Verify vehicle exists
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Verify vehicle supports OBD2 if submitting OBD2 data
    if (obd2_data && !vehicle.obd2_compatible) {
      return res.status(400).json({ message: 'Vehicle is not OBD2 compatible' });
    }
    
    // Create diagnostic data record
    const diagnosticData = await VehicleDiagnosticData.create({
      vehicle_id: vehicleId,
      timestamp: new Date(),
      obd2_data,
      engine_status,
      battery_level,
      oil_level,
      coolant_temperature,
      fuel_level,
      tire_pressure,
      error_codes,
      severity_level,
      created_at: new Date()
    });
    
    res.status(201).json(diagnosticData);
  } catch (error) {
    console.error('Error submitting diagnostic data:', error);
    res.status(500).json({ message: 'Server error while submitting diagnostic data', error: error.message });
  }
};

// Get vehicles with pending maintenance
export const getPendingMaintenanceVehicles = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentDate = new Date();
    
    // Find vehicles with maintenance records that are due
    const vehicles = await Vehicle.findAll({
      where: { user_id: userId },
      include: [{
        model: VehicleMaintenanceRecord,
        where: {
          next_service_date: {
            [Op.lte]: currentDate
          }
        },
        required: false
      }],
      having: Sequelize.literal('COUNT(VehicleMaintenanceRecord.record_id) > 0')
    });
    
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles with pending maintenance:', error);
    res.status(500).json({ 
      message: 'Server error while fetching vehicles with pending maintenance', 
      error: error.message 
    });
  }
};