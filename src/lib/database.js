// Simple in-memory database for development
// In production, you would use a real database like PostgreSQL, MongoDB, etc.

// Use globalThis to ensure singleton behavior across all modules
if (!globalThis.databaseInstance) {
  globalThis.databaseInstance = {
    approvedReviews: new Set(),
    reviews: [],
    instanceId: Math.random().toString(36).substr(2, 9),
    
    // Initialize logging
    init() {
      console.log('Database instance created with ID:', this.instanceId);
    },

    // Store reviews from API
    setReviews(reviews) {
      // Preserve approved reviews when setting new reviews
      const currentApprovedIds = Array.from(this.approvedReviews);
      
      this.reviews = reviews;
      
      // Re-apply approved status to matching reviews
      this.approvedReviews.clear();
      reviews.forEach(review => {
        if (currentApprovedIds.includes(review.id)) {
          this.approvedReviews.add(review.id);
        }
      });
    },

    // Get all reviews
    getReviews() {
      return this.reviews;
    },

    // Get approved review IDs
    getApprovedReviews() {
      return Array.from(this.approvedReviews);
    },

    // Check if a review is approved
    isApproved(reviewId) {
      return this.approvedReviews.has(reviewId);
    },

    // Approve a review
    approveReview(reviewId) {
      this.approvedReviews.add(reviewId);
    },

    // Reject a review
    rejectReview(reviewId) {
      this.approvedReviews.delete(reviewId);
    },

    // Approve multiple reviews
    approveReviews(reviewIds) {
      reviewIds.forEach(id => this.approvedReviews.add(id));
    },

    // Reject all reviews
    rejectAllReviews() {
      this.approvedReviews.clear();
    },

    // Get approved reviews with full data
    getApprovedReviewsData() {
      return this.reviews.filter(review => this.approvedReviews.has(review.id));
    },

    // Get reviews for a specific property
    getReviewsForProperty(propertyName) {
      return this.reviews.filter(review => 
        review.listing.toLowerCase().includes(propertyName.toLowerCase())
      );
    },

    // Get approved reviews for a specific property
    getApprovedReviewsForProperty(propertyName) {
      return this.getReviewsForProperty(propertyName)
        .filter(review => this.approvedReviews.has(review.id));
    }
  };
}

// Initialize the global database instance
globalThis.databaseInstance.init();

// Export the global instance
export default globalThis.databaseInstance;