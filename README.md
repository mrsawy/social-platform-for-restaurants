# 🍽️ Pleny - Restaurant Management & Social Platform API

A comprehensive NestJS-based REST API for managing restaurants with social features, geospatial queries, and intelligent recommendation system.

[![Node.js](https://img.shields.io/badge/Node.js-23+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🎯 Overview

Pleny is a social network for food lovers that combines restaurant management with social features. Users can discover restaurants, follow their favorites, and get personalized recommendations based on cuisine preferences and social connections.

### Key Highlights

- 🏪 **Restaurant Management** - Create, update, and manage restaurant profiles
- 🗺️ **Geospatial Queries** - Find nearby restaurants within custom radius
- 👥 **Social Features** - Follow restaurants and discover what others are following
- 🤖 **Smart Recommendations** - AI-powered suggestions based on user preferences
- 🍜 **Cuisine System** - Multi-cuisine support with validation
- 🔐 **Authentication** - JWT-based secure authentication
- 📊 **Advanced Aggregations** - MongoDB pipeline for complex queries

---

## ✨ Features

### Restaurant Management
- ✅ Create restaurants with bilingual support (English/Arabic)
- ✅ Support 1-3 cuisines per restaurant
- ✅ Unique slug-based identification
- ✅ Geospatial location tracking
- ✅ Follower count tracking

### User Features
- ✅ User registration and authentication
- ✅ Favorite cuisine preferences
- ✅ Follow/unfollow restaurants
- ✅ Personal profile management
- ✅ Social links integration

### Search & Discovery
- ✅ Filter restaurants by multiple cuisines
- ✅ Find nearby restaurants (geospatial queries)
- ✅ Pagination support
- ✅ Search by name or slug

### Recommendations Engine
- ✅ Find users with similar taste
- ✅ Discover restaurants based on social connections
- ✅ MongoDB aggregation pipeline implementation
- ✅ Real-time recommendation updates

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework with TypeScript |
| **Express.js** | HTTP server |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **Swagger** | API documentation |
| **Faker.js** | Test data generation |
| **bcrypt** | Password hashing |
| **class-validator** | DTO validation |

---

## 📋 Prerequisites

- **Node.js v23+** (for native TypeScript support)
- **MongoDB v5.0+** (local or Atlas)
- **pnpm** (package manager)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pleny-restaurant-api.git
cd pleny-restaurant-api
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI_DEV=mongodb://localhost:27017/pleny_restaurant_dev
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/pleny_prod

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=3d
SALT_ROUNDS=10
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

**Or use MongoDB Atlas** (cloud database) and update `MONGODB_URI_DEV` in `.env`

### 5. Run the Application

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod
```

The API will be available at:
- **API Server**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI_DEV` | Development database URL | Required |
| `MONGODB_URI_PROD` | Production database URL | Optional |
| `JWT_SECRET` | Secret key for JWT | Required |
| `JWT_EXPIRES_IN` | Token expiration time | `3d` |
| `SALT_ROUNDS` | bcrypt salt rounds | `10` |

---

## 🌱 Database Seeding

The project includes a comprehensive seeding system to populate your database with test data.

### Seed Data Includes:
- 12 Cuisines (Asian, Italian, Mexican, etc.)
- 20 Restaurants with realistic names
- 50 Users with profiles
- Automatic follow relationships

### Run Seeding

```bash
# Clear database (⚠️ WARNING: Deletes all data)
pnpm db:clear

# Seed database
pnpm db:seed
```

### Seeding Output:
```
🌱 Starting database seeding...
🧹 Clearing existing data...
✓ Database cleared
🍜 Seeding cuisines...
✓ Created 12 cuisines
👥 Seeding users...
✓ Created 50 users
🍽️ Seeding restaurants...
✓ Created 20 restaurants
❤️ Seeding follows...
✓ Created 250 follows

📊 Seeding Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍜 Cuisines: 12
🍽️ Restaurants: 20
👥 Users: 50
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📚 API Documentation

### Swagger UI

Once the server is running, visit:
```
http://localhost:3000/api/docs
```

Interactive API documentation with:
- ✅ All endpoints documented
- ✅ Request/response schemas
- ✅ Try-it-out functionality
- ✅ Authentication support

---

## 📁 Project Structure

```
pleny-restaurant-api/
│
├── src/
│   ├── auth/                      # Authentication module
│   │   ├── dto/                   # Login/Register DTOs
│   │   ├── auth.service.ts        # JWT logic
│   │   ├── auth.controller.ts     # Auth endpoints
│   │   └── auth.guard.ts          # JWT guard
│   │
│   ├── user/                      # User module
│   │   ├── entities/              # User schema
│   │   ├── dto/                   # User DTOs
│   │   ├── user.service.ts        # User business logic
│   │   ├── user.controller.ts     # User endpoints
│   │   └── role.guard.ts          # Role-based guard
│   │
│   ├── restaurant/                # Restaurant module
│   │   ├── entities/              # Restaurant schema
│   │   ├── dto/                   # Restaurant DTOs
│   │   ├── restaurant.service.ts  # Restaurant logic
│   │   └── restaurant.controller.ts
│   │
│   ├── cuisine/                   # Cuisine module
│   │   ├── entities/              # Cuisine schema
│   │   ├── cuisine.service.ts     # Cuisine logic
│   │   └── cuisine.controller.ts
│   │
│   ├── follow/                    # Follow module
│   │   ├── entities/              # Follow schema
│   │   ├── follow.service.ts      # Follow logic
│   │   └── follow.controller.ts
│   │
│   ├── database/
│   │   └── seeders/               # Database seeding
│   │       ├── seed.ts
│   │       ├── clear.ts
│   │       └── seeders.service.ts
│   │
│   ├── app.module.ts              # Root module
│   └── main.ts                    # Application entry point
│
├── .env                           # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## 🔑 Key Features Explained

### 1. Geospatial Queries

Find restaurants within a radius:

```typescript
// Find restaurants within 1km
GET /restaurant/nearby?longitude=31.2357&latitude=30.0444&maxDistance=1000
```

**How it works:**
- Restaurants store location as GeoJSON Point
- MongoDB 2dsphere index for fast queries
- Customizable radius (default 1km)

### 2. Recommendation System

Get personalized restaurant recommendations:

```typescript
GET /user/recommendations
Authorization: Bearer <token>
```

**Algorithm:**
1. Find users with shared favorite cuisines
2. Get restaurants followed by those users
3. Return both similar users and restaurant suggestions

**MongoDB Aggregation Pipeline:**
```javascript
[
  // Match current user
  { $match: { _id: userId } },
  
  // Find similar users
  { $lookup: { 
      from: "users",
      // Find users with overlapping cuisine preferences
  }},
  
  // Get their followed restaurants
  { $lookup: { from: "follows" }},
  
  // Get full restaurant details
  { $lookup: { from: "restaurants" }}
]
```

### 3. Multi-Cuisine Filtering

Filter restaurants by multiple cuisines:

```typescript
GET /restaurant?cuisines[]=asian&cuisines[]=burgers&page=1&limit=10
```

### 4. Follow System with Transactions

Follow/unfollow with atomic operations:

```typescript
// Follow restaurant
POST /follow/:restaurantId
Authorization: Bearer <token>

// Uses MongoDB transactions to ensure:
// - Follow record created
// - Restaurant follower count increased
// - User following count increased
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login user | ❌ |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/user` | Create user | ❌ |
| `GET` | `/user/:id` | Get user by ID | ❌ |
| `GET` | `/user/recommendations` | Get recommendations | ✅ |

### Restaurants

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/restaurant` | Create restaurant | ✅ |
| `GET` | `/restaurant` | List restaurants | ❌ |
| `GET` | `/restaurant/:id` | Get restaurant | ❌ |
| `GET` | `/restaurant/nearby` | Find nearby | ❌ |
| `PATCH` | `/restaurant/:id` | Update restaurant | ✅ |
| `DELETE` | `/restaurant/:id` | Delete restaurant | ✅ |

### Cuisines

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/cuisine` | Create cuisine | ✅ Admin |
| `GET` | `/cuisine` | List cuisines | ❌ |
| `GET` | `/cuisine/:id` | Get cuisine | ❌ |
| `PATCH` | `/cuisine/:id` | Update cuisine | ✅ Admin |
| `DELETE` | `/cuisine/:id` | Delete cuisine | ✅ Admin |

### Follow

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/follow/:restaurantId` | Follow restaurant | ✅ |
| `GET` | `/follow/restaurant/:id` | Get restaurant followers | ❌ |
| `GET` | `/follow/user/:id` | Get user following | ❌ |
| `DELETE` | `/follow/:restaurantId` | Unfollow restaurant | ✅ |

---

## 🧪 Testing

### Manual Testing with Swagger

1. Start the server: `pnpm start:dev`
2. Visit: http://localhost:3000/api/docs
3. Use "Authorize" button to add JWT token
4. Test endpoints directly from browser

### Example Flow:

```bash
# 1. Register user
POST /auth/register
{
  "username": "foodlover",
  "email": "food@example.com",
  "password": "Password123",
  "fullName": "Food Lover",
  "phone": "+201234567890"
}

# 2. Login
POST /auth/login
{
  "identifier": "foodlover",
  "password": "Password123"
}
# Copy the token from response

# 3. Get recommendations (use token in Authorization header)
GET /user/recommendations
Authorization: Bearer <your-token>

# 4. Follow a restaurant
POST /follow/507f1f77bcf86cd799439011
Authorization: Bearer <your-token>
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` in production
- [ ] Use MongoDB Atlas for production database
- [ ] Enable CORS with specific origins
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Configure proper logging
- [ ] Set up CI/CD pipeline

### Build for Production

```bash
pnpm build
pnpm start:prod
```

### Docker Deployment (Optional)

```dockerfile
FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["node", "dist/main"]
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- MongoDB team for powerful database features
- Faker.js for realistic test data

---

## 📞 Support

For issues and questions:
- 📧 Email: support@pleny.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/pleny-restaurant-api/issues)
- 📚 Docs: [Swagger Documentation](http://localhost:3000/api/docs)

---

**⭐ Star this repo if you find it helpful!**

---

## 📊 Database Schema Overview

### Collections

```
Users
├── _id
├── username (unique)
├── email (unique)
├── phone (unique)
├── password (hashed)
├── fullName
├── role (user/admin)
├── preferences
│   ├── favoriteCuisinesIds[]
│   ├── darkMode
│   └── language
└── profile
    ├── bio
    ├── totalFollowing
    └── socialLinks

Restaurants
├── _id
├── nameEn
├── nameAr
├── slug (unique)
├── cuisinesIds[] (1-3 cuisines)
├── location (GeoJSON Point)
├── totalFollowers
├── createdById
└── descriptions (En/Ar)

Cuisines
├── _id
├── name (unique)
├── slug (unique)
├── description
└── isActive

Follows
├── _id
├── userId (ref: User)
├── restaurantId (ref: Restaurant)
└── timestamps
```

---

**Built with ❤️ using NestJS and MongoDB**
