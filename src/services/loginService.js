// src/services/loginService.js
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

// Login user
export const loginUser = async (email, password) => {
  try {
    // Create form data for URL encoded format
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.detail || 'Login failed',
        data: error.response.data,
      };
    }
    throw {
      status: 500,
      message: 'Network error. Please try again.',
    };
  }
};

// Get user role by email (if you have a separate endpoint)
export const getUserRole = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER_ROLES}`);
    // Find user by email
    const user = response.data.find(u => u.email === email);
    return user;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

// Get all user roles (to map role_name to role)
export const getAllUserRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER_ROLES}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};

// Map role_name to role type
export const mapRoleToUserType = (roleName) => {
  const roleMap = {
    'OP Desk': 'doctor',
    'Front Desk': 'office',
    'Platform Desk': 'platform',
  };
  return roleMap[roleName] || 'doctor';
};