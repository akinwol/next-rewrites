import React from "react";
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Layout, Page, Text, Link } from '@vercel/edge-functions-ui'
import getData from "../../../../lib/data";
// import commerce from "../../../../../lib/commerce"
import { commerceClient } from "../../../../lib/commerceHelper";

export default function ProductDetails(props) {
  // const getProducts = fetch("/api/products")
  const { products, seo, productData } = props;
  console.log({ props })


  const router = useRouter()
    if (router.isFallback) {
        return (
          <Page>
            <Text variant="h1" className="mb-6">
              Loading...
            </Text>
          </Page>
        )
    }
  
  return (
    <Page>
      <Head>
        <title>{props.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta itemProp="description" content={props.description} />
      </Head>
      <Text variant="h1" className="mb-6">
        {props.name}
      </Text>
      <div className="mb-4">
        <Link className="mr-2.5" href="/">
          Home
        </Link>
        <Link href="/about">About</Link>
      </div>
      <Text className="mb-2">
        <b>Properties</b>: {props.description}
      </Text>
      <Text className="mb-2">
        <b>Subdomain</b>: {props.subdomain}.vercel.sh
      </Text>
      <Text className="mb-2">
        <b>Custom Domain</b>: {props.customDomain || 'none'}
      </Text>

      <div> 
        <div className='text-2xl mt-8'> Product Details </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"> 
        {productData ? (
          <div className="border-2 rounded-lg p-4">
              <p className="text-l font-bold">{productData.name}</p>
              <img className="mt-2 h-28 w-full" src={productData.assets[0]?productData.assets[0].url : "" }></img>
              <p className="mt-2"> {productData.price.formatted_with_symbol}</p>
            </div>
        ) : (
          <div> Sorry product doesn't exist go back </div>
        )}
        


         
         


        </div>
        
      </div>
    </Page>
  )
}

ProductDetails.Layout = Layout



export async function getStaticPaths() {
  // get all sites that have subdomains set up
  const mockDB = await getData();
  const subdomains = mockDB.filter((item) => item.subdomain)

  // get all sites that have custom domains set up
  const customDomains = mockDB.filter((item) => item.customDomain)

  // build paths for each of the sites in the previous two lists
  const paths = [
    ...subdomains.map((item) => {
      // console.log({ item })
      return { params: { site: item.subdomain, slug: [] } }
    }),
    ...customDomains.map((item) => {
      return { params: { site: item.customDomain, slug: []  } }
    }),
  ]
  // console.log({ paths})
  return {
    paths: paths,
    fallback: 'blocking', // fallback true allows sites to be generated using ISR
  }
}

export async function getStaticProps(props) {
  const mockDB = await getData();
  const { params: { site, slug } } = props
  console.log({ props, slug })
  // props: {
  //   params: { site: 'hostname-1' },
  //   locales: undefined,
  //   locale: undefined,
  //   defaultLocale: undefined
  // }
  // check if site is a custom domain or a subdomain
  const customDomain = site.includes('.') ? true : false

  // fetch data from mock database using the site value as the key
  const data = mockDB.filter((item) =>
    customDomain ? item.customDomain == site : item.subdomain == site
  )
  
  process.env.test = "blah blah2"
  if (data.length > 0 ) process.env[`CHEC_PUBLIC_API_KEY`] = data[0].key //process.env.CHEC_PUBLIC_API_KEY = data[0].key
  // // process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY = data[0].key
  const envPage = process.env.CHEC_PUBLIC_API_KEY
  const comm = await commerceClient({ key: data[0].key  });
  const { data: productData } = await comm.products.list({ query: slug[0]});
  // const { data: products } = await commerce.products.list();
  // console.log({ products })
  console.log({ envPage, data, productData })
  
  return {
    props: { ...data[0],  productData: productData ? productData[0] : null },
    revalidate: 10, // set revalidate interval of 10s
  }
}
