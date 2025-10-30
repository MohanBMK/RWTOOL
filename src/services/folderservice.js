import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const folderService = {
    // Get all folders in reports directory
    listReportFolders: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/folders`);
            return response.data;
        } catch (error) {
            console.error('Error fetching report folders:', error);
            throw error;
        }
    },

    // Get files in a specific folder
    listFilesInFolder: async (folderName) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/folders/${folderName}/files`);
            return response.data;
        } catch (error) {
            console.error('Error fetching files in folder:', error);
            throw error;
        }
    },

    // Get all files accessible by a user
    getUserAccessibleFiles: async (email) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/folders/user/${email}/files`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user accessible files:', error);
            throw error;
        }
    }
};

export default folderService;
