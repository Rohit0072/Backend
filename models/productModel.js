import productDB from '../config/dbProducts.js';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  name: { type: String }, 
  slug: { type: String },
  category: { type: String, default: 'Uncategorized' },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, 
  images: [{ type: String }], 
  creationAt: { type: Date },
  updatedAt: { type: Date }
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (!this.name && this.title) {
    this.name = this.title;
  }
  if (!this.image && Array.isArray(this.images) && this.images.length > 0) {
    this.image = this.images[0]; 
  }
  next();
});

productSchema.post('findOne', function (doc) {
  if (doc) {
  }
});

const Product = productDB.model('Product', productSchema);

export default Product;
