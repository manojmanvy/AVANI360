"""Seed demo listings into the LOCAL dev database.

Usage:
    .\\.venv\\Scripts\\python.exe seed_demo.py seed
    .\\.venv\\Scripts\\python.exe seed_demo.py clear

Demo accounts (password: demo1234):
    arun.seller@demo.avani360.in     (seller)
    balaji.builder@demo.avani360.in  (builder)
    meena.seller@demo.avani360.in    (seller)
    buyer@demo.avani360.in           (buyer)

This script only touches the local `avani360` Postgres database. It does
not change application code, and production should use a separate database.

`clear` removes the demo users and (by cascade) all their listings.
"""

import argparse
import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, or_, select

from app.core.eventloop import configure_windows_event_loop
from app.core.security import hash_password
from app.database.session import AsyncSessionLocal, engine
from app.models.enums import ListingStatus, PropertyType, UserRole
from app.models.property import Property
from app.models.user import User

DEMO_DOMAIN = "demo.avani360.in"
LEGACY_DEMO_DOMAINS = ("demo.bookmyland.in", "demo.bookmyland.test")
DEMO_PASSWORD = "demo1234"

DEMO_USERS = [
    {
        "full_name": "Arun Kumar",
        "email": f"arun.seller@{DEMO_DOMAIN}",
        "phone": "9840012345",
        "role": UserRole.seller,
        "district": "Chennai",
    },
    {
        "full_name": "Sri Balaji Builders",
        "email": f"balaji.builder@{DEMO_DOMAIN}",
        "phone": "9840098765",
        "role": UserRole.builder,
        "district": "Coimbatore",
    },
    {
        "full_name": "Meena Lakshmi",
        "email": f"meena.seller@{DEMO_DOMAIN}",
        "phone": "9840055555",
        "role": UserRole.seller,
        "district": "Madurai",
    },
    {
        "full_name": "Demo Buyer",
        "email": f"buyer@{DEMO_DOMAIN}",
        "phone": "9840077777",
        "role": UserRole.buyer,
        "district": "Chennai",
    },
]

PHOTO_IDS = [
    "1500382017468-9049fed747ef",
    "1560518883-ce09059eeffa",
    "1512917774080-9991f1c4c750",
    "1600585154340-be6161a56a0c",
    "1600607687939-ce8a6c25118c",
    "1568605114967-8130f3a36994",
    "1570129477492-45c003edd2be",
    "1580587771525-78b9dba3b914",
    "1564013799919-ab600027ffc6",
    "1613490493576-7fde63acd811",
    "1592595896551-12b371d546d5",
    "1500534623283-312aade485b7",
    "1510798831971-661eb04b3739",
    "1449844908441-8829872d2607",
]

IMAGE_KINDS = {
    "plot": [0, 1, 6, 11],
    "villa": [1, 3, 4, 9],
    "apartment": [4, 5, 6, 2],
    "farm": [0, 10, 12, 11],
    "commercial": [2, 3, 7, 13],
    "agri": [0, 10, 12, 8],
}

EXTRAS = {
    PropertyType.residential_plot: (
        ["DTCP approved layout", "Clear title", "Corner plot"],
        ["Blacktop road", "Street lights", "Water connection", "Drainage"],
        ["Patta", "DTCP approval", "Survey sketch"],
    ),
    PropertyType.apartment: (
        ["Gated community", "Covered parking", "Lift access"],
        ["Gym", "Children's play area", "24x7 security", "Power backup"],
        ["Sale deed", "Approved plan", "Encumbrance certificate"],
    ),
    PropertyType.villa: (
        ["Private garden", "Modular kitchen", "Vastu compliant"],
        ["Clubhouse", "Swimming pool", "Covered parking", "24x7 security"],
        ["Sale deed", "Approved plan", "Patta"],
    ),
    PropertyType.farm_land: (
        ["Fertile soil", "Borewell", "Fully fenced"],
        ["Farm shed", "Water source", "Road access"],
        ["Patta", "FMB sketch", "Chitta/Adangal"],
    ),
    PropertyType.commercial_plot: (
        ["High visibility", "Main road frontage", "Clear title"],
        ["Highway access", "Power connection", "Water connection"],
        ["Patta", "DTCP approval", "Encumbrance certificate"],
    ),
    PropertyType.agricultural_land: (
        ["Irrigated land", "Well and borewell", "Cultivable"],
        ["Canal water", "Farm access road", "Power supply"],
        ["Patta", "Chitta/Adangal", "FMB sketch"],
    ),
}

