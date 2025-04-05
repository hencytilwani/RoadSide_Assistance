import InsuranceClaim from '../Models/InsuranceClaim.js';
import User from '../Models/Users.js';
import Vehicle from '../Models/Vehicle.js';

// Create a new insurance claim
export const createInsuranceClaim = async (req, res) => {
  try {
    const {
      user_id,
      vehicle_id,
      insurance_company,
      policy_number,
      incident_date,
      description,
      damage_assessment,
      claim_amount,
      supporting_documents
    } = req.body;

    // Validate required fields
    if (!user_id || !vehicle_id || !insurance_company || !policy_number || !incident_date || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if vehicle exists and belongs to user
    const vehicle = await Vehicle.findOne({ where: { vehicle_id, user_id } });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or does not belong to this user' });
    }

    // Create new insurance claim
    const newClaim = await InsuranceClaim.create({
      user_id,
      vehicle_id,
      insurance_company,
      policy_number,
      incident_date,
      description,
      damage_assessment: damage_assessment || {},
      claim_amount,
      supporting_documents: supporting_documents || [],
      status: 'draft',
      ai_assessment_result: {},
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ 
      message: 'Insurance claim created successfully', 
      claim: newClaim 
    });
  } catch (error) {
    console.error('Error creating insurance claim:', error);
    res.status(500).json({ message: 'Server error during claim creation', error: error.message });
  }
};

// Get all claims for a specific user
export const getUserClaims = async (req, res) => {
  try {
    const { userId } = req.params;

    const claims = await InsuranceClaim.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ claims });
  } catch (error) {
    console.error('Error fetching user claims:', error);
    res.status(500).json({ message: 'Server error while fetching claims', error: error.message });
  }
};

// Get a specific claim by ID
export const getClaimById = async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await InsuranceClaim.findByPk(claimId, {
      include: [
        {
          model: Vehicle,
          attributes: ['make', 'model', 'year', 'license_plate', 'color', 'vin_number']
        },
        {
          model: User,
          attributes: ['name', 'email', 'phone_number']
        }
      ]
    });

    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }

    res.status(200).json({ claim });
  } catch (error) {
    console.error('Error fetching claim details:', error);
    res.status(500).json({ message: 'Server error while fetching claim details', error: error.message });
  }
};

// Update an insurance claim
export const updateClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const {
      insurance_company,
      policy_number,
      incident_date,
      description,
      damage_assessment,
      claim_amount,
      supporting_documents,
      status
    } = req.body;

    // Find the claim
    const claim = await InsuranceClaim.findByPk(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }

    // Validate status transition
    const validStatusTransitions = {
      'draft': ['submitted'],
      'submitted': ['processing', 'rejected'],
      'processing': ['approved', 'rejected'],
      'approved': [],
      'rejected': ['draft']
    };

    if (status && status !== claim.status) {
      if (!validStatusTransitions[claim.status].includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status transition from ${claim.status} to ${status}` 
        });
      }
    }

    // Update claim
    await claim.update({
      ...(insurance_company && { insurance_company }),
      ...(policy_number && { policy_number }),
      ...(incident_date && { incident_date }),
      ...(description && { description }),
      ...(damage_assessment && { damage_assessment }),
      ...(claim_amount && { claim_amount }),
      ...(supporting_documents && { supporting_documents }),
      ...(status && { status }),
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'Insurance claim updated successfully', 
      claim 
    });
  } catch (error) {
    console.error('Error updating insurance claim:', error);
    res.status(500).json({ message: 'Server error during claim update', error: error.message });
  }
};

// Submit an insurance claim (change status from draft to submitted)
export const submitClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await InsuranceClaim.findByPk(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }

    if (claim.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft claims can be submitted' });
    }

    // Basic validation before submission
    if (!claim.insurance_company || !claim.policy_number || !claim.description || !claim.incident_date) {
      return res.status(400).json({ message: 'Missing required information for claim submission' });
    }

    await claim.update({
      status: 'submitted',
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'Insurance claim submitted successfully', 
      claim 
    });
  } catch (error) {
    console.error('Error submitting insurance claim:', error);
    res.status(500).json({ message: 'Server error during claim submission', error: error.message });
  }
};

// Process AI assessment for a claim
export const processAIAssessment = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { ai_assessment_result } = req.body;

    if (!ai_assessment_result) {
      return res.status(400).json({ message: 'AI assessment result is required' });
    }

    const claim = await InsuranceClaim.findByPk(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }

    await claim.update({
      ai_assessment_result,
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'AI assessment processed successfully', 
      claim 
    });
  } catch (error) {
    console.error('Error processing AI assessment:', error);
    res.status(500).json({ message: 'Server error during AI assessment processing', error: error.message });
  }
};

// Approve or reject a claim
export const updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status, approved_amount, rejection_reason } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (approved/rejected) is required' });
    }

    const claim = await InsuranceClaim.findByPk(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }

    if (claim.status !== 'processing') {
      return res.status(400).json({ message: 'Only claims in processing status can be approved or rejected' });
    }

    const updateData = {
      status,
      updated_at: new Date()
    };

    if (status === 'approved' && approved_amount) {
      updateData.approved_amount = approved_amount;
    }

    await claim.update(updateData);

    res.status(200).json({ 
      message: `Insurance claim ${status} successfully`, 
      claim 
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    res.status(500).json({ message: 'Server error during status update', error: error.message });
  }
};

// Delete a claim (only draft claims can be deleted)
export const deleteClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await InsuranceClaim.findByPk(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }

    if (claim.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft claims can be deleted' });
    }

    await claim.destroy();

    res.status(200).json({ message: 'Insurance claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting insurance claim:', error);
    res.status(500).json({ message: 'Server error during claim deletion', error: error.message });
  }
};

// Get claims statistics
export const getClaimsStatistics = async (req, res) => {
  try {
    const totalClaims = await InsuranceClaim.count();
    const draftClaims = await InsuranceClaim.count({ where: { status: 'draft' } });
    const submittedClaims = await InsuranceClaim.count({ where: { status: 'submitted' } });
    const processingClaims = await InsuranceClaim.count({ where: { status: 'processing' } });
    const approvedClaims = await InsuranceClaim.count({ where: { status: 'approved' } });
    const rejectedClaims = await InsuranceClaim.count({ where: { status: 'rejected' } });
    
    // Get sum of approved amounts
    const approvedAmounts = await InsuranceClaim.sum('approved_amount', { where: { status: 'approved' } });

    res.status(200).json({
      totalClaims,
      draftClaims,
      submittedClaims,
      processingClaims,
      approvedClaims,
      rejectedClaims,
      approvedAmounts: approvedAmounts || 0
    });
  } catch (error) {
    console.error('Error fetching claims statistics:', error);
    res.status(500).json({ message: 'Server error while fetching statistics', error: error.message });
  }
};