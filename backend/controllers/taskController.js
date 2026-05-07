import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status, projectId, assigneeId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is a member of the project
    if (!project.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to add tasks to this project');
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      projectId,
      assigneeId: assigneeId || null,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (!project.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view tasks for this project');
    }

    const tasks = await Task.find({ projectId: req.params.projectId }).populate('assigneeId', 'name email');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks assigned to user
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assigneeId: req.user._id }).populate('projectId', 'name');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const project = await Project.findById(task.projectId);
    
    // Check if user is admin or the assignee
    if (project.adminId.toString() !== req.user._id.toString() && task.assigneeId?.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assigneeId', 'name email');

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export { createTask, getTasksByProject, getMyTasks, updateTask };
