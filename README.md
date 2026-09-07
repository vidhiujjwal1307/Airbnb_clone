# Airbnb Web Application Clone (Fullstack)

A modern, pixel-perfect, fullstack clone of the Airbnb web application built with **FastAPI (Python)**, **SQLite**, and **Next.js (TypeScript + Tailwind CSS)**. Recreates Airbnb's signature design system, user experience, browse/search/booking workflows, interactive map view, host CRUD dashboard, wishlists, and ratings/reviews.

---

## 🌟 Key Features

### 1. 🔍 Home & Search / Explore
- **Grid of Property Cards**: Clean card design with photo galleries/carousel, title, location, night rate, rating scores, and Superhost badges.
- **Search Bar**: Search by destination location, check-in & check-out dates, and guest capacity.
- **Category Filter Bar**: Horizontal scrollable categories (*Beachfront, Cabins, Iconic Cities, Mansions, Countryside, Lakefront, Tiny Homes, OMG!, Trending*).
- **Advanced Filter Modal**: Price range sliders (Min/Max), property types (*Entire home, Room, Shared room*), and amenity selection (*Wifi, Pool, Hot Tub, Sauna, Kitchen, Free Parking, etc.*).
- **Interactive Map View**: Dynamic map view with real-time price badge markers and property popups.
- **Pagination**: Paginated listing navigation.

### 2. 🏡 Listing Detail Page (`/listings/[id]`)
- **Photo Gallery**: Airbnb 5-photo grid layout with a full-screen photo lightbox.
- **Listing Information**: Property specs (guests, bedrooms, beds, baths), host info avatar, Superhost status tag, and detailed space description.
- **Amenities**: Category grid of included features.
- **Sticky Booking Widget**:
  - Interactive date-range check-in / check-out picker.
  - Automatic validation preventing booking overlapping or unavailable dates.
  - Guest count selector with capacity limit enforcement.
  - Real-time price breakdown (*Nightly rate × nights + Cleaning fee + Service fee*).
  - Mocked checkout modal with card, PayPal, and Apple Pay payment choices.
- **Reviews Section**: Overall star score, category breakdowns (*Cleanliness, Accuracy, Communication, Location, Check-in, Value*), user review list, and "Write a Review" modal.
- **Location Map**: Map preview showing surrounding area.

### 3. ✈️ Booking Flow & "My Trips" (`/trips`)
- **Reservation Persistence**: Confirmed bookings persist in the SQLite database and automatically block those dates on the listing calendar.
- **My Trips View**: Complete history of booked stays with dates, guest count, price breakdown, host details, and status tags (`CONFIRMED` / `CANCELLED`).
- **Trip Actions**: Guests can cancel upcoming reservations (instantly releasing booked dates) and leave stay reviews.

### 4. 🔑 Host Experience & Dashboard (CRUD) (`/host/dashboard`)
- **Role Switching**: Demo Profile Switcher allowing seamless testing between Guest and Host profiles.
- **Host Dashboard**:
  - Analytics metrics (*Total host earnings, active property listings, guest reservations count*).
  - Owned Property Listings table with Quick Actions (*View, Edit, Delete*).
  - Guest Reservations table showing guest profiles, stay dates, revenue, and booking status.
- **Create Listing (`/host/create`)**: Comprehensive property wizard to input title, description, category, property type, location, pricing, capacity, image URLs, and amenities.
- **Edit Listing (`/host/edit/[id]`)**: Full editing capability for owned listings.

### 5. ❤️ Wishlists / Favorites (`/wishlists`)
- Save favorite listings with heart toggle buttons on property cards or detail pages.
- View and manage saved properties in dedicated Wishlist page.

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 14 (TypeScript, App Router, Tailwind CSS, Lucide Icons, Date-fns, Leaflet map support)
- **Backend**: Python 3.12 with FastAPI & Uvicorn
- **Database**: SQLite with SQLAlchemy ORM and Pydantic V2 schemas
- **Architecture**: Modular RESTful API backend with CORS support and lightweight role-context header (`X-User-Id`)

