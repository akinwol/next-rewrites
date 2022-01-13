export default async function getData() {
    const mockDB = [
        // {
        //   name: 'Site 1',
        //   description: 'Subdomain + custom domain',
        //   subdomain: 'subdomain-1',
        //   customDomain: 'custom-domain-1.com',
        //   key: "custom"
        // },
        // {
        //   name: 'Site 2',
        //   description: 'Subdomain only',
        //   subdomain: 'subdomain-2',
        //   customDomain: null,
        //   key: "sub-2"
        // },
        {
          name: 'Prepper - Test (cupcakes)',
          description: 'Meal Prepper Site',
          subdomain: 'pepper-cupcakes',
          customDomain: null,
          key: "pk_test_383275f0b8b972c4ca08c1ac2f19cd39adaddcbd5f631",
          seo: {
            icon: "http://placehold.jp/3d4070/ffffff/150x150.png?text=PR"
          },
        },
        {
          name: 'Baked Test',
          description: 'This is a test site for baked',
          subdomain: 'baked-test',
          customDomain: "goalsnob.com",
          key: "pk_test_38138bd0d3d3e8597a4c07472ec4a57b8f1f4ee66cd17",
          seo: {
            icon: "http://placehold.jp/3d4070/ffffff/150x150.png?text=BT"
          },
        },
      ]

      return mockDB
}