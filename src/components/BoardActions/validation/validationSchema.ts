import { object, string } from 'yup'

const validationSchema = object().shape({
  name: string().trim().required('Required'),
})

export default validationSchema