---

## 🗄️ Database Schema Design

```
+-------------------+       +--------------------+       +---------------------+
|       User        |       |      Listing       |       |    ListingImage     |
+-------------------+       +--------------------+       +---------------------+
| id (PK)           |1     *| id (PK)            |1     *| id (PK)             |
| name              |-------| host_id (FK)       |-------| listing_id (FK)     |
| email             |       | title              |       | url                 |
| avatar_url        |       | description        |       | is_cover            |
| is_host           |       | category           |       | display_order       |
| is_superhost      |       | property_type      |       +---------------------+
| created_at        |       | location_city      |
+-------------------+       | location_country   |       +---------------------+
  |                         | price_per_night    |       |   ListingAmenity    |
  |                         | cleaning_fee       |       +---------------------+
  |                         | service_fee        |1     *| id (PK)             |
  |                         | max_guests         |-------| listing_id (FK)     |
  |                         | bedrooms           |       | name                |
  |                         | beds               |       +---------------------+
  |                         | baths              |
  |                         +--------------------+
  |                           |                |
  |1                          |1               |1
  |                           |                |
  |*                          |*               |*
+-------------------+       +--------------------+       +---------------------+
|      Booking      |       |       Review       |       |      Wishlist       |
+-------------------+       +--------------------+       +---------------------+
| id (PK)           |       | id (PK)            |       | id (PK)             |
| listing_id (FK)   |       | listing_id (FK)    |       | user_id (FK)        |
| guest_id (FK)     |       | author_id (FK)     |       | listing_id (FK)     |
| check_in          |       | rating             |       | created_at          |
| check_out         |       | comment            |       +---------------------+
| guests_count      |       | created_at         |
| total_price       |       +--------------------+
| status            |
+-------------------+
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)

---

### Step 1: Start Backend (FastAPI + SQLite)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not created)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed database with sample listings, hosts, guests, bookings & reviews
python -m app.seed

# Launch FastAPI server
python -m uvicorn app.main:app --port 8000 --reload
```

The backend server will run on `http://127.0.0.1:8000`. You can inspect interactive OpenAPI documentation at `http://127.0.0.1:8000/docs`.

---

### Step 2: Start Frontend (Next.js)

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open your browser at `http://localhost:3000` to access the application.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/users` | List all seed users for demo role switching |
| `GET` | `/api/auth/me` | Retrieve active user profile |
| `GET` | `/api/listings` | Filtered & paginated listings (search, dates, price, category) |
| `GET` | `/api/listings/{id}` | Listing details, ratings breakdown, and booked date ranges |
| `GET` | `/api/listings/host/my-listings` | Host owned listings |
| `POST` | `/api/listings` | Create a new property listing (Host action) |
| `PUT` | `/api/listings/{id}` | Update listing details (Host action) |
| `DELETE` | `/api/listings/{id}` | Delete listing (Host action) |
| `POST` | `/api/bookings` | Create reservation with date collision check |
| `GET` | `/api/bookings/my-trips` | Guest booked trips |
| `GET` | `/api/bookings/host-reservations` | Reservations made on host properties |
| `POST` | `/api/bookings/{id}/cancel` | Cancel reservation (frees booked dates) |
| `POST` | `/api/reviews` | Submit rating & review for stay |
| `POST` | `/api/wishlists/toggle` | Save/remove listing from wishlist |
| `GET` | `/api/wishlists` | User's saved wishlists |

---

## 💡 Assumptions & Design Decisions

1. **Mocked Payment & Authentication**: As allowed in the assignment requirements, user authentication and payment checkout are simplified for seamless evaluation. A profile switcher allows easily testing as a Guest or Host.
2. **Date Collision Blocking**: Calendar check-in/out logic strictly calculates date overlaps against existing confirmed bookings in the SQLite database to prevent double bookings.
3. **Responsive Design**: Designed to provide an intuitive experience across mobile, tablet, and desktop screens.
