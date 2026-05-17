from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from deps import get_admin, get_current_user

router = APIRouter(prefix="/api/v1/characters", tags=["characters"])


class CharacterCreate(BaseModel):
    name: str
    description: Optional[str] = None
    personality: str = "drole"
    tone: str = "adult"
    catchphrase: Optional[str] = None
    tic_verbal: Optional[str] = None
    language: str = "fr"


class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    personality: Optional[str] = None
    tone: Optional[str] = None
    catchphrase: Optional[str] = None
    tic_verbal: Optional[str] = None
    language: Optional[str] = None
    avatar_url: Optional[str] = None


@router.get("")
async def list_characters(user_id: str = Depends(get_current_user)):
    result = (
        get_admin()
        .table("characters")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_character(body: CharacterCreate, user_id: str = Depends(get_current_user)):
    data = {**body.model_dump(exclude_none=True), "user_id": user_id}
    result = get_admin().table("characters").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create character")
    return result.data[0]


@router.get("/{character_id}")
async def get_character(character_id: str, user_id: str = Depends(get_current_user)):
    result = (
        get_admin()
        .table("characters")
        .select("*")
        .eq("id", character_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Character not found")
    return result.data


@router.patch("/{character_id}")
async def update_character(
    character_id: str,
    body: CharacterUpdate,
    user_id: str = Depends(get_current_user),
):
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (
        get_admin()
        .table("characters")
        .update(updates)
        .eq("id", character_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Character not found")
    return result.data[0]


@router.delete("/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_character(character_id: str, user_id: str = Depends(get_current_user)):
    get_admin().table("characters").delete().eq("id", character_id).eq("user_id", user_id).execute()
