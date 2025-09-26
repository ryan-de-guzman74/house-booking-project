import database from '../../../../../lib/database.js';

export async function GET() {
  try {
    // Hostaway API configuration
    const HOSTAWAY_API_BASE = 'https://api.hostaway.com/v1';
    const ACCOUNT_ID = '61148';
    const API_KEY = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';
    
    // Create a timeout promise that rejects after 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API timeout after 10 seconds')), 10000);
    });
    
    // Create the API fetch promise
    const apiPromise = fetch(`${HOSTAWAY_API_BASE}/reviews?accountId=${ACCOUNT_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    // Race between API call and timeout
    const response = await Promise.race([apiPromise, timeoutPromise]);

    let normalized;
    let source;

    if (!response.ok) {
      // If API fails, fall back to mock data for development
      console.warn('Hostaway API failed, falling back to mock data:', response.status);
      const mockData = getMockData();
      normalized = mockData.reviews;
      source = 'mock-data';
    } else {
      const data = await response.json();
      
      // Check if API returned success status
      if (data.status !== 'success' || !data.result) {
        console.warn('Hostaway API returned unexpected format, falling back to mock data');
        const mockData = getMockData();
        normalized = mockData.reviews;
        source = 'mock-data';
      } else {
        // Normalize the real API data
        normalized = data.result.map(r => ({
          id: r.id,
          listing: r.listingName,
          guest: r.guestName,
          review: r.publicReview,
          rating: r.rating || (r.reviewCategory && r.reviewCategory.length > 0 
            ? Math.round(r.reviewCategory.reduce((acc, cat) => acc + cat.rating, 0) / r.reviewCategory.length)
            : null),
          categories: r.reviewCategory || [],
          date: r.submittedAt,
          channel: determineChannel(r), // Function to determine channel based on review data
          type: r.type,
          status: r.status
        }));
        source = 'hostaway-api';
      }
    }

    // Store reviews in database
    database.setReviews(normalized);

    return Response.json({ 
      reviews: normalized,
      source: source,
      count: normalized.length
    });

  } catch (error) {
    console.error('Error fetching reviews from Hostaway API:', error);
    
    // Check if it's a timeout error
    if (error.message === 'API timeout after 10 seconds') {
      console.warn('Hostaway API timed out after 10 seconds, falling back to mock data');
    }
    
    // Fall back to mock data on any error (including timeout)
    const mockData = getMockData();
    database.setReviews(mockData.reviews);
    return Response.json(mockData);
  }
}

// Helper function to determine channel based on review data
function determineChannel(review) {
  // In a real implementation, you might have channel information in the API response
  // For now, we'll use a simple heuristic or default to Hostaway
  if (review.channel) {
    return review.channel;
  }
  
  // You could also check other fields to determine the source
  // For example, if there's a specific field that indicates the booking platform
  return 'Hostaway';
}

// Fallback mock data function
function getMockData() {
  const mockReviews = [
    {
      id: 7453,
      type: "host-to-guest",
      status: "published",
      publicReview: "Shane and family are wonderful! Would definitely host again :)",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "respect_house_rules", rating: 10 }
      ],
      submittedAt: "2020-08-21 22:45:14",
      guestName: "Shane Finkelstein",
      listingName: "2B N1 A - 29 Shoreditch Heights"
    },
    {
      id: 7454,
      type: "guest-to-host",
      status: "published",
      publicReview: "Amazing stay! The apartment was spotless and the location was perfect. Highly recommend!",
      reviewCategory: [
        { category: "cleanliness", rating: 9 },
        { category: "communication", rating: 10 },
        { category: "location", rating: 10 },
        { category: "value", rating: 8 }
      ],
      submittedAt: "2020-09-15 14:30:22",
      guestName: "Emma Thompson",
      listingName: "1B N2 B - 15 Camden Square",
      overallRating: 9
    },
    {
      id: 7455,
      type: "guest-to-host",
      status: "published",
      publicReview: "Great communication and the place was exactly as described. Would stay again!",
      reviewCategory: [
        { category: "cleanliness", rating: 8 },
        { category: "communication", rating: 9 },
        { category: "accuracy", rating: 10 }
      ],
      submittedAt: "2020-10-03 09:15:45",
      guestName: "Michael Chen",
      listingName: "Studio N3 C - 42 King's Cross",
      overallRating: 8
    },
    {
      id: 7456,
      type: "guest-to-host",
      status: "published",
      publicReview: "Perfect location for exploring London. The host was very responsive and helpful.",
      reviewCategory: [
        { category: "location", rating: 10 },
        { category: "communication", rating: 9 },
        { category: "cleanliness", rating: 8 },
        { category: "value", rating: 9 }
      ],
      submittedAt: "2020-11-12 16:20:10",
      guestName: "Sarah Johnson",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      overallRating: 9
    },
    {
      id: 7457,
      type: "host-to-guest",
      status: "published",
      publicReview: "Excellent guests! Very respectful and left the place in perfect condition.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "respect_house_rules", rating: 10 },
        { category: "communication", rating: 9 }
      ],
      submittedAt: "2020-12-01 11:45:33",
      guestName: "David Wilson",
      listingName: "3B N4 D - 88 Notting Hill",
      overallRating: 10
      }
    ];

    const normalized = mockReviews.map(r => ({
      id: r.id,
      listing: r.listingName,
      guest: r.guestName,
      review: r.publicReview,
      rating: r.overallRating || Math.round(r.reviewCategory.reduce((acc, cat) => acc + cat.rating, 0) / r.reviewCategory.length),
      categories: r.reviewCategory,
      date: r.submittedAt,
      channel: r.id % 3 === 0 ? "Airbnb" : r.id % 3 === 1 ? "Booking.com" : "Hostaway",
      type: r.type
    }));

    return { 
      reviews: normalized,
      source: 'mock-data',
      count: normalized.length
    };
}
