import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

import { removeimageFromCloudinary } from '../controllers/category.controller.js';
import { createBannerV2, deleteBannerV2, getBannersV2, getBannerV2, updateBannerV2, uploadBannerV2Images } from '../controllers/bannerV2.controller.js';


1

const bannerV2Routes=express.Router();

bannerV2Routes.post('/uploadImages',auth,upload.array('images'),uploadBannerV2Images);
bannerV2Routes.post('/create',auth,createBannerV2);
bannerV2Routes.get('/',getBannersV2);
bannerV2Routes.get('/:id',getBannerV2);
bannerV2Routes.delete('/deleteImage',auth,removeimageFromCloudinary);
bannerV2Routes.delete('/:id',auth,deleteBannerV2);
bannerV2Routes.put('/:id',auth,updateBannerV2);
export default  bannerV2Routes;

