"use client"

import { DAYS_OF_WEEK } from "@/lib/constants"
import useGetHolidays from "@/lib/hooks/useGetHolidays"
import { CalendarDate } from "@internationalized/date"
import { Button } from "@nextui-org/react"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "../icons/chevron"
import SingleDateBlock from "./SingleDataBlock"

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

  const { holidays } = useGetHolidays({ country: "US", year: currentYear })

  const findAllHolidays = (day) => {
    const foundHolidays = holidays.filter((holiday) => {
      return (
        holiday.date.compare(
          new CalendarDate(currentYear, currentMonth + 1, day)
        ) === 0
      )
    })

    return foundHolidays
  }

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-medium">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
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
          <SingleDateBlock
            day={day}
            currentMonth={currentMonth}
            currentYear={currentYear}
            holidays={findAllHolidays(day)}
          />
        ))}
      </div>
    </div>
  )
}
