import { sampleHolidays } from "./sample-holidays"

const fetchHolidays = async ({ fetchornot, country, year, signal }) => {
  // Not to burn free apis while hot reload because there is a limit
  // and it counts faster than actual requests 🙃
  if (!fetchornot) {
    return { data: sampleHolidays }
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
    const response = await fetch(url, { signal })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return { data }
  } catch (error) {
    console.log({ error })
    return { error }
  }
}

export default fetchHolidays
