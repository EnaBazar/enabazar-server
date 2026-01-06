import express from 'express';
import auth from '../middleware/auth.js';
import { AddToMyListController, DeleteToMyListController, getToMyListController } from '../controllers/mylist.controller.js';

const mylistRoutes=express.Router()


mylistRoutes.post('/add',auth,AddToMyListController);
mylistRoutes.delete('/:id',auth,DeleteToMyListController);
mylistRoutes.get('/get',auth,getToMyListController);

export default  mylistRoutes;