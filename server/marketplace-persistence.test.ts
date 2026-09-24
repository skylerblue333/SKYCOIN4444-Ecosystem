import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq, inArray } from "drizzle-orm";
import {
  orders,
  products,
  reviews,
  users,
} from "../drizzle/schema";
import {
  createOrder,
  createProduct,
  createReview,
  db,
  getOrders,
  getProducts,
  getReviews,
  updateOrderStatus,
} from "./db";

const buyer = "marketplace-persistence-buyer";
const seller = "marketplace-persistence-seller";
const outsider = "marketplace-persistence-outsider";
const userIds = [buyer, seller, outsider];

async function cleanup() {
  const productRows = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.sellerId, seller));
  const productIds = productRows.map(row => row.id);

  if (productIds.length) {
    await db.delete(reviews).where(inArray(reviews.productId, productIds));
    await db.delete(orders).where(inArray(orders.productId, productIds));
    await db.delete(products).where(inArray(products.id, productIds));
  }
  await db.delete(users).where(inArray(users.id, userIds));
}

beforeEach(async () => {
  await cleanup();
  await db.insert(users).values([
    {
      id: buyer,
      openId: buyer,
      email: "marketplace-buyer@example.test",
      username: buyer,
      name: "Marketplace Buyer",
      loginMethod: "test",
    },
    {
      id: seller,
      openId: seller,
      email: "marketplace-seller@example.test",
      username: seller,
      name: "Marketplace Seller",
      loginMethod: "test",
    },
    {
      id: outsider,
      openId: outsider,
      email: "marketplace-outsider@example.test",
      username: outsider,
      name: "Marketplace Outsider",
      loginMethod: "test",
    },
  ]);
});

afterEach(cleanup);

describe("marketplace persistence", () => {
  it("persists products and filters discovery by category", async () => {
    const product = await createProduct({
      name: "Persistent Item",
      price: 12.5,
      category: "digital",
      sellerId: seller,
    });

    expect(product?.sellerId).toBe(seller);

    const digital = await getProducts(20, 0, "digital");
    expect(digital.some(row => row.id === product?.id)).toBe(true);

    const physical = await getProducts(20, 0, "physical");
    expect(physical.some(row => row.id === product?.id)).toBe(false);
  });

  it("creates a pending order with calculated total and shipping address", async () => {
    const product = await createProduct({
      name: "Order Item",
      price: 7.25,
      category: "digital",
      sellerId: seller,
    });
    if (!product) throw new Error("product missing");

    const result = await createOrder({
      userId: buyer,
      productId: product.id,
      quantity: 3,
      shippingAddress: "123 Test Lane",
    });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error("order creation failed");
    expect(result.order?.status).toBe("pending");
    expect(result.order?.total).toBeCloseTo(21.75);
    expect(result.order?.shippingAddress).toBe("123 Test Lane");

    const history = await getOrders(buyer);
    expect(history.map(row => row.id)).toContain(result.order?.id);
  });

  it("allows only the owning buyer to cancel a pending order", async () => {
    const product = await createProduct({
      name: "Cancelable Item",
      price: 5,
      category: "digital",
      sellerId: seller,
    });
    if (!product) throw new Error("product missing");

    const created = await createOrder({
      userId: buyer,
      productId: product.id,
      quantity: 1,
      shippingAddress: "456 Test Road",
    });
    if (!created.success || !created.order) throw new Error("order missing");

    const denied = await updateOrderStatus(
      outsider,
      created.order.id,
      "cancelled"
    );
    expect(denied).toEqual({
      success: false,
      reason: "order_not_found_or_not_owner",
    });

    const unsupported = await updateOrderStatus(
      buyer,
      created.order.id,
      "shipped"
    );
    expect(unsupported).toEqual({
      success: false,
      reason: "seller_fulfillment_not_configured",
    });

    const cancelled = await updateOrderStatus(
      buyer,
      created.order.id,
      "cancelled"
    );
    expect(cancelled).toEqual({ success: true });

    const [stored] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, created.order.id));
    expect(stored?.status).toBe("cancelled");
  });

  it("persists product reviews", async () => {
    const product = await createProduct({
      name: "Reviewed Item",
      price: 3,
      category: "digital",
      sellerId: seller,
    });
    if (!product) throw new Error("product missing");

    const review = await createReview(
      product.id,
      buyer,
      5,
      "Persistent review"
    );
    expect(review?.rating).toBe(5);

    const productReviews = await getReviews(product.id);
    expect(productReviews).toHaveLength(1);
    expect(productReviews[0]?.comment).toBe("Persistent review");
  });
});
