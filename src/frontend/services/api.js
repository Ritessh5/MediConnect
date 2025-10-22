// API Base URL
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Helper function to make API calls
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

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Save tokens to localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Save tokens to localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await apiCall('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiCall('/auth/me', {
      method: 'GET',
    });
  },

  // Change password
  changePassword: async (passwords) => {
    return await apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  },
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get current user from localStorage
export const getCurrentUserFromStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Doctor API calls
export const doctorAPI = {
  // Get all doctors
  getAllDoctors: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiCall(`/doctors${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    return await apiCall(`/doctors/${id}`, {
      method: 'GET',
    });
  },

  // Get specializations
  getSpecializations: async () => {
    return await apiCall('/doctors/specializations/list', {
      method: 'GET',
    });
  },
};

// Appointment API calls
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
// Medicine API calls
export const medicineAPI = {
  // Search medicines
  // FIX: Renamed 'symptom' to 'type' and append 'type' parameter
  searchMedicines: async (query, type = 'name') => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    // CRITICAL FIX: The backend expects 'type', not 'symptom'.
    if (type) params.append('type', type);
    
    return await apiCall(`/medicines/search?${params.toString()}`, {
      method: 'GET',
    });
  },

  // Get all medicines
  getAllMedicines: async () => {
    return await apiCall('/medicines', {
      method: 'GET',
    });
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    return await apiCall(`/medicines/${id}`, {
      method: 'GET',
    });
  },
};

// Chat API calls
export const chatAPI = {
  // Create or get chat
  createOrGetChat: async (doctorId, appointmentId = null) => {
    return await apiCall('/chat', {
      method: 'POST',
      body: JSON.stringify({ doctorId, appointmentId }),
    });
  },

  // Get my chats
  getMyChats: async () => {
    return await apiCall('/chat', {
      method: 'GET',
    });
  },

  // Get chat messages
  getChatMessages: async (chatId) => {
    return await apiCall(`/chat/${chatId}/messages`, {
      method: 'GET',
    });
  },

  // Send message
  sendMessage: async (chatId, message) => {
    return await apiCall(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
// Prescription API calls
export const prescriptionAPI = {
  // Get my prescriptions (patient)
  getMyPrescriptions: async () => {
    return await apiCall('/prescriptions/my-prescriptions', {
      method: 'GET',
    });
  },

  // Get prescription by ID
  getPrescriptionById: async (id) => {
    return await apiCall(`/prescriptions/${id}`, {
      method: 'GET',
    });
  },

  // Create prescription (doctor)
  createPrescription: async (prescriptionData) => {
    return await apiCall('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  },

};
