 
import Project from '../../models/finance/Project.js';

 
export const create = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error creating project",
      error: err.message,
    });
  }
};
 
export const list = async (req, res) => {
  try {
    const projects = await Project.find().populate("client", "name email phone gstin");
    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error fetching projects",
      error: err.message,
    });
  }
};
export const get = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({
      success: true,
      message: "Projects findById fetched successfully",
      project,
    });
  } catch (err) {
   res.status(400).json({
      success: false,
      message: "Error findById fetching projects",
      error: err.message,
    });
  }
};
 
export const update = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(
      {
      success: true,
      message: "Projects update successfully",
      project,
    }
    );
  } catch (err) {
    res.status(400).json({ message: 'Error updating project', error: err.message });
  }
};

 
export const remove = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found', success: true, });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting project', error: err.message });
  }
};
