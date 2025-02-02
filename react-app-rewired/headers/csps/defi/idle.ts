import type { Csp } from '../../types'

export const csp: Csp = {
  'connect-src': [
    'https://api.idle.finance',
    'https://api-polygon.idle.finance',
    'https://api.thegraph.com/subgraphs/name/samster91/idle-tranches',
    'https://raw.githubusercontent.com/Idle-Labs/idle-dashboard/',
    'https://api.github.com/repos/Idle-Labs/Idle-Labs/idle-dashboard',
  ],
  'img-src': [
    'https://rawcdn.githack.com/Idle-Labs/idle-dashboard/',
    'https://raw.githack.com/Idle-Labs/idle-dashboard/',
    'https://app.idle.finance/images/tokens/',
    'https://raw.githubusercontent.com/Idle-Labs/idle-dashboard/',
  ],
}
