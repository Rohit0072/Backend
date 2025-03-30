import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
dotenv.config();

const productDB = mongoose.createConnection(
    process.env.PRODUCT_MONGO_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

productDB.on('connected', () => {
    console.log('Products Database Connected');
});

productDB.on('error', (err) => {
    console.error('Products Database Connection Error:', err);
});

export default productDB;
