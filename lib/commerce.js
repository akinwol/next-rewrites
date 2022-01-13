import CommerceSDK from "@chec/commerce.js";
console.log({ nextpub: process.env.CHEC_PUBLIC_API_KEY})

const client = new CommerceSDK(process.env.CHEC_PUBLIC_API_KEY);

export default client;

// const commerceClient = async ({ key }) => {
//     return new CommerceSDK(key);
// }
// export default commerceClient;