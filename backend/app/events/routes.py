from fastapi import APIRouter, Depends
from pydantic import UUID4

from app.dependencies.get_session import get_db
from app.events.event_service import add_event, get_all_events
from app.events.models import CreateEventRequest

router = APIRouter(
  prefix="/api/event",
  tags=["Events"]
)

@router.post('/add')
def add_event_api(event: CreateEventRequest, session=Depends(get_db)):
  return add_event(session, event)

@router.get('/all')
def get_all_events_api(session=Depends(get_db), month: int | None = None):
  return get_all_events(session, month)
