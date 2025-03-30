import productDB from '../config/dbProducts.js'; 
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }
}, { timestamps: true });

const Product = productDB.model('Product', productSchema); // Use the productDB connection

export default Product;
