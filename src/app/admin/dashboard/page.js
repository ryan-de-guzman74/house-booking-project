"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RatingChart from "../../components/RatingChart";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [properties, setProperties] = useState({});
  const [approvedReviews, setApprovedReviews] = useState(new Set());
  const [filterChannel, setFilterChannel] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState(null);
  // Removed unused state variables to stop infinite loops
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Helper function to convert listing name to property ID
  const getPropertyId = (listingName) => {
    const mapping = {
      "2B N1 A - 29 Shoreditch Heights": "29-shoreditch-heights",
      "1B N2 B - 15 Camden Square": "15-camden-square", 
      "Studio N3 C - 42 King's Cross": "42-kings-cross",
      "3B N4 D - 88 Notting Hill": "88-notting-hill"
    };
    return mapping[listingName] || listingName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle review click to show modal
  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  // Close modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedReview(null);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication check
  useEffect(() => {
    document.title = "Admin | Dashboard";
  }, []);

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


  // Load data once - NO TIMEOUT, NO POLLING, NO INFINITE LOOPS
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load reviews data once
        const reviewsResponse = await fetch("/admin/api/reviews/hostaway");
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews);
        setDataSource(reviewsData.source);
        
        // Load property data once
        const propertyIds = ["29-shoreditch-heights", "15-camden-square", "42-kings-cross", "88-notting-hill"];
        const propertyPromises = propertyIds.map(id => 
          fetch(`/admin/api/properties/${id}`)
            .then(res => res.json())
            .then(data => ({ id, property: data.property }))
            .catch(() => ({ id, property: null }))
        );
        
        const propertyResults = await Promise.all(propertyPromises);
        const propertyMap = {};
        propertyResults.forEach(({ id, property }) => {
          if (property) {
            propertyMap[id] = property;
          }
        });
        setProperties(propertyMap);
        
        // Load approved reviews once
        const approvedResponse = await fetch("/admin/api/reviews/approved");
        const approvedData = await approvedResponse.json();
        setApprovedReviews(new Set(approvedData.approvedReviews.map(r => r.id)));
        
        setIsLoading(false);
        
      } catch (error) {
        console.log('Error loading data:', error.message);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []); // Empty dependency array - runs only once

  // Handle approve/reject toggle
  const toggleApproval = async (reviewId) => {
    const isCurrentlyApproved = approvedReviews.has(reviewId);
    const action = isCurrentlyApproved ? 'reject' : 'approve';
    
    try {
      const response = await fetch('/admin/api/reviews/approved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action,
          reviewIds: [reviewId]
        })
      });

      if (response.ok) {
        setApprovedReviews(prev => {
          const newSet = new Set(prev);
          if (isCurrentlyApproved) {
            newSet.delete(reviewId);
          } else {
            newSet.add(reviewId);
          }
          return newSet;
        });
      } else {
        console.error('Failed to update review approval');
      }
    } catch (error) {
      console.error('Error updating review approval:', error);
    }
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = (reviews || [])
    .filter(review => filterChannel === "all" || review.channel === filterChannel)
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case "guest":
          comparison = a.guest.localeCompare(b.guest);
          break;
        case "property":
          comparison = a.listing.localeCompare(b.listing);
          break;
        case "status":
          const aApproved = approvedReviews.has(a.id);
          const bApproved = approvedReviews.has(b.id);
          comparison = aApproved - bApproved;
          break;
        case "channel":
          comparison = (a.channel || '').localeCompare(b.channel || '');
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Data Update Notification - Removed to fix infinite loops */}
      
      {/* Fixed Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 shadow-2xl py-5">
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
                className="text-3xl font-bold text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer"
              >
                Flex Living
              </button>
            </div>
            
            {/* Centered Dashboard Title */}
            <div className="flex-1 flex justify-center">
              <h2 className="text-5xl font-bold text-white">Dashboard</h2>
            </div>
            
             <div className="flex items-center space-x-4">
               <div className="text-right">
                 <div className="flex flex-col space-y-3">
                   {/* Real Data Item */}
                   <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 transition-all duration-300 ${
                     dataSource === 'hostaway-api' 
                       ? 'bg-blue-600 text-white border-2 border-white border-opacity-30' 
                       : 'bg-blue-900 text-gray-400'
                   }`}>
                     <span>Real Data</span>
                    {/* Removed countdown spinner to fix infinite loops */}
                   </div>
                   
                   {/* Mock Data Item */}
                   <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 transition-all duration-300 ${
                     dataSource === 'mock-data' 
                       ? 'bg-green-600 text-white border-2 border-white border-opacity-30' 
                       : 'bg-green-900 text-gray-400'
                   }`}>
                     <span>Mock Data</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </header>

       <div className="max-w-7xl mx-auto p-6 pt-32">

         {/* Modern Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{reviews?.length || 0}</div>
                <div className="text-gray-600 font-medium">Total Reviews</div>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">{approvedReviews.size}</div>
                <div className="text-gray-600 font-medium">Approved</div>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-1">{(reviews?.length || 0) - approvedReviews.size}</div>
                <div className="text-gray-600 font-medium">Pending</div>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {(reviews?.length || 0) > 0 ? Math.round(reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length) : 0}
                </div>
                <div className="text-gray-600 font-medium">Avg Rating</div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Channel:
                </label>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                >
                  <option value="all">All Channels</option>
                  <option value="Hostaway">Hostaway</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Booking.com">Booking.com</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Sort by:
                </label>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                >
                  <option value="date">Date</option>
                  <option value="rating">Rating</option>
                  <option value="guest">Guest Name</option>
                  <option value="property">Property</option>
                  <option value="status">Status</option>
                  <option value="channel">Channel</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Order:
                </label>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/admin/api/reviews/approved', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        action: 'approve_all'
                      })
                    });

                    if (response.ok) {
                      const allIds = new Set(reviews.map(r => r.id));
                      setApprovedReviews(allIds);
                    } else {
                      console.error('Failed to approve all reviews');
                    }
                  } catch (error) {
                    console.error('Error approving all reviews:', error);
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve All
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/admin/api/reviews/approved', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        action: 'reject_all'
                      })
                    });

                    if (response.ok) {
                      setApprovedReviews(new Set());
                    } else {
                      console.error('Failed to reject all reviews');
                    }
                  } catch (error) {
                    console.error('Error rejecting all reviews:', error);
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject All
              </button>
            </div>
          </div>
        </div>

        {/* Modern Charts Section */}
        <div className={`grid grid-cols-1 ${isChartExpanded ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8 mb-8 transition-all duration-300`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <RatingChart reviews={reviews} properties={properties} onExpandChange={setIsChartExpanded} />
          </div>
          
          {/* Modern Channel Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reviews by Channel</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(
                (reviews || []).reduce((acc, review) => {
                  acc[review.channel] = (acc[review.channel] || 0) + 1;
                  return acc;
                }, {})
              ).map(([channel, count]) => (
                <div key={channel} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">{channel}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-blue-600 h-3 rounded-full shadow-sm transition-all duration-500"
                        style={{ width: `${(count / (reviews?.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Reviews Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="animate-spin w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accessing Real Data</h3>
              <p className="text-gray-600 mb-6">Connecting to Hostaway API...</p>
              <div className="bg-blue-50 rounded-2xl p-6 max-w-md mx-auto">
                <div className="text-4xl font-bold text-blue-600 mb-2">Loading...</div>
                <p className="text-sm text-gray-600">Fetching data from API</p>
              </div>
            </div>
          ) : (reviews?.length || 0) === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
              <p className="text-gray-600">There are no reviews to display at the moment.</p>
            </div>
          ) : (
            <>
              {/* Modern Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Status
                          {sortField === 'status' && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('property')}
                          className="flex items-center hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Property
                          {sortField === 'property' && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('guest')}
                          className="flex items-center hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Guest
                          {sortField === 'guest' && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Review
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('rating')}
                          className="flex items-center hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Rating
                          {sortField === 'rating' && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('date')}
                          className="flex items-center hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Date
                          {sortField === 'date' && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <button
                          onClick={() => {
                            if (sortField === 'channel') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortField('channel');
                              setSortDirection('asc');
                            }
                          }}
                          className="flex items-center hover:text-blue-600 transition-colors duration-200 cursor-pointer group"
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                          Channel
                          {sortField === 'channel' && (
                            <svg className="w-3 h-3 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                            </svg>
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredAndSortedReviews.map(review => (
                      <tr key={review.id} className="hover:bg-blue-50 transition-all duration-200 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={approvedReviews.has(review.id)}
                              onChange={() => toggleApproval(review.id)}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all duration-200"
                            />
                            <span className={`ml-3 text-sm font-semibold px-3 py-1 rounded-full ${
                              approvedReviews.has(review.id) 
                                ? 'text-green-700 bg-green-100' 
                                : 'text-orange-700 bg-orange-100'
                            }`}>
                              {approvedReviews.has(review.id) ? '✓ Approved' : '⏳ Pending'}
                            </span>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={`/admin/property/${getPropertyId(review.listing)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-semibold group-hover:text-blue-700"
                          >
                            {properties[getPropertyId(review.listing)]?.name || review.listing}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">{review.guest}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          <div 
                            className="truncate group-hover:text-gray-900 transition-colors cursor-pointer hover:text-blue-600 hover:underline" 
                            title={review.review}
                            onClick={() => handleReviewClick(review)}
                          >
                            {review.review}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.rating ? (
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 font-bold text-gray-900">{review.rating}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-medium">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {new Date(review.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            {review.channel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modern Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredAndSortedReviews.map(review => (
                  <div key={review.id} className="p-6 hover:bg-blue-50 transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={approvedReviews.has(review.id)}
                          onChange={() => toggleApproval(review.id)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all duration-200"
                        />
                        <span className={`ml-3 text-sm font-semibold px-3 py-1 rounded-full ${
                          approvedReviews.has(review.id) 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-orange-700 bg-orange-100'
                        }`}>
                          {approvedReviews.has(review.id) ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {review.channel}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <a 
                          href={`/property/${getPropertyId(review.listing)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-lg group-hover:text-blue-700 transition-colors"
                        >
                          {properties[getPropertyId(review.listing)]?.name || review.listing}
                        </a>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900">{review.guest}</span>
                      </div>
                      
                      <div className="text-sm text-gray-700 bg-gray-50/50 rounded-xl p-3 group-hover:bg-gray-100/50 transition-colors">
                        {review.review}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {review.rating ? (
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 font-bold text-gray-900">{review.rating}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-medium">No rating</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReview && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={closeReviewModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
              <button
                onClick={closeReviewModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <article className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                <div className="grid grid-cols-4 gap-6">
                  {/* Text column - takes 3/4 width */}
                  <div className="col-span-3">
                    <header className="flex items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mr-4">{selectedReview.guest}</h3>
                      <time className="text-sm text-gray-500">{new Date(selectedReview.date).toLocaleDateString()}</time>
                    </header>
                    <p className="text-gray-700 leading-relaxed text-lg">{selectedReview.review}</p>
                  </div>
                  
                  {/* Rating column - takes 1/4 width */}
                  <div className="col-span-1 flex items-center justify-end">
                    <div className="flex items-center text-yellow-400">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => {
                          const rating = selectedReview.rating / 2; // Convert 10-scale to 5-scale
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
                      <span className="ml-2 text-lg font-bold text-gray-900">{selectedReview.rating}</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Additional Review Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Property</h4>
                  <p className="text-gray-700">{selectedReview.listing}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Channel</h4>
                  <p className="text-gray-700">{selectedReview.channel}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Review ID</h4>
                  <p className="text-gray-700">{selectedReview.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    approvedReviews.has(selectedReview.id) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {approvedReviews.has(selectedReview.id) ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeReviewModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
