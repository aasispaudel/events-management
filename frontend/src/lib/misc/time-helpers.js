import { now } from "@internationalized/date"
import "client-only"

export function validateSelectedTimezone(timezone) {
  try {
    current_zoned_time = now(timezone)

    return {name: current_zoned_time}
  }
}
