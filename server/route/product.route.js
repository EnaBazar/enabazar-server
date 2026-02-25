import express from 'express';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';
import { createProduct, createProductRams, createProductSize, deletemultipleProducts, deletemultipleProductsRams, deletemultipleProductsSize, DeleteProducts, DeleteProductsRams, DeleteProductsSize, getAllProducts, getAllProductsByCatId, getAllProductsByName,
         getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCatId, 
         getAllProductsBySubCatName, getAllProductsByThirdCatId, getAllProductsByThirdCatName,
          getAllProductsCount, getAllProductsFeatures, getProducts, getProductsRams, getProductsRamsById, getProductsSize,
         getProductsSizeById, UpadteProduct, UpadteProductRams, UpadteProductSize, uploadImages, 
         createProductWieght,
         UpadteProductWieght,
         DeleteProductsWieght,
         deletemultipleProductsWieght,
         getProductsWieght,
         getProductsWieghtById,
         uploadBannerImages,
         
         filters,
         sortBy,
      
         searchProductController} from '../controllers/product.controller.js';
import {removeimageFromCloudinary} from '../controllers/category.controller.js'
import productmodel from '../models/product.model.js';



const productRoutes=express.Router()

productRoutes.post('/uploadimages',auth,upload.array('images'),uploadImages);
productRoutes.post('/uploadBannerimages',auth,upload.array('bannerimages'),uploadBannerImages);
productRoutes.post('/create',auth,createProduct);
productRoutes.get('/getAllProduct',auth,getAllProducts);
productRoutes.get('/getAllProductByCatId/:id',getAllProductsByCatId);

productRoutes.get('/getAllProductByCatName',getAllProductsByName);
productRoutes.get('/getAllProductBySubCatId/:id',getAllProductsBySubCatId);
productRoutes.get('/getAllProductBySubCatName',getAllProductsBySubCatName);
productRoutes.get('/getAllProductByThirdCatId/:id',getAllProductsByThirdCatId);
productRoutes.get('/getAllProductByThirdCatName',getAllProductsByThirdCatName);
productRoutes.get('/getAllProductByPrice',getAllProductsByPrice);
productRoutes.get('/getAllProductByRating',getAllProductsByRating);
productRoutes.get('/getAllProductCount', getAllProductsCount);
productRoutes.get('/getAllProductFeatured', getAllProductsFeatures);
productRoutes.delete('/:id',DeleteProducts);
productRoutes.delete('/deleteMultiple',deletemultipleProducts);
productRoutes.get('/:id',getProducts);
productRoutes.delete('/deleteImage',auth,removeimageFromCloudinary);
productRoutes.put('/updateProduct/:id',auth,UpadteProduct);



productRoutes.post('/productRAMS/create',auth,createProductRams);
productRoutes.put('/productRAMS/updateProductRams/:id',auth,UpadteProductRams);
productRoutes.delete('/productRAMS/:id',DeleteProductsRams);
productRoutes.delete('/productRAMS/deleteMultipleRams',deletemultipleProductsRams);
productRoutes.get('/productRAMS/get',getProductsRams);
productRoutes.get('/productRAMS/:id',getProductsRamsById);




productRoutes.post('/productSize/create',auth,createProductSize);
productRoutes.put('/productSize/updateProductSize/:id',auth,UpadteProductSize);
productRoutes.delete('/productSize/:id',DeleteProductsSize);
productRoutes.delete('/productSize/deleteMultipleSize',deletemultipleProductsSize);
productRoutes.get('/productSize/get',getProductsSize);
productRoutes.get('/productSize/:id',getProductsSizeById);


productRoutes.post('/productWieght/create',auth,createProductWieght);
productRoutes.put('/productWieght/updateProductWieght/:id',auth,UpadteProductWieght);
productRoutes.delete('/productWieght/:id',DeleteProductsWieght);
productRoutes.delete('/productWieght/deleteMultipleWieght',deletemultipleProductsWieght);
productRoutes.get('/productWieght/get',getProductsWieght);
productRoutes.get('/productWieght/:id',getProductsWieghtById);


productRoutes.post('/filters',filters);
productRoutes.post('/sortBy',sortBy);

productRoutes.get('/search/get',searchProductController);




export default  productRoutes;