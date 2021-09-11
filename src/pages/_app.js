import '@styles/globals.scss'
import Layout from '@components/Layout'
import { SnipcartProvider } from '@hooks/use-snipcart'

function MyApp({ Component, pageProps }) {
  return (
    <SnipcartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SnipcartProvider>
  )
}

export default MyApp
