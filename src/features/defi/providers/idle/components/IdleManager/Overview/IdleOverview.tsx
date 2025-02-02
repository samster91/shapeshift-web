import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { Center, useToast } from '@chakra-ui/react'
import { toAssetId } from '@shapeshiftoss/caip'
import { ClaimableToken, IdleOpportunity } from '@shapeshiftoss/investor-idle'
import { Overview } from 'features/defi/components/Overview/Overview'
import {
  DefiAction,
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { useIdle } from 'features/defi/contexts/IdleProvider/IdleProvider'
import { useEffect, useState } from 'react'
import { useTranslate } from 'react-polyglot'
import { CircularProgress } from 'components/CircularProgress/CircularProgress'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'
import { useWalletAddress } from 'hooks/useWalletAddress/useWalletAddress'
import { bnOrZero } from 'lib/bignumber/bignumber'
import { useGetAssetDescriptionQuery } from 'state/slices/assetsSlice/assetsSlice'
import {
  selectAssetById,
  selectMarketDataById,
  selectPortfolioCryptoBalanceByAssetId,
  selectSelectedLocale,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

export const IdleOverview = () => {
  const { idle: api } = useIdle()
  const translate = useTranslate()
  const toast = useToast()
  const { query } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const [opportunity, setOpportunity] = useState<IdleOpportunity | null>(null)
  const [claimableTokens, setClaimableTokens] = useState<ClaimableToken[]>([])
  const { chainId, contractAddress: vaultAddress, assetReference } = query

  const assetNamespace = 'erc20'
  const assetId = toAssetId({ chainId, assetNamespace, assetReference })
  const vaultTokenId = toAssetId({
    chainId,
    assetNamespace,
    assetReference: vaultAddress,
  })
  const asset = useAppSelector(state => selectAssetById(state, vaultTokenId))
  const underlyingToken = useAppSelector(state => selectAssetById(state, assetId))
  const marketData = useAppSelector(state => selectMarketDataById(state, assetId))
  // user info
  const balance = useAppSelector(state =>
    selectPortfolioCryptoBalanceByAssetId(state, { assetId: vaultTokenId }),
  )

  const cryptoAmountAvailable = bnOrZero(balance).div(`1e${asset.precision}`)
  const fiatAmountAvailable = bnOrZero(cryptoAmountAvailable).times(marketData.price)

  const selectedLocale = useAppSelector(selectSelectedLocale)
  const descriptionQuery = useGetAssetDescriptionQuery({ assetId, selectedLocale })

  const walletAddress = useWalletAddress('0x0000000000000000000000000000000000000000')

  useEffect(() => {
    ;(async () => {
      try {
        if (!(vaultAddress && api)) return
        const [opportunity] = await Promise.all([
          api.findByOpportunityId(
            toAssetId({ chainId, assetNamespace, assetReference: vaultAddress }),
          ),
        ])
        if (!opportunity) {
          return toast({
            position: 'top-right',
            description: translate('common.somethingWentWrongBody'),
            title: translate('common.somethingWentWrong'),
            status: 'error',
          })
        }
        setOpportunity(opportunity)

        const claimableTokens = await opportunity.getClaimableTokens(walletAddress)
        setClaimableTokens(claimableTokens)
      } catch (error) {
        // TODO: handle client side errors
        console.error('IdleOverview error:', error)
      }
    })()
  }, [api, vaultAddress, chainId, toast, translate, walletAddress])

  const additionalParams: Record<string, any> = {}

  useAppSelector(selectorState => {
    if (claimableTokens && claimableTokens.length > 0) {
      let rewardAssets: any[] = []
      claimableTokens.forEach(token => {
        const rewardAsset = selectAssetById(selectorState, token.assetId)
        if (rewardAsset) {
          rewardAssets.push({
            ...rewardAsset,
            cryptoBalance: bnOrZero(token.amount).div(`1e+${asset.precision}`).toPrecision(),
          })
        }
      })

      additionalParams.rewardAssets = rewardAssets
    }
  })

  if (!opportunity) {
    return (
      <Center minW='500px' minH='350px'>
        <CircularProgress />
      </Center>
    )
  }

  const menu = [
    {
      label: 'common.deposit',
      icon: <ArrowUpIcon />,
      action: DefiAction.Deposit,
    },
    {
      label: 'common.withdraw',
      icon: <ArrowDownIcon />,
      action: DefiAction.Withdraw,
    },
  ]

  if (!opportunity.metadata.cdoAddress) {
    menu.push({
      label: 'common.claim',
      icon: <ArrowDownIcon />,
      action: DefiAction.Claim,
    })
  }

  return (
    <Overview
      asset={asset}
      name={`${underlyingToken.name} Vault (${opportunity.version})`}
      opportunityFiatBalance={fiatAmountAvailable.toFixed(2)}
      underlyingAssets={[
        {
          ...underlyingToken,
          cryptoBalance: cryptoAmountAvailable.toPrecision(),
          allocationPercentage: '1',
        },
      ]}
      provider='Idle Finance'
      description={{
        description: underlyingToken.description,
        isLoaded: !descriptionQuery.isLoading,
        isTrustedDescription: underlyingToken.isTrustedDescription,
      }}
      tvl={opportunity.tvl.balanceUsdc.toFixed(2)}
      apy={opportunity.apy.toString()}
      menu={menu}
      {...additionalParams}
    />
  )
}
