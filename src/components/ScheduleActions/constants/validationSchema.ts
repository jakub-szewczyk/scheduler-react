import { object, string } from 'yup'

const validationSchema = object().shape({
  name: string().required('Required'),
})

export default validationSchema
