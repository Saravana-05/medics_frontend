// src/services/staffService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all staff members
export const getAllStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/staff/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

// Get staff by ID
export const getStaffById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

// Get staff by clinic ID
export const getStaffByClinicId = async (clinicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/staff/?clinic_id=${clinicId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching staff by clinic:', error);
    throw error;
  }
};

// Create staff - Using FormData
export const createStaff = async (staffData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", staffData.clinic_id || "");
    formData.append("staff_code", staffData.staff_code || "");
    formData.append("first_name", staffData.first_name || "");
    formData.append("branch_id", staffData.branch_id || "");
    formData.append("department_id", staffData.department_id || "");
    formData.append("user_id", staffData.user_id || "");
    formData.append("last_name", staffData.last_name || "");
    formData.append("gender", staffData.gender || "");
    formData.append("dob", staffData.dob || "");
    formData.append("mobile", staffData.mobile || "");
    formData.append("email", staffData.email || "");
    formData.append("address_line1", staffData.address_line1 || "");
    formData.append("address_line2", staffData.address_line2 || "");
    formData.append("city", staffData.city || "");
    formData.append("state", staffData.state || "");
    formData.append("country", staffData.country || "");
    formData.append("pincode", staffData.pincode || "");
    formData.append("designation", staffData.designation || "");
    formData.append("joining_date", staffData.joining_date || "");
    formData.append("status", staffData.status || "ACTIVE");

    const response = await axios.post(`${API_BASE_URL}/api/staff/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

// Update staff - Using FormData
export const updateStaff = async (id, staffData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", staffData.clinic_id || "");
    formData.append("staff_code", staffData.staff_code || "");
    formData.append("first_name", staffData.first_name || "");
    formData.append("branch_id", staffData.branch_id || "");
    formData.append("department_id", staffData.department_id || "");
    formData.append("user_id", staffData.user_id || "");
    formData.append("last_name", staffData.last_name || "");
    formData.append("gender", staffData.gender || "");
    formData.append("dob", staffData.dob || "");
    formData.append("mobile", staffData.mobile || "");
    formData.append("email", staffData.email || "");
    formData.append("address_line1", staffData.address_line1 || "");
    formData.append("address_line2", staffData.address_line2 || "");
    formData.append("city", staffData.city || "");
    formData.append("state", staffData.state || "");
    formData.append("country", staffData.country || "");
    formData.append("pincode", staffData.pincode || "");
    formData.append("designation", staffData.designation || "");
    formData.append("joining_date", staffData.joining_date || "");
    formData.append("status", staffData.status || "ACTIVE");

    const response = await axios.put(`${API_BASE_URL}/api/staff/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

// Delete staff (soft delete)
export const deleteStaff = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};