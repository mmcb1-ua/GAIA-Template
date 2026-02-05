from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Placeholder - usually this decodes token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # In a real app, verify token and return user
    # For now, we rely on the test override, or fail if no override
    # This is "Red" state implementation effectively requiring the real thing or override
    # But since we promised to "mock it for now if missing", let's make it usable for manual testing if needed
    # However, strict TDD says only code what's tested.
    pass

async def get_current_admin():
    # Placeholder for RBAC
    # Tests will override this to return an admin user
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
