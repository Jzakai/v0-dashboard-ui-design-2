#orchestrator

from fastapi import FastAPI
from routes.scenario_routes import router as scenario_router
from routes.assignment_routes import router as assignment_router
from routes.auth_routes import router as auth_router
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
app.include_router(auth_router)

supabaseUrl = 'https://xbqubafoxtqfvnvgsaod.supabase.co'
supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXViYWZveHRxZnZudmdzYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjcwNDUsImV4cCI6MjA4MDUwMzA0NX0.0gODUNUIonqOmGoc6GoSlPchvxoDSbDr0c0p1Xcssds'



supabase = create_client(supabaseUrl, supabaseKey)
