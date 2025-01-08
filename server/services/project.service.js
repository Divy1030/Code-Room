import projectModel from '../models/project.model.js';
import userModel from '../models/user.model.js';
import mongoose from 'mongoose';

export const createProject = async ({ name, userId }) => {
    if (!name) {
        throw new Error('Name is required');
    }
    if (!userId) {
        throw new Error('User is required');
    }
    let project;
    try {
        project = await projectModel.create({
            name,
            users: [ userId ]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }

    return project;
};

export const getAllProjectsByUserId = async (userId) => {
    if (!userId) {
        throw new Error('User is required');
    }
    const allUserProject = await projectModel.find({ users: userId });
    return allUserProject;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid Project ID');
    }
    if (!users) {
      throw new Error('Users are required');
    }
    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
      throw new Error('Users must be an array of valid ObjectId');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }
  
    const project = await projectModel.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
  

    if (!Array.isArray(project.users)) {
      project.users = [project.users];
    }

    const existingUsers = project.users.map(user => user.toString());
    const duplicateUsers = users.filter(user => existingUsers.includes(user.toString()));

    if (duplicateUsers.length > 0) {
        const duplicateUserNames = await userModel.find({ _id: { $in: duplicateUsers } }).select('email');
        const duplicateUserEmails = duplicateUserNames.map(user => user.email).join(', ');
        throw new Error(`User ${duplicateUserEmails} already exist in this project`);
    }
    project.users = [...new Set([...project.users, ...users])];
    await project.save();
  
    return project;
  };

  export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users', 'email');

    return project;
}