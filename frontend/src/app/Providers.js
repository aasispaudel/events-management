"use client"

import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider } from "next-themes"

/**
 *
 * @provides NextUI, ThemeProvider
 */
const Providers = ({ children }) => {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <NextUIProvider>{children}</NextUIProvider>
    </ThemeProvider>
  )
}

export default Providers
