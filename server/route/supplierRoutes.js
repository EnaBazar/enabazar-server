import express from "express";
import { createSupplier, deleteMultipleSuppliers, deleteSupplier, getAllSuppliers, getSupplierById, updateSupplier } from "../controllers/supplierController.js";


const supplierRoutes = express.Router();

supplierRoutes.post("/create", createSupplier);
supplierRoutes.get("/", getAllSuppliers);
supplierRoutes.get("/:id", getSupplierById);
supplierRoutes.put("/:id", updateSupplier);
supplierRoutes.delete("/:id", deleteSupplier);
supplierRoutes.delete("/", deleteMultipleSuppliers);

export default supplierRoutes;
