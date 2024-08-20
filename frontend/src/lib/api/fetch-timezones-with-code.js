import "client-only"

import { now } from "@internationalized/date"
import { fastApiUrl } from "../env"
import { hasValue } from "../utils"

export const fetchTimeZonesWithCode = async (code) => {
  const url = new URL(`${fastApiUrl}/timezones/${code}`)

  try {
    const response = await fetch(url)

    const data = await response.json()

    const verifiedTimezones = []
    data.forEach((tz) => {
      const verifiedTz = verifyTimezone(tz)
      if (hasValue(verifiedTz)) {
        verifiedTimezones.push(verifiedTz)
      }
    })

    if (!response.ok || verifiedTimezones.length <= 0) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { data: verifiedTimezones }
  } catch (error) {
    console.log({ error })
    return { data: [], error }
  }
}

const verifyTimezone = (tz) => {
  try {
    const current_zoned_time = now(tz.name)
    return {
      ...tz,
      offset: current_zoned_time.offset,
    }
  } catch (error) {
    return null
  }
}
