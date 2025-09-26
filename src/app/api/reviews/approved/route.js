import database from '../../../../lib/database.js';

// GET - Get all approved reviews (public API for property pages)
export async function GET() {
  try {
    const approvedReviews = database.getApprovedReviewsData();
    
    return Response.json({ 
      approvedReviews,
      count: approvedReviews.length 
    });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    return Response.json({ error: 'Failed to fetch approved reviews' }, { status: 500 });
  }
}
