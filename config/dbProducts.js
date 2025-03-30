import mongoose from 'mongoose'; // ✅ Correct spelling
import dotenv from 'dotenv';
dotenv.config();

const productDB = mongoose.createConnection(
    process.env.PRODUCT_MONGO_URI, // ✅ Use environment variable instead of hardcoding
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

productDB.on('connected', () => {
    console.log('Connected to Products Database');
});

productDB.on('error', (err) => {
    console.error('Products Database Connection Error:', err);
});

export default productDB; // ✅ Use only `export default`
