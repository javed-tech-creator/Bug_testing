 
import Client from "../../models/finance/Client.js";

 

export const create= async (req, res) => {
  try {
    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      status: 201,
      client,
    });
  } catch (err) { 
    res.status(400).json({
      success: false,
      message: "Error creating client",
      error: err.message,
    });
  }
};

 
export const list = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching clients', error: err.message });
  }
};

 
export const get = async (req, res) => {
  try {
    const c = await Client.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Client not found' });
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: 'Invalid client ID', error: err.message });
  }
};

 
export const update = async (req, res) => {
  try {
    const c = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!c) return res.status(404).json({ message: 'Client not found' });
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: 'Error updating client', error: err.message });
  }
};

 
export const remove = async (req, res) => {
  try {
    const c = await Client.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting client', error: err.message });
  }
};
