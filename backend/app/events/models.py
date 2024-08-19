from pydantic import BaseModel, FutureDatetime, ConfigDict
from datetime import datetime

class CreateEventRequest(BaseModel):
  title: str
  description: str | None = None
  event_from: FutureDatetime
  event_to: FutureDatetime
  participants: list[str] = []

class EventResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  title: str
  description: str | None = None
  event_from: datetime
  event_to: datetime
  participants: list[str] = []

class EventsResponse(BaseModel):
  events: list[EventResponse]
