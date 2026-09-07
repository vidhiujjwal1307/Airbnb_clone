import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, listings, bookings, reviews, wishlists

# Create tables automatically on startup if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="air bnb API",
    description="India stays API providing search, listings, booking management, host CRUD, reviews, and wishlists.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(wishlists.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to the air bnb API",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
