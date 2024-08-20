from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import UUID4

from app.dependencies.get_session import get_db
from app.events.event_service import add_event, get_all_events, update_event, delete_event
from app.events.models import CreateEventRequest, UpdateEventRequest

router = APIRouter(
  prefix="/api/event",
  tags=["Events"]
)


@router.post('/add')
def add_event_api(background_tasks: BackgroundTasks,
                  event: CreateEventRequest, session=Depends(get_db)):
  return add_event(background_tasks, session, event)


@router.put('/update/{event_id}')
def update_event_api(background_tasks: BackgroundTasks, event_id: int,
                     event: UpdateEventRequest, session=Depends(get_db)):
  return update_event(background_tasks, event_id, session, event)

@router.delete('/delete/{event_id}')
def delete_event_api(background_tasks: BackgroundTasks, event_id: int, session=Depends(get_db)):
  return delete_event(background_tasks, event_id, session)


@router.get('/all')
def get_all_events_api(session=Depends(get_db),
                       month: int | None = None, year: int | None = None):
  return get_all_events(session, month, year)
