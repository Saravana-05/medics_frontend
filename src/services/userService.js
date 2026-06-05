// src/services/userService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Create user with auto_verify
export const createUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append("full_name", userData.full_name || "");
    formData.append("email", userData.email || "");
    formData.append("password", userData.password || "");
    formData.append("contact", userData.contact || "");

    const response = await axios.post(`${API_BASE_URL}/api/users/?auto_verify=true`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user (soft delete - deactivate)
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Assign role to user
export const assignRoleToUser = async (userId, roleId, assignedBy = "") => {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("role_id", roleId);
    if (assignedBy) {
      formData.append("assigned_by", assignedBy);
    }

    const response = await axios.post(`${API_BASE_URL}/api/user-roles/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
};

// Get user roles
export const getUserRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user-roles/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};