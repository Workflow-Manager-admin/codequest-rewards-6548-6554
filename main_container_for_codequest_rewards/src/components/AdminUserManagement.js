import React, { useState, useEffect } from 'react';
import AdminUserForm from './AdminUserForm';
import { AdminService } from '../services';

/**
 * AdminUserManagement component handles user listing, creation, and editing
 * 
 * @returns {JSX.Element} The AdminUserManagement component
 */
const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user logic would be here
        console.log("Updating user:", userData);
      } else {
        // Add new user
        await AdminService.addUser(userData);
      }
      
      // Refresh the user list
      fetchUsers();
      
      // Close the form
      handleFormClose();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. Please try again.");
    }
  };

  return (
    <div className="admin-user-management">
      <div className="section-header">
        <h2 className="section-title">User Management</h2>
        <button className="btn" onClick={handleAddUser}>Add New User</button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>Loading users...</div>
      ) : (
        <div className="admin-data-table">
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Role</th>
                <th>Teams</th>
                <th>Level</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="avatar-cell">
                    <div className="leaderboard-avatar">{user.name.charAt(0)}</div>
                  </td>
                  <td>{user.name}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{user.teams.join(', ')}</td>
                  <td className="number-cell">{user.level}</td>
                  <td className="number-cell">{user.points}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-small"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="admin-form-modal">
            <AdminUserForm 
              user={editingUser}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
