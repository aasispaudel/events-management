"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { HiMoon, HiSun } from "react-icons/hi2"

const ThemeButton = () => {
  const [mounted, setMounted] = useState(false)
  const { systemTheme, theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1 }}>
      {currentTheme === "dark" ? (
        <HiSun
          className="h-8 w-8 cursor-pointer text-white hover:text-yellow-200"
          onClick={() => {
            setTheme("light")
          }}
        />
      ) : (
        <HiMoon
          className="h-8 w-8 cursor-pointer text-slate-700 hover:text-slate-900"
          onClick={() => {
            setTheme("dark")
          }}
        />
      )}
    </motion.div>
  )
}

export default ThemeButton
