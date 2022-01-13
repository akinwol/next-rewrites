import React from "react";
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Layout, Page, Text, Link } from '@vercel/edge-functions-ui'
import getData from "../../../lib/data";
import commerce from "../../../lib/commerce"
import { commerceClient } from "../../../lib/commerceHelper";

export default function About(props) {
  // const getProducts = fetch("/api/products")
  const { products, seo } = props;
  console.log({ props, env: process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY, products })

  const handleProd = async () => {
    console.log("page load")
    try {
      const response = fetch("/api/products")
      const productRes = await (await response).json()
      console.log({ productRes })
    } catch (error) {
      console.log({ error })
      
    }
  }

  React.useEffect(() => {
    console.log("effect")
    if (products) handleProd()
  }, [])
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
        <link rel="icon" href={props.seo && props.seo.icon ? props.seo.icon : "/favicon.ico"} />
        <meta itemProp="description" content={props.description} />
      </Head>
      <Text variant="h1" className="mb-6">
        {props.name}
      </Text>
      <div className="mb-4">
        {props.name ? (
          <>
          <Link className="mr-2.5" href="/">
          Home
        </Link>
        <Link href="/about">About</Link>
        <Link href="/products">Products</Link>
          </>
        ):
        <p className="text-4xl">Page does not exist</p>
      }
      </div>
      <Text className="mb-2">
        <b>Properties</b>: {props.description}
      </Text>
      <Text className="mb-2">
        <b>Subdomain</b>: {props.subdomain}
      </Text>
      <Text className="mb-2">
        <b>Custom Domain</b>: {props.customDomain || 'none'}
      </Text>

      <div> 
        <div className='text-2xl mt-8'> Products </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"> 
        {products && products.map((p) => (
            <div key={p.id} className="border-2 rounded-lg p-4">
              <p className="text-l font-bold">{p.name}</p>
              <img className="mt-2 h-28 w-full" src={p.assets[0]?p.assets[0].url : "" }></img>
              <p className="mt-2"> {p.price.formatted_with_symbol}</p>
            </div>

        ))}


         
         


        </div>
        
      </div>
    </Page>
  )
}

About.Layout = Layout



export async function getStaticPaths() {
  // get all sites that have subdomains set up
  const mockDB = await getData();
  const subdomains = mockDB.filter((item) => item.subdomain)

  // get all sites that have custom domains set up
  const customDomains = mockDB.filter((item) => item.customDomain)

  // build paths for each of the sites in the previous two lists
  const paths = [
    ...subdomains.map((item) => {
      console.log({ item })
      return { params: { site: item.subdomain } }
    }),
    ...customDomains.map((item) => {
      console.log({ item })
      return { params: { site: item.customDomain } }
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
  const { params: { site } } = props
  console.log({ props })
  // check if site is a custom domain or a subdomain
  const customDomain = (site.includes(process.env.ROOT_URL) || site.includes(".")) ? false : true
  console.log({ customDomain })

  // fetch data from mock database using the site value as the key
  let updatedSite = site.replace("www.","")
  updatedSite = site.replace(".koladae.com", "")
  console.log({updatedSite})
  const data = mockDB.filter((item) =>
    customDomain ? item.customDomain == updatedSite : item.subdomain == updatedSite
  )
  console.log({ data })
  
  process.env.test = "blah blah2"
  let products = null
  if (data.length > 0 ) {
    process.env[`CHEC_PUBLIC_API_KEY`] = data[0].key //process.env.CHEC_PUBLIC_API_KEY = data[0].key
  // // process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY = data[0].key
  const envPage = process.env.CHEC_PUBLIC_API_KEY
  const comm = await commerceClient({ key: data[0].key  });
  const { data: productData } = await comm.products.list();
  // const { data: products } = await commerce.products.list();
  // console.log({ products })
  console.log({ envPage, data })
  products = productData
  }
  
  return {
    props: { ...data[0], products },
    revalidate: 3600, // set revalidate interval of 10s
  }
}
