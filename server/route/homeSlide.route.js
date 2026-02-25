import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

import { addHomeSlide, deletemultipleSlides, deleteSlide, getHomeSlides, getSlide, removeimageFromCloudinary, updateSlide, uploadImages } from '../controllers/homeSlider.controller.js';



const homeSlideRoutes=express.Router();

homeSlideRoutes.post('/uploadImages', auth, upload.array('images'), uploadImages);
homeSlideRoutes.post('/add', auth, addHomeSlide);
homeSlideRoutes.get('/', getHomeSlides);
homeSlideRoutes.get('/:id', getSlide);
homeSlideRoutes.delete('/deleteImage', auth, removeimageFromCloudinary);
// ✅ static route comes before dynamic one
homeSlideRoutes.delete('/deleteMultiple', auth, deletemultipleSlides);
homeSlideRoutes.delete('/:id', auth, deleteSlide);
homeSlideRoutes.put('/:id', auth, updateSlide);
export default  homeSlideRoutes;

