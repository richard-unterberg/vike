// LA_TEMP

export { onBeforePrerenderStart }

import { someCondition } from './someCondition'

const onBeforePrerenderStart = someCondition()
  ? async () => {
      console.log('LA_TEMP')
      return ['/about']
    }
  : null
