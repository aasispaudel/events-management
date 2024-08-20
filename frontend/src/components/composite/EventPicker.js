"use client"

import { addEvent } from "@/lib/api/add-event"
import addQuestionSchema from "@/lib/schema/event-picker-schema"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  getLocalTimeZone,
  now,
  toTime,
  ZonedDateTime,
} from "@internationalized/date"
import { Button, Input, Textarea, TimeInput } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Participants from "./Participants"

const EventPicker = ({ date }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addQuestionSchema),
    defaultValues: { participants: [] },
  })

  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [currentParticipant, setCurrentParticipant] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let from = now(getLocalTimeZone()).add({ minutes: 15 })
    from = new ZonedDateTime(
      date.year,
      date.month,
      date.day,
      from.timeZone,
      from.offset,
      from.hour,
      from.minute,
      from.second
    )

    console.log({ from })

    const to = from.add({ minutes: 30 })
    setFrom(toTime(from))
    setTo(toTime(to))

    setValue("event_from", from.toAbsoluteString())
    setValue("event_to", to.toAbsoluteString())
  }, [])

  const setTimeFrom = (value) => {
    console.log({ value })

    setFrom(value)
    setValue("event_from", value.toAbsoluteString())
  }
  const setTimeTo = (value) => {
    setTo(value)
    setValue("event_to", value.toAbsoluteString())
  }

  const onSubmit = async (d) => {
    setLoading(true)
    const { data, error } = await addEvent({ myEvent: d })
    if (error) {
      toast.error("Error adding event. Try later.")
      setLoading(false)
      return
    }

    toast.success(`Successfully added your event ${data.title}`)
    setLoading(false)
  }

  const addParticipant = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      console.log("Value changed", event.target.value)
      setValue("participants", [...watch("participants"), event.target.value])
      setCurrentParticipant("")
    }
  }

  console.log({ errors })

  return (
    <form
      className="px-2 w-full flex flex-col gap-y-2 text-black
       dark:text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-lg my-4">New Event</div>
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
      <Button
        size="sm"
        variant="ghost"
        color="success"
        className="mt-4"
        type="submit"
        isLoading={loading}
      >
        Create Event
      </Button>
    </form>
  )
}

export default EventPicker
