import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { createBannerV1, deleteBannerV1, getBannersV1, getBannerV1,   updateBannerV1,   uploadBannerV1Images } from '../controllers/bannerV1.controller.js';
import { removeimageFromCloudinary } from '../controllers/category.controller.js';


1

const bannerV1Routes=express.Router();

bannerV1Routes.post('/uploadImages',auth,upload.array('images'),uploadBannerV1Images);
bannerV1Routes.post('/create',auth,createBannerV1);
bannerV1Routes.get('/',getBannersV1);
bannerV1Routes.get('/:id',getBannerV1);
bannerV1Routes.delete('/deleteImage',auth,removeimageFromCloudinary);
bannerV1Routes.delete('/:id',auth,deleteBannerV1);
bannerV1Routes.put('/:id',auth,updateBannerV1);
export default  bannerV1Routes;

