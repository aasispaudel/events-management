import * as Yup from "yup"

const addQuestionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  participants: Yup.array()
    .of(Yup.string().email("Invalid email format"))
    .test("is-valid", "Invalid email format for participants", (value) => {
      if (!value) return true // Allow empty list
      return value.every((email) => Yup.string().email().isValidSync(email))
    }),
})

export default addQuestionSchema
