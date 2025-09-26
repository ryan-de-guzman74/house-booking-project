import mockData from '@/lib/mockData.js';

// GET - Get all reviews (public API for property pages)
// For now, return all reviews since approved reviews don't persist in serverless
export async function GET() {
  try {
    // Use mock data directly for now
    // In a real production app, you'd use a persistent database
    const allReviews = mockData.reviews || [];
    
    return Response.json({ 
      approvedReviews: allReviews,
      count: allReviews.length 
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
