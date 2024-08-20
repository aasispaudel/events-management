from pydantic import BaseModel
import pytz

class TimezoneMap(BaseModel):
  name: str


def get_timezones_list(code: str):
  tzs = pytz.country_timezones.get(code, [])
  return [TimezoneMap(name=t) for t in tzs]
