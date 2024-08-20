import { parseDate } from "@internationalized/date"
import { useEffect, useState } from "react"
import fetchHolidays from "../api/fetch-holidays"
import { EventTypes } from "../constants"

const REAL_FETCH = false

const useGetHolidays = ({ country, year = "2024" }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [holidays, setHolidays] = useState([])

  useEffect(() => {
    setLoading(true)

    fetchHolidays({ fetchornot: REAL_FETCH, country, year })
      .then(({ data }) => {
        setHolidays(formatHolidays(data.holidays))
        setError(null)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.error ? e.error : e)
        setHolidays([])
        setLoading(false)
      })
  }, [])

  return { holidays, error, loading }
}

const formatHolidays = (holidays) => {
  return holidays.map((holiday) => {
    const parsedDate = parseDate(holiday.date)
    return {
      date: parsedDate.set({ year: 2024 }),
      name: holiday.name,
      type: holiday.public === true ? EventTypes.holiday : EventTypes.important,
    }
  })
}

export default useGetHolidays
