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
  },

  /**
   * Download multiple files as a ZIP
   * @param {Array<{folder:string,fileName:string}>} files
   * @param {string} zipName
   * @returns {Blob} zip Blob
   */
  downloadBatch: async (files, zipName = "reports.zip") => {
    const res = await fetch(`${API_BASE_URL}/api/files/download/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files, zipName })
    });
    if (!res.ok) throw new Error("Failed to download selected reports");
    const blob = await res.blob();
    return blob;
  },

  /**
   * Favorites APIs
   */
  getFavorites: async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/favorites?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to load favorites");
      const data = await res.json();
      return data.favorites || [];
    } catch (e) {
      console.error("Error fetching favorites:", e);
      return [];
    }
  },
  addFavorite: async (userId, folder, fileName) => {
    const res = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, folder, fileName })
    });
    if (!res.ok) throw new Error("Failed to add favorite");
    return res.json();
  },
  removeFavorite: async (userId, folder, fileName) => {
    const res = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, folder, fileName })
    });
    if (!res.ok) throw new Error("Failed to remove favorite");
    return res.json();
  }
};

export default reportService;