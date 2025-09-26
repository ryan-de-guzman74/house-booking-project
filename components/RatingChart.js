"use client";

export default function RatingChart({ reviews }) {
  // Calculate average rating per property
  const propertyRatings = reviews.reduce((acc, review) => {
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

  const chartData = Object.entries(propertyRatings)
    .map(([property, data]) => ({
      property: property.length > 20 ? property.substring(0, 20) + "..." : property,
      average: data.count > 0 ? (data.total / data.count).toFixed(1) : 0,
      count: data.count
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.average - a.average);

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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Ratings by Property</h3>
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-32 text-sm text-gray-600 truncate" title={item.property}>
              {item.property}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(parseFloat(item.average) / maxRating) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center space-x-2 w-20">
              <span className="text-sm font-semibold text-gray-900">{item.average}</span>
              <span className="text-yellow-400">★</span>
              <span className="text-xs text-gray-500">({item.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
