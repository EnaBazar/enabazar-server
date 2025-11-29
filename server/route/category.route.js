import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { createcategory, deleteCategory, getcategoris, getCategorisCount, getCategory, getSubCategorisCount, removeimageFromCloudinary, updateCategory, uploadImages } from '../controllers/category.controller.js';



const categoryRoutes=express.Router();

categoryRoutes.post('/uploadImages',auth,upload.array('images'),uploadImages);
categoryRoutes.post('/create',auth,createcategory);
categoryRoutes.get('/',getcategoris);
categoryRoutes.get('/get/count',getCategorisCount);
categoryRoutes.get('/get/count/subCat',getSubCategorisCount);
categoryRoutes.get('/:id',getCategory);
categoryRoutes.delete('/deleteImage',auth,removeimageFromCloudinary);
categoryRoutes.delete('/:id',auth,deleteCategory);
categoryRoutes.put('/:id',auth,updateCategory);

export default  categoryRoutes;

