import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const userGroupService = {
    // Get all user groups
    getAllGroups: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-groups`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user groups:', error);
            throw error;
        }
    },

    // Get user group by ID
    getGroupById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-groups/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user group:', error);
            throw error;
        }
    },

    // Get groups by user email
    getGroupsByUserEmail: async (email) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-groups/user/${email}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user groups:', error);
            throw error;
        }
    },

    // Get user's accessible folders
    getUserAccessibleFolders: async (email) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-groups/user/${email}/folders`);
            return response.data;
        } catch (error) {
            console.error('Error fetching accessible folders:', error);
            throw error;
        }
    },

    // Create new user group
    createGroup: async (groupData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user-groups`, groupData);
            return response.data;
        } catch (error) {
            console.error('Error creating user group:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    // Update user group
    updateGroup: async (id, groupData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/user-groups/${id}`, groupData);
            return response.data;
        } catch (error) {
            console.error('Error updating user group:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    // Delete user group
    deleteGroup: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/user-groups/${id}`);
        } catch (error) {
            console.error('Error deleting user group:', error);
            throw error;
        }
    },

    // Add user to group
    addUserToGroup: async (groupId, userEmail) => {
        try {
            await axios.post(`${API_BASE_URL}/user-groups/${groupId}/members`, userEmail);
        } catch (error) {
            console.error('Error adding user to group:', error);
            throw error;
        }
    },

    // Remove user from group
    removeUserFromGroup: async (groupId, userEmail) => {
        try {
            await axios.delete(`${API_BASE_URL}/user-groups/${groupId}/members/${userEmail}`);
        } catch (error) {
            console.error('Error removing user from group:', error);
            throw error;
        }
    }
};
export default userGroupService;