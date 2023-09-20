import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `

  enum GenderValues {
    MEN
    WOMEN
    KIDS
  }

  type Image {
    title: String
    url: String!
  }

  type Card {
    title: String
    desc: String
    price: String
  }

  type Section {
    title: String
    desc: String
    images: [Image]
  }

  type Collection {
    title: String
    cta: String
    cards: [Card]
  }

  type HomeScreen {
    greeting: String!,
    collectionCategory: [Section]
    cardSlider: [Collection]

  }

  type Query {
    homeScreen(gender: GenderValues): HomeScreen!
  }
`;

const resolvers = {
  Query: {
    homeScreen: (_, { gender }) => ({
      greeting: `Good morning! ${gender}`,
      collectionCategory: () => {
        if (gender === "WOMEN") {
          return womenData.map((item) => ({
            title: item.title,
            desc: item.desc,
            images: item.images.map((image, index) => ({
              title: item.imagesTitle[index],
              url: image,
            })),
          }));
        } else if (gender === "MEN") {
          return menData.map((item) => ({
            title: item.title,
            desc: item.desc,
            images: item.images.map((image, index) => ({
              title: item.imagesTitle[index],
              url: image,
            })),
          }));
        } else if (gender === "KIDS") {
          return kidsData.map((item) => ({
            title: item.title,
            desc: item.desc,
            images: item.images.map((image, index) => ({
              title: item.imagesTitle[index],
              url: image,
            })),
          }));
        }
      },
      cardSlider: () => {
        return loadCollections(gender);
        // if (gender === "WOMEN") {
        //   return collectionsWomen.map((item) => ({
        //     title: item.title,
        //     cta: item.cta,
        //     cards: () => {
        //       return item.cards.map((card) => ({
        //         title: card.title,
        //         desc: card.desc,
        //         price: card.price,
        //       }));
        //     },
        //   }));
        // } else if (gender === "MEN") {
        //   return collectionsMen.map((item) => ({
        //     title: item.title,
        //     cta: item.cta,
        //     cards: () => {
        //       return item.cards.map((card) => ({
        //         title: card.title,
        //         desc: card.desc,
        //         price: card.price,
        //       }));
        //     },
        //   }));
        // }
      },
    }),
  },
};

const loadCollections = async (gender) => {
  const collectionIds = {
    WOMEN: "gid://shopify/Collection/289631928472",
    MEN: "gid://shopify/Collection/289631895704",
  };
  if (!(gender in collectionIds)) {
    throw new Error("Invalid gender parameter");
  }
  const collectionId = collectionIds[gender];

  const response = await fetch(
    "https://trappist-1e.myshopify.com/api/2023-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "ff031bf264f816c80da166c05bc93a87",
      },
      body: JSON.stringify({
        query: `
                query {
                    collection(id:${collectionId}){
                        title
                        products(first:20) {
                            edges {
                                node {
                                    title
                                    vendor
                                    priceRange {
                                        maxVariantPrice {
                                            amount
                                        }
                                    }
                                    images(first:5) {
                                        edges{
                                            node{
                                                url
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
      }),
    }
  );

  const data = await response.json();
  console.log(data.data.collection.products.edges.map((edge) => edge.node));

  //   const collection = [
  //     {
  //       title: data.data.collection.title,
  //       cta: "urlwomen",
  //       cards: data.data.collection.products.edges.map((edge) => edge.node),
  //     },
  //     {
  //       title: data.data.collection.title,
  //       cta: "urlwomen",
  //       cards: data.data.collection.products.edges.map((edge) => edge.node),
  //     },
  //   ];

  return {
    title: "hello",
  };

  //   return {
  //     title: data.data.collection.title,
  //     cta: "urlwomen",
  //     cards: data.data.collection.products.edges.map((edge) => ({
  //       title: edge.node.title,
  //       desc: edge.node.desc,
  //       price: edge.node.priceRange.maxVariantPrice.amount,
  //     })),
  //   };

  //   if (gender === "WOMEN") {
  //     return collection.map((item) => ({
  //       title: item.title,
  //       cta: item.cta,
  //       cards: () => {
  //         return item.cards.map((card) => ({
  //           title: card.title,
  //           desc: card.desc,
  //           price: card.price,
  //         }));
  //       },
  //     }));
  //   }

  //   else if (gender === "MEN") {
  //     return collectionsMen.map((item) => ({
  //       title: item.title,
  //       cta: item.cta,
  //       cards: () => {
  //         return item.cards.map((card) => ({
  //           title: card.title,
  //           desc: card.desc,
  //           price: card.price,
  //         }));
  //       },
  //     }));
  //   }
};

const womenData = [
  {
    title: "discover",
    desc: "large collection of scrubsets and labcoats",
    imagesTitle: ["scrubset", "labcoat"],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/scrubset.jpg?v=1695124024",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/labcoat.jpg?v=1695124024",
    ],
  },
  {
    title: "complete your looks",
    desc: "solid scrub top | pant | printed tops ",
    imagesTitle: ["scrub tops", "pant", "printed tops"],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/scrubtop.jpg?v=1695124024",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/pants.jpg?v=1695124024",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/prinedtops.jpg?v=1695124024",
    ],
  },
  {
    title: "style your way",
    desc: "fashionable jackets and T-shirts",
    imagesTitle: ["jackets", "t-shirt"],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/jackets.jpg?v=1695124025",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/t-shirt.jpg?v=1695124024",
    ],
  },
];
const menData = [
  {
    title: "discover",
    desc: "large collection of scrubsets and labcoats",
    imagesTitle: ["scrubset", "labcoat"],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/ss3.webp?v=1695132401",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/ss3.webp?v=1695132401",
    ],
  },
  {
    title: "complete your looks",
    desc: "solid scrub top | pant | printed tops ",
    imagesTitle: ["", ""],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/ss3.webp?v=1695132401",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/ss3.webp?v=1695132401",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/ss3.webp?v=1695132401",
    ],
  },
  {
    title: "style your way",
    desc: "fashionable jackets and T-shirts",
    imagesTitle: ["scrub tops", "pant", "printed tops"],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/ss3.webp?v=1695132401",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/ss3.webp?v=1695132401",
    ],
  },
];
const kidsData = [
  {
    title: "discover",
    desc: "large collection of scrubsets and labcoats",
    imagesTitle: ["scrubset", "labcoat"],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/boys.jpg?v=1695132697",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/boys.jpg?v=1695132697",
    ],
  },
  {
    title: "complete your looks",
    desc: "solid scrub top | pant | printed tops ",
    imagesTitle: ["", ""],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/boys.jpg?v=1695132697",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/boys.jpg?v=1695132697",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/boys.jpg?v=1695132697",
    ],
  },
  {
    title: "style your way",
    desc: "fashionable jackets and T-shirts",
    imagesTitle: ["scrub tops", "pant", "printed tops"],
    images: [
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/boys.jpg?v=1695132697",
      "https://cdn.shopify.com/s/files/1/0599/1307/6888/files/boys.jpg?v=1695132697",
    ],
  },
];

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`server ready at ${url}`);
