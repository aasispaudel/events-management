import { cn } from "@/lib/utils"
// import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { EventTypes } from "@/lib/constants"
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import clsx from "clsx"
import { motion } from "framer-motion"
import { useState } from "react"
import EventPicker from "./EventPicker"
import HolidayDetail from "./HolidayDetail"
import MyEvent from "./MyEvent"

const SingleDateBlock = ({
  todayDate,
  blockDate,
  holidays,
  events,
  revalidateEvents,
}) => {
  const isToday = () =>
    blockDate.day === todayDate.day &&
    blockDate.month === todayDate.month &&
    blockDate.year === todayDate.year

  const [triggerEvent, setTriggerEvent] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      size="lg"
      className="w-[25rem] md:w-[30rem] h-full"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      placement="right"
    >
      <PopoverTrigger className="w-full">
        <motion.div
          key={blockDate.day}
          className={cn(
            `text-center bg-default h-[100%] rounded-lg text-lg font-medium p-4 aspect-square
       hover:bg-default hover:cursor-pointer dark:hover:bg-default-300`,
            {
              "bg-success-400 dark:bg-success-400 tex-xs": isToday(),
            }
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true)
            setTriggerEvent({ type: "new" })
          }}
        >
          <div className="flex flex-col w-full items-start gap-y-1">
            <div className="flex justify-center items-center w-full">
              {blockDate.day}
              <span className={clsx("text-sm ml-2", { hidden: !isToday() })}>
                (Today)
              </span>
            </div>
            {holidays.map((holiday) => (
              <MyEvent
                key={holiday.id}
                setPopoverOpen={setIsOpen}
                setTriggerEvent={setTriggerEvent}
                title={holiday.name}
                type={holiday.type}
                id={holiday.div}
              />
            ))}
            {events.map((myEvent) => (
              <MyEvent
                key={myEvent.id}
                setPopoverOpen={setIsOpen}
                setTriggerEvent={setTriggerEvent}
                title={myEvent.title}
                type={myEvent.type}
                id={myEvent.id}
                participants={myEvent.participants}
                event_from={myEvent.event_from}
                event_to={myEvent.event_to}
              />
            ))}
          </div>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="bg-slate-100 dark:bg-neutral-900 border-none w-[25rem] md:w-[30rem] rounded-lg">
        {triggerEvent ? (
          triggerEvent.type === EventTypes.personal ? (
            <EventPicker
              date={blockDate}
              eventValues={triggerEvent}
              nullifyTriggerEvent={() => setTriggerEvent(null)}
              revalidateEvents={revalidateEvents}
            />
          ) : triggerEvent.type === "new" ? (
            <EventPicker
              date={blockDate}
              nullifyTriggerEvent={() => setTriggerEvent(null)}
              revalidateEvents={revalidateEvents}
            />
          ) : (
            <HolidayDetail
              title={triggerEvent.title}
              type={triggerEvent.type}
            />
          )
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export default SingleDateBlock
