import { useState } from "react";
import "./DomainManagement.css";

export const DomainManagement = () => {
  const [domains, setDomains] = useState([
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
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteDomainId, setDeleteDomainId] = useState(null);

  const openModal = (domain = null) => {
    setEditingDomain(domain);
    setFormData(
      domain 
        ? { name: domain.name, description: domain.description } 
        : { name: "", description: "" }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDomain(null);
    setFormData({ name: "", description: "" });
  };

  const saveDomain = () => {
    if (!formData.name.trim()) {
      setNotification("Domain name is required");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    const isDuplicate = domains.some(
      (d) => 
        d.name.toLowerCase() === formData.name.trim().toLowerCase() && 
        d.id !== editingDomain?.id
    );
    
    if (isDuplicate) {
      setNotification("Domain name already exists");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    if (editingDomain) {
      setDomains(
        domains.map(d => 
          d.id === editingDomain.id 
            ? { ...d, name: formData.name, description: formData.description } 
            : d
        )
      );
      setNotification("Domain updated successfully");
    } else {
      const newDomain = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        createdDate: new Date().toISOString().split("T")[0]
      };
      setDomains([...domains, newDomain]);
      setNotification("Domain created successfully");
    }

    closeModal();
    setTimeout(() => setNotification(""), 3000);
  };

  const openDeleteConfirm = (domainId) => {
    setDeleteDomainId(domainId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteDomainId(null);
  };

  const deleteDomain = () => {
    setDomains(domains.filter(d => d.id !== deleteDomainId));
    setNotification("Domain deleted successfully");
    closeDeleteConfirm();
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredDomains = domains.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dm-container">
      {notification && (
        <div className="dm-notification">{notification}</div>
      )}

      <div className="dm-header">
        <h1 className="dm-title">Domain Management</h1>
        <button className="dm-btn-primary" onClick={() => openModal()}>
          + Add Domain
        </button>
      </div>

      <input
        type="text"
        placeholder="Search domains..."
        className="dm-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="dm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDomains.length === 0 ? (
            <tr>
              <td colSpan="4" className="dm-no-data">
                No domains found
              </td>
            </tr>
          ) : (
            filteredDomains.map((domain) => (
              <tr key={domain.id}>
                <td>{domain.name}</td>
                <td>{domain.description || <em>No description</em>}</td>
                <td>{new Date(domain.createdDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="dm-btn-edit"
                    onClick={() => openModal(domain)}
                  >
                    Edit
                  </button>
                  <button
                    className="dm-btn-delete"
                    onClick={() => openDeleteConfirm(domain.id)}
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
        <div className="dm-modal-backdrop" onClick={closeModal}>
          <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="dm-modal-title">
              {editingDomain ? "Edit Domain" : "Create Domain"}
            </h2>
            <input
              type="text"
              placeholder="Domain Name"
              className="dm-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onKeyPress={(e) => e.key === 'Enter' && saveDomain()}
              autoFocus
            />
            <textarea
              placeholder="Description"
              className="dm-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
            />
            <div className="dm-modal-actions">
              <button className="dm-btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="dm-btn-primary" onClick={saveDomain}>
                {editingDomain ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="dm-modal-backdrop" onClick={closeDeleteConfirm}>
          <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="dm-modal-title">Delete Domain</h2>
            <p className="dm-modal-text">
              Are you sure you want to delete this domain? This action cannot be undone.
            </p>
            <div className="dm-modal-actions">
              <button className="dm-btn-cancel" onClick={closeDeleteConfirm}>
                Cancel
              </button>
              <button className="dm-btn-delete" onClick={deleteDomain}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};