import React, { useState, useEffect } from 'react';

/**
 * AdminUserForm component provides a form for creating and editing user details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User data for editing (null for creating new user)
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is canceled
 * @returns {JSX.Element} The AdminUserForm component
 */
const AdminUserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'reviewer',
    teams: [],
    level: 1,
    points: 0
  });

  const [errors, setErrors] = useState({});
  const [availableTeams] = useState([
    'Backend Team', 
    'Frontend Team', 
    'Security Team', 
    'UX Team', 
    'DevOps Team', 
    'Fintech Team'
  ]);

  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'reviewer',
        teams: user.teams || [],
        level: user.level || 1,
        points: user.points || 0
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleTeamToggle = (team) => {
    setFormData(prev => {
      const updatedTeams = prev.teams.includes(team)
        ? prev.teams.filter(t => t !== team)
        : [...prev.teams, team];
      
      return {
        ...prev,
        teams: updatedTeams
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    if (formData.teams.length === 0) {
      newErrors.teams = 'At least one team must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="admin-form user-form">
      <h2 className="form-title">
        {user ? 'Edit User' : 'Create New User'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Display Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="reviewer">Reviewer</option>
            <option value="team_lead">Team Lead</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Teams:</label>
          <div className="teams-checkbox-group">
            {availableTeams.map(team => (
              <div key={team} className="team-checkbox">
                <input
                  type="checkbox"
                  id={`team-${team}`}
                  checked={formData.teams.includes(team)}
                  onChange={() => handleTeamToggle(team)}
                />
                <label htmlFor={`team-${team}`}>{team}</label>
              </div>
            ))}
          </div>
          {errors.teams && <div className="error-message">{errors.teams}</div>}
        </div>
        
        {user && (
          <>
            <div className="form-group">
              <label htmlFor="level">Level:</label>
              <input
                type="number"
                id="level"
                name="level"
                min="1"
                max="50"
                value={formData.level}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="points">Points:</label>
              <input
                type="number"
                id="points"
                name="points"
                min="0"
                value={formData.points}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn">
            {user ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm;
