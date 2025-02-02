import { createContext } from 'react'

import { IdleWithdrawActions, IdleWithdrawState } from './WithdrawCommon'

interface IWithdrawContext {
  state: IdleWithdrawState | null
  dispatch: React.Dispatch<IdleWithdrawActions> | null
}

export const WithdrawContext = createContext<IWithdrawContext>({ state: null, dispatch: null })
