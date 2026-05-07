import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      adminId: req.user._id,
      members: [req.user._id], // admin is automatically a member
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ members: req.user._id }).populate('adminId', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('adminId', 'name email').populate('members', 'name email');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is a member
    if (!project.members.some(member => member._id.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private/Admin
const addMemberToProject = async (req, res, next) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.adminId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized, only admin can add members');
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      res.status(404);
      throw new Error('User to add not found');
    }

    if (project.members.includes(userToAdd._id)) {
      res.status(400);
      throw new Error('User is already a member');
    }

    project.members.push(userToAdd._id);
    await project.save();

    const updatedProject = await Project.findById(req.params.id).populate('adminId', 'name email').populate('members', 'name email');
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export { createProject, getProjects, getProjectById, addMemberToProject };
