from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from supabase import create_client
import bcrypt

router = APIRouter(prefix="/auth", tags=["authentication"])

# Supabase client
supabaseUrl = 'https://xbqubafoxtqfvnvgsaod.supabase.co'
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXViYWZveHRxZnZudmdzYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjcwNDUsImV4cCI6MjA4MDUwMzA0NX0.0gODUNUIonqOmGoc6GoSlPchvxoDSbDr0c0p1Xcssds"
supabase = create_client(supabaseUrl, supabaseKey)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
async def signup(request: SignupRequest):
    try:
        # Check if user already exists
        existing_user = supabase.table("users").select("*").eq("email", request.email).execute()
        
        if existing_user.data:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # Hash password
        hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt())
        
        # Insert new user
        user_data = {
        "email": request.email,
        "password_hash": hashed_password.decode('utf-8'),
        "name": request.name,
        "role": request.role
        }
        
        result = supabase.table("users").insert(user_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        return {
            "message": "User created successfully",
            "user": {
                "email": request.email,
                "name": request.name,
                "role": request.role
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")


@router.post("/login")
async def login(request: LoginRequest):
    try:
        # Get user from database
        user_result = supabase.table("users").select("*").eq("email", request.email).execute()
        
        if not user_result.data:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = user_result.data[0]
        
        # Verify password
        if not bcrypt.checkpw(request.password.encode('utf-8'), user["password_hash"].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return {
            "message": "Login successful",
            "user": {
                "email": user["email"],
                "name": user["name"],
                "role": user["role"]
            },
            "name": user["name"],
            "role": user["role"]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
