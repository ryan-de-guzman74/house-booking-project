"use client";
import { useState } from "react";

export default function ReviewCard({ 
  review, 
  variant = "card", // "card" for guest page, "table" for admin page
  onReviewClick = null,
  showActions = false,
  onApprove = null,
  onReject = null,
  isApproved = false,
  onToggleApproval = null, // For admin dashboard checkbox
  propertyName = null // For admin dashboard property name
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle review click for modal
  const handleClick = () => {
    if (onReviewClick) {
      onReviewClick(review);
    }
  };

  // Handle approve/reject actions
  const handleApprove = (e) => {
    e.stopPropagation();
    if (onApprove) onApprove(review.id);
  };

  const handleReject = (e) => {
    e.stopPropagation();
    if (onReject) onReject(review.id);
  };

  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400 font-medium">N/A</span>;
    
    return (
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 font-bold text-gray-900">{rating}</span>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  // Get review text based on data structure
  const getReviewText = () => {
    return review.publicReview || review.review || "No review text available";
  };

  // Get guest name based on data structure
  const getGuestName = () => {
    return review.guestName || review.guest || "Anonymous";
  };

  // Get listing name based on data structure
  const getListingName = () => {
    return review.listing || review.listingName || "Unknown Property";
  };

  // Get date based on data structure
  const getDate = () => {
    return review.submittedAt || review.date || null;
  };

  // Get rating based on data structure
  const getRating = () => {
    return review.overallRating || review.rating || null;
  };

  // Convert listing name to property ID
  const getPropertyIdFromListing = (listingName) => {
    const mapping = {
      "2B N1 A - 29 Shoreditch Heights": "29-shoreditch-heights",
      "1B N2 B - 15 Camden Square": "15-camden-square", 
      "Studio N3 C - 42 King's Cross": "42-kings-cross",
      "3B N4 D - 88 Notting Hill": "88-notting-hill"
    };
    return mapping[listingName] || listingName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Card variant for guest page
  if (variant === "card") {
    return (
      <article className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
        <div className="grid grid-cols-4 gap-6">
          {/* Text column - takes 3/4 width */}
          <div className="col-span-3">
            <header className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mr-4">{getGuestName()}</h3>
              <time className="text-sm text-gray-500">{formatDate(getDate())}</time>
            </header>
            <p className="text-gray-700 leading-relaxed text-lg">{getReviewText()}</p>
          </div>
          
          {/* Rating column - takes 1/4 width */}
          <div className="col-span-1 flex items-center justify-end">
            <div className="text-right">
              {renderStars(getRating())}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Table variant for admin page
  if (variant === "table") {
    return (
      <tr 
        key={review.id}
        className="hover:bg-blue-50 transition-all duration-200 group"
        onClick={handleClick}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={isApproved}
              onChange={(e) => {
                e.stopPropagation();
                if (onToggleApproval) onToggleApproval(review.id);
              }}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all duration-200"
            />
            <span className={`ml-3 text-sm font-semibold px-3 py-1 rounded-full ${
              isApproved 
                ? 'text-green-700 bg-green-100' 
                : 'text-orange-700 bg-orange-100'
            }`}>
              {isApproved ? '✓ Approved' : '⏳ Pending'}
            </span>
          </label>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <a 
            href={`/admin/property/${getPropertyIdFromListing(getListingName())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-semibold group-hover:text-blue-700"
            onClick={(e) => e.stopPropagation()}
          >
            {propertyName || getListingName()}
          </a>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm font-semibold text-gray-900">{getGuestName()}</span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
          <div 
            className="truncate group-hover:text-gray-900 transition-colors cursor-pointer hover:text-blue-600 hover:underline" 
            title={getReviewText()}
          >
            {getReviewText()}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {renderStars(getRating())}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
          {formatDate(getDate())}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {review.channel || "N/A"}
          </span>
        </td>
      </tr>
    );
  }

  // Default fallback
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold">{getGuestName()}</h3>
      <p className="text-gray-700">{getReviewText()}</p>
      {renderStars(review.rating)}
    </div>
  );
}
