import CommerceSDK from "@chec/commerce.js";

const client = new CommerceSDK(process.env.CHEC_PUBLIC_API_KEY);

export default async function handler(req, res) {
  console.log("request coming")
  const { data: products } = await client.products.list();
    // console.log({ products })
  return res.status(200).json({products})
}