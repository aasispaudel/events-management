from typing import Annotated

from fastapi import FastAPI, Depends, Request, Path
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.events.routes import router as event_router
from app.exceptions.event_exception import EventException
from app.email.get_fastapi_mail import router as email_router

from app.timezones.timezones_service import get_timezones_list, TimezoneMap

app = FastAPI()

origins = [
  "http://localhost:3000",
  "http://localhost:3001"
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.exception_handler(EventException)
async def custom_http_exception_handler(request: Request, exc: EventException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.error_code
        }
    )

app.include_router(event_router)
app.include_router(email_router)

@app.get("/hello")
def get_hello():
  return {'greeting': 'Hello world'}

@app.get("/timezones/{code}")
def get_timezone(code: Annotated[str, Path(min_length=2, max_length=2)]) -> list[TimezoneMap]:
  return get_timezones_list(code)

