from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY: str = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

security = HTTPBearer()

_admin: Client | None = None


def get_admin() -> Client:
    global _admin
    if _admin is None:
        _admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _admin


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """Verify Supabase JWT and return the authenticated user_id."""
    try:
        resp = get_admin().auth.get_user(credentials.credentials)
        if not resp.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return resp.user.id
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
