import express from 'express';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';
import { AddToCartItemController, DeleteCartItemController, emptyCartController, getCartItemController, UpadteCartItemController } from '../controllers/cart.controller.js';

const cartRoutes=express.Router()

cartRoutes.post('/create',auth,AddToCartItemController);
cartRoutes.get('/get',auth,getCartItemController);
cartRoutes.put('/update-qty',auth,UpadteCartItemController);
cartRoutes.delete('/delete-cart-item/:id',auth,DeleteCartItemController);
cartRoutes.delete('/emptycart/:id',auth,emptyCartController);




export default  cartRoutes;