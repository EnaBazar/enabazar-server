import express from 'express';
import dotenv from 'dotenv';
import DbCon from './libs/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

dotenv.config();
DbCon();

const app = express();

// ---- CORS ----
app.use(cors({
    origin: "https://www.goroabazar.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
}));

// OPTIONS handle
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet({
    crossOriginResourcePolicy:false
}));

// Routes
app.use('/auth', AuthRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/mylist', mylistRoutes);
app.use('/address', addressRouter);
app.use('/homeSlides', homeSlideRoutes);
app.use('/bannerV1', bannerV1Routes);
app.use('/bannerV2', bannerV2Routes);
app.use('/bannerV3', bannerV3Routes);
app.use('/blog', blogRoutes);
app.use('/order', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is Running on port ${PORT}`);
});
