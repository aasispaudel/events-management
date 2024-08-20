import { EventTypes } from "../constants"
import { fastApiUrl } from "../env"

const fetchEvents = async ({ month, year }) => {
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
  const f = events.map((event) => {
    return {
      ...event,
      type: EventTypes.personal,
      participants: event.participants ? event.participants : [],
    }
  })
  return f
}

export default fetchEvents
