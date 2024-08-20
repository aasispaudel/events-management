"use client"

import { deleteEvent } from "@/lib/api/event-mutations"
import { Button } from "@nextui-org/react"
import { useState } from "react"
import { toast } from "sonner"

const DeleteEvent = ({ eventId }) => {
  const [deleting, setDeleting] = useState(false)

  const onDelete = async () => {
    setDeleting(true)

    const { data, error } = await deleteEvent({ eventId })
    if (error) {
      toast.error("Could not delete now. Try later")
      setDeleting(false)
      return
    }

    toast.success("Successfully deleted your event")
    setDeleting(false)
  }

  return (
    <Button
      size="sm"
      className="w-full"
      color="danger"
      onPress={onDelete}
      isLoading={deleting}
    >
      Delete
    </Button>
  )
}

export default DeleteEvent
