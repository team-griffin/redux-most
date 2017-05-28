import { just } from 'most'
import {
  curriedChain as chain,
  curriedDelay as delay,
  curriedMap as map,
  curriedMerge as merge,
} from '../utils'
import { push } from 'react-router-redux'
import { CHECKED_ADMIN_ACCESS } from '../constants/ActionTypes'
import { accessDenied } from '../actions'
import { select } from 'redux-most'
// import { select } from '../../../src/index'

// Fluent style
// const adminAccess = action$ =>
//   action$.thru(select(CHECKED_ADMIN_ACCESS))
//     // If you wanted to do an actual access check you
//     // could do so here and then filter by failed checks.
//     .delay(800)
//     .chain(_ =>
//       merge(
//         just(accessDenied()),
//         just().delay(800).map(_ => push('/'))
//       )
//     )

// Functional style
const adminAccess = action$ => {
  const checkedAdminAccess$ = select(CHECKED_ADMIN_ACCESS, action$)
  // If you wanted to do an actual access check you
  // could do so here and then filter by failed checks.
  const delayedCheckedAdminAccess$ = delay(800, checkedAdminAccess$)
  const redirectToRoot$ = map(_ => push('/'), delay(800, just()))
  const denyAndRedirect = _ => merge(just(accessDenied()), redirectToRoot$)
  return chain(denyAndRedirect, delayedCheckedAdminAccess$)
}

export default adminAccess
