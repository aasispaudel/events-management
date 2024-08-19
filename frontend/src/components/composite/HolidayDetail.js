import { EventTypes } from "@/lib/constants"
import { cn } from "@/lib/utils"

const HolidayDetail = ({ title, type, titleProps }) => {
  return (
    <div className="px-2 py-3 w-full flex flex-col gap-y-2 text-black dark:text-white">
      <div
        className={cn("text-lg my-4", {
          "text-danger": type === EventTypes.holiday,
          "text-warning": type === EventTypes.important,
        })}
        {...titleProps}
      >
        {`${title}`}
      </div>
    </div>
  )
}

export default HolidayDetail
