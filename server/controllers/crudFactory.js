export const createCrudController = (Model, label) => ({
  create: async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({ success: true, error: false, message: `${label} created`, data: doc });
    } catch (error) {
      res.status(500).json({ success: false, error: true, message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const docs = await Model.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, error: false, data: docs });
    } catch (error) {
      res.status(500).json({ success: false, error: true, message: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ success: false, error: true, message: `${label} not found` });
      res.status(200).json({ success: true, error: false, data: doc });
    } catch (error) {
      res.status(500).json({ success: false, error: true, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ success: false, error: true, message: `${label} not found` });
      res.status(200).json({ success: true, error: false, message: `${label} updated`, data: doc });
    } catch (error) {
      res.status(500).json({ success: false, error: true, message: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ success: false, error: true, message: `${label} not found` });
      res.status(200).json({ success: true, error: false, message: `${label} deleted` });
    } catch (error) {
      res.status(500).json({ success: false, error: true, message: error.message });
    }
  }
});
