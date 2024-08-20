import { EventTypes } from "@/lib/constants"
import clsx from "clsx"
import { motion } from "framer-motion"
import { useCallback } from "react"
import { GoDotFill } from "react-icons/go"

const CHAR_LENGTH_MAP = {
  lg: 12,
  md: 8,
  sm: 4,
}

const MyEvent = ({
  setPopoverOpen,
  type,
  title,
  id,
  setTriggerEvent,
  event_from,
  event_to,
  participants,
}) => {
  /**
   * Note that event parameter on this funciton is different from our event which are created events or holidays
   * For example in setTriggerEvent: event is a holiday or created event which triggers the popver
   * In onClick(event), event is click event from browser
   *
   * @param {clickEvent} event
   */
  const onClick = (event) => {
    console.log("Event is being fired")

    setPopoverOpen(false)
    event.preventDefault()
    event.stopPropagation()

    setTriggerEvent({ title, type, id, event_from, event_to, participants })
    setPopoverOpen(true)
  }

  const getFormattedTitle = useCallback((title, type = "lg") => {
    if (title.length <= CHAR_LENGTH_MAP[type]) {
      return title
    } else {
      return `${title.slice(0, CHAR_LENGTH_MAP[type])}..`
    }
  }, [])

  return (
    <motion.div
      className="text-sm flex items-center gap-x-1"
      whileHover={{ scale: 1.05 }}
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
      <div className="block md:hidden">{""}</div>
      <div className="hidden md:block lg:hidden">
        {getFormattedTitle(title, "sm")}
      </div>
      <div className="hidden lg:block xl:hidden">
        {getFormattedTitle(title, "md")}
      </div>
      <div className="hidden xl:block">{getFormattedTitle(title, "lg")}</div>
    </motion.div>
  )
}

export default MyEvent
