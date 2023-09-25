import { object, string } from 'yup'

const validationSchema = object().shape({
  name: string().trim().required('Required'),
  description: string().trim(),
})

export default validationSchema
