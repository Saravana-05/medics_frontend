// src/services/roleService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all roles
export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/roles/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Get role by ID
export const getRoleById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};

// Create role
export const createRole = async (roleData) => {
  try {
    const formData = new FormData();
    formData.append("name", roleData.name || "");
    formData.append("description", roleData.description || "");

    const response = await axios.post(`${API_BASE_URL}/api/roles/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Update role
export const updateRole = async (id, roleData) => {
  try {
    const formData = new FormData();
    formData.append("name", roleData.name || "");
    formData.append("description", roleData.description || "");
    formData.append("is_active", roleData.is_active || "true");

    const response = await axios.put(`${API_BASE_URL}/api/roles/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Delete role
export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};