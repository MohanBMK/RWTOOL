import { useState } from "react";
import "./FilePathManagement.css";

export const FilePathManagement = () => {
  const [pathConfigs, setPathConfigs] = useState([
    { 
      id: "1", 
      reportName: "KYC Reports", 
      sourcePath: "/incoming/kyc", 
      outputPath: "/reports/compliance/kyc",
      status: "Active",
      createdDate: "2024-01-15" 
    },
    { 
      id: "2", 
      reportName: "Dormant Reports", 
      sourcePath: "/incoming/dormant", 
      outputPath: "/reports/compliance/dormant",
      status: "Active",
      createdDate: "2024-02-20" 
    },
    { 
      id: "3", 
      reportName: "AML Reports", 
      sourcePath: "/incoming/aml", 
      outputPath: "/reports/compliance/aml",
      status: "Active",
      createdDate: "2024-03-10" 
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [formData, setFormData] = useState({ 
    reportName: "", 
    sourcePath: "", 
    outputPath: "",
    status: "Active"
  });
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfigId, setDeleteConfigId] = useState(null);

  const openModal = (config = null) => {
    setEditingConfig(config);
    setFormData(
      config 
        ? { 
            reportName: config.reportName, 
            sourcePath: config.sourcePath,
            outputPath: config.outputPath,
            status: config.status
          } 
        : { reportName: "", sourcePath: "", outputPath: "", status: "Active" }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingConfig(null);
    setFormData({ reportName: "", sourcePath: "", outputPath: "", status: "Active" });
  };

  const saveConfig = () => {
    if (!formData.reportName.trim() || !formData.sourcePath.trim() || !formData.outputPath.trim()) {
      setNotification("All fields are required");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    const isDuplicate = pathConfigs.some(
      (c) => 
        c.reportName.toLowerCase() === formData.reportName.trim().toLowerCase() && 
        c.id !== editingConfig?.id
    );
    
    if (isDuplicate) {
      setNotification("Report name already exists");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    if (editingConfig) {
      setPathConfigs(
        pathConfigs.map(c => 
          c.id === editingConfig.id 
            ? { 
                ...c, 
                reportName: formData.reportName, 
                sourcePath: formData.sourcePath,
                outputPath: formData.outputPath,
                status: formData.status
              } 
            : c
        )
      );
      setNotification("Path configuration updated successfully");
    } else {
      const newConfig = {
        id: Date.now().toString(),
        reportName: formData.reportName,
        sourcePath: formData.sourcePath,
        outputPath: formData.outputPath,
        status: formData.status,
        createdDate: new Date().toISOString().split("T")[0]
      };
      setPathConfigs([...pathConfigs, newConfig]);
      setNotification("Path configuration created successfully");
    }

    closeModal();
    setTimeout(() => setNotification(""), 3000);
  };

  const openDeleteConfirm = (configId) => {
    setDeleteConfigId(configId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteConfigId(null);
  };

  const deleteConfig = () => {
    setPathConfigs(pathConfigs.filter(c => c.id !== deleteConfigId));
    setNotification("Path configuration deleted successfully");
    closeDeleteConfirm();
    setTimeout(() => setNotification(""), 3000);
  };

  const toggleStatus = (configId) => {
    setPathConfigs(
      pathConfigs.map(c => 
        c.id === configId 
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } 
          : c
      )
    );
    setNotification("Status updated successfully");
    setTimeout(() => setNotification(""), 2000);
  };

  const filteredConfigs = pathConfigs.filter(
    (c) =>
      c.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sourcePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.outputPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fpm-container">
      {notification && (
        <div className="fpm-notification">{notification}</div>
      )}

      <div className="fpm-header">
        <div>
          <h1 className="fpm-title">File Path Management</h1>
          <p className="fpm-subtitle">Configure automatic file transfer paths for reports</p>
        </div>
        <button className="fpm-btn-primary" onClick={() => openModal()}>
          + Add Path Configuration
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by report name or path..."
        className="fpm-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="fpm-table">
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Source Path</th>
            <th>Output Path</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredConfigs.length === 0 ? (
            <tr>
              <td colSpan="6" className="fpm-no-data">
                No path configurations found
              </td>
            </tr>
          ) : (
            filteredConfigs.map((config) => (
              <tr key={config.id}>
                <td className="fpm-bold">{config.reportName}</td>
                <td className="fpm-path">{config.sourcePath}</td>
                <td className="fpm-path">{config.outputPath}</td>
                <td>
                  <span 
                    className={`fpm-badge ${config.status.toLowerCase()}`}
                    onClick={() => toggleStatus(config.id)}
                  >
                    {config.status}
                  </span>
                </td>
                <td>{new Date(config.createdDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="fpm-btn-edit"
                    onClick={() => openModal(config)}
                  >
                    Edit
                  </button>
                  <button
                    className="fpm-btn-delete"
                    onClick={() => openDeleteConfirm(config.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fpm-modal-backdrop" onClick={closeModal}>
          <div className="fpm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="fpm-modal-title">
              {editingConfig ? "Edit Path Configuration" : "Create Path Configuration"}
            </h2>
            <input
              type="text"
              placeholder="Report Name (e.g., KYC Reports)"
              className="fpm-input"
              value={formData.reportName}
              onChange={(e) =>
                setFormData({ ...formData, reportName: e.target.value })
              }
              autoFocus
            />
            <input
              type="text"
              placeholder="Source Path (e.g., /incoming/kyc)"
              className="fpm-input"
              value={formData.sourcePath}
              onChange={(e) =>
                setFormData({ ...formData, sourcePath: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Output Path (e.g., /reports/compliance/kyc)"
              className="fpm-input"
              value={formData.outputPath}
              onChange={(e) =>
                setFormData({ ...formData, outputPath: e.target.value })
              }
            />
            <select
              className="fpm-select"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="fpm-modal-actions">
              <button className="fpm-btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="fpm-btn-primary" onClick={saveConfig}>
                {editingConfig ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fpm-modal-backdrop" onClick={closeDeleteConfirm}>
          <div className="fpm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="fpm-modal-title">Delete Path Configuration</h2>
            <p className="fpm-modal-text">
              Are you sure you want to delete this path configuration? This action cannot be undone.
            </p>
            <div className="fpm-modal-actions">
              <button className="fpm-btn-cancel" onClick={closeDeleteConfirm}>
                Cancel
              </button>
              <button className="fpm-btn-delete" onClick={deleteConfig}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};