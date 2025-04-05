import ReviewsRating from '../Models/Review.js';
import User from '../Models/Users.js';
import ServiceProvider from '../Models/ServiceProviderModel.js';
import ServicesProvided from '../Models/ServiceProvidedModel.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const {
      user_id,
      provider_id,
      service_id,
      rating,
      review_text
    } = req.body;

    // Validate required fields
    if (!user_id || !provider_id || !service_id || !rating) {
      return res.status(400).json({ 
        message: 'Missing required fields. User ID, Provider ID, Service ID, and Rating are required' 
      });
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user exists
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if service provider exists
    const providerExists = await ServiceProvider.findByPk(provider_id);
    if (!providerExists) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    // Check if service exists
    const serviceExists = await ServicesProvided.findByPk(service_id);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create the review
    const newReview = await ReviewsRating.create({
      user_id,
      provider_id,
      service_id,
      rating,
      review_text,
      review_date: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });

    // Return the created review
    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      message: 'Server error while creating review', 
      error: error.message 
    });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewsRating.findAll({
      include: [
        { model: User, attributes: ['user_id', 'name', 'profile_image_url'] },
        { model: ServiceProvider, attributes: ['provider_id', 'business_name'] },
        { model: ServicesProvided, attributes: ['service_id', 'service_type'] }
      ]
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      message: 'Server error while fetching reviews', 
      error: error.message 
    });
  }
};

// Get reviews by provider ID
export const getReviewsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const reviews = await ReviewsRating.findAll({
      where: { provider_id: providerId },
      include: [
        { model: User, attributes: ['user_id', 'name', 'profile_image_url'] },
        { model: ServicesProvided, attributes: ['service_id', 'service_type'] }
      ]
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({ 
      provider_id: providerId,
      total_reviews: reviews.length,
      average_rating: parseFloat(averageRating),
      reviews 
    });
  } catch (error) {
    console.error('Error fetching provider reviews:', error);
    res.status(500).json({ 
      message: 'Server error while fetching provider reviews', 
      error: error.message 
    });
  }
};

// Get reviews by user ID
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await ReviewsRating.findAll({
      where: { user_id: userId },
      include: [
        { model: ServiceProvider, attributes: ['provider_id', 'business_name'] },
        { model: ServicesProvided, attributes: ['service_id', 'service_type'] }
      ]
    });

    res.status(200).json({ 
      user_id: userId,
      total_reviews: reviews.length,
      reviews 
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ 
      message: 'Server error while fetching user reviews', 
      error: error.message 
    });
  }
};

// Get reviews by service ID
export const getReviewsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await ReviewsRating.findAll({
      where: { service_id: serviceId },
      include: [
        { model: User, attributes: ['user_id', 'name', 'profile_image_url'] },
        { model: ServiceProvider, attributes: ['provider_id', 'business_name'] }
      ]
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({ 
      service_id: serviceId,
      total_reviews: reviews.length,
      average_rating: parseFloat(averageRating),
      reviews 
    });
  } catch (error) {
    console.error('Error fetching service reviews:', error);
    res.status(500).json({ 
      message: 'Server error while fetching service reviews', 
      error: error.message 
    });
  }
};

// Get a specific review by ID
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewsRating.findByPk(reviewId, {
      include: [
        { model: User, attributes: ['user_id', 'name', 'profile_image_url'] },
        { model: ServiceProvider, attributes: ['provider_id', 'business_name'] },
        { model: ServicesProvided, attributes: ['service_id', 'service_type'] }
      ]
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ 
      message: 'Server error while fetching review', 
      error: error.message 
    });
  }
};

// Update a review (only the review text and rating)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review_text } = req.body;

    // Find the review
    const review = await ReviewsRating.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Validate rating if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
    }

    // Update the review
    await review.update({
      rating: rating !== undefined ? rating : review.rating,
      review_text: review_text !== undefined ? review_text : review.review_text,
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'Review updated successfully',
      review 
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Server error while updating review', 
      error: error.message 
    });
  }
};

// Add response to a review (by service provider)
export const addReviewResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response_text } = req.body;

    // Validate response text
    if (!response_text) {
      return res.status(400).json({ message: 'Response text is required' });
    }

    // Find the review
    const review = await ReviewsRating.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update with response
    await review.update({
      response_text,
      response_date: new Date(),
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: 'Response added successfully',
      review
    });
  } catch (error) {
    console.error('Error adding review response:', error);
    res.status(500).json({ 
      message: 'Server error while adding review response', 
      error: error.message 
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review
    const review = await ReviewsRating.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Delete the review
    await review.destroy();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Server error while deleting review', 
      error: error.message 
    });
  }
};

// Get aggregated review stats for a provider
export const getProviderReviewStats = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Check if provider exists
    const providerExists = await ServiceProvider.findByPk(providerId);
    if (!providerExists) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    // Get all reviews for the provider
    const reviews = await ReviewsRating.findAll({
      where: { provider_id: providerId }
    });

    // Calculate stats
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
    
    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(review => review.rating === 5).length,
      4: reviews.filter(review => review.rating === 4).length,
      3: reviews.filter(review => review.rating === 3).length,
      2: reviews.filter(review => review.rating === 2).length,
      1: reviews.filter(review => review.rating === 1).length
    };

    // Calculate percentage for each rating
    const ratingPercentage = {};
    for (let i = 1; i <= 5; i++) {
      ratingPercentage[i] = totalReviews > 0 
        ? ((ratingDistribution[i] / totalReviews) * 100).toFixed(1) 
        : 0;
    }

    res.status(200).json({
      provider_id: providerId,
      provider_name: providerExists.business_name,
      total_reviews: totalReviews,
      average_rating: parseFloat(averageRating),
      rating_distribution: ratingDistribution,
      rating_percentage: ratingPercentage
    });
  } catch (error) {
    console.error('Error fetching provider review stats:', error);
    res.status(500).json({ 
      message: 'Server error while fetching provider review stats', 
      error: error.message 
    });
  }
};