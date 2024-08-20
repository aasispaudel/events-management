import * as Yup from "yup"

const addQuestionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  event_from: Yup.string()
    .required("Event from is required")
    .test("is-valid-datetime", "Event from must be a valid time", (value) => {
      return !isNaN(Date.parse(value))
    }),
  event_to: Yup.string()
    .required("Event to is required")
    .test("is-valid-datetime", "Event to must be a valid time", (value) => {
      return !isNaN(Date.parse(value))
    })
    .test(
      "is-greater",
      "End event must be greater than Start event",
      function (value) {
        const { event_from } = this.parent
        return event_from && value
          ? new Date(value) > new Date(event_from)
          : true
      }
    ),
  participants: Yup.array()
    .of(Yup.string().email("Invalid email format"))
    .test("is-valid", "Invalid email format for participants", (value) => {
      if (!value) return true // Allow empty list
      return value.every((email) => Yup.string().email().isValidSync(email))
    }),
})

export default addQuestionSchema
