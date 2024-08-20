# Configuration for FastAPI-Mail
from enum import Enum
from pytz import utc
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from dotenv import load_dotenv
import os
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel
from datetime import timedelta, datetime
from app.events.models import CreateEventRequest
from app.scheduler.scheduler import scheduler

load_dotenv()

class EmailBody(BaseModel):
  subject: str
  event_name: str
  event_date: str
  event_time: str

class SendEmailType(Enum):
  confirmation = 'confirmation'
  reminder = 'reminder'


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

'''Only for testing purposes
Remove once the testing is complete'''
@router.post('/schedule')
async def send_email_api(event_model: CreateEventRequest):
  scheduled_time = event_model.event_from - timedelta(minutes=1)

  scheduler.add_job(
    send_email,
    'date',
    run_date=scheduled_time,
    args=[
      EmailBody(
        subject=f'Event: {event_model.title} reminder',
        event_name=event_model.title,
        event_date=event_model.event_from.strftime('%Y-%m-%d'),
        event_time=event_model.event_from.strftime('%H:%M'),
      ), SendEmailType.reminder
    ]
  )

  return {'Success': event_model.event_from - timedelta(minutes=1)}

async def send_email_sample():
  print('Sending email')
  fm = FastMail(conf)
  message = MessageSchema(
    subject='subject',
    recipients=['aasispaudelthp2@gmail.com'],
    body='This is ample test body',
    subtype=MessageType.plain)

  await fm.send_message(message)

  print('email sending added')

'''
 Sends email with two types of templates
 Confirmation and Reminder for events
 Has extra print statement to act as logger for review
'''

async def send_email(email: EmailBody,
                     send_email_type: SendEmailType):
  print(f'Creating {send_email_type} email')
  template = '_confirmation_template.html' if send_email_type == SendEmailType.confirmation \
    else '_reminder_template.html'
  template = env.get_template(template)
  email_content = template.render(
    event_name=email.event_name,
    event_date=email.event_date,
    event_time=email.event_time
  )

  message = MessageSchema(
    subject=email.subject,
    recipients=['aasispaudelthp2@gmail.com'],
    body=email_content,
    subtype=MessageType.html)

  fm = FastMail(conf)

  print('Ready to send email')
  try:
    await fm.send_message(message)
    print('Email sent successfully')
  except Exception as e:
    print('Could not send email')


  return {"message": "Email has been sent"}
