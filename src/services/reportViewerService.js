import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reports';

const reportViewerService = {
    /**
     * Get preview URL for a report
     * @param {string} folder - Folder name
     * @param {string} fileName - File name
     * @returns {string} Preview URL
     */
    getPreviewUrl: (folder, fileName) => {
        return `${API_BASE_URL}/preview?folder=${encodeURIComponent(folder)}&fileName=${encodeURIComponent(fileName)}`;
    },

    /**
     * Get report metadata
     * @param {string} folder - Folder name
     * @param {string} fileName - File name
     * @returns {Promise} Report metadata
     */
    getReportMetadata: async (folder, fileName) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/metadata`, {
                params: { folder, fileName }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching report metadata:', error);
            throw error;
        }
    },

    /**
     * Get download URL for a report
     * @param {string} folder - Folder name
     * @param {string} fileName - File name
     * @returns {string} Download URL
     */
    getDownloadUrl: (folder, fileName) => {
        return `http://localhost:8080/api/files/download?folder=${encodeURIComponent(folder)}&fileName=${encodeURIComponent(fileName)}`;
    }
};

export default reportViewerService;
