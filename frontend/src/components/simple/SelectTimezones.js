"use client"

import { TimezoneContext } from "@/app/Providers"
import { fetchTimeZonesWithCode } from "@/lib/api/fetch-timezones-with-code"
import { makeReadableOffset } from "@/lib/misc/make-readable-offset"
import { Select, SelectItem } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

const SelectTimezones = ({ countryCode }) => {
  const [timezones, setTimezones] = useState([])
  const { setCurrentTimezone } = useContext(TimezoneContext)

  const [selectedTimezone, setSelectedTimezone] = useState()
  const onItemSelect = (e) => {
    const value = e.target.value
    if (value === "") return
    setSelectedTimezone(value)
  }

  useEffect(() => {
    if (selectedTimezone) {
      setCurrentTimezone({
        name: selectedTimezone,
        offset: timezones.find((tz) => tz.name === selectedTimezone).offset,
      })
    }
  }, [selectedTimezone])

  useEffect(() => {
    ;(async () => {
      try {
        if (countryCode.length !== 2) {
          setTimezones([])
        }

        const { data } = await fetchTimeZonesWithCode(countryCode)
        setTimezones(data)
        setSelectedTimezone(data[0].name)
      } catch (error) {
        console.log({ error })

        toast.warning("No timezones for this country supported", {
          description: "Using default timezone: 'America/New_York'",
        })

        setTimezones(["America/New_York"])
      }
    })()
  }, [countryCode])

  return (
    <Select
      className="dark:text-white text-black"
      size="sm"
      label="Timezone"
      items={timezones}
      selectedKeys={[selectedTimezone]}
      onChange={onItemSelect}
      selectionMode="single"
    >
      {(tz) => (
        <SelectItem key={tz.name} textValue={tz.name}>
          <div className="flex w-full justify-between text-black dark:text-white">
            <div> {tz.name}</div>
            <div>{makeReadableOffset(tz.offset)}</div>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}

export default SelectTimezones
