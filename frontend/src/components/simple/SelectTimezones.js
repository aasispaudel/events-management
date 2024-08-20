"use client"

import { TimezoneContext } from "@/app/Providers"
import { fastApiUrl } from "@/lib/env"
import { makeReadableOffset } from "@/lib/misc/make-readable-offset"
import { Select, SelectItem } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"

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

        const res = await fetch(`${fastApiUrl}/timezones/${countryCode}`)

        const data = await res.json()

        if (!res.ok || data?.length <= 0) {
          setTimezones([])
          return
        }
        setTimezones(data)
        setSelectedTimezone("America/New_York")
      } catch (error) {
        console.log({ error })

        setTimezones([])
      }
    })()
  }, [countryCode])

  return (
    <Select
      size="sm"
      label="Timezone"
      items={timezones}
      selectedKeys={[selectedTimezone]}
      onChange={onItemSelect}
      selectionMode="single"
    >
      {(tz) => (
        <SelectItem key={tz.name} textValue={tz.name}>
          <div className="flex w-full justify-between">
            <div> {tz.name}</div>
            <div>{makeReadableOffset(tz.offset)}</div>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}

export default SelectTimezones
