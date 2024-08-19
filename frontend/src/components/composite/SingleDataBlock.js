import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { motion } from "framer-motion"
import { useCallback, useState } from "react"
import EventPicker from "./EventPicker"
import HolidayDetail from "./HolidayDetail"
import MyEvent from "./MyEvent"

const SingleDateBlock = ({ day, currentMonth, currentYear, holidays }) => {
  const today = new Date()

  const isToday = useCallback((today) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }, [])

  const [triggerEvent, setTriggerEvent] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  if (holidays.length > 0) {
    console.log("Printing holiday from single date block", holidays)
  }

  return (
    <Popover
      size="lg"
      className="w-[25rem] md:[30rem]"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <motion.div
          key={day}
          className={cn(
            `text-center dark:bg-default rounded-lg text-lg font-medium p-4 aspect-square
       hover:bg-default hover:cursor-pointer dark:hover:bg-default-300`,
            {
              "bg-success-400 dark:bg-success-400": isToday(today),
            }
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTriggerEvent(null)
            setIsOpen(true)
          }}
        >
          <div className="flex flex-col w-full items-start gap-y-1">
            <div className="flex justify-center w-full">
              {!isToday(today) ? day : `${day} (Today)`}
            </div>
            {holidays.map((holiday) => (
              <MyEvent
                setPopoverOpen={setIsOpen}
                setTriggerEvent={setTriggerEvent}
                title={holiday.name}
                type={holiday.type}
              />
            ))}
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent>
        {(titleProps) => {
          if (triggerEvent) {
            return (
              <HolidayDetail
                title={triggerEvent.title}
                type={triggerEvent.type}
                titleProps={titleProps}
              />
            )
          }

          return <EventPicker titleProps={titleProps} />
        }}
      </PopoverContent>
    </Popover>
  )
}

export default SingleDateBlock
