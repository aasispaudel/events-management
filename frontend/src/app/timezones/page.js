"use client"

import { useEffect, useState } from "react"

const page = () => {
  const [timezones, setTimezones] = useState()

  useEffect(() => {
    const timezoneWork = () => {
      // Retrieve available timezones
      const timezones = Intl.supportedValuesOf("timeZone")

      // Mapping of country codes to timezones
      const countryTimezoneMap = {}

      timezones.forEach((tz) => {
        // Get the country code from the timezone
        const parts = tz.split("/")
        if (parts.length > 1) {
          const countryCode = parts[0] // e.g., "America" -> "US"

          // Add timezone to the corresponding country code
          if (!countryTimezoneMap[countryCode]) {
            countryTimezoneMap[countryCode] = []
          }
          countryTimezoneMap[countryCode].push(tz)
        }
      })

      return countryTimezoneMap
    }

    setTimezones(timezoneWork())
  }, [])

  return <div className="flex justify-center mt-20">{"hello"}</div>
}

export default page
