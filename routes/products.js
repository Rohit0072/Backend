import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) query.category = category;

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, category, price, description, image } = req.body;

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        await product.deleteOne();
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            product: {
                _id: product._id,
                name: product.name,
                title: product.title,
                category: product.category,
                price: product.price,
                description: product.description,
                image: product.image,
                images: product.images,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            },
        });
    } catch (err) {
        console.error('Error fetching product by ID:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
