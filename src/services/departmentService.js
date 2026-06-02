// src/services/departmentService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all departments
export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/departments/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Get department by ID
export const getDepartmentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department:', error);
    throw error;
  }
};

// Get departments by clinic ID
export const getDepartmentsByClinicId = async (clinicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/departments/?clinic_id=${clinicId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching departments by clinic:', error);
    throw error;
  }
};

// Create department - Using FormData
export const createDepartment = async (departmentData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", departmentData.clinic_id || "");
    formData.append("department_code", departmentData.department_code || "");
    formData.append("department_name", departmentData.department_name || "");
    formData.append("description", departmentData.description || "");
    formData.append("status", departmentData.status || "ACTIVE");

    const response = await axios.post(`${API_BASE_URL}/api/departments/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update department - Using FormData
export const updateDepartment = async (id, departmentData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", departmentData.clinic_id || "");
    formData.append("department_code", departmentData.department_code || "");
    formData.append("department_name", departmentData.department_name || "");
    formData.append("description", departmentData.description || "");
    formData.append("status", departmentData.status || "ACTIVE");

    const response = await axios.put(`${API_BASE_URL}/api/departments/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

// Delete department
export const deleteDepartment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};