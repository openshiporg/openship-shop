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

export default async (req, res) => {
  await cors(req, res);

  const { domain, accessToken, searchEntry } = req.query;
  if (process.env.ACCESS_TOKEN !== accessToken) {
    return res.status(403).json({ error: "Denied" });
  }
  const allOrders = [
    {
      orderId: "210983908",
      orderName: "SC-1221",
      link: "https://sc.com/order/210983908",
      date: Intl.DateTimeFormat("en-US").format(Date.now()),
      first_name: "Jared",
      last_name: "Dunn",
      streetAddress1: "3593 Sycamore Street",
      streetAddress2: "STE. 113",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      country: "US",
      lineItems: [
        {
          name: "Road Bike",
          quantity: 1,
          price: "499",
          image: "https://example.com/road-bike",
          productId: "32849038290",
          variantId: "0",
          lineItemId: "2313613213",
        },
      ],
    },
  ];
  if (searchEntry.trim()) {
    const orders = allOrders.filter((order) =>
      order.orderName.includes(searchEntry)
    );
    return res.status(200).json({ orders });
  }
  return res.status(200).json({ orders: allOrders });
};
