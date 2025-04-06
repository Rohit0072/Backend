import Cart from "../models/Cart.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
    } else {
      const existingItem = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
    }

    await cart.save();

    const fullProducts = await Promise.all(
      cart.products.map(async (item) => {
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
          quantity: item.quantity,
          addedAt: item.addedAt,
        };
      })
    );

    const filtered = fullProducts.filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      products: filtered,
    });
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const fullProducts = await Promise.all(
      cart.products.map(async (item) => {
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
          quantity: item.quantity,
          addedAt: item.addedAt,
        };
      })
    );

    const filtered = fullProducts.filter(Boolean);

    res.status(200).json({ success: true, products: filtered });
  } catch (err) {
    console.error("❌ Error in getCart:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Product removed",
    });
  } catch (err) {
    console.error("❌ Error in removeFromCart:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.products.find((p) => p.productId.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, message: "Quantity updated" });
  } catch (err) {
    console.error("❌ Error updating cart quantity:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
