// Simple storage for approved review IDs that works with serverless
// In production, you'd use a real database like PostgreSQL, MongoDB, etc.

let approvedReviewIds = new Set();

// Initialize with no approved reviews - start empty
// Reviews will only be approved through the admin dashboard

export const approvedReviewsStorage = {
  // Get all approved review IDs
  getApprovedIds() {
    return Array.from(approvedReviewIds);
  },

  // Check if a review is approved
  isApproved(reviewId) {
    return approvedReviewIds.has(reviewId);
  },

  // Approve a review
  approveReview(reviewId) {
    approvedReviewIds.add(reviewId);
    console.log(`Approved review ${reviewId}. Total approved: ${approvedReviewIds.size}`);
  },

  // Reject a review
  rejectReview(reviewId) {
    approvedReviewIds.delete(reviewId);
    console.log(`Rejected review ${reviewId}. Total approved: ${approvedReviewIds.size}`);
  },

  // Approve multiple reviews
  approveReviews(reviewIds) {
    reviewIds.forEach(id => approvedReviewIds.add(id));
    console.log(`Approved ${reviewIds.length} reviews. Total approved: ${approvedReviewIds.size}`);
  },

  // Reject all reviews
  rejectAllReviews() {
    approvedReviewIds.clear();
    console.log('Rejected all reviews. Total approved: 0');
  },

  // Get approved reviews from a list of all reviews
  getApprovedReviews(allReviews) {
    return allReviews.filter(review => approvedReviewIds.has(review.id));
  }
};
