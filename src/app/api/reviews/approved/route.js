import mockData from '@/lib/mockData.js';
import { approvedReviewsStorage } from '@/lib/approvedReviewsStorage.js';

// GET - Get approved reviews (public API for property pages)
export async function GET() {
  try {
    const allReviews = mockData.reviews || [];
    
    // Get only the approved reviews using the shared storage
    const approvedReviews = approvedReviewsStorage.getApprovedReviews(allReviews);
    
    console.log(`Found ${approvedReviews.length} approved reviews out of ${allReviews.length} total reviews`);
    console.log('Approved review IDs:', approvedReviewsStorage.getApprovedIds());
    console.log('Approved reviews:', approvedReviews.map(r => ({ id: r.id, guest: r.guest })));
    
    return Response.json({ 
      approvedReviews,
      count: approvedReviews.length 
    });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    return Response.json({ error: 'Failed to fetch approved reviews' }, { status: 500 });
  }
}
