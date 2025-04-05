import UserEmergencyContact from '../Models/UserEmergencyContactModel.js';
import User from '../Models/Users.js';

// Get all emergency contacts for a user
export const getAllUserEmergencyContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all emergency contacts for the user
    const emergencyContacts = await UserEmergencyContact.findAll({
      where: { user_id: userId },
      order: [['is_primary', 'DESC']]
    });

    res.status(200).json({ emergencyContacts });
  } catch (error) {
    console.error('Error getting emergency contacts:', error);
    res.status(500).json({ message: 'Server error while fetching emergency contacts', error: error.message });
  }
};

// Get a specific emergency contact
export const getEmergencyContactById = async (req, res) => {
  try {
    const { contactId } = req.params;

    const emergencyContact = await UserEmergencyContact.findByPk(contactId);
    if (!emergencyContact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    res.status(200).json({ emergencyContact });
  } catch (error) {
    console.error('Error getting emergency contact:', error);
    res.status(500).json({ message: 'Server error while fetching emergency contact', error: error.message });
  }
};

// Add a new emergency contact for a user
export const addEmergencyContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone_number, relationship, is_primary } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate required fields
    if (!name || !phone_number) {
      return res.status(400).json({ message: 'Name and phone number are required' });
    }

    // If this contact is set as primary, update other contacts to non-primary
    if (is_primary) {
      await UserEmergencyContact.update(
        { is_primary: false },
        { where: { user_id: userId, is_primary: true } }
      );
    }

    // Create new emergency contact
    const newEmergencyContact = await UserEmergencyContact.create({
      user_id: userId,
      name,
      phone_number,
      relationship: relationship || null,
      is_primary: is_primary || false,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ 
      message: 'Emergency contact added successfully', 
      emergencyContact: newEmergencyContact 
    });
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    res.status(500).json({ message: 'Server error while adding emergency contact', error: error.message });
  }
};

// Update an emergency contact
export const updateEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { name, phone_number, relationship, is_primary } = req.body;

    // Check if emergency contact exists
    const emergencyContact = await UserEmergencyContact.findByPk(contactId);
    if (!emergencyContact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    // If setting this contact as primary, update other contacts to non-primary
    if (is_primary && !emergencyContact.is_primary) {
      await UserEmergencyContact.update(
        { is_primary: false },
        { where: { user_id: emergencyContact.user_id, is_primary: true } }
      );
    }

    // Update emergency contact
    await emergencyContact.update({
      name: name || emergencyContact.name,
      phone_number: phone_number || emergencyContact.phone_number,
      relationship: relationship !== undefined ? relationship : emergencyContact.relationship,
      is_primary: is_primary !== undefined ? is_primary : emergencyContact.is_primary,
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'Emergency contact updated successfully', 
      emergencyContact 
    });
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    res.status(500).json({ message: 'Server error while updating emergency contact', error: error.message });
  }
};

// Delete an emergency contact
export const deleteEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    // Check if emergency contact exists
    const emergencyContact = await UserEmergencyContact.findByPk(contactId);
    if (!emergencyContact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    // Delete the emergency contact
    await emergencyContact.destroy();

    res.status(200).json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    res.status(500).json({ message: 'Server error while deleting emergency contact', error: error.message });
  }
};

// Set a contact as primary emergency contact
export const setPrimaryContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    // Check if emergency contact exists
    const emergencyContact = await UserEmergencyContact.findByPk(contactId);
    if (!emergencyContact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    // Get user ID from the emergency contact
    const userId = emergencyContact.user_id;

    // Update all other contacts to non-primary
    await UserEmergencyContact.update(
      { is_primary: false },
      { where: { user_id: userId, is_primary: true } }
    );

    // Set this contact as primary
    await emergencyContact.update({
      is_primary: true,
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'Contact set as primary successfully', 
      emergencyContact 
    });
  } catch (error) {
    console.error('Error setting primary contact:', error);
    res.status(500).json({ message: 'Server error while setting primary contact', error: error.message });
  }
};

// Get only the primary emergency contact for a user
export const getPrimaryContact = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get primary emergency contact
    const primaryContact = await UserEmergencyContact.findOne({
      where: { user_id: userId, is_primary: true }
    });

    if (!primaryContact) {
      return res.status(404).json({ message: 'No primary emergency contact found for this user' });
    }

    res.status(200).json({ primaryContact });
  } catch (error) {
    console.error('Error getting primary contact:', error);
    res.status(500).json({ message: 'Server error while fetching primary contact', error: error.message });
  }
};

// Bulk add multiple emergency contacts
export const bulkAddEmergencyContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { contacts } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate contacts array
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: 'Valid contacts array is required' });
    }

    // Check for primary contacts in the new batch
    const hasPrimary = contacts.some(contact => contact.is_primary);
    
    // If any new contact is marked as primary, update existing primary contacts
    if (hasPrimary) {
      await UserEmergencyContact.update(
        { is_primary: false },
        { where: { user_id: userId, is_primary: true } }
      );
    }

    // Create all emergency contacts
    const contactPromises = contacts.map(contact => {
      return UserEmergencyContact.create({
        user_id: userId,
        name: contact.name,
        phone_number: contact.phone_number,
        relationship: contact.relationship || null,
        is_primary: contact.is_primary || false,
        created_at: new Date(),
        updated_at: new Date()
      });
    });

    const createdContacts = await Promise.all(contactPromises);

    res.status(201).json({ 
      message: 'Emergency contacts added successfully', 
      contacts: createdContacts 
    });
  } catch (error) {
    console.error('Error adding emergency contacts:', error);
    res.status(500).json({ message: 'Server error while adding emergency contacts', error: error.message });
  }
};