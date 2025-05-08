import { TaskModel } from "../models/task.model.js";

export const addTask = async (req, res) => {
  const { title, description, dueDate, priority, status,userEmail } = req.body;

  if (!title || !description || !dueDate || !priority || !status) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  } else if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof dueDate !== "string" ||
    typeof priority !== "string" ||
    typeof status !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields should be string" });
  } else {
    try {
      let existTask = await TaskModel.findOne({ title });
      if (existTask) {
        return res.status(409).json({
          success: false,
          message: "Task already exist with this title",
        });
      }
      let newTask = await TaskModel.create({
        title,
        description,
        dueDate,
        priority,
        status,
        userEmail,
        userId : req.user.id

      });

      if (newTask) {
        return res.status(201).json({
          success: true,
          message: "Task created successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const getTasks = async (req, res) => {
  try {
    let allTasks = await TaskModel.find({
      $or: [{ userId: req.user.id }, { assignedTo: req.user.id }],
    });

    if (allTasks) {
      return res.status(200).json({ success: true, allTasks });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getTask = async (req, res) => {
  try {
    let task = await TaskModel.findById({ _id: req.params.id });
    if (task) {
      return res.status(200).json({ success: true, task });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    let hasDeleted = await TaskModel.findByIdAndDelete({ _id: req.params.id });

    if (hasDeleted) {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  if (!title || !description || !dueDate || !priority || !status) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  } else if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof dueDate !== "string" ||
    typeof priority !== "string" ||
    typeof status !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields should be string" });
  } else {
    try {
      let updateTask = await TaskModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          title,
          description,
          dueDate,
          priority,
          status,
        },
        { new: true }
      );

      if (updateTask) {
        return res.status(200).json({
          success: true,
          message: "Task updated successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const assignTask = async (req, res) => {
  const { assignedTo, taskId } = req.body;

  try {
    let hasAssigned = await TaskModel.findByIdAndUpdate(
      taskId,
      { assignedTo },
      { new: true }
    );

    if (hasAssigned) {
      return res
        .status(200)
        .json({ success: true, message: "Task assigned successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const unAssignTask = async (req, res) => {
  try {
    let hasUnAssigned = await TaskModel.findByIdAndUpdate(
      req.params.id,
      { assignedTo: null },
      { new: true }
    );

    if (hasUnAssigned) {
      return res
        .status(200)
        .json({ success: true, message: "Task Un-assigned successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
