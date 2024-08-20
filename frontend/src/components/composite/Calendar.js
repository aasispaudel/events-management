"use client"

import { TimezoneContext } from "@/app/Providers"
import fetchHolidays from "@/lib/api/fetch-holidays"
import fetchEvents from "@/lib/api/fetch-user-events"
import { DAYS_OF_WEEK } from "@/lib/constants"
import { CalendarDate, toCalendarDate } from "@internationalized/date"
import { Button } from "@nextui-org/react"
import { useAsyncList } from "@react-stately/data"
import { useContext, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "../icons/chevron"
import SelectCountries from "../simple/SelectCountries"
import SingleDateBlock from "./SingleDateBlock"

const REAL_HOLIDAY_FETCH = false

export function Calendar() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const holidays = useAsyncList({
    async load(signal) {
      let { data, error } = await fetchHolidays({
        fetchornot: REAL_HOLIDAY_FETCH,
        country: "US",
        year: currentYear,
        signal,
      })

      return { items: data }
    },
  })

  const events = useAsyncList({
    async load(signal) {
      let { data, error } = await fetchEvents({
        month: currentMonth + 1,
        year: currentYear,
        signal,
      })

      return { items: data }
    },
  })

  const findAllHolidays = (day) => {
    const foundHolidays = holidays.items.filter((holiday) => {
      return (
        holiday.date.compare(
          new CalendarDate(currentYear, currentMonth + 1, day)
        ) === 0
      )
    })

    return foundHolidays
  }

  const findAllEvents = (day) => {
    const foundEvents = events.items.filter((event) => {
      return (
        toCalendarDate(event.eventFrom).compare(
          new CalendarDate(currentYear, currentMonth + 1, day)
        ) === 0
      )
    })

    return foundEvents
  }

  const { currentTimezone } = useContext(TimezoneContext)

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-x-4 items-center w-full">
          <div className="text-lg font-medium">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
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
              day={day}
              currentMonth={currentMonth}
              currentYear={currentYear}
              holidays={findAllHolidays(day)}
              events={findAllEvents(day)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
