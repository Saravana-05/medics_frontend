// src/services/nurseService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all nurses
export const getAllNurses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/nurses/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching nurses:', error);
    throw error;
  }
};

// Get nurse by ID
export const getNurseById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/nurses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nurse:', error);
    throw error;
  }
};

// Get nurses by staff ID
export const getNursesByStaffId = async (staffId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/nurses/staff/${staffId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching nurses by staff:', error);
    throw error;
  }
};

// Get nurses by department
export const getNursesByDepartment = async (departmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/nurses/department/${departmentId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching nurses by department:', error);
    throw error;
  }
};

// Create nurse - Using FormData
export const createNurse = async (nurseData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("staff_id", nurseData.staff_id || "");
    formData.append("department_id", nurseData.department_id || "");
    formData.append("qualification", nurseData.qualification || "");
    formData.append("shift_type", nurseData.shift_type || "");
    formData.append("status", nurseData.status || "ACTIVE");

    const response = await axios.post(`${API_BASE_URL}/api/nurses/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating nurse:', error);
    throw error;
  }
};

// Update nurse - Using FormData
export const updateNurse = async (id, nurseData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("staff_id", nurseData.staff_id || "");
    formData.append("department_id", nurseData.department_id || "");
    formData.append("qualification", nurseData.qualification || "");
    formData.append("shift_type", nurseData.shift_type || "");
    formData.append("status", nurseData.status || "ACTIVE");

    const response = await axios.put(`${API_BASE_URL}/api/nurses/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating nurse:', error);
    throw error;
  }
};

// Delete nurse
export const deleteNurse = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/nurses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting nurse:', error);
    throw error;
  }
};