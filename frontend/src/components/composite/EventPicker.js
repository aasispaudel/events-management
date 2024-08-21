"use client"

import { TimezoneContext } from "@/app/Providers"
import { addEvent, updateEvent } from "@/lib/api/event-mutations"
import { dateFrom1TimeFrom2 } from "@/lib/misc/time-helpers"
import addQuestionSchema from "@/lib/schema/event-picker-schema"
import { hasValue } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { now, parseAbsolute, toTime } from "@internationalized/date"
import { Button, Input, Textarea, TimeInput } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import DeleteEvent from "../simple/DeleteEvent"
import Participants from "./Participants"

const EventPicker = ({
  date,
  eventValues,
  nullifyTriggerEvent,
  closePicker,
  revalidateEvents,
}) => {
  const { currentTimezone } = useContext(TimezoneContext)

  const defaultValues = eventValues ? { ...eventValues } : { participants: [] }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addQuestionSchema),
    defaultValues,
  })

  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [currentParticipant, setCurrentParticipant] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let from, to, fromFormValue, toFormValue
    if (hasValue(eventValues?.event_from)) {
      from = parseAbsolute(eventValues.event_from, currentTimezone.name)
      fromFormValue = eventValues.event_from
      to = parseAbsolute(eventValues.event_to, currentTimezone.name)
      toFormValue = eventValues.event_to
    } else {
      from = now(currentTimezone.name).add({ minutes: 15 })
      from = dateFrom1TimeFrom2(date, from, currentTimezone)
      to = from.add({ minutes: 30 })
      fromFormValue = from.toAbsoluteString()
      toFormValue = to.toAbsoluteString()
    }

    setFrom(toTime(from))
    setTo(toTime(to))

    setValue("event_from", fromFormValue)
    setValue("event_to", toFormValue)

    return () => {
      nullifyTriggerEvent()
      reset()
    }
  }, [])

  const setTimeFrom = (value) => {
    setFrom(value)

    const zonedValue = value
      ? dateFrom1TimeFrom2(date, value, currentTimezone).toAbsoluteString()
      : null

    setValue("event_from", zonedValue)
  }

  const setTimeTo = (value) => {
    setTo(value)

    const zonedValue = value
      ? dateFrom1TimeFrom2(date, value, currentTimezone).toAbsoluteString()
      : null

    setValue("event_to", zonedValue)
  }

  const onSubmit = async (d) => {
    setLoading(true)
    if (eventValues) {
      await onSubmitUpdate(d)
    } else {
      await onSubmitAdd(d)
    }
    setLoading(false)
    revalidateEvents()

    // Close the popover
    closePicker()
  }

  const onSubmitUpdate = async (d) => {
    const { data, error } = await updateEvent({ myEvent: d })
    if (error) {
      console.log({ data, error })

      toast.error("Error updating event. Try later.")
      return
    }

    toast.success(`Successfully updated your event ${data.title}`)
  }

  const onSubmitAdd = async (d) => {
    const { data, error } = await addEvent({ myEvent: d })
    if (error) {
      toast.error("Error adding event. Try later.")
      return
    }

    toast.success(`Successfully added your event ${data.title}`)

    reset()
  }

  const addParticipant = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      setValue("participants", [...watch("participants"), event.target.value])
      setCurrentParticipant("")
    }
  }

  return (
    <form
      className="px-2 w-full flex flex-col gap-y-2 text-black
       dark:text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-lg my-4">
        {eventValues ? "Update Event" : "New Event"}
      </div>
      <Input
        size="sm"
        {...register("title")}
        labelPlacement="outside"
        label="Title"
        placeholder="I am going on a trip"
        isRequired
        variant="underlined"
        type="text"
      />
      <Textarea
        size="sm"
        {...register("description")}
        labelPlacement="outside"
        label="Description"
        placeholder="I am going on a trip"
        variant="underlined"
        type="text"
      />
      <div className="flex w-full">
        <TimeInput
          size="sm"
          value={from}
          onChange={setTimeFrom}
          type="time"
          isRequired
          label="From"
          variant="underlined"
        />
        <TimeInput
          size="sm"
          value={to}
          onChange={setTimeTo}
          type="time"
          isRequired
          label="To"
          variant="underlined"
        />
      </div>
      <Input
        size="sm"
        labelPlacement="outside"
        label="Participants"
        variant="underlined"
        type="text"
        onValueChange={setCurrentParticipant}
        onKeyDown={addParticipant}
        value={currentParticipant}
      />
      <Participants
        participants={watch("participants")}
        removeParticipant={(index) => {
          const p = watch("participants")
          p.splice(index, 1)
          setValue("participants", p)
        }}
      />
      {errors?.participants && (
        <p className="text-xs text-danger">{errors?.participants?.message}</p>
      )}
      {errors?.event_to && (
        <p className="text-xs text-danger">{errors?.event_to?.message}</p>
      )}
      <div className="flex w-full mt-4 items-center gap-x-5">
        {eventValues && (
          <DeleteEvent
            eventId={eventValues.id}
            revalidateEvents={revalidateEvents}
            closePicker={closePicker}
          />
        )}
        <Button
          size="sm"
          variant="ghost"
          color="success"
          className="w-full"
          type="submit"
          isLoading={loading}
        >
          {!eventValues ? "Create Event" : "Update Event"}
        </Button>
      </div>
    </form>
  )
}

export default EventPicker
