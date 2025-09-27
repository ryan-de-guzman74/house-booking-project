// Shared mock data storage for the application
// This ensures that property edits are reflected in both the properties API and reviews API

let mockData = {
  properties: {
    "29-shoreditch-heights": {
      id: "29-shoreditch-heights",
      name: "2B N1 A - 29 Shoreditch Heights",
      address: "29 Shoreditch Heights, London E1 6JQ",
      description: "Modern 2-bedroom apartment in the heart of Shoreditch. Perfect for business travelers and tourists exploring East London.",
      price: "£150",
      status: "active",
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "TV", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    "15-camden-square": {
      id: "15-camden-square",
      name: "1B N2 B - 15 Camden Square",
      address: "15 Camden Square, London NW1 7XA",
      description: "Cozy 1-bedroom apartment near Camden Market. Great for solo travelers and couples visiting North London.",
      price: "£120",
      status: "active",
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "TV", "Garden"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    "42-kings-cross": {
      id: "42-kings-cross",
      name: "Studio N3 C - 42 King's Cross",
      address: "42 King's Cross, London WC1X 9HB",
      description: "Modern studio apartment near Kings Cross Station. Perfect for solo travelers and couples exploring London.",
      price: "£80",
      status: "active",
      bedrooms: 0,
      bathrooms: 1,
      guests: 2,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "TV"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    "88-notting-hill": {
      id: "88-notting-hill",
      name: "3B N4 D - 88 Notting Hill",
      address: "88 Notting Hill, London W11 3QA",
      description: "Elegant 3-bedroom apartment in prestigious Notting Hill. Walking distance to Portobello Market and Hyde Park.",
      price: "£200",
      status: "active",
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "TV", "Parking", "Garden", "Balcony"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    }
  },
  reviews: [
    {
      id: 7453,
      type: "host-to-guest",
      status: "pending",
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
      status: "pending",
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
      status: "pending",
      publicReview: "Great location and very clean. The host was very responsive to our needs.",
      reviewCategory: [
        { category: "cleanliness", rating: 8 },
        { category: "communication", rating: 9 },
        { category: "location", rating: 9 },
        { category: "value", rating: 7 }
      ],
      submittedAt: "2020-10-03 09:15:45",
      guestName: "Michael Chen",
      listingName: "Studio N3 C - 42 King's Cross",
      overallRating: 8
    },
    {
      id: 7456,
      type: "guest-to-host",
      status: "pending",
      publicReview: "Absolutely beautiful apartment in a fantastic location. The amenities were top-notch!",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "location", rating: 10 },
        { category: "value", rating: 9 },
        { category: "amenities", rating: 10 }
      ],
      submittedAt: "2020-11-12 16:20:30",
      guestName: "Sarah Johnson",
      listingName: "3B N4 D - 88 Notting Hill",
      overallRating: 10
    },
    {
      id: 7457,
      type: "guest-to-host",
      status: "pending",
      publicReview: "Perfect for a business trip. Clean, modern, and well-equipped.",
      reviewCategory: [
        { category: "cleanliness", rating: 9 },
        { category: "communication", rating: 8 },
        { category: "location", rating: 8 },
        { category: "value", rating: 8 }
      ],
      submittedAt: "2020-12-01 11:45:12",
      guestName: "David Wilson",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      overallRating: 8
    }
  ]
};

// Helper function to determine channel based on review data
function determineChannel(review) {
  if (review.channel) {
    return review.channel;
  }
  return 'Hostaway';
}

// Get normalized reviews data
export function getMockReviews() {
  return {
    reviews: mockData.reviews.map(r => ({
      id: r.id,
      listing: r.listingName,
      guest: r.guestName,
      review: r.publicReview,
      rating: r.overallRating || (r.reviewCategory && r.reviewCategory.length > 0 
        ? Math.round(r.reviewCategory.reduce((acc, cat) => acc + cat.rating, 0) / r.reviewCategory.length)
        : null),
      categories: r.reviewCategory || [],
      date: r.submittedAt,
      channel: determineChannel(r),
      type: r.type,
      status: r.status
    })),
    source: 'mock-data',
    count: mockData.reviews.length
  };
}

// Get property data
export function getMockProperty(id) {
  return mockData.properties[id] || null;
}

// Get all properties
export function getAllMockProperties() {
  return mockData.properties;
}

// Update property data
export function updateMockProperty(id, updates) {
  if (mockData.properties[id]) {
    const oldName = mockData.properties[id].name;
    
    mockData.properties[id] = {
      ...mockData.properties[id],
      ...updates,
      id: id // Ensure ID doesn't change
    };
    
    // Update the listing names in reviews to match the updated property name
    if (updates.name && updates.name !== oldName) {
      mockData.reviews.forEach(review => {
        if (review.listingName === oldName) {
          review.listingName = updates.name;
        }
      });
    }
    
    return mockData.properties[id];
  }
  return null;
}

// Update review listing names when property names change
export function updateReviewListingNames() {
  Object.values(mockData.properties).forEach(property => {
    mockData.reviews.forEach(review => {
      // This is a simple mapping - in a real app you'd have a more sophisticated relationship
      const propertyId = property.id;
      const expectedOldName = getExpectedOldName(propertyId);
      
      if (review.listingName === expectedOldName) {
        review.listingName = property.name;
      }
    });
  });
}

// Helper function to get expected old names for mapping
function getExpectedOldName(propertyId) {
  const mapping = {
    "29-shoreditch-heights": "2B N1 A - 29 Shoreditch Heights",
    "15-camden-square": "1B N2 B - 15 Camden Square",
    "42-kings-cross": "Studio N3 C - 42 King's Cross",
    "88-notting-hill": "3B N4 D - 88 Notting Hill"
  };
  return mapping[propertyId];
}

// Update review approval status
export function updateReviewStatus(reviewId, status) {
  const review = mockData.reviews.find(r => r.id === reviewId);
  if (review) {
    review.status = status;
    console.log(`Updated review ${reviewId} status to: ${status}`);
    return true;
  }
  console.log(`Review ${reviewId} not found`);
  return false;
}

// Approve multiple reviews
export function approveReviews(reviewIds) {
  reviewIds.forEach(id => updateReviewStatus(id, 'published'));
  console.log(`Approved ${reviewIds.length} reviews in mockData`);
}

// Reject a review
export function rejectReview(reviewId) {
  updateReviewStatus(reviewId, 'pending');
  console.log(`Rejected review ${reviewId} in mockData`);
}

// Reject all reviews
export function rejectAllReviews() {
  mockData.reviews.forEach(review => {
    review.status = 'pending';
  });
  console.log('Rejected all reviews in mockData');
}

// Get approved reviews
export function getApprovedReviews() {
  return mockData.reviews.filter(review => review.status === 'published');
}

export default mockData;
