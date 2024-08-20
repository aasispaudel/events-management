from datetime import datetime

from pydantic import BaseModel
import pytz

class TimezoneMap(BaseModel):
  offset: int
  name: str


def get_timezones_list(code: str):
  tzs = pytz.country_timezones.get(code, [])
  my_timezones = []

  for tz in tzs:
    timezone = pytz.timezone(tz)
    timezone_now = datetime.now(timezone)
    offset = timezone_now.utcoffset().total_seconds() * 1000  # Offset in milliseconds
    my_timezones.append(TimezoneMap(offset=offset, name=tz))

  return my_timezones
