const API_BASE_URL = "http://localhost:8080";

const reportService = {
  /**
   * Get presigned URL for viewing a report
   * @param {string} reportId - The report ID
   * @param {string} userId - The user ID
   * @param {string} folder - The folder path
   * @param {string} fileName - The file name
   */
  presignView: async (reportId, userId, folder, fileName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/${reportId}/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId,
          folder,
          fileName
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to get preview URL");
      }
      
      return res.json();
    } catch (error) {
      console.error("Error in presignView:", error);
      throw error;
    }
  }
};

export default reportService;