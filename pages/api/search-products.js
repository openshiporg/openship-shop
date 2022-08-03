import Cors from "cors";

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  const { accessToken, searchEntry, productId, variantId } = req.query;
  if (process.env.ACCESS_TOKEN && process.env.ACCESS_TOKEN !== accessToken) {
    return res.status(403).json({ error: "Denied" });
  }
  const allProducts = [
    {
      image: "https://images.pexels.com/photos/531844/pexels-photo-531844.jpeg?cs=srgb&dl=pexels-pixabay-531844.jpg&fm=jpg&h=120&w=100&fit=crop",
      title: "Pocket Book",
      productId: "887262",
      variantId: "0",
      price: "9.99",
      availableForSale: true,
    },
  ];
  if (searchEntry) {
    const products = allProducts.filter((product) =>
      product.title.includes(searchEntry)
    );
    return res.status(200).json({ products });
  }
  if (productId && variantId) {
    const products = allProducts.filter(
      (product) =>
        product.productId === productId && product.variantId === variantId
    );
    if (products.length > 0) {
      return res.status(200).json({ products });
    }
    return res.status(400).json({ error: "Not found" });
  }
  return res.status(200).json({ products: allProducts });
}
