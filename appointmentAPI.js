const API_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const appointmentAPI = {
  // Book appointment
  bookAppointment: async (appointmentData) => {
    return await apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Get my appointments
  getMyAppointments: async (status = null) => {
    const query = status ? `?status=${status}` : '';
    return await apiCall(`/appointments/my-appointments${query}`, {
      method: 'GET',
    });
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    return await apiCall(`/appointments/${id}`, {
      method: 'GET',
    });
  },

  // Cancel appointment
  cancelAppointment: async (id, reason) => {
    return await apiCall(`/appointments/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancelReason: reason }),
    });
  },

  // Update appointment status
  updateStatus: async (id, status) => {
    return await apiCall(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};