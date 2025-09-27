import { getMockReviews } from '../../../../../lib/mockData.js';
import { approvedReviewsStorage } from '../../../../../lib/approvedReviewsStorage.js';
import { approveReviews as mockDataApproveReviews, rejectReview as mockDataRejectReview, rejectAllReviews as mockDataRejectAllReviews } from '../../../../../lib/mockData.js';

// GET - Get all approved reviews
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
          approvedReviewsStorage.approveReviews(reviewIds);
          mockDataApproveReviews(reviewIds); // Update mockData.js
        } catch (error) {
          console.error('Error approving reviews:', error);
          return Response.json({ error: 'Failed to approve reviews' }, { status: 500 });
        }
        break;
      case 'reject':
        try {
          reviewIds.forEach(id => approvedReviewsStorage.rejectReview(id));
          reviewIds.forEach(id => mockDataRejectReview(id)); // Update mockData.js
        } catch (error) {
          console.error('Error rejecting reviews:', error);
          return Response.json({ error: 'Failed to reject reviews' }, { status: 500 });
        }
        break;
      case 'approve_all':
        try {
          const mockReviews = getMockReviews();
          const allReviewIds = mockReviews.reviews.map(r => r.id);
          approvedReviewsStorage.approveReviews(allReviewIds);
          mockDataApproveReviews(allReviewIds); // Update mockData.js
        } catch (error) {
          console.error('Error approving all reviews:', error);
          return Response.json({ error: 'Failed to approve all reviews' }, { status: 500 });
        }
        break;
      case 'reject_all':
        try {
          approvedReviewsStorage.rejectAllReviews();
          mockDataRejectAllReviews(); // Update mockData.js
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
      approvedCount: approvedReviewsStorage.getApprovedIds().length
    });
  } catch (error) {
    console.error('Error updating review approval:', error);
    return Response.json({ error: 'Failed to update review approval' }, { status: 500 });
  }
}
