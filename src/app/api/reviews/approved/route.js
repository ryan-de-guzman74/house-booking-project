import { getMockReviews } from '@/lib/mockData.js';
import { approvedReviewsStorage } from '@/lib/approvedReviewsStorage.js';

// GET - Get approved reviews (public API for property pages)
export async function GET() {
  try {
    // Initialize with mock data to ensure consistency across serverless instances
    const mockReviews = getMockReviews();
    
    // Get approved reviews using the shared storage
    const approvedReviews = approvedReviewsStorage.getApprovedReviews(mockReviews.reviews);
    
    console.log(`Found ${approvedReviews.length} approved reviews out of ${mockReviews.reviews.length} total reviews`);
    console.log('Approved review IDs:', approvedReviewsStorage.getApprovedIds());
    
    return Response.json({ 
      approvedReviews,
      count: approvedReviews.length 
    });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    return Response.json({ error: 'Failed to fetch approved reviews' }, { status: 500 });
  }
}
