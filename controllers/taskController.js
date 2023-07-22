// const Task = require('../models/task');

// const getAllTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve tasks' });
//   }
// };
// const getTasks = async (req, res) => {
//   try {
//     const taskId = req.params.id;
//     const tasks = await Task.findById(taskId);
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve tasks' });
//   }
// };

// const createTask = async (req, res) => {
//   const { title, videoLink } = req.body;

//   try {
//     const newTask = await Task.create({ title, videoLink });
//     res.status(201).json(newTask);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create a task' });
//   }
// };

// const deleteTask = async (req, res) => {
//   const taskId = req.params.id;

//   try {
//     await Task.findByIdAndDelete(taskId);
//     res.status(200).json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete the task' });
//   }
// };

// module.exports = {
//   getAllTasks,
//   getTasks,
//   createTask,
//   deleteTask,
// };


// taskController.js
const Task = require('../models/newTask');
const UserTask = require('../models/userTasks');
// const mongoose = require('mongoose');
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
};

// const getTaskById = async (req, res) => {
//   try {
//     const taskId = req.params.id;
//     const task = await Task.findById(taskId);
//     res.status(200).json(task);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve the task' });
//   }
// };

// const getTaskById = async (req, res) => {
//   try {
//     const taskId = req.params.id;
//     const userId = req.body.userId; // Assuming you send userId in the request body

//      // Check if the provided userId is a valid ObjectId
//      if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: 'Invalid userId format' });
//     }
//     // Check if the provided userId exists in the UserTask collection
//     const userExists = await UserTask.exists({ userId });
//     if (!userExists) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Fetch the task based on taskId
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     // Check if the task is completed by the specified user
//     const userTask = await UserTask.findOne({ taskId, userId });
//     if (userTask) {
//       task.completedBy = userTask.completed;
//     } else {
//       task.completedBy = false; // If no UserTask found, the task is not completed by the user
//     }

//     res.status(200).json(task);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to retrieve the task' });
//   }
// };
//2nd latest code 
// const getTaskById = async (req, res) => {
//   try {
//     const taskId = req.params.id;
//     const userId = req.body.userId; // Assuming you send userId in the request body

//     // Check if the provided userId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: 'Invalid userId format' });
//     }

//     // Fetch the task based on taskId
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     // Fetch the userTask based on taskId and userId (optional)
//     const userTask = await UserTask.findOne({ taskId, userId });

//     // If userTask is found, update the task.completedBy
//     if (userTask) {
//       task.userTasks = userTask.completed;
//     } else {
//       task.completedBy = false; // If no UserTask found, the task is not completed by the user
//     }

//     res.status(200).json(task);
//   } catch (error) {
//     console.error(error); // Log the error for debugging purposes
//     res.status(500).json({ error: 'Failed to retrieve the task. Please try again later.' });
//   }
// };

const createTask = async (req, res) => {
  const { title, videoLink } = req.body;

  try {
    const newTask = await Task.create({ title, videoLink });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a task' });
  }
};
//last updated code

const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Fetch the task based on taskId
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Fetch all userTasks associated with the given taskId
    const userTasks = await UserTask.find({ taskId });

    // Check if all users have completed the task
    const allUsersCompleted = userTasks.every(userTask => userTask.completed);

    if (allUsersCompleted) {
      // If all users have completed the task, show userTasks array as empty
      task.userTasks = userTasks.map(userTask => ({
        userId: userTask.userId,
        completed: userTask.completed
      }));
      // task.userTasks = [];
    } else {
      // If there are userTasks, show the userTasks array with the information
      task.userTasks = [];
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Failed to retrieve the task. Please try again later.' });
  }
};


const markTaskCompleted = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.body.userId; // Assuming you send userId in the request body

  try {
    await Task.findByIdAndUpdate(taskId, { completedBy: true });

    // Check if the userTask already exists, if not, create a new entry
    const userTask = await UserTask.findOne({ taskId, userId });
    if (!userTask) {
      await UserTask.create({ taskId, userId, completed: true });
    } else {
      userTask.completed = true;
      await userTask.save();
    }

    res.status(200).json({ message: 'Task marked as completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark the task as completed' });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndDelete(taskId);
    // Delete userTask entries for the deleted task
    await UserTask.deleteMany({ taskId });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the task' });
  }
};
const deleteAllTasks = async (req, res) => {
  try {
    // Delete all tasks
    await Task.deleteMany({});
    // Delete all userTask entries related to the deleted tasks
    await UserTask.deleteMany({});
    res.status(200).json({ message: 'All tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete all tasks' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  markTaskCompleted,
  deleteTask,
  deleteAllTasks
};
