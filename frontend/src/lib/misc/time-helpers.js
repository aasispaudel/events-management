import { ZonedDateTime } from "@internationalized/date"
import "client-only"

export function dateFrom1TimeFrom2(datetime1, datetime2, currentTimezone) {
  return new ZonedDateTime(
    datetime1.year,
    datetime1.month,
    datetime1.day,
    // Timezone specific details
    currentTimezone.name,
    currentTimezone.offset,
    // Time speicific details
    datetime2.hour,
    datetime2.minute,
    0
  )
}
