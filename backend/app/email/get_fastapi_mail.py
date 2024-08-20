# Configuration for FastAPI-Mail
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from dotenv import load_dotenv
import os
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel

load_dotenv()

class EmailBody(BaseModel):
  subject: str
  body: str

class Body(BaseModel):
  event_name: str
  event_date: str
  event_time: str


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv('EMAIL_USERNAME'),
    MAIL_PASSWORD=os.getenv('EMAIL_PASSWORD'),
    MAIL_FROM=os.getenv('EMAIL_FROM'),
    MAIL_PORT=465,
    MAIL_SERVER=os.getenv('EMAIL_SERVER'),
    MAIL_FROM_NAME=os.getenv('EMAIL_FROM_NAME'),
    MAIL_SSL_TLS=True,
    MAIL_STARTTLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

router = APIRouter(prefix='/email', tags=['Email'])

env = Environment(loader=FileSystemLoader("app/email"))  # Ensure the correct path to your templates

@router.post('/send')
async def send_email(background_tasks: BackgroundTasks, email: EmailBody):
  template = env.get_template('_confirmation_template.html')
  email_content = template.render(
    event_name='Test event',
    event_date='Test date',
    event_time='Test time'
  )

  message = MessageSchema(
    subject=email.subject,
    recipients=['aasispaudelthp2@gmail.com'],
    body=email_content,
    subtype=MessageType.html)

  fm = FastMail(conf)

  try:
    await fm.send_message(message)
  except Exception as e:
    raise HTTPException(status_code=500, detail="Email could not be sent")

  # background_tasks.add_task(fm.send_message, message, './_confirmation_template.html')

  return {"message": "Email has been sent"}
