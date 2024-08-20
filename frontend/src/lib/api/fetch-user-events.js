import { parseAbsolute } from "@internationalized/date"
import { EventTypes } from "../constants"
import { fastApiUrl } from "../env"

const fetchEvents = async ({ month, year, signal }) => {
  const url = new URL(`${fastApiUrl}/api/event/all`)

  if (month) {
    url.searchParams.append("month", month)
  }
  if (year) {
    url.searchParams.append("year", year)
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return { data: formatEvents(data.events) }
  } catch (error) {
    console.log({ error })
    return { data: [], error }
  }
}

const formatEvents = (events) => {
  return events.map((event) => {
    return {
      id: event.id,
      eventFrom: parseAbsolute(event.event_from),
      eventTo: parseAbsolute(event.event_to),
      title: event.title,
      type: EventTypes.personal,
      participants: event.participants,
      description: event.description,
    }
  })
}

export default fetchEvents
