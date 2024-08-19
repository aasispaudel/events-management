import * as Yup from "yup"

const addQuestionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
})

export default addQuestionSchema
