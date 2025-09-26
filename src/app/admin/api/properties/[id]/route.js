import { NextResponse } from 'next/server';

// In-memory storage for property data (in a real app, this would be a database)
let propertyData = {
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
};

// GET - Fetch property by ID
export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const property = propertyData[id];
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

// PUT - Update property
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const updates = await request.json();
    
    if (!propertyData[id]) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Update the property data
    propertyData[id] = {
      ...propertyData[id],
      ...updates,
      id: id // Ensure ID doesn't change
    };
    
    console.log('Property updated:', propertyData[id]);
    
    return NextResponse.json({ 
      success: true, 
      property: propertyData[id],
      message: 'Property updated successfully' 
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}
