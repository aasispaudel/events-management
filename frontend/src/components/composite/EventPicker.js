"use client"

import addQuestionSchema from "@/lib/schema/event-picker-schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { Time } from "@internationalized/date"
import { Button, Input, Textarea, TimeInput } from "@nextui-org/react"
import { useState } from "react"
import { useForm } from "react-hook-form"

const EventPicker = ({ titleProps }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addQuestionSchema) })

  const [from, setFrom] = useState(new Time())
  const [to, setTo] = useState(new Time())

  const setTimeFrom = (value) => {
    setFrom(value)
    setValue("from", value)
  }
  const setTimeTo = (value) => {
    setTo(value)
    setValue("to", value)
  }

  const onSubmit = (d) => {
    console.log({ d })
  }

  return (
    <form
      className="px-2 py-3 w-full flex flex-col gap-y-2 text-black dark:text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-lg my-4" {...titleProps}>
        New Event
      </div>
      <Input
        size="lg"
        {...register("title")}
        labelPlacement="outside"
        label="Title"
        placeholder="I am going on a trip"
        isRequired
        variant="underlined"
        type="text"
      />
      <Textarea
        size="lg"
        {...register("description")}
        labelPlacement="outside"
        label="Description"
        placeholder="I am going on a trip"
        variant="underlined"
        type="text"
      />
      <div className="flex w-full">
        <TimeInput
          value={from}
          onChange={setTimeFrom}
          type="time"
          isRequired
          label="From"
          variant="underlined"
        />
        <TimeInput
          value={to}
          onChange={setTimeTo}
          type="time"
          isRequired
          label="To"
          variant="underlined"
        />
      </div>

      <Button
        size="sm"
        variant="ghost"
        color="success"
        className="mt-4"
        type="submit"
      >
        Create Event
      </Button>
    </form>
  )
}

export default EventPicker
