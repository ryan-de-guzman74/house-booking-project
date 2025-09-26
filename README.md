<<<<<<< HEAD
# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, built with Next.js and designed to integrate with the Hostaway API.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: In-memory database (development) / PostgreSQL (production ready)
- **External API**: Hostaway Reviews API
- **Deployment**: Vercel-ready

## Key Design & Logic Decisions

1. **Hostaway API Integration**
- Implemented /api/reviews/hostaway to fetch and normalize reviews.
- Falls back to mock review data when the sandbox API has no results.
- Normalized structure: { id, listingName, guestName, channel, rating, category, date, status }.

2. **Manager Dashboard**
- Clean UI with filtering, sorting, and trend-spotting features.
- Approve/reject system lets managers control which reviews appear publicly.
- Bulk actions (approve/reject all) for efficiency.

3. **Review Display Page**
- Replicates Flex Living property layout.
- Displays only manager-approved reviews.
- Keeps style consistent with Flex Living website.

4. **Fallback Strategy**
- Mock data displayed when no live API updates are available.
- Ensures dashboard always shows meaningful results.

## API Behaviors

- **GET /api/reviews/hostaway** → Returns reviews from Hostaway or mock data
- **GET /api/reviews/approved** → Returns approved reviews
- **POST /api/reviews/approved** → Approve/reject one or more reviews

**Example response:**
   {
      "reviews": [...],
      "source": "hostaway-api",
      "count": 25
   }

## Google Reviews (Exploration)

- Explored using Google Places API.
- Requires Google Cloud setup, API key, billing, and quota management.
- Found to be feasible, but adds complexity (costs, GDPR, rate limits).
- Left unimplemented for this project — findings are documented.

## Running Locally
   git clone <repo-url>
   cd flex-living-dashboard
   npm install
   npm run dev

   - **Dashboard** → http://localhost:3000/dashboard
   - **Property Page** → http://localhost:3000/property/[id]

## API Credentials (Sandbox)

- **Account ID**: 61148
- **API Key**: f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
- **Note**: Sandbox API contains no live reviews, so mock data is used.


**Built with ❤️ for Flex Living**
=======
# house-booking-project
Start-up project for real estate or house rental platform.
>>>>>>> a0eea718630de5520191fb76e7fec6d9f6443cb4
