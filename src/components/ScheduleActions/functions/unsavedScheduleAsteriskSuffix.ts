import { concat, equals, when, __ } from 'ramda'

const unsavedScheduleAsteriskSuffix = when(equals('unsaved'), concat(__, '*'))

export default unsavedScheduleAsteriskSuffix
