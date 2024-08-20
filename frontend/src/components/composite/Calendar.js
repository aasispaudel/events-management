"use client"

import { CountryContext, TimezoneContext } from "@/app/Providers"
import fetchHolidays from "@/lib/api/fetch-holidays"
import fetchEvents from "@/lib/api/fetch-user-events"
import { DAYS_OF_WEEK } from "@/lib/constants"
import {
  CalendarDate,
  endOfMonth,
  getLocalTimeZone,
  parseAbsolute,
  startOfMonth,
  toCalendarDate,
  today,
} from "@internationalized/date"
import { Button } from "@nextui-org/react"
import { useAsyncList } from "@react-stately/data"
import { useContext, useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "../icons/chevron"
import SelectCountries from "../simple/SelectCountries"
import SingleDateBlock from "./SingleDateBlock"

const REAL_HOLIDAY_FETCH = false

export function Calendar() {
  const { currentTimezone } = useContext(TimezoneContext)
  const { country: selectedGlobalCountry } = useContext(CountryContext)

  const [todayDate, setTodayDate] = useState(today(getLocalTimeZone()))

  useEffect(() => {
    if (currentTimezone) {
      setTodayDate(today(currentTimezone.name))
    }
  }, [currentTimezone])

  const [currentMonth, setCurrentMonth] = useState(todayDate.month)
  const [currentYear, setCurrentYear] = useState(todayDate.year)

  // Calculate days in the current month
  const start = startOfMonth(new CalendarDate(currentYear, currentMonth, 1))
  const end = endOfMonth(start)
  const daysInMonth = end.day

  // Get the day of the week for the first day of the month
  // Need to - 1 because in native Date, date starts from 0, in internationlized/date date starts from 1
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay()

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Holidays list
  const holidays = useAsyncList({
    async load(signal) {
      let { data, error } = await fetchHolidays({
        fetchornot: REAL_HOLIDAY_FETCH,
        country: selectedGlobalCountry,
        year: currentYear,
        signal,
      })

      return { items: data }
    },
  })
  // Modify holiday list with country change
  useEffect(() => {
    holidays.reload()
  }, [selectedGlobalCountry])

  // User events list
  const events = useAsyncList({
    async load(signal) {
      let { data, error } = await fetchEvents({
        month: currentMonth,
        year: currentYear,
      })

      return { items: data }
    },
  })
  // Modify user-events when timezone is changed

  const findAllHolidays = (day) => {
    const foundHolidays = holidays.items.filter((holiday) => {
      return (
        holiday.date.compare(
          new CalendarDate(currentYear, currentMonth, day)
        ) === 0
      )
    })

    return foundHolidays
  }

  const findAllEvents = (day) => {
    const foundEvents = events.items.filter((event) => {
      return (
        toCalendarDate(
          parseAbsolute(event.event_from, currentTimezone.name)
        ).compare(new CalendarDate(currentYear, currentMonth, day)) === 0
      )
    })

    return foundEvents
  }

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-x-4 items-center w-full">
          <div className="text-lg font-medium">
            {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>

          <SelectCountries />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handlePreviousMonth}
            isIconOnly
            className="hover:bg-success"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleNextMonth}
            isIconOnly
            className="hover:bg-success"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => i + 1).map((day) => (
          <div key={`empty-${day}`} className="text-center text-sm"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div key={day}>
            <SingleDateBlock
              todayDate={todayDate}
              blockDate={new CalendarDate(currentYear, currentMonth, day)}
              holidays={findAllHolidays(day)}
              events={findAllEvents(day)}
              revalidateEvents={() => {
                events.reload()
              }}
              addEvent={(event) => {
                events.append(event)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
