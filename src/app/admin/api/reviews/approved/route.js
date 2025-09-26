import database from '../../../../../lib/database.js';

// GET - Get all approved reviews
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

// POST - Approve/reject reviews
export async function POST(request) {
  try {
    const body = await request.text();
    console.log('Raw request body:', body);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw body:', body);
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    const { action, reviewIds } = parsedBody;
    
    if (!action) {
      return Response.json({ error: 'Missing action' }, { status: 400 });
    }

    // For approve_all and reject_all, reviewIds is not required
    if ((action === 'approve' || action === 'reject') && !reviewIds) {
      return Response.json({ error: 'Missing reviewIds for approve/reject actions' }, { status: 400 });
    }

    switch (action) {
      case 'approve':
        try {
          database.approveReviews(reviewIds);
        } catch (error) {
          console.error('Error approving reviews:', error);
          return Response.json({ error: 'Failed to approve reviews' }, { status: 500 });
        }
        break;
      case 'reject':
        try {
          reviewIds.forEach(id => database.rejectReview(id));
        } catch (error) {
          console.error('Error rejecting reviews:', error);
          return Response.json({ error: 'Failed to reject reviews' }, { status: 500 });
        }
        break;
      case 'approve_all':
        try {
          const allReviewIds = database.getReviews().map(r => r.id);
          database.approveReviews(allReviewIds);
        } catch (error) {
          console.error('Error approving all reviews:', error);
          return Response.json({ error: 'Failed to approve all reviews' }, { status: 500 });
        }
        break;
      case 'reject_all':
        try {
          database.rejectAllReviews();
        } catch (error) {
          console.error('Error rejecting all reviews:', error);
          return Response.json({ error: 'Failed to reject all reviews' }, { status: 500 });
        }
        break;
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    return Response.json({ 
      success: true, 
      message: `Reviews ${action}ed successfully`,
      approvedCount: database.getApprovedReviews().length
    });
  } catch (error) {
    console.error('Error updating review approval:', error);
    return Response.json({ error: 'Failed to update review approval' }, { status: 500 });
  }
}
