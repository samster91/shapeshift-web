import { ChainId } from '@shapeshiftoss/caip'

export enum DefiType {
  Pool = 'pool',
  Vault = 'vault',
  Staking = 'staking',
  Farming = 'farming',
  TokenStaking = 'token_staking',
}

export enum DefiProvider {
  Idle = 'idle',
  Yearn = 'yearn',
  ShapeShift = 'ShapeShift',
  Cosmos = 'Cosmos',
  Osmosis = 'Osmosis',
}

export enum DefiAction {
  Overview = 'overview',
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  GetStarted = 'get-started',
  Claim = 'claim',
}

export enum DefiStep {
  Info = 'info',
  Approve = 'approve',
  Confirm = 'confirm',
  Status = 'status',
}

export enum Templates {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  Overview = 'overview',
}

export type DefiParams = {
  provider: DefiProvider
  earnType: DefiType
  action: DefiAction
}

export type DefiQueryParams = {
  chainId: ChainId
  contractAddress: string
  assetReference: string
  rewardId: string
  modal: string
  provider: string
}

export type DefiManagerProviderProps = {
  children: React.ReactNode
}

export type DefiManagerContextProps = {
  open(): void
  close(): void
}
