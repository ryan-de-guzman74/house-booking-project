"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mock property data
  const mockProperties = {
    "29-shoreditch-heights": {
      id: "29-shoreditch-heights",
      name: "2B N1 A - 29 Shoreditch Heights",
      address: "29 Shoreditch Heights, London E1 6JQ",
      description: "Beautiful 2-bedroom apartment in the heart of Shoreditch. Perfect for business travelers and tourists exploring East London.",
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "TV", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
      ],
      price: "£120/night",
      rating: 4.8,
      reviewCount: 0,
      bedrooms: 2,
      bathrooms: 1,
      guests: 4
    },
    "15-camden-square": {
      id: "15-camden-square",
      name: "1B N2 B - 15 Camden Square",
      address: "15 Camden Square, London NW1 7JX",
      description: "Charming 1-bedroom apartment in Camden. Close to Camden Market and Regent's Park.",
      amenities: ["WiFi", "Kitchen", "Washing Machine", "TV", "Balcony"],
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
      ],
      price: "£95/night",
      rating: 4.6,
      reviewCount: 0,
      bedrooms: 1,
      bathrooms: 1,
      guests: 2
    },
    "42-kings-cross": {
      id: "42-kings-cross",
      name: "Studio N3 C - 42 King's Cross",
      address: "42 King's Cross, London N1C 4AG",
      description: "Modern studio apartment near King's Cross station. Ideal for short stays and business trips.",
      amenities: ["WiFi", "Kitchen", "Washing Machine", "TV", "Gym Access"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
      ],
      price: "£85/night",
      rating: 4.4,
      reviewCount: 0,
      bedrooms: 0,
      bathrooms: 1,
      guests: 1
    },
    "88-notting-hill": {
      id: "88-notting-hill",
      name: "3B N4 D - 88 Notting Hill",
      address: "88 Notting Hill, London W11 3QZ",
      description: "Spacious 3-bedroom house in trendy Notting Hill. Perfect for families and groups visiting London.",
      amenities: ["WiFi", "Kitchen", "Washing Machine", "Garden", "TV"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
      ],
      price: "£180/night",
      rating: 4.9,
      reviewCount: 0,
      bedrooms: 3,
      bathrooms: 2,
      guests: 6
    }
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set initial scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const propertyData = mockProperties[params.id];
      console.log('Property ID:', params.id);
      console.log('Property Data:', propertyData);
      
      if (propertyData) {
        setProperty(propertyData);
        
        // Fetch approved reviews for this property
        fetch("/api/public/reviews/approved")
          .then(res => res.json())
          .then(data => {
            // Create mapping from property ID to listing name
            const propertyToListingMapping = {
              "29-shoreditch-heights": "2B N1 A - 29 Shoreditch Heights",
              "15-camden-square": "1B N2 B - 15 Camden Square",
              "42-kings-cross": "Studio N3 C - 42 King's Cross",
              "88-notting-hill": "3B N4 D - 88 Notting Hill"
            };
            
            const expectedListingName = propertyToListingMapping[params.id];
            
            // Filter approved reviews for this specific property
            const propertyReviews = (data.approvedReviews || []).filter(review => 
              review.listing === expectedListingName
            );
            
            setApprovedReviews(propertyReviews);
            setLoading(false);
          })
          .catch(err => {
            console.error("Error fetching approved reviews:", err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [params.id, mockProperties]);

  const scrollToTop = () => {
    // Navigate to landing page first, then scroll to top
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="animate-spin w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Property Details...</h3>
          <p className="text-gray-600">Fetching data for {params.id}...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-600 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-6">The property with ID &quot;{params.id}&quot; could not be found.</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/80 shadow-2xl py-5' 
          : 'bg-black/80 py-10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-600 shadow-lg transition-all duration-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <button 
                onClick={scrollToTop}
                className={`font-bold tracking-tight transition-all duration-500 hover:scale-105 ${
                  isScrolled 
                    ? 'text-white text-3xl' 
                    : 'text-white text-4xl drop-shadow-2xl'
                }`}
              >
                Flex Living
              </button>
            </div>
            <nav className="hidden md:flex space-x-12 ml-auto">
              <Link href="/#properties" className={`font-bold transition-all duration-300 hover:scale-105 relative group pb-2 ${
                isScrolled ? 'text-xl text-white hover:text-blue-400' : 'text-2xl text-white drop-shadow-lg hover:text-blue-400'
              }`}>
                Properties
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              <Link href="/#about" className={`font-bold transition-all duration-300 hover:scale-105 relative group pb-2 ${
                isScrolled ? 'text-xl text-white hover:text-blue-400' : 'text-2xl text-white drop-shadow-lg hover:text-blue-400'
              }`}>
                About
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              <Link href="/#contact" className={`font-bold transition-all duration-300 hover:scale-105 relative group pb-2 ${
                isScrolled ? 'text-xl text-white hover:text-blue-400' : 'text-2xl text-white drop-shadow-lg hover:text-blue-400'
              }`}>
                Contact
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Property Hero Section */}
      <section className="relative pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Property Images - 2 per row, last image spans full width if odd count */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {property.images && property.images.length > 0 ? (
                  property.images.map((image, index) => {
                    const isLastImage = index === property.images.length - 1;
                    const isOddCount = property.images.length % 2 !== 0;
                    const shouldSpanFullWidth = isLastImage && isOddCount;
                    
                    return (
                      <div 
                        key={index} 
                        className={`relative group ${shouldSpanFullWidth ? 'col-span-2' : ''}`}
                      >
                        <img 
                          src={image} 
                          alt={`${property.name} image ${index + 1}`}
                          className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                          onError={(e) => {
                            console.log('Image failed to load:', image);
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h6m-6 0H7" />
                          </svg>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500 text-lg">No images available</p>
                  </div>
                )}
      </div>

            {/* Property Information */}
            <div className="bg-gray-50 rounded-b-2xl p-8 -mx-8 -mb-8">
                <div className="flex items-start justify-between mb-6">
            <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.name}</h1>
                    <p className="text-xl text-gray-600 mb-4">{property.address}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => {
                          const rating = parseFloat(property.rating);
                          const starRating = i + 1;
                          let fillPercentage = 0;
                          
                          if (starRating <= Math.floor(rating)) {
                            fillPercentage = 100;
                          } else if (starRating === Math.ceil(rating) && rating % 1 !== 0) {
                            fillPercentage = (rating % 1) * 100;
                          }
                          
                          return (
                            <div key={i} className="relative w-12 h-12">
                              <svg className="w-12 h-12 text-gray-300 absolute" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <div 
                                className="absolute overflow-hidden"
                                style={{ width: `${fillPercentage}%` }}
                              >
                                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{property.rating}</span>
                </div>
              </div>
            </div>
            
                  <div className="text-right">
                    <div className="text-5xl font-bold text-blue-600 mb-2">{property.price}</div>
                    <div className="text-lg text-gray-500 mb-6"></div>
                    <button className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                      Book Now
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{property.bedrooms}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{property.bathrooms}</div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{property.guests}</div>
                    <div className="text-sm text-gray-500">Max Guests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">Active</div>
                    <div className="text-sm text-gray-500">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          {/* About this property and Amenities - Same row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About this property */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">About this property</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{property.description}</p>
        </div>

        {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">Amenities</h2>
              <div className="grid grid-cols-1 gap-4">
            {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {amenity}
              </div>
            ))}
          </div>
        </div>
          </div>
          
          {/* Reviews - Full width row */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">Guest Reviews</h2>
            
            {approvedReviews.length > 0 ? (
            <div className="space-y-6">
                {approvedReviews.map(review => (
                  <article key={review.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
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
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 text-lg">No reviews yet</p>
                    </div>
                  )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <button
                onClick={scrollToTop}
                className="flex items-center text-2xl font-bold mb-4"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                Flex Living
              </button>
              <p className="text-gray-300 mb-6 max-w-md">
                Redefining London living with premium properties and exceptional service. 
                Your perfect home away from home.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Properties</h3>
              <ul className="space-y-3">
                <li><Link href="/property/29-shoreditch-heights" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Shoreditch Heights</Link></li>
                <li><Link href="/property/15-camden-square" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Camden Square</Link></li>
                <li><Link href="/property/42-kings-cross" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">King&apos;s Cross</Link></li>
                <li><Link href="/property/88-notting-hill" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Notting Hill</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Flex Living. All rights reserved. | Built by{' '}
              <a href="mailto:ryanlink74@outlook.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                ryanlink74@outlook.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}