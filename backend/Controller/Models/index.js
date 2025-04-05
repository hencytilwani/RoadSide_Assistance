// Import the Sequelize instance from your connection file
import { sequelize } from "../Config/dbConnection.js";
import { Sequelize } from "sequelize";

const db = {};

// Import models individually
import User from './Users.js';
import UserEmergencyContact from './UserEmergencyContactModel.js';
import Vehicle from './Vehicle.js';
import VehicleMaintenanceRecord from './VehicleMaintenanceRecordModel.js';
import VehicleDiagnosticData from './VehicleDiagnosticDataModel.js';
import ServiceProvider from './ServiceProviderModel.js';
import ServiceProviderMechanic from './ServiceProviderMechanicModel.js';
import SubscriptionPlan from './SubscriptionPlanModel.js';
import BreakdownRequest from './BreakdownRequestModel.js';
import ServiceAssignment from './ServiceAssignmentModel.js';
import VideoConsultation from './VideoConsultationModel.js';
import ServicesProvided from './ServiceProvidedModel.js';
import Payment from './Payment.js';
import Subscription from './SubscriptionModel.js';
import ReviewsRating from './Review.js';
import Notification from './NotificationsModel.js';
import PredictiveMaintenanceAlert from './MaintenanceAlert.js';
import SOSAlert from './SOSAlertsModel.js';
import InsuranceClaim from './InsuranceClaim.js';
import SparePartsInventory from './SparePartModel.js';
import AdminUsers from './AdminUsersModel.js';
import SystemLogs from './SystemLogsModel.js';
import ARRepairGuides from './ARRepairGuidesModel.js';

// Assign the imported models directly (no initialization needed)
db.User = User;
db.User_Emergency_Contact = UserEmergencyContact;
db.Vehicle = Vehicle;
db.Vehicle_Maintenance_Record = VehicleMaintenanceRecord;
db.Vehicle_Diagnostic_Data = VehicleDiagnosticData;
db.Service_Provider = ServiceProvider;
db.Service_Provider_Mechanic = ServiceProviderMechanic;
db.Subscription_Plan = SubscriptionPlan;
db.Breakdown_Request = BreakdownRequest;
db.Service_Assignment = ServiceAssignment;
db.Video_Consultation = VideoConsultation;
db.Services_Provided = ServicesProvided;
db.Payment = Payment;
db.Subscription = Subscription;
db.Reviews_Rating = ReviewsRating;
db.Notification = Notification;
db.Predictive_Maintenance_Alert = PredictiveMaintenanceAlert;
db.SOS_Alert = SOSAlert;
db.Insurance_Claim = InsuranceClaim;
db.Spare_Parts_Inventory = SparePartsInventory;
db.Admin_Users = AdminUsers;
db.System_Logs = SystemLogs;
db.AR_Repair_Guides = ARRepairGuides;

// User associations
db.User.hasMany(db.User_Emergency_Contact, { foreignKey: 'user_id' });
db.User.hasMany(db.Vehicle, { foreignKey: 'user_id' });
db.User.hasMany(db.Breakdown_Request, { foreignKey: 'user_id' });
db.User.hasMany(db.Payment, { foreignKey: 'user_id' });
db.User.hasMany(db.Subscription, { foreignKey: 'user_id' });
db.User.hasMany(db.Reviews_Rating, { foreignKey: 'user_id' });
db.User.hasMany(db.Notification, { foreignKey: 'user_id' });
db.User.hasMany(db.SOS_Alert, { foreignKey: 'user_id' });
db.User.hasMany(db.Insurance_Claim, { foreignKey: 'user_id' });
db.User.belongsTo(db.Subscription_Plan, { foreignKey: 'subscription_plan_id' });

// User_Emergency_Contact associations
db.User_Emergency_Contact.belongsTo(db.User, { foreignKey: 'user_id' });

// Vehicle associations
db.Vehicle.belongsTo(db.User, { foreignKey: 'user_id' });
db.Vehicle.hasMany(db.Vehicle_Maintenance_Record, { foreignKey: 'vehicle_id' });
db.Vehicle.hasMany(db.Vehicle_Diagnostic_Data, { foreignKey: 'vehicle_id' });
db.Vehicle.hasMany(db.Breakdown_Request, { foreignKey: 'vehicle_id' });
db.Vehicle.hasMany(db.Predictive_Maintenance_Alert, { foreignKey: 'vehicle_id' });
db.Vehicle.hasMany(db.SOS_Alert, { foreignKey: 'vehicle_id' });
db.Vehicle.hasMany(db.Insurance_Claim, { foreignKey: 'vehicle_id' });

