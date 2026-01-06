import express from'express';
import dotenv, { config } from 'dotenv';
import DbCon from './libs/db.js';
import AuthRoutes from './route/auth.routes.js';
import cors from'cors';
import cookieParser from'cookie-parser';
import morgan from'morgan';
import helmet from'helmet';
import categoryRoutes from './route/category.route.js';
import productRoutes from './route/product.route.js';
import cartRoutes from './route/cart.route.js';
import mylistRoutes from './route/mylist.route.js';
import addressRouter from './route/address.route.js';
import bannerV1Routes from './route/bannerV1.route.js';
import bannerV2Routes from './route/bannerV2.route.js';
import bannerV3Routes from './route/bannerV3.route.js';
import blogRoutes from './route/blog.route.js';
import orderRoutes from './route/order.route.js';
import homeSlideRoutes from './route/homeSlide.route.js';




dotenv.config()
DbCon()

const PORT = process.env.PORT || 5000
const app=express()
app.use(cors(

   { origin: "*"}
));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet({
    
    
}))


app.use(express.json())
app.use('/auth',AuthRoutes)
app.use('/category',categoryRoutes)
app.use('/product',productRoutes)
app.use('/cart',cartRoutes)
app.use('/mylist',mylistRoutes)
app.use('/address',addressRouter)
app.use('/homeSlides',homeSlideRoutes)
app.use('/bannerV1', bannerV1Routes);
app.use('/bannerV2', bannerV2Routes);
app.use('/bannerV3', bannerV3Routes);
app.use('/blog',blogRoutes)
app.use('/order',orderRoutes)
app.listen(PORT,()=>{
    
    console.log(`App is Running on port ${PORT} `)
})