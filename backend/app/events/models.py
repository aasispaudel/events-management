from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CreateEventRequest(BaseModel):
  title: str
  description: str | None = None
  event_from: datetime
  event_to: datetime
  participants: list[str] = []

class EventResponse(CreateEventRequest):
  model_config = ConfigDict(from_attributes=True)

  id: int

class EventsResponse(BaseModel):
  events: list[EventResponse]
