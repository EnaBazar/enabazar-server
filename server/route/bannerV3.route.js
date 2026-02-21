import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

import { removeimageFromCloudinary } from '../controllers/category.controller.js';

import { createBannerV3, deleteBannerV3, getBannersV3, getBannerV3, updateBannerV3, uploadBannerV3Images } from '../controllers/bannerV3.controller.js';


1

const bannerV3Routes=express.Router();

bannerV3Routes.post('/uploadImages',auth,upload.array('images'),uploadBannerV3Images);
bannerV3Routes.post('/create',auth,createBannerV3);
bannerV3Routes.get('/',getBannersV3);
bannerV3Routes.get('/:id',getBannerV3);
bannerV3Routes.delete('/deleteImage',auth,removeimageFromCloudinary);
bannerV3Routes.delete('/:id',auth,deleteBannerV3);
bannerV3Routes.put('/:id',auth,updateBannerV3);
export default  bannerV3Routes;

