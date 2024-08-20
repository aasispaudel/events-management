"use client"

import { getLocalTimeZone, now } from "@internationalized/date"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider } from "next-themes"
import { createContext, useState } from "react"

const time = now(getLocalTimeZone())
export const TimezoneContext = createContext()
export const CountryContext = createContext(null)

/**
 *
 * @provides NextUI, ThemeProvider, TimezoneContext.Provier, CountryContext.Providerr
 */
const Providers = ({ children }) => {
  const [currentTimezone, setCurrentTimezone] = useState({
    name: time.timeZone,
    offset: time.offset,
  })

  const [country, setCountry] = useState()

  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <NextUIProvider>
        <CountryContext.Provider value={{ country, setCountry }}>
          <TimezoneContext.Provider
            value={{ currentTimezone, setCurrentTimezone }}
          >
            {children}
          </TimezoneContext.Provider>
        </CountryContext.Provider>
      </NextUIProvider>
    </ThemeProvider>
  )
}

export default Providers
