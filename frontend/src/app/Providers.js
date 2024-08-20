"use client"

import { getLocalTimeZone, now } from "@internationalized/date"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider } from "next-themes"
import { createContext, useState } from "react"

const time = now(getLocalTimeZone())
export const TimezoneContext = createContext({
  name: time.timeZone,
  offset: time.offset,
})

/**
 *
 * @provides NextUI, ThemeProvider
 */
const Providers = ({ children }) => {
  const [currentTimezone, setCurrentTimezone] = useState()

  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <NextUIProvider>
        <TimezoneContext.Provider
          value={{ currentTimezone, setCurrentTimezone }}
        >
          {children}
        </TimezoneContext.Provider>
      </NextUIProvider>
    </ThemeProvider>
  )
}

export default Providers
