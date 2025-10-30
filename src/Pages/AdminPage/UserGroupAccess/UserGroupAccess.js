import { useState, useEffect } from "react";
import "./UserGroupAccess.css";
import domainService from '../../../services/domainService';
import userGroupService from "../../../services/usergroupservice";
import folderService from "../../../services/folderservice";

export const UserGroupAccess = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [availableFolders, setAvailableFolders] = useState([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingFolders, setLoadingFolders] = useState(true);

  // Fetch all data on component mount
  useEffect(() => {
    fetchDomains();
    fetchUserGroups();
    fetchFolders();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoadingDomains(true);
      const domains = await domainService.getAllDomains();
      setAvailableDomains(domains);
    } catch (error) {
      console.error('Error fetching domains:', error);
      setNotification('Error loading domains');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setLoadingDomains(false);
    }
  };

  const fetchUserGroups = async () => {
    try {
      setLoadingGroups(true);
      const groups = await userGroupService.getAllGroups();
      setUserGroups(groups);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      setNotification('Error loading user groups');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchFolders = async () => {
    try {
      setLoadingFolders(true);
      const folders = await folderService.listReportFolders();
      setAvailableFolders(folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setNotification('Error loading folders');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setLoadingFolders(false);
    }
  };

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
            adGroupName: group.adGroupName || "", 
            folderAccess: group.folderAccess ? [...group.folderAccess] : [],
            associatedDomain: group.associatedDomain || "",
            users: group.members ? [...group.members] : (group.users ? [...group.users] : [])
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

  const saveGroup = async () => {
    if (!formData.adGroupName.trim() || formData.folderAccess.length === 0 || !formData.associatedDomain.trim()) {
      setNotification("AD Group Name, at least one Folder, and Associated Domain are required");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    try {
      const groupData = {
        adGroupName: formData.adGroupName,
        folderAccess: formData.folderAccess,
        associatedDomain: formData.associatedDomain,
        members: formData.users || []
      };

      if (editingGroup) {
        await userGroupService.updateGroup(editingGroup.id, groupData);
        setNotification("User group updated successfully");
      } else {
        await userGroupService.createGroup(groupData);
        setNotification("User group created successfully");
      }

      closeModal();
      await fetchUserGroups(); // Refresh the list
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error('Error saving user group:', error);
      setNotification(error.message || 'Error saving user group');
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const openDeleteConfirm = (groupId) => {
    setDeleteGroupId(groupId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteGroupId(null);
  };

  const deleteGroup = async () => {
    try {
      await userGroupService.deleteGroup(deleteGroupId);
      setNotification("User group deleted successfully");
      closeDeleteConfirm();
      await fetchUserGroups(); // Refresh the list
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error('Error deleting user group:', error);
      setNotification('Error deleting user group');
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const filteredGroups = userGroups.filter(
    (g) =>
      g.adGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.folderAccess && g.folderAccess.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
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
        {loadingGroups ? (
          <div className="uga-no-data">Loading user groups...</div>
        ) : filteredGroups.length === 0 ? (
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
                    <span className="uga-stat-value">{(group.members || group.users || []).length} Members</span>
                  </div>
                  <div className="uga-stat">
                    <span className="uga-stat-icon">📁</span>
                    <span className="uga-stat-value">{(group.folderAccess || []).length} Folders</span>
                  </div>
                </div>
                
                <div className="uga-info-section">
                  <span className="uga-section-label">FOLDER ACCESS:</span>
                  <div className="uga-folder-tags">
                    {(group.folderAccess || []).map((folder, idx) => (
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
                disabled={loadingDomains}
              >
                <option value="">
                  {loadingDomains ? "Loading domains..." : "-- Select Domain --"}
                </option>
                {availableDomains.map((domain) => (
                  <option key={domain.id} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
              {availableDomains.length === 0 && !loadingDomains && (
                <p style={{color: '#dc3545', fontSize: '0.875rem', marginTop: '5px'}}>
                  No domains available. Please add domains in Domain Management first.
                </p>
              )}
            </div>

            <div className="uga-form-section">
              <label className="uga-form-label">Folder Access *</label>
              <p className="uga-form-sublabel">Select folders this group can access (from reports directory)</p>
              <div className="uga-folder-grid">
                {availableFolders.map((folder) => (
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