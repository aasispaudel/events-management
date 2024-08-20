from fastapi import HTTPException
from sqlalchemy import select, extract
from sqlalchemy.orm import Session
from app.sql_alchemy.models import Event
from app.events.models import CreateEventRequest, EventsResponse, EventResponse
from datetime import datetime

def add_event(session: Session, event: CreateEventRequest):
  try:
    event = Event(**event.model_dump())
    session.add(event)
    session.commit()
    session.refresh(event)

    return EventResponse.model_validate(event)
  except Exception as e:
    raise HTTPException(status_code=500, detail='Could not save right now. Please try again later')


def get_all_events(session: Session, month: int | None = None,  year: int | None = None):
  if month is None:
    month = datetime.now().month
  if year is None:
    year = datetime.now().year

  try:
    current_year = datetime.now().year
    events = session.scalars(
                select(Event)
                .where(extract('YEAR', Event.event_from) == year)
                .where(extract('MONTH', Event.event_from) == month)
    ).all()
    return EventsResponse.model_validate({'events': events})
  except Exception as e:
    raise HTTPException(status_code=500, detail='Could not retrieve events')