// Vehicle_Maintenance_Record associations
db.Vehicle_Maintenance_Record.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });

// Vehicle_Diagnostic_Data associations
db.Vehicle_Diagnostic_Data.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });

// Service_Provider associations
db.Service_Provider.hasMany(db.Service_Provider_Mechanic, { foreignKey: 'provider_id' });
db.Service_Provider.hasMany(db.Service_Assignment, { foreignKey: 'provider_id' });
db.Service_Provider.hasMany(db.Reviews_Rating, { foreignKey: 'provider_id' });

// Service_Provider_Mechanic associations
db.Service_Provider_Mechanic.belongsTo(db.Service_Provider, { foreignKey: 'provider_id' });
db.Service_Provider_Mechanic.hasMany(db.Service_Assignment, { foreignKey: 'mechanic_id' });
db.Service_Provider_Mechanic.hasMany(db.Video_Consultation, { foreignKey: 'mechanic_id' });

// Subscription_Plan associations
db.Subscription_Plan.hasMany(db.User, { foreignKey: 'subscription_plan_id' });
db.Subscription_Plan.hasMany(db.Subscription, { foreignKey: 'plan_id' });

// Breakdown_Request associations
db.Breakdown_Request.belongsTo(db.User, { foreignKey: 'user_id' });
db.Breakdown_Request.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });
db.Breakdown_Request.hasOne(db.Service_Assignment, { foreignKey: 'request_id' });
db.Breakdown_Request.hasOne(db.Video_Consultation, { foreignKey: 'request_id' });

// Service_Assignment associations
db.Service_Assignment.belongsTo(db.Breakdown_Request, { foreignKey: 'request_id' });
db.Service_Assignment.belongsTo(db.Service_Provider, { foreignKey: 'provider_id' });
db.Service_Assignment.belongsTo(db.Service_Provider_Mechanic, { foreignKey: 'mechanic_id' });
db.Service_Assignment.hasMany(db.Services_Provided, { foreignKey: 'assignment_id' });

// Video_Consultation associations
db.Video_Consultation.belongsTo(db.Breakdown_Request, { foreignKey: 'request_id' });
db.Video_Consultation.belongsTo(db.Service_Provider_Mechanic, { foreignKey: 'mechanic_id' });

// Services_Provided associations
db.Services_Provided.belongsTo(db.Service_Assignment, { foreignKey: 'assignment_id' });
db.Services_Provided.hasMany(db.Payment, { foreignKey: 'service_id' });
db.Services_Provided.hasMany(db.Reviews_Rating, { foreignKey: 'service_id' });

// Payment associations
db.Payment.belongsTo(db.User, { foreignKey: 'user_id' });
db.Payment.belongsTo(db.Services_Provided, { foreignKey: 'service_id' });
db.Payment.belongsTo(db.Subscription, { foreignKey: 'subscription_id' });
db.Payment.hasOne(db.Subscription, { foreignKey: 'payment_id' });

// Subscription associations
db.Subscription.belongsTo(db.User, { foreignKey: 'user_id' });
db.Subscription.belongsTo(db.Subscription_Plan, { foreignKey: 'plan_id' });
db.Subscription.belongsTo(db.Payment, { foreignKey: 'payment_id' });

// Reviews_Rating associations
db.Reviews_Rating.belongsTo(db.User, { foreignKey: 'user_id' });
db.Reviews_Rating.belongsTo(db.Service_Provider, { foreignKey: 'provider_id' });
db.Reviews_Rating.belongsTo(db.Services_Provided, { foreignKey: 'service_id' });

// Notification associations
db.Notification.belongsTo(db.User, { foreignKey: 'user_id' });

// Predictive_Maintenance_Alert associations
db.Predictive_Maintenance_Alert.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });

// SOS_Alert associations
db.SOS_Alert.belongsTo(db.User, { foreignKey: 'user_id' });
db.SOS_Alert.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });

// Insurance_Claim associations
db.Insurance_Claim.belongsTo(db.User, { foreignKey: 'user_id' });
db.Insurance_Claim.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });

// Add sequelize instance to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;