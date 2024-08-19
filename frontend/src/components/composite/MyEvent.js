import { EventTypes } from "@/lib/constants"
import clsx from "clsx"
import { motion } from "framer-motion"
import { useCallback } from "react"
import { GoDotFill } from "react-icons/go"

const MyEvent = ({ setPopoverOpen, type, title, setTriggerEvent }) => {
  /**
   * Note that event parameter on this funciton is different from our event which are created events or holidays
   * For example in setTriggerEvent: event is a holiday or created event which triggers the popver
   * In onClick(event), event is click event from browser
   *
   * @param {clickEvent} event
   */
  const onClick = (event) => {
    setPopoverOpen(false)
    event.preventDefault()
    event.stopPropagation()

    setTriggerEvent({ title, type })
    setPopoverOpen(true)
    console.log("Event clicked")
  }

  const getFormattedTitle = useCallback((title) => {
    if (title.length <= 12) {
      return title
    } else {
      return `${title.slice(0, 12)}..`
    }
  }, [])

  return (
    <motion.div
      className="text-sm flex items-center gap-x-2"
      whileHover={{ scale: 1.3 }}
      onClick={(event) => {
        onClick(event)
      }}
    >
      <GoDotFill
        color={clsx({
          "#F31260": type === EventTypes.holiday,
          "#F5A524": type === EventTypes.important,
          "#006FEE": type === EventTypes.personal,
        })}
      />
      <div>{getFormattedTitle(title)}</div>
    </motion.div>
  )
}

export default MyEvent
