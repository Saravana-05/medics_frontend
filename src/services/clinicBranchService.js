// src/services/clinicBranchService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all clinic branches
export const getAllClinicBranches = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clinic-branches/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching clinic branches:', error);
    throw error;
  }
};

// Get clinic branch by ID
export const getClinicBranchById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clinic-branches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic branch:', error);
    throw error;
  }
};

// Get branches by clinic ID
export const getBranchesByClinicId = async (clinicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clinic-branches/?clinic_id=${clinicId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching branches by clinic:', error);
    throw error;
  }
};

// Create clinic branch - Using FormData
export const createClinicBranch = async (branchData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", branchData.clinic_id || "");
    formData.append("branch_code", branchData.branch_code || "");
    formData.append("branch_name", branchData.branch_name || "");
    formData.append("email", branchData.email || "");
    formData.append("mobile", branchData.mobile || "");
    formData.append("address_line1", branchData.address_line1 || "");
    formData.append("address_line2", branchData.address_line2 || "");
    formData.append("city", branchData.city || "");
    formData.append("state", branchData.state || "");
    formData.append("country", branchData.country || "");
    formData.append("pincode", branchData.pincode || "");
    formData.append("is_main_branch", branchData.is_main_branch ? "true" : "false");
    formData.append("status", branchData.status || "ACTIVE");

    const response = await axios.post(`${API_BASE_URL}/api/clinic-branches/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating clinic branch:', error);
    throw error;
  }
};

// Update clinic branch - Using FormData
export const updateClinicBranch = async (id, branchData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", branchData.clinic_id || "");
    formData.append("branch_code", branchData.branch_code || "");
    formData.append("branch_name", branchData.branch_name || "");
    formData.append("email", branchData.email || "");
    formData.append("mobile", branchData.mobile || "");
    formData.append("address_line1", branchData.address_line1 || "");
    formData.append("address_line2", branchData.address_line2 || "");
    formData.append("city", branchData.city || "");
    formData.append("state", branchData.state || "");
    formData.append("country", branchData.country || "");
    formData.append("pincode", branchData.pincode || "");
    formData.append("is_main_branch", branchData.is_main_branch ? "true" : "false");
    formData.append("status", branchData.status || "ACTIVE");

    const response = await axios.put(`${API_BASE_URL}/api/clinic-branches/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating clinic branch:', error);
    throw error;
  }
};

// Delete clinic branch
export const deleteClinicBranch = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/clinic-branches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting clinic branch:', error);
    throw error;
  }
};