import database from '@/lib/database.js';
import { approvedReviewsStorage } from '@/lib/approvedReviewsStorage.js';

// GET - Get approved reviews (public API for property pages)
export async function GET() {
  try {
    // Use the same data source as the admin API for consistency
    const approvedReviews = database.getApprovedReviewsData();
    
    console.log(`Found ${approvedReviews.length} approved reviews from database`);
    console.log('Approved reviews:', approvedReviews.map(r => ({ id: r.id, guest: r.guest, status: 'published' })));
    
    return Response.json({ 
      approvedReviews,
      count: approvedReviews.length 
    });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    return Response.json({ error: 'Failed to fetch approved reviews' }, { status: 500 });
  }
}
