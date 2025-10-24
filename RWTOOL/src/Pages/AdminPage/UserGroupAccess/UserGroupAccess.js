import { useState, useEffect } from "react";
import "./UserGroupAccess.css";

// Available domains data
const DOMAINS = [
  { 
    id: "1", 
    name: "Financial Reports", 
    description: "All financial and accounting reports", 
    createdDate: "2024-01-15" 
  },
  { 
    id: "2", 
    name: "Operations", 
    description: "Operational metrics and performance reports", 
    createdDate: "2024-02-20" 
  },
  { 
    id: "3", 
    name: "HR Analytics", 
    description: "Human resources and workforce analytics", 
    createdDate: "2024-03-10" 
  }
];

// Available folders for access control
const AVAILABLE_FOLDERS = [
  "SCB",
  "AML",
  "AML/General",
  "Credit Admin",
  "Credit Admin/Credit Risk",
  "Compliance",
  "Finance Department",
  "Operations",
  "Treasury",
  "Investment Banking"
];

export const UserGroupAccess = () => {
  const [userGroups, setUserGroups] = useState([
    { 
      id: "1", 
      adGroupName: "Wealth Compliance", 
      folderAccess: ["Compliance", "AML/General"],
      associatedDomain: "Financial Reports",
      users: ["john.doe@company.com", "jane.smith@company.com"],
      createdDate: "2024-01-15" 
    },
    { 
      id: "2", 
      adGroupName: "Wealth User Admin", 
      folderAccess: ["Operations", "Finance Department"],
      associatedDomain: "Operations",
      users: ["admin.user@company.com"],
      createdDate: "2024-02-20" 
    }
  ]);

  const [availableDomains, setAvailableDomains] = useState([]);

  // Load domains from raw data
  useEffect(() => {
    setAvailableDomains(DOMAINS);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({ 
    adGroupName: "", 
    folderAccess: [],
    associatedDomain: "",
    users: []
  });
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(null);
  

  const openModal = (group = null) => {
    setEditingGroup(group);
    setFormData(
      group 
        ? { 
            adGroupName: group.adGroupName, 
            folderAccess: [...group.folderAccess],
            associatedDomain: group.associatedDomain || "",
            users: [...group.users]
          } 
        : { adGroupName: "", folderAccess: [], associatedDomain: "", users: [] }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGroup(null);
    setFormData({ adGroupName: "", folderAccess: [], associatedDomain: "", users: [] });
  };

  // Toggle folder selection
  const toggleFolder = (folder) => {
    setFormData(prev => ({
      ...prev,
      folderAccess: prev.folderAccess.includes(folder)
        ? prev.folderAccess.filter(f => f !== folder)
        : [...prev.folderAccess, folder]
    }));
  };

  const saveGroup = () => {
    if (!formData.adGroupName.trim() || formData.folderAccess.length === 0 || !formData.associatedDomain.trim()) {
      setNotification("AD Group Name, at least one Folder, and Associated Domain are required");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    const isDuplicate = userGroups.some(
      (g) => 
        g.adGroupName.toLowerCase() === formData.adGroupName.trim().toLowerCase() && 
        g.id !== editingGroup?.id
    );
    
    if (isDuplicate) {
      setNotification("AD Group Name already exists");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    if (editingGroup) {
      setUserGroups(
        userGroups.map(g => 
          g.id === editingGroup.id 
            ? { 
                ...g, 
                adGroupName: formData.adGroupName, 
                folderAccess: formData.folderAccess,
                associatedDomain: formData.associatedDomain,
                users: formData.users
              } 
            : g
        )
      );
      setNotification("User group updated successfully");
    } else {
      const newGroup = {
        id: Date.now().toString(),
        adGroupName: formData.adGroupName,
        folderAccess: formData.folderAccess,
        associatedDomain: formData.associatedDomain,
        users: formData.users,
        createdDate: new Date().toISOString().split("T")[0]
      };
      setUserGroups([...userGroups, newGroup]);
      setNotification("User group created successfully");
    }

    closeModal();
    setTimeout(() => setNotification(""), 3000);
  };

  const openDeleteConfirm = (groupId) => {
    setDeleteGroupId(groupId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteGroupId(null);
  };

  const deleteGroup = () => {
    setUserGroups(userGroups.filter(g => g.id !== deleteGroupId));
    setNotification("User group deleted successfully");
    closeDeleteConfirm();
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredGroups = userGroups.filter(
    (g) =>
      g.adGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.folderAccess.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.reportAccess.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="uga-container">
      {/* Notification */}
      {notification && (
        <div className="uga-notification">{notification}</div>
      )}

      {/* Header */}
      <div className="uga-header">
        <div>
          <h1 className="uga-title">User Group Access Management</h1>
          <p className="uga-subtitle">Manage Active Directory groups and their access permissions</p>
        </div>
        <button className="uga-btn-primary" onClick={() => openModal()}>
          + Add User Group
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by AD group name, folder, or report..."
        className="uga-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Cards Grid */}
      <div className="uga-grid">
        {filteredGroups.length === 0 ? (
          <div className="uga-no-data">No user groups found</div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.id} className="uga-card">
              <div className="uga-card-header">
                <h3 className="uga-card-title">{group.adGroupName}</h3>
                <div className="uga-card-actions">
                  <button
                    className="uga-btn-edit-small"
                    onClick={() => openModal(group)}
                  >
                    Edit
                  </button>
                  <button
                    className="uga-btn-delete-small"
                    onClick={() => openDeleteConfirm(group.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="uga-card-body">
                <p className="uga-description">Access to compliance and regulatory reports</p>
                
                <div className="uga-stats-row">
                  <div className="uga-stat">
                    <span className="uga-stat-icon">👥</span>
                    <span className="uga-stat-value">{group.users.length} Members</span>
                  </div>
                  <div className="uga-stat">
                    <span className="uga-stat-icon">📁</span>
                    <span className="uga-stat-value">{group.folderAccess.length} Folders</span>
                  </div>
                </div>
                
                <div className="uga-info-section">
                  <span className="uga-section-label">FOLDER ACCESS:</span>
                  <div className="uga-folder-tags">
                    {group.folderAccess.map((folder, idx) => (
                      <span key={idx} className="uga-folder-tag">{folder}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="uga-modal-backdrop" onClick={closeModal}>
          <div className="uga-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="uga-modal-title">
              {editingGroup ? "Edit User Group" : "Create User Group"}
            </h2>
            
            <div className="uga-form-section">
              <label className="uga-form-label">AD Group Name *</label>
              <input
                type="text"
                placeholder="e.g., Wealth Compliance"
                className="uga-input"
                value={formData.adGroupName}
                onChange={(e) =>
                  setFormData({ ...formData, adGroupName: e.target.value })
                }
                autoFocus
              />
            </div>

            <div className="uga-form-section">
              <label className="uga-form-label">Associated Domain *</label>
              <select
                className="uga-select"
                value={formData.associatedDomain}
                onChange={(e) =>
                  setFormData({ ...formData, associatedDomain: e.target.value })
                }
              >
                <option value="">-- Select Domain --</option>
                {availableDomains.map((domain) => (
                  <option key={domain.id} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="uga-form-section">
              <label className="uga-form-label">Folder Access *</label>
              <p className="uga-form-sublabel">Select folders this group can access</p>
              <div className="uga-folder-grid">
                {AVAILABLE_FOLDERS.map((folder) => (
                  <label key={folder} className="uga-folder-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.folderAccess.includes(folder)}
                      onChange={() => toggleFolder(folder)}
                    />
                    <span className="uga-folder-icon">📁</span>
                    <span className="uga-folder-name">{folder}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="uga-modal-actions">
              <button className="uga-btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="uga-btn-primary" onClick={saveGroup}>
                {editingGroup ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="uga-modal-backdrop" onClick={closeDeleteConfirm}>
          <div className="uga-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="uga-modal-title">Delete User Group</h2>
            <p className="uga-modal-text">
              Are you sure you want to delete this user group? All users will lose their access permissions. This action cannot be undone.
            </p>
            <div className="uga-modal-actions">
              <button className="uga-btn-cancel" onClick={closeDeleteConfirm}>
                Cancel
              </button>
              <button className="uga-btn-delete" onClick={deleteGroup}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
