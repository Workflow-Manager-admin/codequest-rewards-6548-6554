import React, { useState, useEffect } from 'react';
import AdminProjectForm from './AdminProjectForm';
import { ProjectService } from '../services';

/**
 * AdminProjectManagement component handles project listing, creation, and editing
 * 
 * @returns {JSX.Element} The AdminProjectManagement component
 */
const AdminProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = async (projectId) => {
    try {
      const project = await ProjectService.getProjectById(projectId);
      setEditingProject(project);
      setShowForm(true);
    } catch (error) {
      console.error("Failed to load project details:", error);
      alert("Error loading project details. Please try again.");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSubmit = async (projectData) => {
    try {
      if (editingProject) {
        // Update existing project
        await ProjectService.updateProject(editingProject.id, projectData);
      } else {
        // Create new project
        await ProjectService.createProject(projectData);
      }
      
      // Refresh the project list
      fetchProjects();
      
      // Close the form
      handleFormClose();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
    }
  };

  return (
    <div className="admin-project-management">
      <div className="section-header">
        <h2 className="section-title">Project Management</h2>
        <button className="btn" onClick={handleAddProject}>Add New Project</button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>Loading projects...</div>
      ) : (
        <div className="admin-data-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Teams</th>
                <th>Languages</th>
                <th>Active MRs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td className="project-name">{project.name}</td>
                  <td>{project.description}</td>
                  <td>{project.teams.join(', ')}</td>
                  <td>{project.primaryLanguages ? project.primaryLanguages.join(', ') : 'N/A'}</td>
                  <td className="number-cell">{project.metrics?.activeMRs || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-small"
                        onClick={() => handleEditProject(project.id)}
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
            <AdminProjectForm 
              project={editingProject}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectManagement;
