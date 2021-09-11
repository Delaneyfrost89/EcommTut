import Head from 'next/head'
import Image from 'next/image'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

import Container from '@components/Container'
import Button from '@components/Button'
import styles from '@styles/Product.module.scss'

export default function Home({ product }) {
  return (
    <>
      <Head>
        <title>{product.title} | Hyper Bros Trading Cards</title>
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <Image
              src={product.featuredImage.sourceUrl}
              alt={product.featuredImage.altText}
              width={product.featuredImage.mediaDetails.width}
              height={product.featuredImage.mediaDetails.height}
            />
          </div>
          <div className={styles.productContent}>
            <h1>{product.title}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: product.content,
              }}
            ></div>
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
              data-time-max-quantity={1}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}

export async function getStaticProps({ params }) {
  const { productSlug } = params

  const client = new ApolloClient({
    uri: 'https://delaneyfrost.com/graphql',
    cache: new InMemoryCache(),
  })

  const res = await client.query({
    query: gql`
      query SingleProductBySlug($slug: ID!) {
        product(id: $slug, idType: SLUG) {
          id
          slug
          title
          product {
            productId
            productPrice
          }
          content
          featuredImage {
            node {
              altText
              mediaDetails {
                height
                width
              }
              sourceUrl
            }
          }
        }
      }
    `,
    variables: {
      slug: productSlug,
    },
  })

  const product = {
    ...res.data.product,
    ...res.data.product,
    featuredImage: {
      ...res.data.product.featuredImage.node,
    },
  }

  return {
    props: {
      product,
    },
  }
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: 'https://delaneyfrost.com/graphql',
    cache: new InMemoryCache(),
  })

  const res = await client.query({
    query: gql`
      query AllProducts {
        products {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    `,
  })

  const paths = res.data.products.edges.map(({ node }) => {
    return {
      params: {
        productSlug: node.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}
