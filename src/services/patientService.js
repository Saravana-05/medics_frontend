// src/services/patientService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Get all patients
export const getAllPatients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/patients/`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Get patient by ID
export const getPatientById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

// Get patients by clinic
export const getPatientsByClinic = async (clinicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/patients/?clinic_id=${clinicId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching patients by clinic:', error);
    throw error;
  }
};

// Get patients by branch
export const getPatientsByBranch = async (branchId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/patients/?branch_id=${branchId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching patients by branch:', error);
    throw error;
  }
};

// Create patient - Using FormData
export const createPatient = async (patientData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", patientData.clinic_id || "");
    formData.append("branch_id", patientData.branch_id || "");
    formData.append("patient_no", patientData.patient_no || "");
    formData.append("first_name", patientData.first_name || "");
    formData.append("last_name", patientData.last_name || "");
    formData.append("gender", patientData.gender || "");
    formData.append("dob", patientData.dob || "");
    formData.append("mobile", patientData.mobile || "");
    formData.append("email", patientData.email || "");
    formData.append("address_line1", patientData.address_line1 || "");
    formData.append("address_line2", patientData.address_line2 || "");
    formData.append("city", patientData.city || "");
    formData.append("state", patientData.state || "");
    formData.append("country", patientData.country || "");
    formData.append("pincode", patientData.pincode || "");
    formData.append("allergies", patientData.allergies || "");
    formData.append("chronic_disease", patientData.chronic_disease || "");
    formData.append("insurance_provider", patientData.insurance_provider || "");
    formData.append("insurance_number", patientData.insurance_number || "");
    formData.append("height_cm", patientData.height_cm || "");
    formData.append("weight_kg", patientData.weight_kg || "");
    formData.append("bmi", patientData.bmi || "");
    formData.append("status", patientData.status || "ACTIVE");

    const response = await axios.post(`${API_BASE_URL}/api/patients/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Update patient - Using FormData
export const updatePatient = async (id, patientData) => {
  try {
    const formData = new FormData();
    
    // Append all fields - backend expects Form data
    formData.append("clinic_id", patientData.clinic_id || "");
    formData.append("branch_id", patientData.branch_id || "");
    formData.append("patient_no", patientData.patient_no || "");
    formData.append("first_name", patientData.first_name || "");
    formData.append("last_name", patientData.last_name || "");
    formData.append("gender", patientData.gender || "");
    formData.append("dob", patientData.dob || "");
    formData.append("mobile", patientData.mobile || "");
    formData.append("email", patientData.email || "");
    formData.append("address_line1", patientData.address_line1 || "");
    formData.append("address_line2", patientData.address_line2 || "");
    formData.append("city", patientData.city || "");
    formData.append("state", patientData.state || "");
    formData.append("country", patientData.country || "");
    formData.append("pincode", patientData.pincode || "");
    formData.append("allergies", patientData.allergies || "");
    formData.append("chronic_disease", patientData.chronic_disease || "");
    formData.append("insurance_provider", patientData.insurance_provider || "");
    formData.append("insurance_number", patientData.insurance_number || "");
    formData.append("height_cm", patientData.height_cm || "");
    formData.append("weight_kg", patientData.weight_kg || "");
    formData.append("bmi", patientData.bmi || "");
    formData.append("status", patientData.status || "ACTIVE");

    const response = await axios.put(`${API_BASE_URL}/api/patients/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

// Delete patient
export const deletePatient = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};