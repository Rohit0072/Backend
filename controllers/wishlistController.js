import Wishlist from "../models/Wishlist.js";
import Product from "../models/productModel.js";

export const addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [{ productId }] });
    } else {
      const exists = wishlist.products.some(
        (item) => item.productId.toString() === productId
      );
      if (!exists) {
        wishlist.products.push({ productId });
      }
    }

    await wishlist.save();

    const fullProducts = await Promise.all(
      wishlist.products.map(async (item) => {
        const productDetails = await Product.findById(item.productId);
        if (!productDetails) return null;

        const data = {
          _id: item._id,
          productId: productDetails._id,
          name: productDetails.title, 
          price: productDetails.price,
          description: productDetails.description,
          category: productDetails.category || "Uncategorized",
          image: productDetails.images?.[0] || "https://placehold.co/150x150", 
          addedAt: item.addedAt,
        };
        return data;
      })
    );

    const filtered = fullProducts.filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      products: filtered,
    });
  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    const fullProducts = await Promise.all(
      wishlist.products.map(async (item) => {
        const productDetails = await Product.findById(item.productId);
        if (!productDetails) return null;

        return {
          _id: item._id,
          productId: productDetails._id,
          name: productDetails.title, 
          price: productDetails.price,
          description: productDetails.description,
          category: productDetails.category || "Uncategorized",
          image: productDetails.images?.[0] || "https://placehold.co/150x150", 
          addedAt: item.addedAt,
        };
      })
    );

    const filtered = fullProducts.filter(Boolean);

    res.status(200).json({ success: true, products: filtered });
  } catch (err) {
    console.error("❌ Error in getWishlist:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (item) => item.productId.toString() !== productId
      );
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: "Product removed",
      wishlist,
    });
  } catch (err) {
    console.error("❌ Error in removeFromWishlist:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
