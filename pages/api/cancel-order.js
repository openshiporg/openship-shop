import { request, gql } from "graphql-request";

export default async (req, res) => {
  const { accessToken, orderId } = req.body;
  if (process.env.ACCESS_TOKEN !== accessToken) {
    return res.status(403).json({ error: "Denied" });
  }
  try {
    const cancelledOrder = await request({
      url: process.env.OPENSHIP_DOMAIN,
      requestHeaders: {
        "x-api-key": process.env.OPENSHIP_KEY,
      },
      document: gql`
        mutation ($orderId: String!) {
          cancelOrder(orderId: $orderId) {
            id
          }
        }
      `,
      variables: { orderId },
    });
    return res.status(200).json({ cancelledOrder });
  } catch {
    return res.status(400).json({
      error: "Order cancellation failed.",
    });
  }
};
