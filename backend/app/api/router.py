from fastapi import APIRouter

from app.api.routes import auth, enquiries, properties, scheme_leads, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(properties.router)
api_router.include_router(enquiries.router)
api_router.include_router(scheme_leads.router)
