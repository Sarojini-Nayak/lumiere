import User from "../models/User.js";

// @desc Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