# area is always stored in sq.ft. so the "Largest area" sort is meaningful.
LISTINGS = [
    {
        "seller": 0,
        "title": "DTCP Approved Residential Plot near OMR",
        "type": PropertyType.residential_plot,
        "district": "Chennai",
        "city": "Chennai",
        "locality": "OMR, Thalambur",
        "price": 3_200_000,
        "area": 1200,
        "dims": "30 x 40 ft",
        "facing": "East",
        "ownership": "Patta",
        "lat": 12.9010,
        "lng": 80.2279,
        "days": 0,
        "featured": True,
        "kind": "plot",
        "desc": "Build-ready DTCP approved plot on the OMR IT corridor with clear Patta and a 30 ft blacktop approach road. Ideal for a family home or long-term investment.",
    },
    {
        "seller": 1,
        "title": "Premium 4 BHK Villa in Saravanampatti",
        "type": PropertyType.villa,
        "district": "Coimbatore",
        "city": "Coimbatore",
        "locality": "Saravanampatti",
        "price": 16_500_000,
        "area": 2400,
        "dims": "40 x 60 ft",
        "facing": "North-East",
        "ownership": "Patta",
        "beds": 4,
        "baths": 4,
        "lat": 11.0785,
        "lng": 76.9994,
        "days": 1,
        "featured": True,
        "kind": "villa",
        "desc": "Spacious 4 BHK villa in a gated community near Saravanampatti with a private garden, covered parking and clubhouse access.",
    },
    {
        "seller": 2,
        "title": "Fertile Farm Land near Madurai Ring Road",
        "type": PropertyType.farm_land,
        "district": "Madurai",
        "city": "Madurai",
        "locality": "Ring Road, Othakadai",
        "price": 7_500_000,
        "area": 130_680,
        "dims": "3 acres",
        "facing": "East",
        "ownership": "Patta",
        "lat": 9.9500,
        "lng": 78.1800,
        "days": 2,
        "featured": True,
        "kind": "farm",
        "desc": "Three acres of fertile farm land just off the Madurai Ring Road with a working borewell, farm shed and clear Patta.",
    },
    {
        "seller": 0,
        "title": "Commercial Plot on Trichy Airport Road",
        "type": PropertyType.commercial_plot,
        "district": "Tiruchirappalli",
        "city": "Tiruchirappalli",
        "locality": "Airport Road",
        "price": 12_000_000,
        "area": 3600,
        "dims": "60 x 60 ft",
        "facing": "North",
        "ownership": "Patta",
        "lat": 10.7650,
        "lng": 78.7090,
        "days": 3,
        "featured": True,
        "kind": "commercial",
        "desc": "High-visibility commercial plot on the Trichy Airport Road with 60 ft frontage, ideal for showrooms, offices or a service centre.",
    },
    {
        "seller": 2,
        "title": "Agricultural Land near Salem Bye-pass",
        "type": PropertyType.agricultural_land,
        "district": "Salem",
        "city": "Salem",
        "locality": "Salem Bye-pass, Omalur",
        "price": 4_500_000,
        "area": 217_800,
        "dims": "5 acres",
        "facing": "West",
        "ownership": "Patta",
        "lat": 11.7000,
        "lng": 78.1000,
        "days": 4,
        "featured": True,
        "kind": "agri",
        "desc": "Five acres of cultivable agricultural land near the Salem Bye-pass with canal water, a well and good road access.",
    },
    {
        "seller": 1,
        "title": "3 BHK Apartment in Erode City Centre",
        "type": PropertyType.apartment,
        "district": "Erode",
        "city": "Erode",
        "locality": "City Centre",
        "price": 5_800_000,
        "area": 1450,
        "dims": "-",
        "facing": "East",
        "ownership": "Undivided share",
        "beds": 3,
        "baths": 2,
        "lat": 11.3410,
        "lng": 77.7172,
        "days": 5,
        "featured": True,
        "kind": "apartment",
        "desc": "Well-maintained 3 BHK apartment in the heart of Erode with covered parking, lift access and 24x7 security.",
    },
    {
        "seller": 2,
        "title": "Heritage Style Villa in Thanjavur",
        "type": PropertyType.villa,
        "district": "Thanjavur",
        "city": "Thanjavur",
        "locality": "Medical College Road",
        "price": 24_000_000,
        "area": 3000,
        "dims": "50 x 60 ft",
        "facing": "East",
        "ownership": "Patta",
        "beds": 4,
        "baths": 4,
        "lat": 10.7870,
        "lng": 79.1378,
        "days": 8,
        "kind": "villa",
        "desc": "Traditional Thanjavur-style villa with modern interiors, a private courtyard, modular kitchen and covered parking.",
    },
    {
        "seller": 0,
        "title": "Budget Residential Plot in Tirunelveli",
        "type": PropertyType.residential_plot,
        "district": "Tirunelveli",
        "city": "Tirunelveli",
        "locality": "Palayamkottai",
        "price": 1_800_000,
        "area": 900,
        "dims": "30 x 30 ft",
        "facing": "North",
        "ownership": "Patta",
        "lat": 8.7139,
        "lng": 77.7567,
        "days": 10,
        "kind": "plot",
        "desc": "Affordable residential plot in Palayamkottai with clear title, water connection and easy access to schools and hospitals.",
    },
    {
        "seller": 1,
        "title": "Investment Plot near Hosur SIPCOT",
        "type": PropertyType.residential_plot,
        "district": "Krishnagiri",
        "city": "Hosur",
        "locality": "SIPCOT Phase 2",
        "price": 2_450_000,
        "area": 1500,
        "dims": "30 x 50 ft",
        "facing": "East",
        "ownership": "Patta",
        "lat": 12.7409,
        "lng": 77.8253,
        "days": 12,
        "kind": "plot",
        "desc": "Fast-appreciating plot near Hosur SIPCOT Phase 2, suitable for residential or rental investment with clear DTCP approval.",
    },
    {
        "seller": 2,
        "title": "ECR Beachside Luxury Villa",
        "type": PropertyType.villa,
        "district": "Chennai",
        "city": "Chennai",
        "locality": "ECR, Injambakkam",
        "price": 85_000_000,
        "area": 4200,
        "dims": "60 x 70 ft",
        "facing": "East",
        "ownership": "Patta",
        "beds": 5,
        "baths": 5,
        "lat": 12.9200,
        "lng": 80.2500,
        "days": 14,
        "kind": "villa",
        "desc": "Premium beachside villa on ECR with a private pool, landscaped garden, home theatre and covered parking for three cars.",
    },
    {
        "seller": 0,
        "title": "DTCP Layout Plot on GST Road",
        "type": PropertyType.residential_plot,
        "district": "Chengalpattu",
        "city": "Chengalpattu",
        "locality": "GST Road, Maraimalai Nagar",
        "price": 2_800_000,
        "area": 1100,
        "dims": "25 x 44 ft",
        "facing": "South",
        "ownership": "Patta",
        "lat": 12.6819,
        "lng": 79.9888,
        "days": 16,
        "kind": "plot",
        "desc": "Ready-to-register plot in a DTCP layout on GST Road with blacktop roads, street lights and underground drainage.",
    },
    {
        "seller": 2,
        "title": "Gated Community Plot in Tiruvallur",
        "type": PropertyType.residential_plot,
        "district": "Tiruvallur",
        "city": "Tiruvallur",
        "locality": "Perungalathur",
        "price": 2_200_000,
        "area": 1000,
        "dims": "25 x 40 ft",
        "facing": "East",
        "ownership": "Patta",
        "lat": 13.1231,
        "lng": 79.9110,
        "days": 18,
        "kind": "plot",
        "desc": "Plot inside a gated community in Tiruvallur with park, clubhouse and 24x7 security, close to the railway station.",
    },
    {
        "seller": 1,
        "title": "Commercial Land on Kanchipuram Highway",
        "type": PropertyType.commercial_plot,
        "district": "Kanchipuram",
        "city": "Kanchipuram",
        "locality": "Chennai-Trichy Highway",
        "price": 9_500_000,
        "area": 4800,
        "dims": "60 x 80 ft",
        "facing": "North",
        "ownership": "Patta",
        "lat": 12.8342,
        "lng": 79.7036,
        "days": 20,
        "kind": "commercial",
        "desc": "Commercial land with highway frontage on the Chennai-Trichy highway, suitable for a fuel station, warehouse or retail showroom.",
    },
    {
        "seller": 0,
        "title": "Organic Farm Land in Dindigul",
        "type": PropertyType.farm_land,
        "district": "Dindigul",
        "city": "Dindigul",
        "locality": "Batlagundu",
        "price": 3_800_000,
        "area": 174_240,
        "dims": "4 acres",
        "facing": "East",
        "ownership": "Patta",
        "lat": 10.3624,
        "lng": 77.9695,
        "days": 22,
        "kind": "farm",
        "desc": "Four acres of organic farm land in Batlagundu with a borewell, farm shed and rich red soil suitable for vegetables and fruit trees.",
    },
    {
        "seller": 1,
        "title": "Spacious 4 BHK Apartment in Vellore",
        "type": PropertyType.apartment,
        "district": "Vellore",
        "city": "Vellore",
        "locality": "Katpadi",
        "price": 19_500_000,
        "area": 2200,
        "dims": "-",
        "facing": "West",
        "ownership": "Undivided share",
        "beds": 4,
        "baths": 3,
        "lat": 12.9690,
        "lng": 79.1370,
        "days": 24,
        "kind": "apartment",
        "desc": "Large 4 BHK apartment near Katpadi with two covered parking spaces, a community hall and power backup.",
    },
    {
        "seller": 2,
        "title": "Sea View Plot in Kanyakumari",
        "type": PropertyType.residential_plot,
        "district": "Kanyakumari",
        "city": "Kanyakumari",
        "locality": "Vivekananda Nagar",
        "price": 4_200_000,
        "area": 1300,
        "dims": "30 x 43 ft",
        "facing": "East",
        "ownership": "Patta",
        "lat": 8.0883,
        "lng": 77.5385,
        "days": 26,
        "kind": "plot",
        "desc": "Rare sea-view plot in Kanyakumari with clear title, water connection and excellent potential for a holiday home.",
    },
    {
        "seller": 1,
        "title": "Industrial Commercial Plot in Tiruppur",
        "type": PropertyType.commercial_plot,
        "district": "Tiruppur",
        "city": "Tiruppur",
        "locality": "SIPCOT Industrial Park",
        "price": 47_500_000,
        "area": 10_000,
        "dims": "100 x 100 ft",
        "facing": "North",
        "ownership": "Patta",
        "lat": 11.1085,
        "lng": 77.3411,
        "days": 28,
        "kind": "commercial",
        "desc": "Large industrial plot inside the Tiruppur SIPCOT park with 100 ft frontage, power connection and highway access.",
    },
    {
        "seller": 0,
        "title": "Riverfront Agricultural Land near Thanjavur",
        "type": PropertyType.agricultural_land,
        "district": "Thanjavur",
        "city": "Thanjavur",
        "locality": "Kumbakonam Road",
        "price": 12_000_000,
        "area": 261_360,
        "dims": "6 acres",
        "facing": "East",
        "ownership": "Patta",
        "lat": 10.8200,
        "lng": 79.1800,
        "days": 30,
        "kind": "agri",
        "desc": "Six acres of riverfront agricultural land near Kumbakonam Road with canal irrigation, a well and clear Chitta/Adangal records.",
    },
    {
        "seller": 1,
        "title": "Luxury Villa with Private Pool in Coimbatore",
        "type": PropertyType.villa,
        "district": "Coimbatore",
        "city": "Coimbatore",
        "locality": "Vadavalli",
        "price": 62_000_000,
        "area": 5200,
        "dims": "70 x 75 ft",
        "facing": "North-East",
        "ownership": "Patta",
        "beds": 5,
        "baths": 5,
        "lat": 11.0300,
        "lng": 76.9100,
        "days": 32,
        "kind": "villa",
        "desc": "Luxury 5 BHK villa in Vadavalli with a private pool, landscaped garden, home automation and a three-car garage.",
    },
    {
        "seller": 0,
        "title": "Compact Studio Apartment near Chennai Metro",
        "type": PropertyType.apartment,
        "district": "Chennai",
        "city": "Chennai",
        "locality": "Anna Nagar",
        "price": 6_000_000,
        "area": 650,
        "dims": "-",
        "facing": "East",
        "ownership": "Undivided share",
        "beds": 1,
        "baths": 1,
        "lat": 13.0850,
        "lng": 80.2100,
        "days": 34,
        "kind": "apartment",
        "desc": "Compact studio apartment near the Chennai Metro in Anna Nagar, ideal for working professionals or rental income.",
    },
    {
        "seller": 2,
        "title": "Corner Residential Plot in Madurai",
        "type": PropertyType.residential_plot,
        "district": "Madurai",
        "city": "Madurai",
        "locality": "Villapuram",
        "price": 3_500_000,
        "area": 1400,
        "dims": "35 x 40 ft",
        "facing": "North-East",
        "ownership": "Patta",
        "lat": 9.9000,
        "lng": 78.1000,
        "days": 36,
        "kind": "plot",
        "desc": "Corner plot in Villapuram, Madurai with wide road access, clear title and walkable distance to schools and shops.",
    },
    {
        "seller": 0,
        "title": "Farm House Plot in the Nilgiris",
        "type": PropertyType.farm_land,
        "district": "Nilgiris",
        "city": "Ooty",
        "locality": "Coonoor Road",
        "price": 18_000_000,
        "area": 87_120,
        "dims": "2 acres",
        "facing": "South",
        "ownership": "Patta",
        "lat": 11.4102,
        "lng": 76.6950,
        "days": 38,
        "kind": "farm",
        "desc": "Two-acre farm house plot on Coonoor Road with mountain views, a borewell and space for a private retreat.",
    },
    {
        "seller": 1,
        "title": "DTCP Plot in Salem awaiting review",
        "type": PropertyType.residential_plot,
        "district": "Salem",
        "city": "Salem",
        "locality": "Hasthampatti",
        "price": 2_900_000,
        "area": 1200,
        "dims": "30 x 40 ft",
        "facing": "East",
        "ownership": "Patta",
        "lat": 11.6643,
        "lng": 78.1460,
        "days": 1,
        "kind": "plot",
        "status": ListingStatus.pending,
        "desc": "DTCP plot in Hasthampatti, Salem with clear Patta and a 30 ft approach road. Submitted for admin review.",
    },
    {
        "seller": 2,
        "title": "Villa in Coimbatore awaiting review",
        "type": PropertyType.villa,
        "district": "Coimbatore",
        "city": "Coimbatore",
        "locality": "Saravanampatti",
        "price": 15_000_000,
        "area": 2600,
        "dims": "40 x 65 ft",
        "facing": "East",
        "ownership": "Patta",
        "beds": 4,
        "baths": 4,
        "lat": 11.0785,
        "lng": 76.9994,
        "days": 2,
        "kind": "villa",
        "status": ListingStatus.pending,
        "desc": "Newly built 4 BHK villa in Saravanampatti with modular kitchen and covered parking. Submitted for admin review.",
    },
    {
        "seller": 0,
        "title": "Plot in Chennai missing approval documents",
        "type": PropertyType.residential_plot,
        "district": "Chennai",
        "city": "Chennai",
        "locality": "Mugalivakkam",
        "price": 9_000_000,
        "area": 1500,
        "dims": "30 x 50 ft",
        "facing": "East",
        "ownership": "Patta",
        "lat": 13.0200,
        "lng": 80.1600,
        "days": 6,
        "kind": "plot",
        "status": ListingStatus.rejected,
        "reason": "Patta and DTCP approval documents are missing. Please re-upload clear copies.",
        "desc": "Residential plot in Mugalivakkam, Chennai. Listing was rejected because the approval documents were not clear.",
    },
]


