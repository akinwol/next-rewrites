import CommerceSDK from "@chec/commerce.js";

export const commerceClient = async ({ key }) => {
    return new CommerceSDK(key);
}