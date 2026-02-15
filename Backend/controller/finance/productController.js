 
import ProductDbSchema from '../../models/finance/Product.js'

 
export const create = async (req, res) => {
  try {
    const product = await ProductDbSchema.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: err.message,
    });
  }
}

 
export const list = async (req, res) => {
  try {
    const products = await ProductDbSchema.find();
    res.json({
      success: true,
      message: "Product fetch successfully",
      products,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

 
export const get = async (req, res) => {
  try {
    const product = await ProductDbSchema.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({
       success: true,
      message: "Product findById fetch successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID', error: err.message });
  }
};
 
export const update = async (req, res) => {
  try {
    const product = await ProductDbSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({
       success: true,
      message: "Product update successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err.message });
  }
};

 
export const remove = async (req, res) => {
  try {
    const product = await ProductDbSchema.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' ,success:true});
  } catch (err) {
    res.status(400).json({ message: 'Error deleting product', error: err.message });
  }
};
