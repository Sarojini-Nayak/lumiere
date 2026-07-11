import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalRevenueAgg,
      totalOrders,
      totalProducts,
      totalUsers,
      ordersByStatus,
      revenueByDay,
      topProducts,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { isPaid: true, paidAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
            revenue: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            name: { $first: "$items.name" },
            image: { $first: "$items.image" },
            totalSold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
      Product.find({ stock: { $lte: 5 } })
        .select("name sku stock images price")
        .sort({ stock: 1 })
        .limit(10),
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("user totalPrice orderStatus isPaid createdAt"),
    ]);

    res.status(200).json({
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
      ordersByStatus,
      revenueByDay,
      topProducts,
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
