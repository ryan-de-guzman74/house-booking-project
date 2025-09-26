# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, built with Next.js and designed to integrate with the Hostaway API.

## 🚀 Features

- **Real-time Review Management**: Fetch and manage reviews from Hostaway API
- **Manager Dashboard**: Filter, sort, and approve/reject reviews
- **Property Pages**: Display approved reviews on individual property pages
- **Data Persistence**: Store approved review states in database
- **Fallback System**: Graceful fallback to mock data when API is unavailable
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: In-memory database (development) / PostgreSQL (production ready)
- **External API**: Hostaway Reviews API
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Hostaway API credentials (provided)

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd flex-living-dashboard
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create environment file (optional - credentials are hardcoded for demo)
   cp .env.example .env.local
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Dashboard: http://localhost:3000/dashboard
   - Property Pages: http://localhost:3000/property/[property-id]

## 🏗 Architecture

### API Integration

The system implements a robust API integration strategy:

#### 1. Hostaway API Integration (`/api/reviews/hostaway`)
- **Primary Data Source**: Fetches real reviews from Hostaway API
- **Fallback Strategy**: Uses mock data when API is unavailable
- **Data Normalization**: Converts API response to consistent format
- **Error Handling**: Comprehensive error handling with graceful degradation

```javascript
// API Configuration
const HOSTAWAY_API_BASE = 'https://api.hostaway.com/v1';
const ACCOUNT_ID = '61148';
const API_KEY = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';
```

#### 2. Data Flow
```
Hostaway API → Normalization → Database Storage → Frontend Display
     ↓
Mock Data (Fallback)
```

#### 3. Database Layer (`/lib/database.js`)
- **In-Memory Storage**: For development and demo purposes
- **Production Ready**: Easy migration to PostgreSQL/MongoDB
- **CRUD Operations**: Full review management capabilities

### Key Design Decisions

#### 1. **Graceful Degradation**
- API failures automatically fall back to mock data
- No user-facing errors when external services are down
- Clear logging for debugging

#### 2. **Data Normalization**
- Consistent data structure regardless of source
- Handles missing fields gracefully
- Calculates ratings from category averages when needed

#### 3. **State Management**
- Server-side state for approved reviews
- Client-side state for UI interactions
- Optimistic updates for better UX

#### 4. **Security Considerations**
- API keys should be moved to environment variables in production
- Input validation on all API endpoints
- Rate limiting should be implemented for production

## 📊 API Endpoints

### Reviews Management
- `GET /api/reviews/hostaway` - Fetch all reviews from Hostaway API
- `GET /api/reviews/approved` - Get approved reviews
- `POST /api/reviews/approved` - Approve/reject reviews

### Request/Response Examples

#### Fetch Reviews
```bash
GET /api/reviews/hostaway
```
```json
{
  "reviews": [...],
  "source": "hostaway-api",
  "count": 25
}
```

#### Approve Reviews
```bash
POST /api/reviews/approved
Content-Type: application/json

{
  "action": "approve",
  "reviewIds": [7453, 7454]
}
```

## 🔧 Production Deployment

### Environment Variables
```bash
HOSTAWAY_API_KEY=your_api_key_here
HOSTAWAY_ACCOUNT_ID=your_account_id
DATABASE_URL=postgresql://user:password@localhost:5432/flexliving
```

### Database Migration
Replace the in-memory database with a production database:

```javascript
// lib/database.js - Production version
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Implement database methods using SQL queries
```

### Security Enhancements
1. Move API credentials to environment variables
2. Implement rate limiting
3. Add authentication/authorization
4. Enable CORS properly
5. Add input sanitization

## 🔍 Google Reviews Integration

### Current Status: **Not Implemented**

#### Exploration Findings:
- **Google Places API** would be required
- **Challenges Identified**:
  - Requires Google Cloud Console setup
  - API key management and billing
  - Rate limiting and quota management
  - Data format differences from Hostaway
  - Privacy and GDPR compliance considerations

#### Implementation Approach (if pursued):
1. Set up Google Cloud Console project
2. Enable Places API
3. Create API endpoint: `/api/reviews/google`
4. Implement data normalization layer
5. Merge with Hostaway data in dashboard

#### Recommended Next Steps:
- Evaluate business value vs. implementation complexity
- Consider third-party services like ReviewBoard or Podium
- Implement if Google Reviews are critical for business

## 🧪 Testing

### Manual Testing Checklist
- [ ] Dashboard loads with reviews
- [ ] Filtering by channel works
- [ ] Sorting by date/rating/guest works
- [ ] Approve/reject individual reviews
- [ ] Approve/reject all reviews
- [ ] Property pages show approved reviews only
- [ ] API fallback works when Hostaway is down

### Automated Testing (Recommended)
```bash
npm install --save-dev jest @testing-library/react
npm run test
```

## 📈 Performance Considerations

- **API Caching**: Implement Redis for API response caching
- **Database Indexing**: Add indexes on frequently queried fields
- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Implement dynamic imports for large components

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check network connectivity
   - Verify API credentials
   - Check Hostaway API status

2. **Reviews Not Loading**
   - Check browser console for errors
   - Verify API endpoint responses
   - Check database connection

3. **Approval State Not Persisting**
   - Verify database operations
   - Check API endpoint responses
   - Clear browser cache

## 📝 Development Notes

### Code Structure
```
src/
├── app/
│   ├── api/reviews/          # API endpoints
│   ├── dashboard/            # Manager dashboard
│   ├── property/[id]/        # Property pages
│   └── components/           # Reusable components
├── lib/
│   └── database.js           # Database layer
└── README.md
```

### Key Files
- `src/app/api/reviews/hostaway/route.js` - Main API integration
- `src/lib/database.js` - Data persistence layer
- `src/app/dashboard/page.js` - Manager interface
- `src/app/property/[id]/page.js` - Public property pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary to Flex Living.

---

**Built with ❤️ for Flex Living**