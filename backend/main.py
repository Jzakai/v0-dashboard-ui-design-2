#orchestrator

from fastapi import FastAPI
from routes.scenario_routes import router as scenario_router
from routes.assignment_routes import router as assignment_router
from supabase import create_client


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(scenario_router)
app.include_router(assignment_router)

supabaseUrl = 'https://orxufngqjlljmrahvmgt.supabase.co'
supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeHVmbmdxamxsam1yYWh2bWd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAyOTkwOCwiZXhwIjoyMDc4NjA1OTA4fQ.oK87M171H-kbhdBGSEZcBBGVpypjbphuqNf5p82stSw'



supabase = create_client(supabaseUrl, supabaseKey)
