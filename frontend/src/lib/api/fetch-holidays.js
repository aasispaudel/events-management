import { parseDate } from "@internationalized/date"
import { EventTypes } from "../constants"
import { sampleHolidays } from "./sample-holidays"

const fetchHolidays = async ({ fetchornot, country, year, signal }) => {
  // Not to burn free apis while hot reload because there is a limit
  // and it counts faster than actual requests 🙃
  if (!fetchornot) {
    try {
      return { data: formatHolidays(sampleHolidays.holidays) }
    } catch (e) {
      console.log({ error: e })

      return { data: [], error: e }
    }
  }

  const url = new URL("https://holidayapi.com/v1/holidays")
  const params = {
    country,
    year,
    pretty: "true",
    key: "f42ac06c-5777-4399-afb5-6e15a24565c5",
  }

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  )

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return { data: formatHolidays(data.holidays) }
  } catch (error) {
    console.log({ error })
    return { data: [], error }
  }
}

const formatHolidays = (holidays) => {
  return holidays.map((holiday) => {
    const parsedDate = parseDate(holiday.date)
    return {
      id: holiday.uuid,
      date: parsedDate.set({ year: 2024 }),
      name: holiday.name,
      type: holiday.public === true ? EventTypes.holiday : EventTypes.important,
    }
  })
}

export default fetchHolidays
