"use client";

import { useState } from 'react';

export default function RatingChart({ reviews, properties = {}, onExpandChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (onExpandChange) {
      onExpandChange(newExpanded);
    }
  };
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

  // Calculate average rating per property
  const propertyRatings = (reviews || []).reduce((acc, review) => {
    if (!acc[review.listing]) {
      acc[review.listing] = { total: 0, count: 0, ratings: [] };
    }
    if (review.rating) {
      acc[review.listing].total += review.rating;
      acc[review.listing].count += 1;
      acc[review.listing].ratings.push(review.rating);
    }
    return acc;
  }, {});

  const allChartData = Object.entries(propertyRatings)
    .map(([property, data]) => {
      const propertyId = getPropertyId(property);
      const propertyName = properties[propertyId]?.name || property;
      return {
        property: propertyName,
        displayProperty: propertyName.length > 20 ? propertyName.substring(0, 20) + "..." : propertyName,
        average: data.count > 0 ? (data.total / data.count).toFixed(1) : 0,
        count: data.count
      };
    })
    .filter(item => item.count > 0)
    .sort((a, b) => b.average - a.average);

  const chartData = isExpanded ? allChartData : allChartData.slice(0, 5);
  const hasMoreProperties = allChartData.length > 5;

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Ratings by Property</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No rating data available</p>
        </div>
      </div>
    );
  }

  const maxRating = Math.max(...chartData.map(item => parseFloat(item.average)));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Average Ratings by Property</h3>
        {hasMoreProperties && (
          <button
            onClick={handleExpandToggle}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>{isExpanded ? 'Show Less' : 'Show All'}</span>
          </button>
        )}
      </div>
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-32 text-sm text-gray-600 truncate" title={item.property}>
              {item.displayProperty}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(parseFloat(item.average) / maxRating) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center space-x-2 w-20">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-semibold text-gray-900">{item.average}</span>
              </div>
              <span className="text-xs text-gray-500">({item.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
