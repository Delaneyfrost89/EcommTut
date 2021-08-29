import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Header from '@components/Header'
import Container from '@components/Container'
import Button from '@components/Button'
import styles from '@styles/Home.module.scss'

export default function Home({ products }) {
  return (
    <div>
      <Head>
        <title>Hyper Bros Trading Cards</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='preconnect' href='https://app.snipcart.com' />
        <link rel='preconnect' href='https://cdn.snipcart.com' />
        <link
          rel='stylesheet'
          href='https://cdn.snipcart.com/themes/v3.2.1/default/snipcart.css'
        />
      </Head>

      <Header />
      <main className={styles.main}>
        <Container>
          <h1>Hyper Bros. Trading Cards</h1>
          <h2>Available Cards</h2>
          <ul className={styles.products}>
            {products.map((product) => {
              return (
                <li key={product.product.productId}>
                  <Image
                    src={product.featuredImage.sourceUrl}
                    alt={`${product.title} Card`}
                    width={product.featuredImage.mediaDetails.width}
                    height={product.featuredImage.mediaDetails.height}
                  />
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>
                    ${product.product.productPrice}
                  </p>
                  <Button
                    className='snipcart-add-item'
                    data-item-id={product.product.productId}
                    data-item-price={product.product.productPrice}
                    data-item-url='/'
                    data-item-description={`${product.title} trading card.`}
                    data-item-image={product.featuredImage.sourceUrl}
                    data-item-name={product.title}
                  >
                    Add to Cart
                  </Button>
                </li>
              )
            })}
          </ul>
        </Container>
      </main>

      <footer className={styles.footer}>
        &copy; Hyper Bros. Trading Cards, {new Date().getFullYear()}
      </footer>
      <Script src='https://cdn.snipcart.com/themes/v3.2.1/default/snipcart.js' />
      <div
        hidden
        id='snipcart'
        data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}
      />
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'http://hyperbros.local/graphql',
    cache: new InMemoryCache(),
  })

  const res = await client.query({
    query: gql`
      query AllProducts {
        products {
          edges {
            node {
              id
              content
              featuredImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
              title
              slug
              uri
              product {
                productId
                productPrice
              }
            }
          }
        }
      }
    `,
  })

  const products = res.data.products.edges.map(({ node }) => {
    const data = {
      ...node,
      ...node.product,
      featuredImage: node.featuredImage.node,
    }
    return data
  })

  return {
    props: {
      products,
    },
  }
}
