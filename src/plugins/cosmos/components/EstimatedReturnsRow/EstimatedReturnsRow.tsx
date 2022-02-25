import { Box } from '@chakra-ui/layout'
import { Amount } from 'components/Amount/Amount'
import { Row } from 'components/Row/Row'
import { Text } from 'components/Text'

type EstimatedReturnsRowProps = {
  assetSymbol: string
  cryptoYield: string
  fiatYield: string
}
export const EstimatedReturnsRow = ({
  assetSymbol,
  cryptoYield,
  fiatYield
}: EstimatedReturnsRowProps) => (
  <Row px={4} py={4}>
    <Row.Label>
      <Text translation='modals.deposit.estimatedReturns' />
    </Row.Label>
    <Row.Value>
      <Box textAlign='right'>
        <Amount.Fiat value={fiatYield} fontWeight='bold' lineHeight='1' mb={1} />
        <Amount.Crypto value={cryptoYield} symbol={assetSymbol} color='gray.500' lineHeight='1' />
      </Box>
    </Row.Value>
  </Row>
)