def photo(index: int) -> str:
    photo_id = PHOTO_IDS[index % len(PHOTO_IDS)]
    return (
        "https://images.unsplash.com/photo-"
        f"{photo_id}?auto=format&fit=crop&w=1200&q=70"
    )


async def purge_demo_accounts(db) -> int:
    """Delete every demo account (including ones from older domain variants)."""
    domains = (DEMO_DOMAIN, *LEGACY_DEMO_DOMAINS)
    patterns = [f"%@{domain}" for domain in domains]
    users = list(
        (await db.scalars(select(User).where(or_(*[User.email.ilike(p) for p in patterns])))).all()
    )
    if users:
        await db.execute(delete(User).where(User.id.in_([user.id for user in users])))
        await db.commit()
    return len(users)


async def upsert_demo_users(db) -> list[User]:
    users: list[User] = []
    for spec in DEMO_USERS:
        user = await db.scalar(select(User).where(User.email == spec["email"]))
        if user is None:
            user = User(
                full_name=spec["full_name"],
                email=spec["email"],
                password_hash=hash_password(DEMO_PASSWORD),
                is_active=True,
            )
            db.add(user)
        user.full_name = spec["full_name"]
        user.phone = spec["phone"]
        user.role = spec["role"]
        user.district = spec["district"]
        user.is_active = True
        await db.flush()
        users.append(user)
    await db.commit()
    return users


