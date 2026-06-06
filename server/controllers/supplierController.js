import Supplier from "../models/Supplier.js";


// Create Supplier
export async function createSupplier(req, res) {
  try {
    let supplier = new Supplier({
      name: req.body.name,
      mobile: req.body.mobile,
      address: req.body.address,
      openingDue: req.body.openingDue || 0,
    });

    supplier = await Supplier.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "Supplier Created Successfully",
      supplier,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
}

// Get All Suppliers
export async function getAllSuppliers(req, res) {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      error: false,
      suppliers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
}

// Get Single Supplier
export async function getSupplierById(req, res) {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Supplier Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      supplier,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
}

// Update Supplier
export async function updateSupplier(req, res) {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        mobile: req.body.mobile,
        address: req.body.address,
        openingDue: req.body.openingDue,
      },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Supplier Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Supplier Updated Successfully",
      supplier,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
}

// Delete Supplier
export async function deleteSupplier(req, res) {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Supplier Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Supplier Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
}

// Multiple Delete Supplier
export async function deleteMultipleSuppliers(req, res) {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid Supplier IDs",
      });
    }

    await Supplier.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      success: true,
      error: false,
      message: "Suppliers Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
}