const API_BASE = 'https://eventhubbackend-production-0f15.up.railway.app/api'; // Production URL
// const API_BASE = 'http://localhost:8080/api'; // Local URL

// Helper function to include JWT token in all secure requests
const getAuthHeaders = () => {
    const token = localStorage.getItem('eh_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const DB = {
    // --- Auth API ---
    login: async (email, password) => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const response = await res.json();
            
            // Expected ApiResponse format: { success: true, message: "", data: { token, user } }
            if (res.ok && response.success) {
                localStorage.setItem('eh_session', JSON.stringify(response.data.user));
                localStorage.setItem('eh_token', response.data.token);
                return { success: true, user: response.data.user };
            }
            return { success: false, message: response.message || 'Invalid credentials' };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Server error. Is the Spring Boot backend running?' };
        }
    },
    forgotPassword: async (email, newPassword) => {
        try {
            const res = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            return await res.json();
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Server error during password reset.' };
        }
    },
    register: async (name, email, password, role, phone) => {
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role, phone })
            });
            const response = await res.json();
            
            if (res.ok && response.success) {
                localStorage.setItem('eh_session', JSON.stringify(response.data.user));
                localStorage.setItem('eh_token', response.data.token);
                return { success: true, user: response.data.user };
            }
            return { success: false, message: response.message || 'Registration failed' };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Server error. Is the Spring Boot backend running?' };
        }
    },
    logout: () => {
        localStorage.removeItem('eh_session');
        localStorage.removeItem('eh_token');
    },
    getSession: () => {
        return JSON.parse(localStorage.getItem('eh_session'));
    },
    
    // --- Users API ---
    getUsers: async () => {
        const res = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() });
        if (!res.ok) return [];
        return await res.json();
    },
    deleteUser: async (id) => {
        await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    },
    updateUser: async (id, name, email, password, role, phone, profileImage) => {
        try {
            const res = await fetch(`${API_BASE}/users/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ name, email, password, role, phone, profileImage })
            });
            const response = await res.json();
            if (res.ok && response.success) {
                const session = DB.getSession();
                if (session && session.id === id) {
                    localStorage.setItem('eh_session', JSON.stringify(response.data));
                }
            }
            return response;
        } catch (err) {
            console.error("Error updating user:", err);
            return { success: false, message: 'Failed to update.' };
        }
    },

    // --- Events API ---
    createEvent: async (title, desc, date, time, location, capacity, isFree, price, organizerId) => {
        const res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, desc, date, time, location, capacity, isFree, price, organizerId, status: 'PENDING' })
        });
        return await res.json();
    },
    updateEventStatus: async (eventId, status) => {
        const res = await fetch(`${API_BASE}/events/${eventId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        return res.ok;
    },
    getAllEvents: async () => {
        // Events might be public, but we send headers just in case
        const res = await fetch(`${API_BASE}/events`, { headers: getAuthHeaders() });
        if (!res.ok) return [];
        return await res.json();
    },
    deleteEvent: async (id) => {
        await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    },

    // --- Bookings API ---
    bookEvent: async (eventId, userId) => {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ eventId, userId })
        });
        return await res.json();
    },
    cancelBooking: async (bookingId) => {
        await fetch(`${API_BASE}/bookings/${bookingId}`, { method: 'DELETE', headers: getAuthHeaders() });
    },
    getUserBookings: async (userId) => {
        const res = await fetch(`${API_BASE}/bookings/user/${userId}`, { headers: getAuthHeaders() });
        if (!res.ok) return [];
        return await res.json();
    },
    getEventAttendees: async (eventId) => {
        const res = await fetch(`${API_BASE}/bookings/event/${eventId}`, { headers: getAuthHeaders() });
        if (!res.ok) return [];
        return await res.json();
    },
    addGalleryImage: async (eventId, imageUrl) => {
        const res = await fetch(`${API_BASE}/events/${eventId}/gallery`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ imageUrl })
        });
        return await res.json();
    },
    removeGalleryImage: async (eventId, imageUrl) => {
        const res = await fetch(`${API_BASE}/events/${eventId}/gallery`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ imageUrl })
        });
        return await res.json();
    },
    uploadGalleryImage: async (eventId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('eh_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_BASE}/events/${eventId}/gallery/upload`, {
            method: 'POST',
            headers: headers,
            body: formData
        });
        return await res.json();
    }
};