async def remove_demo_listings(db, users: list[User]) -> int:
    seller_ids = [user.id for user in users if user.role in (UserRole.seller, UserRole.builder)]
    if not seller_ids:
        return 0
    result = await db.execute(delete(Property).where(Property.seller_id.in_(seller_ids)))
    await db.commit()
    return result.rowcount or 0


async def seed() -> None:
    async with AsyncSessionLocal() as db:
        purged = await purge_demo_accounts(db)
        users = await upsert_demo_users(db)
        removed = await remove_demo_listings(db, users)

        now = datetime.now(timezone.utc)
        for index, spec in enumerate(LISTINGS):
            property_type = spec["type"]
            highlights, amenities, documents = EXTRAS[property_type]
            seller = users[spec["seller"]]
            created_at = now - timedelta(days=spec["days"], hours=index % 12)
            images = [photo(i) for i in IMAGE_KINDS[spec["kind"]]]

            prop = Property(
                seller_id=seller.id,
                title=spec["title"],
                description=spec["desc"],
                property_type=property_type,
                district=spec["district"],
                city=spec["city"],
                locality=spec["locality"],
                price=spec["price"],
                area=spec["area"],
                area_unit="sq.ft.",
                dimensions=spec["dims"],
                facing=spec["facing"],
                ownership=spec["ownership"],
                bedrooms=spec.get("beds"),
                bathrooms=spec.get("baths"),
                latitude=spec["lat"],
                longitude=spec["lng"],
                map_link=f"https://www.google.com/maps/search/?api=1&query={spec['lat']},{spec['lng']}",
                highlights=highlights,
                amenities=amenities,
                documents=documents,
                images=images,
                status=spec.get("status", ListingStatus.approved),
                rejection_reason=spec.get("reason"),
                featured=spec.get("featured", False),
                created_at=created_at,
                updated_at=created_at,
            )
            db.add(prop)

        await db.commit()

        approved = sum(1 for item in LISTINGS if item.get("status", ListingStatus.approved) == ListingStatus.approved)
        pending = sum(1 for item in LISTINGS if item.get("status") == ListingStatus.pending)
        rejected = sum(1 for item in LISTINGS if item.get("status") == ListingStatus.rejected)

    print(f"Removed {removed} old demo listing(s).")
    if purged:
        print(f"Purged {purged} stale demo account(s) from an older domain.")
    print(f"Seeded {len(LISTINGS)} listings ({approved} approved, {pending} pending, {rejected} rejected).")
    print(f"Demo password for all accounts: {DEMO_PASSWORD}")
    for spec in DEMO_USERS:
        print(f"  {spec['role'].value:<7} {spec['email']}")


async def clear() -> None:
    async with AsyncSessionLocal() as db:
        removed = await purge_demo_accounts(db)
    print(f"Removed {removed} demo account(s) and all their listings.")


async def main(action: str) -> None:
    try:
        if action == "clear":
            await clear()
        else:
            await seed()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", nargs="?", choices=["seed", "clear"], default="seed")
    args = parser.parse_args()
    configure_windows_event_loop()
    asyncio.run(main(args.action))
