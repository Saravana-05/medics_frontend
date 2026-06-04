// src/services/doctorService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/doctors/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw error;
  }
};

// Get doctors by staff ID
export const getDoctorsByStaffId = async (staffId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/doctors/staff/${staffId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching doctors by staff:', error);
    throw error;
  }
};

// Get doctors by department
export const getDoctorsByDepartment = async (departmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/doctors/department/${departmentId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching doctors by department:', error);
    throw error;
  }
};

// Create doctor - Using FormData
export const createDoctor = async (doctorData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("staff_id", doctorData.staff_id || "");
    formData.append("department_id", doctorData.department_id || "");
    formData.append("doctor_registration_no", doctorData.doctor_registration_no || "");
    formData.append("qualification", doctorData.qualification || "");
    formData.append("specialization", doctorData.specialization || "");
    formData.append("consultation_fee", doctorData.consultation_fee || "");
    formData.append("experience_years", doctorData.experience_years || "");
    formData.append("available_from", doctorData.available_from || "");
    formData.append("available_to", doctorData.available_to || "");
    formData.append("signature_url", doctorData.signature_url || "");
    formData.append("status", doctorData.status || "ACTIVE");

    const response = await axios.post(`${API_BASE_URL}/api/doctors/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

// Update doctor - Using FormData
export const updateDoctor = async (id, doctorData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("staff_id", doctorData.staff_id || "");
    formData.append("department_id", doctorData.department_id || "");
    formData.append("doctor_registration_no", doctorData.doctor_registration_no || "");
    formData.append("qualification", doctorData.qualification || "");
    formData.append("specialization", doctorData.specialization || "");
    formData.append("consultation_fee", doctorData.consultation_fee || "");
    formData.append("experience_years", doctorData.experience_years || "");
    formData.append("available_from", doctorData.available_from || "");
    formData.append("available_to", doctorData.available_to || "");
    formData.append("signature_url", doctorData.signature_url || "");
    formData.append("status", doctorData.status || "ACTIVE");

    const response = await axios.put(`${API_BASE_URL}/api/doctors/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

// Delete doctor
export const deleteDoctor = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};