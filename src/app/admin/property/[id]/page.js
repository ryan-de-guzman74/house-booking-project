'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const propertyId = params.id;
  const [property, setProperty] = useState(null);
  const [editableProperty, setEditableProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [dataSource, setDataSource] = useState('mock-data');
  const [countdown, setCountdown] = useState(10);
  const [isApiActive, setIsApiActive] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = "Admin | Edit";
  }, []);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('adminAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // Mock property data - in a real app, this would come from an API
  const mockProperties = {
    "29-shoreditch-heights": {
      id: "29-shoreditch-heights",
      name: "2B N1 A - 29 Shoreditch Heights",
      address: "29 Shoreditch Heights, London E1 6JQ",
      description: "Modern 2-bedroom apartment in the heart of Shoreditch. Perfect for business travelers and short stays.",
      price: "£120",
      bedrooms: 2,
      bathrooms: 1,
      guests: 4,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "TV"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      status: "active"
    },
    "15-camden-square": {
      id: "15-camden-square",
      name: "1B N2 B - 15 Camden Square",
      address: "15 Camden Square, London NW1 7AB",
      description: "Charming 1-bedroom flat overlooking Camden Square. Great for couples looking to explore London's music scene.",
      price: "£95",
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Balcony", "TV"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      status: "active"
    },
    "42-kings-cross": {
      id: "42-kings-cross",
      name: "Studio N3 C - 42 King's Cross",
      address: "42 Kings Cross Road, London N1 9AH",
      description: "Modern studio apartment near Kings Cross Station. Perfect for solo travelers and couples exploring London.",
      price: "£80",
      bedrooms: 0,
      bathrooms: 1,
      guests: 2,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Dishwasher", "TV", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      status: "active"
    },
    "88-notting-hill": {
      id: "88-notting-hill",
      name: "3B N4 D - 88 Notting Hill",
      address: "88 Notting Hill Gate, London W11 3HT",
      description: "Elegant 3-bedroom apartment in prestigious Notting Hill. Walking distance to Portobello Market and Hyde Park.",
      price: "£200",
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "TV", "Garden Access"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      status: "active"
    }
  };

  // Countdown effect for API timeout
  useEffect(() => {
    if (isApiActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsApiActive(false);
      setDataSource('mock-data');
    }
  }, [countdown, isApiActive]);

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with timeout
        if (isApiActive) {
          setDataSource('hostaway-api');
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Try to load from API first; if it fails, use mock data, but don't early return
        try {
          const response = await fetch(`/admin/api/properties/${propertyId}`);
          if (response.ok) {
            const result = await response.json();
            setProperty(result.property);
            setEditableProperty({ ...result.property });
          } else {
            throw new Error('Property API not ok');
          }
        } catch (apiError) {
          console.log('API not available, using mock data');
          const propertyData = mockProperties[propertyId];
          if (propertyData) {
            setProperty(propertyData);
            setEditableProperty({ ...propertyData });
          } else {
            console.error('Property not found for ID:', propertyId);
          }
        }
        
        // Load all reviews from admin API
        const reviewsResponse = await fetch('/admin/api/reviews/hostaway');
        if (reviewsResponse.ok) {
          const responseData = await reviewsResponse.json();
          
          // Extract the reviews array from the response
          const allReviews = responseData.reviews || [];
          
          // Ensure allReviews is an array before filtering
          if (Array.isArray(allReviews)) {
            // Normalize listing names to propertyId and compare
            const toPropertyId = (listingName) => {
              const mapping = {
                "2B N1 A - 29 Shoreditch Heights": "29-shoreditch-heights",
                "Updated Property Name": "29-shoreditch-heights", // Handle updated property name
                "1B N2 B - 15 Camden Square": "15-camden-square",
                "Studio N3 C - 42 King's Cross": "42-kings-cross",
                "3B N4 D - 88 Notting Hill": "88-notting-hill",
              };
              return (
                mapping[listingName] ||
                (listingName || '')
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
              );
            };

            // Get current property name for more accurate matching
            const currentProperty = mockProperties[propertyId];
            const currentPropertyName = currentProperty?.name;
            
            const propertyReviews = allReviews.filter((review) => {
              const reviewPid = toPropertyId(review.listing);
              // Also check if the review listing matches the current property name
              const matchesPropertyId = reviewPid === propertyId;
              const matchesCurrentName = currentPropertyName && review.listing === currentPropertyName;
              return matchesPropertyId || matchesCurrentName;
            });

            console.log('Found reviews for property:', propertyReviews.length);
            setApprovedReviews(propertyReviews);
          } else {
            console.warn('Reviews data is not an array:', allReviews);
            setApprovedReviews([]);
          }
        }
        
      } catch (error) {
        console.error('Error loading property:', error);
        setDataSource('mock-data');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]); // Removed isApiActive to stop infinite loop

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditableProperty({ ...property });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to API
      const response = await fetch(`/admin/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableProperty),
      });

      if (!response.ok) {
        throw new Error('Failed to save property');
      }

      const result = await response.json();
      
      // Update local state with saved data
      setProperty(result.property);
      setEditing(false);
      setMessage('Property updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving property:', error);
      setMessage('Error saving property. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setEditableProperty(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...editableProperty.amenities];
    newAmenities[index] = value;
    setEditableProperty(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  const addAmenity = () => {
    setEditableProperty(prev => ({
      ...prev,
      amenities: [...prev.amenities, '']
    }));
  };

  const removeAmenity = (index) => {
    const newAmenities = editableProperty.amenities.filter((_, i) => i !== index);
    setEditableProperty(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking authentication</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // This will be handled by the useEffect redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 shadow-2xl py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-600 shadow-lg transition-all duration-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <button 
                onClick={() => router.push('/admin/dashboard')}
                className="text-3xl font-bold text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer"
              >
                Flex Living
              </button>
            </div>
            
            {/* Centered Property Edit Title */}
            <div className="flex-1 flex justify-center">
              <h2 className="text-5xl font-bold text-white">Property Edit</h2>
            </div>
            
          </div>
        </div>
      </header>

      {/* Fixed Logout Button - Center Right of Screen */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50">
        <button
          onClick={handleLogout}
          className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-pulse">
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-semibold">{message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 pt-36">
        {/* Property Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-8 mb-4">
                {/* Property Name and Location Group */}
                <div className="flex flex-col space-y-2">
                  {editing ? (
                    <input
                      type="text"
                      value={editableProperty.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                      style={{ width: '400px' }}
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                  )}
                  
                  {editing ? (
                    <input
                      type="text"
                      value={editableProperty.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      style={{ width: '400px' }}
                    />
                  ) : (
                    <p className="text-gray-600">{property.address}</p>
                  )}
                </div>
                
                {/* Price Display - Right after the group */}
                <div className="flex items-center space-x-3">
                  {editing ? (
                    <>
                      <input
                        type="text"
                        value={editableProperty.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="text-7xl font-bold text-blue-600 bg-transparent border-b-2 border-blue-500 focus:outline-none text-right mx-8"
                        style={{ width: '200px' }}
                      />
                      <span className="text-2xl text-gray-600">per night</span>
                    </>
                  ) : (
                    <>
                      <span className="text-7xl font-bold text-blue-600 mx-8">{property.price} </span>
                      <span className="text-2xl text-gray-600">/ per night</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Underline for Property Information */}
              <div className="w-full h-px bg-gray-300 mb-6"></div>
            </div>
            
            <div className="ml-6 flex items-center space-x-6">
              {/* Edit/Save Buttons */}
              <div className="flex space-x-3">
                {editing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      {saving && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Property
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* Property Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Bedrooms */}
            <div className="bg-blue-500 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Bedrooms</h3>
                {editing ? (
                  <input
                    type="number"
                    value={editableProperty.bedrooms}
                    onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-center text-2xl font-bold"
                  />
                ) : (
                  <p className="text-4xl font-bold text-white">{property.bedrooms}</p>
                )}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="bg-green-500 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Bathrooms</h3>
                {editing ? (
                  <input
                    type="number"
                    value={editableProperty.bathrooms}
                    onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-center text-2xl font-bold"
                  />
                ) : (
                  <p className="text-4xl font-bold text-white">{property.bathrooms}</p>
                )}
              </div>
            </div>

            {/* Max Guests */}
            <div className="bg-purple-500 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Max Guests</h3>
                {editing ? (
                  <input
                    type="number"
                    value={editableProperty.guests}
                    onChange={(e) => handleChange('guests', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-center text-2xl font-bold"
                  />
                ) : (
                  <p className="text-4xl font-bold text-white">{property.guests}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-orange-500 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Status</h3>
                {editing ? (
                  <select
                    value={editableProperty.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-center text-lg font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                    property.status === 'active' ? 'bg-green-500 text-white' :
                    property.status === 'inactive' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {property.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300 hover:text-blue-600 hover:text-2xl transition-all duration-200 cursor-pointer">Description</h2>
          {editing ? (
            <textarea
              value={editableProperty.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-600">{property.description}</p>
          )}
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="mb-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-300">
              <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 hover:text-2xl transition-all duration-200 cursor-pointer">Amenities</h2>
              {editing && (
                <button
                  onClick={addAmenity}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Amenity
                </button>
              )}
            </div>
          </div>
          
          {editing ? (
            <div className="space-y-2">
              {editableProperty.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={amenity}
                    onChange={(e) => handleAmenityChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeAmenity(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Property Images */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300 hover:text-blue-600 hover:text-2xl transition-all duration-200 cursor-pointer">Property Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`${property.name} image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600 hover:text-blue-600 hover:text-4xl transition-all duration-200 cursor-pointer">Approved Reviews</h2>
          
          {approvedReviews.length > 0 ? (
            <div className="space-y-6">
              {approvedReviews.map((review, index) => (
                <article key={review.id || index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Text column - takes 3/4 width */}
                    <div className="col-span-3">
                      <header className="flex items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mr-4">{review.guest}</h3>
                        <time className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</time>
                      </header>
                      <p className="text-gray-700 leading-relaxed text-lg">{review.review}</p>
                    </div>
                    
                    {/* Rating column - takes 1/4 width */}
                    <div className="col-span-1 flex items-center justify-end">
                      <div className="flex items-center text-yellow-400">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => {
                            const rating = review.rating / 2; // Convert 10-scale to 5-scale
                            const starRating = i + 1;
                            let fillPercentage = 0;
                            
                            if (starRating <= Math.floor(rating)) {
                              fillPercentage = 100;
                            } else if (starRating === Math.ceil(rating) && rating % 1 !== 0) {
                              fillPercentage = (rating % 1) * 100;
                            }
                            
                            return (
                              <div key={i} className="relative w-6 h-6">
                                <svg className="w-6 h-6 text-gray-300 absolute" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <div 
                                  className="absolute overflow-hidden"
                                  style={{ width: `${fillPercentage}%` }}
                                >
                                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-lg font-bold text-gray-900 ml-2">{review.rating}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500">No approved reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}