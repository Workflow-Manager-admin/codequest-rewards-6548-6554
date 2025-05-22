import React, { useState, useEffect } from 'react';
import { AdminService, ProjectService } from '../services';

/**
 * AdminUserProjectAssignment component handles the assignment of users to projects
 * 
 * @returns {JSX.Element} The AdminUserProjectAssignment component
 */
const AdminUserProjectAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTeams, setProjectTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState({
    projects: true,
    users: true,
    teams: false
  });

  // Fetch projects and users on component mount
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // Fetch project teams when a project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchProjectTeams(selectedProject);
    } else {
      setProjectTeams([]);
      setTeamMembers({});
    }
  }, [selectedProject]);

  // Update unassigned users list when users and team members change
  useEffect(() => {
    if (!isLoading.users && !isLoading.teams) {
      calculateUnassignedUsers();
    }
  }, [users, teamMembers, isLoading.users, isLoading.teams]);

  const fetchProjects = async () => {
    try {
      setIsLoading(prev => ({ ...prev, projects: true }));
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, projects: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(prev => ({ ...prev, users: true }));
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchProjectTeams = async (projectId) => {
    try {
      setIsLoading(prev => ({ ...prev, teams: true }));
      const teams = await ProjectService.getProjectTeams(projectId);
      setProjectTeams(teams);
      
      // Create a map of team members
      const membersMap = {};
      teams.forEach(team => {
        membersMap[team.id] = team.members;
      });
      setTeamMembers(membersMap);
    } catch (error) {
      console.error("Failed to load project teams:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, teams: false }));
    }
  };

  const calculateUnassignedUsers = () => {
    // Get all assigned user IDs
    const assignedUserIds = new Set();
    Object.values(teamMembers).forEach(members => {
      members.forEach(member => {
        assignedUserIds.add(member.id);
      });
    });
    
    // Filter users not in assigned list
    const unassigned = users.filter(user => !assignedUserIds.has(user.id));
    setUnassignedUsers(unassigned);
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId === "" ? null : projectId);
  };

  const handleAssignUser = (userId, teamId) => {
    // In a real implementation, this would call an API
    // For now, we'll just update the local state
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setTeamMembers(prev => {
      const updatedMembers = { ...prev };
      if (!updatedMembers[teamId]) {
        updatedMembers[teamId] = [];
      }
      
      updatedMembers[teamId] = [
        ...updatedMembers[teamId],
        {
          id: user.id,
          name: user.name,
          role: 'reviewer' // Default role for newly assigned users
        }
      ];
      
      return updatedMembers;
    });
    
    // This would trigger the useEffect to update unassignedUsers
  };

  const handleRemoveUser = (userId, teamId) => {
    setTeamMembers(prev => {
      const updatedMembers = { ...prev };
      if (updatedMembers[teamId]) {
        updatedMembers[teamId] = updatedMembers[teamId].filter(
          member => member.id !== userId
        );
      }
      return updatedMembers;
    });
    
    // This would trigger the useEffect to update unassignedUsers
  };

  return (
    <div className="admin-assignment">
      <div className="section-header">
        <h2 className="section-title">User-Project Assignment</h2>
      </div>

      <div className="assignment-selector">
        <label htmlFor="project-select">Select Project:</label>
        <select 
          id="project-select" 
          value={selectedProject || ""} 
          onChange={handleProjectChange}
          className="admin-select"
        >
          <option value="">-- Select a Project --</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {isLoading.projects || isLoading.users ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>Loading data...</div>
      ) : selectedProject ? (
        isLoading.teams ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>Loading team data...</div>
        ) : (
          <div className="assignment-grid">
            <div className="teams-panel">
              <h3 className="panel-title">Project Teams</h3>
              {projectTeams.length === 0 ? (
                <div className="empty-state">No teams available for this project</div>
              ) : (
                <div className="teams-list">
                  {projectTeams.map(team => (
                    <div key={team.id} className="team-card">
                      <h4 className="team-name">{team.name}</h4>
                      <p className="team-description">{team.description}</p>
                      
                      <h5 className="team-members-title">Team Members</h5>
                      <ul className="team-members-list">
                        {teamMembers[team.id] && teamMembers[team.id].length > 0 ? (
                          teamMembers[team.id].map(member => (
                            <li key={member.id} className="team-member-item">
                              <span className="member-name">{member.name}</span>
                              <span className="member-role">{member.role}</span>
                              <button 
                                className="btn-icon remove-member"
                                onClick={() => handleRemoveUser(member.id, team.id)}
                                title="Remove from team"
                              >
                                ×
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="empty-message">No members assigned</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="unassigned-users-panel">
              <h3 className="panel-title">Available Users</h3>
              {unassignedUsers.length === 0 ? (
                <div className="empty-state">All users are assigned to teams</div>
              ) : (
                <ul className="unassigned-users-list">
                  {unassignedUsers.map(user => (
                    <li key={user.id} className="unassigned-user-item">
                      <div className="user-info">
                        <span className="user-avatar">{user.name.charAt(0)}</span>
                        <span className="user-name">{user.name}</span>
                        <span className="user-level">Level {user.level}</span>
                      </div>
                      <div className="assign-actions">
                        <select 
                          className="team-select"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignUser(user.id, e.target.value);
                              e.target.value = ""; // Reset select after action
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">Assign to team</option>
                          {projectTeams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="empty-state centered">Select a project to manage team assignments</div>
      )}
    </div>
  );
};

export default AdminUserProjectAssignment;
