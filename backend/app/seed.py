"""Small, repeatable India-only demo catalogue for the air bnb app."""
import datetime
from sqlalchemy.orm import Session
from app import models
from app.database import Base, SessionLocal, engine

HOSTS = [("Aarav Mehta", "aarav@example.com", True), ("Naina Kapoor", "naina@example.com", True), ("Kabir Singh", "kabir@example.com", False)]
LISTINGS = [
    ("Garden villa near Pari Chowk", "Greater Noida", 28.4744, 77.5040, "Countryside", 1800, 6, 3, "A quiet three-bedroom villa with a lawn, work desk and easy access to the expo centre.", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"),
    ("Modern studio in Sector 18", "Noida", 28.5708, 77.3260, "Iconic Cities", 1400, 2, 1, "A bright, central studio close to shops, metro connections and lively cafés.", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200"),
    ("Heritage home in South Delhi", "Delhi", 28.5355, 77.2410, "Iconic Cities", 2000, 5, 3, "A calm family home with a leafy courtyard in a well-connected Delhi neighbourhood.", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200"),
    ("Riverside apartment in Indirapuram", "Ghaziabad", 28.6346, 77.3666, "Trending", 1600, 4, 2, "A comfortable apartment with a balcony, dependable Wi-Fi and a fully equipped kitchen.", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"),
    ("Skyline loft in Cyber City", "Gurugram", 28.4945, 77.0884, "Mansions", 1900, 4, 2, "A polished loft for work trips and weekend breaks, minutes from Cyber City.", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200"),
    ("Forest cottage in Rajpur", "Dehradun", 30.3165, 78.0322, "Cabins", 3800, 4, 2, "A peaceful cottage at the foothills with a fireplace, garden and mountain air.", "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200"),
    ("Himalayan view cabin", "Mussoorie", 30.4598, 78.0644, "Cabins", 6000, 5, 2, "A warm hillside cabin with valley views, a reading nook and an outdoor sit-out.", "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200"),
]

def seed_database() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        users = [models.User(name=name, email=email, is_host=True, is_superhost=superhost, avatar_url=f"https://i.pravatar.cc/300?img={index + 12}") for index, (name, email, superhost) in enumerate(HOSTS)]
        db.add_all(users)
        db.flush()
        created = []
        for index, (title, city, latitude, longitude, category, price, guests, bedrooms, description, image) in enumerate(LISTINGS):
            listing = models.Listing(title=title, description=description, category=category, property_type="Entire home", location_city=city, location_country="India", latitude=latitude, longitude=longitude, price_per_night=price, cleaning_fee=600, service_fee=350, max_guests=guests, bedrooms=bedrooms, beds=bedrooms, baths=max(1, bedrooms - 1), host_id=users[index % len(users)].id)
            db.add(listing)
            db.flush()
            db.add(models.ListingImage(listing_id=listing.id, url=image, is_cover=True, display_order=0))
            for amenity in ("Fast Wi-Fi", "Kitchen", "Free parking", "Air conditioning"):
                db.add(models.ListingAmenity(listing_id=listing.id, name=amenity))
            created.append(listing)
        today = datetime.date.today()
        db.add(models.Booking(listing_id=created[0].id, guest_id=users[1].id, check_in=today + datetime.timedelta(days=10), check_out=today + datetime.timedelta(days=13), guests_count=2, total_price=6350, status="confirmed"))
        db.add(models.Review(listing_id=created[0].id, author_id=users[1].id, rating=5, comment="Beautiful, comfortable stay and a very helpful host."))
        db.commit()
        print("Seeded seven India-only air bnb listings.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
