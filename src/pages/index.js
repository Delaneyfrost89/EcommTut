import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Fuse from 'fuse.js'
import Container from '@components/Container'
import Button from '@components/Button'
import styles from '@styles/Home.module.scss'

export default function Home({ products, allegiances }) {
  const [activeAllegiance, setActiveAllegiance] = useState()
  const [query, setQuery] = useState()

  let activeProducts = products
  if (activeAllegiance) {
    activeProducts = activeProducts.filter(({ allegiances }) => {
      const allegianceIds = allegiances.map(({ slug }) => slug)
      return allegianceIds.includes(activeAllegiance)
    })
  }

  const fuse = new Fuse(products, {
    keys: ['title', 'allegiances.name'],
  })

  if (query) {
    const results = fuse.search(query)
    activeProducts = results.map(({ item }) => item)
  }

  function handleOnSearch(event) {
    const value = event.currentTarget.value
    setQuery(value)
  }

  return (
    <Container>
      <h4>Some thing to test</h4>
      <h1 className='sr-only'>Hyper Bros. Trading Cards</h1>
      <h2 className='sr-only'>Available Cards</h2>
      <div className={styles.discover}>
        <div className={styles.allegiances}>
          <h2>Filter by Allegiance</h2>
          <ul>
            {allegiances.map((allegiance) => {
              const isActive = allegiance.slug === activeAllegiance
              let allegianceClassName
              if (isActive) {
                allegianceClassName = styles.allegianceIsActive
              }

              return (
                <li key={allegiance.id}>
                  <Button
                    color='yellow'
                    className={allegianceClassName}
                    onClick={() => setActiveAllegiance(allegiance.slug)}
                  >
                    {allegiance.name}
                  </Button>
                </li>
              )
            })}
            <li>
              <Button
                color='yellow'
                className={!activeAllegiance && styles.allegianceIsActive}
                onClick={() => setActiveAllegiance(undefined)}
              >
                View All
              </Button>
            </li>
          </ul>
        </div>
        <div className={styles.search}>
          <h2>Search</h2>
          <form>
            <input type='search' onChange={handleOnSearch} />
          </form>
        </div>
      </div>

      <ul className={styles.products}>
        {activeProducts.map((product) => {
          return (
            <li key={product.product.productId}>
              <Link href={`/products/${product.slug}`}>
                <a>
                  <div className={styles.productImage}>
                    <Image
                      src={product.featuredImage.sourceUrl}
                      alt={product.featuredImage.altText}
                      width={product.featuredImage.mediaDetails.width}
                      height={product.featuredImage.mediaDetails.height}
                    />
                  </div>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>
                    ${product.product.productPrice}
                  </p>
                </a>
              </Link>
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
            </li>
          )
        })}
      </ul>
    </Container>
  )
}

export async function getStaticProps() {
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
              featuredImage {
                node {
                  mediaDetails {
                    width
                    height
                  }
                  sourceUrl
                  altText
                }
              }
              title
              slug
              uri
              product {
                productId
                productPrice
              }
              allegiances {
                edges {
                  node {
                    id
                    name
                    slug
                  }
                }
              }
            }
          }
        }
        allegiances {
          edges {
            node {
              id
              name
              slug
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
      featuredImage: { ...node.featuredImage.node },
      allegiances: node.allegiances.edges.map(({ node }) => node),
    }
    return data
  })

  const allegiances = res.data.allegiances.edges.map(({ node }) => node)

  return {
    props: {
      products,
      allegiances,
    },
  }
}
