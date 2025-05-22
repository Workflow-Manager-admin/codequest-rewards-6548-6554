import React, { useState, useEffect } from 'react';

/**
 * AdminProjectForm component provides a form for creating and editing project details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data for editing (null for creating new project)
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is canceled
 * @returns {JSX.Element} The AdminProjectForm component
 */
const AdminProjectForm = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repositories: [{ name: '', provider: 'github' }],
    teams: [],
    primaryLanguages: []
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

  const [availableLanguages] = useState([
    'JavaScript', 
    'TypeScript', 
    'Python', 
    'Java', 
    'C#', 
    'C++', 
    'Ruby', 
    'Go', 
    'PHP',
    'Swift',
    'Kotlin',
    'Rust',
    'Node.js',
    'React',
    'Angular',
    'Vue.js'
  ]);

  // Initialize form with project data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        repositories: project.repositories && project.repositories.length > 0 
          ? project.repositories 
          : [{ name: '', provider: 'github' }],
        teams: project.teams || [],
        primaryLanguages: project.primaryLanguages || []
      });
    }
  }, [project]);

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

  const handleRepoChange = (index, field, value) => {
    setFormData(prev => {
      const updatedRepos = [...prev.repositories];
      updatedRepos[index] = { 
        ...updatedRepos[index], 
        [field]: value 
      };
      return {
        ...prev,
        repositories: updatedRepos
      };
    });
  };

  const addRepository = () => {
    setFormData(prev => ({
      ...prev,
      repositories: [
        ...prev.repositories,
        { name: '', provider: 'github' }
      ]
    }));
  };

  const removeRepository = (index) => {
    setFormData(prev => {
      const updatedRepos = [...prev.repositories];
      updatedRepos.splice(index, 1);
      return {
        ...prev,
        repositories: updatedRepos.length ? updatedRepos : [{ name: '', provider: 'github' }]
      };
    });
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

  const handleLanguageToggle = (language) => {
    setFormData(prev => {
      const updatedLanguages = prev.primaryLanguages.includes(language)
        ? prev.primaryLanguages.filter(l => l !== language)
        : [...prev.primaryLanguages, language];
      
      return {
        ...prev,
        primaryLanguages: updatedLanguages
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    const emptyRepos = formData.repositories.some(repo => !repo.name.trim());
    if (emptyRepos) {
      newErrors.repositories = 'All repositories must have a name';
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
    <div className="admin-form project-form">
      <h2 className="form-title">
        {project ? 'Edit Project' : 'Create New Project'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name:</label>
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
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
          ></textarea>
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label>Repositories:</label>
          {formData.repositories.map((repo, index) => (
            <div key={index} className="repository-input">
              <input
                type="text"
                placeholder="Repository name (e.g., org/repo-name)"
                value={repo.name}
                onChange={(e) => handleRepoChange(index, 'name', e.target.value)}
                className={errors.repositories ? 'error' : ''}
              />
              <select
                value={repo.provider}
                onChange={(e) => handleRepoChange(index, 'provider', e.target.value)}
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="bitbucket">Bitbucket</option>
              </select>
              <button 
                type="button" 
                className="btn-icon"
                onClick={() => removeRepository(index)}
                disabled={formData.repositories.length === 1}
              >
                ×
              </button>
            </div>
          ))}
          {errors.repositories && <div className="error-message">{errors.repositories}</div>}
          <button type="button" className="btn btn-small" onClick={addRepository}>
            Add Repository
          </button>
        </div>
        
        <div className="form-group">
          <label>Teams:</label>
          <div className="checkbox-group">
            {availableTeams.map(team => (
              <div key={team} className="checkbox-item">
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
        
        <div className="form-group">
          <label>Primary Languages:</label>
          <div className="checkbox-group languages-group">
            {availableLanguages.map(language => (
              <div key={language} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`lang-${language}`}
                  checked={formData.primaryLanguages.includes(language)}
                  onChange={() => handleLanguageToggle(language)}
                />
                <label htmlFor={`lang-${language}`}>{language}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn">
            {project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectForm;
