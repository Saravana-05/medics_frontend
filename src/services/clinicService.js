// src/services/clinicService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all clinics
export const getAllClinics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clinics/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
};

// Get clinic by ID
export const getClinicById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clinics/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic:', error);
    throw error;
  }
};

// Create clinic - Using FormData
export const createClinic = async (clinicData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data, not JSON
    formData.append("clinic_code", clinicData.clinic_code || "");
    formData.append("clinic_name", clinicData.clinic_name || "");
    formData.append("clinic_type", clinicData.clinic_type || "");
    formData.append("registration_number", clinicData.registration_number || "");
    formData.append("gst_number", clinicData.gst_number || "");
    formData.append("email", clinicData.email || "");
    formData.append("mobile", clinicData.mobile || "");
    formData.append("alternate_mobile", clinicData.alternate_mobile || "");
    formData.append("address_line1", clinicData.address_line1 || "");
    formData.append("address_line2", clinicData.address_line2 || "");
    formData.append("city", clinicData.city || "");
    formData.append("state", clinicData.state || "");
    formData.append("country", clinicData.country || "");
    formData.append("pincode", clinicData.pincode || "");
    formData.append("website", clinicData.website || "");
    formData.append("logo_url", clinicData.logo_url || "");
    formData.append("status", clinicData.status || "ACTIVE");

    const response = await axios.post(`${API_BASE_URL}/api/clinics/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating clinic:', error);
    throw error;
  }
};

// Update clinic - Using FormData
export const updateClinic = async (id, clinicData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_code", clinicData.clinic_code || "");
    formData.append("clinic_name", clinicData.clinic_name || "");
    formData.append("clinic_type", clinicData.clinic_type || "");
    formData.append("registration_number", clinicData.registration_number || "");
    formData.append("gst_number", clinicData.gst_number || "");
    formData.append("email", clinicData.email || "");
    formData.append("mobile", clinicData.mobile || "");
    formData.append("alternate_mobile", clinicData.alternate_mobile || "");
    formData.append("address_line1", clinicData.address_line1 || "");
    formData.append("address_line2", clinicData.address_line2 || "");
    formData.append("city", clinicData.city || "");
    formData.append("state", clinicData.state || "");
    formData.append("country", clinicData.country || "");
    formData.append("pincode", clinicData.pincode || "");
    formData.append("website", clinicData.website || "");
    formData.append("logo_url", clinicData.logo_url || "");
    formData.append("status", clinicData.status || "ACTIVE");

    const response = await axios.put(`${API_BASE_URL}/api/clinics/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating clinic:', error);
    throw error;
  }
};

// Delete clinic
export const deleteClinic = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/clinics/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting clinic:', error);
    throw error;
  }
};