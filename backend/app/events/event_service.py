from fastapi import HTTPException
from sqlalchemy import select, extract
from sqlalchemy.orm import Session
from datetime import timedelta
from app.scheduler.scheduler import scheduler
from app.sql_alchemy.models import Event
from app.events.models import CreateEventRequest, EventsResponse, EventResponse
from datetime import datetime
from app.email.email_service import send_email, SendEmailType, EmailBody
from pytz import utc


def add_event(background_tasks, session: Session, event_model: CreateEventRequest):
  try:
    event = Event(**event_model.model_dump())
    session.add(event)
    session.commit()
    session.refresh(event)

    # Send confirmation email
    background_tasks.add_task(
      send_email, EmailBody(
        subject=f'Event: {event.title} created successfully',
        event_name=event.title,
        event_date=event.event_from.strftime('%Y-%m-%d'),
        event_time=event.event_from.strftime('%H:%M'),
      ), SendEmailType.confirmation
    )

    # Schedule reminder email
    run_date = event.event_from - timedelta(minutes=1)
    if run_date > datetime.now(utc):
      scheduler.add_job(
        send_email,
        'date',
        run_date=run_date,
        args=[
          EmailBody(
            subject=f'Event: {event.title} reminder',
            event_name=event.title,
            event_date=event.event_from.strftime('%Y-%m-%d'),
            event_time=event.event_from.strftime('%H:%M'),
          ), SendEmailType.reminder
        ]
      )

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
