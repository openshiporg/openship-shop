import { request, gql } from "graphql-request";

export default async (req, res) => {
  const {
    shopId,
    orderId,
    orderName,
    email,
    first_name,
    last_name,
    streetAddress1,
    streetAddress2,
    city,
    state,
    zip,
    country,
    currency,
    lineItems,
  } = req.body;
  if (process.env.ACCESS_TOKEN !== accessToken) {
    return res
      .status(403)
      .json({ error: "Denied" });
  }
  try {
    const orderDetails = await request({
      url: process.env.OPENSHIP_DOMAIN,
      requestHeaders: {
        "x-api-key": process.env.OPENSHIP_KEY,
      },
      document: gql`
        mutation ($data: OrderCreateInput!) {
          createOrder(data: $data) {
            id
          }
        }
      `,
      variables: {
        data: {
          orderId,
          orderName,
          email,
          first_name,
          last_name,
          streetAddress1,
          streetAddress2,
          city,
          state,
          zip,
          country,
          currency,
          lineItems: { create: lineItems },
          shop: { connect: { id: shopId } },
          linkOrder: true,
          matchOrder: true,
          processOrder: true,
          status: "INPROCESS",
        },
      },
    });
    return res
      .status(200)
      .json({ orderDetails });
  } catch {
    return res.status(400).json({
      error: "Order creation failed.",
    });
  }
};