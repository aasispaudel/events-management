from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from typing import Optional
from sqlalchemy import DateTime, ARRAY, String


class Base(DeclarativeBase):
  pass


class Event(Base):
  __tablename__ = 'event'

  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  title: Mapped[str]
  event_from = mapped_column(DateTime(timezone=True))
  event_to = mapped_column(DateTime(timezone=True))
  description: Mapped[Optional[str]]
  participants: Mapped[list[str]] = mapped_column(ARRAY(String))
