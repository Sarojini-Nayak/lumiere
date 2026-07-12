import Product from "../models/Product.js";

// Atomically decrements stock for every item in an order. Uses a conditional
// update (stock: { $gte: quantity }) so two customers racing to buy the last
// unit can't both succeed. If any single item doesn't have enough stock left,
// every item already decremented in this call is rolled back and the name of
// the item that failed is returned so the caller can show a clear message.
export const reduceStockSafely = async (items) => {
  const decremented = [];

  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!updated) {
      for (const done of decremented) {
        await Product.findByIdAndUpdate(done.product, { $inc: { stock: done.quantity } });
      }
      return { success: false, failedItemName: item.name };
    }

    decremented.push(item);
  }

  return { success: true };
};
