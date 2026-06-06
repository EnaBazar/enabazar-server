import Collection from "../models/Collection.js";
import CashTransaction from "../models/CashTransaction.js";

export const createCollection = async (req, res) => {
  try {
    const { date, mokam, amount, note = "" } = req.body;
    const collection = await Collection.create({ date, mokam, amount, note });

    await CashTransaction.create({ date, type: "in", source: "collection", amount, referenceId: collection._id, note: note || "Mokam collection" });

    res.status(201).json({ success: true, error: false, message: "Collection created", data: collection });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate("mokam", "name mobile").sort({ date: -1 });
    res.status(200).json({ success: true, error: false, data: collections });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};
