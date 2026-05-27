import os
import json
import time

import jwt
import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
_jwks_cache = None
_jwks_expiry = 0


def _get_jwks() -> dict:
    """Fetch JWKS from Clerk, with 1-hour cache."""
    global _jwks_cache, _jwks_expiry
    if time.time() > _jwks_expiry:
        resp = requests.get(CLERK_JWKS_URL, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_expiry = time.time() + 3600
    return _jwks_cache


def _find_signing_key(token: str):
    """Find the RS256 public key matching the JWT's `kid` header."""
    try:
        unverified_header = jwt.get_unverified_header(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token header")

    kid = unverified_header.get("kid")
    if not kid:
        raise HTTPException(status_code=401, detail="Token missing kid header")

    jwks = _get_jwks()
    for key_data in jwks.get("keys", []):
        if key_data.get("kid") == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key_data))

    # Force refresh and try once more
    global _jwks_cache
    _jwks_cache = None
    jwks = _get_jwks()
    for key_data in jwks.get("keys", []):
        if key_data.get("kid") == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key_data))

    raise HTTPException(status_code=401, detail="Unable to find signing key for token")


def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> dict:
    """
    Dependency: extract and verify a Clerk JWT from the Authorization header.
    Returns the decoded JWT payload on success.
    """
    token = credentials.credentials
    try:
        key = _find_signing_key(token)
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
