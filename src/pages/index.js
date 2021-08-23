import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import Header from '@components/Header'
import Container from '@components/Container'
import Button from '@components/Button'
import products from '@data/products.json'

import styles from '@styles/Home.module.scss'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Card Store USA</title>
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
                <li key={product.id}>
                  <Image
                    src={product.image}
                    alt={`${product.title} Card`}
                    width='864px'
                    height='1200px'
                  />
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>${product.price}</p>
                  <Button
                    className='snipcart-add-item'
                    data-item-id={product.id}
                    data-item-price={product.price}
                    data-item-url='/'
                    data-item-description={`${product.title} trading card.`}
                    data-item-image={product.image}
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
