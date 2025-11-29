import {Router} from "express";
import auth from "../middleware/auth.js";
import { addAddressController, DeleteAddressController, editAddress, getAddressController, selectAddressController } from "../controllers/address.controller.js";


const addressRouter= Router()


addressRouter.post('/add',auth,addAddressController)
addressRouter.get('/get',auth,getAddressController)
addressRouter.get('/selectAddress/:id',auth,selectAddressController)
addressRouter.put('/:id',auth,editAddress)
addressRouter.delete('/:id',auth,DeleteAddressController)
export default addressRouter;