import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const subscriptionService = {
    // Get all subscription requests (admin)
    getAllRequests: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/subscriptions`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription requests:', error);
            throw error;
        }
    },

    // Get pending requests (admin)
    getPendingRequests: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/subscriptions/pending`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            throw error;
        }
    },

    // Get requests by user email (user)
    getRequestsByUser: async (email) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/subscriptions/user/${email}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user requests:', error);
            throw error;
        }
    },

    // Create new subscription request (user)
    createRequest: async (requestData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/subscriptions`, requestData);
            return response.data;
        } catch (error) {
            console.error('Error creating subscription request:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    // Approve request (admin)
    approveRequest: async (requestId) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/subscriptions/${requestId}/approve`);
            return response.data;
        } catch (error) {
            console.error('Error approving request:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    // Reject request (admin)
    rejectRequest: async (requestId, rejectionReason) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/subscriptions/${requestId}/reject`,
                { rejectionReason }
            );
            return response.data;
        } catch (error) {
            console.error('Error rejecting request:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    // Review request with decision (admin)
    reviewRequest: async (requestId, action, rejectionReason = null) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/subscriptions/${requestId}/review`,
                { action, rejectionReason }
            );
            return response.data;
        } catch (error) {
            console.error('Error reviewing request:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    // Cancel request (user)
    cancelRequest: async (requestId, userEmail) => {
        try {
            await axios.delete(`${API_BASE_URL}/subscriptions/${requestId}/cancel?userEmail=${userEmail}`);
        } catch (error) {
            console.error('Error cancelling request:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    }
};

export default subscriptionService;