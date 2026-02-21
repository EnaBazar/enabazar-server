import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { createblog, deleteblog, getblog, getblogis, updateBlog, uploadImages } from '../controllers/blog.controller.js';
import { removeimageFromCloudinary } from '../controllers/category.controller.js';



const blogRoutes=express.Router();

blogRoutes.post('/uploadImages',auth,upload.array('images'),uploadImages);
blogRoutes.post('/create',auth,createblog);
blogRoutes.get('/',getblogis);
blogRoutes.get('/:id',getblog);
blogRoutes.delete('/deleteImage',auth,removeimageFromCloudinary);
blogRoutes.delete('/:id',auth,deleteblog);
blogRoutes.put('/:id',auth,updateBlog);
export default  blogRoutes;

