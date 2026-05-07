import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FolderPlus, CheckCircle, Clock, AlertCircle, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/tasks/my-tasks')
      ]);
      
      setProjects(projectsRes.data);
      
      // Calculate stats
      const tasks = tasksRes.data;
      const now = new Date();
      
      let todo = 0, inProgress = 0, done = 0, overdue = 0;
      
      tasks.forEach(task => {
        if (task.status === 'To Do') todo++;
        if (task.status === 'In Progress') inProgress++;
        if (task.status === 'Done') done++;
        
        if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Done') {
          overdue++;
        }
      });
      
      setStats({
        total: tasks.length,
        todo,
        inProgress,
        done,
        overdue
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', {
        name: newProjectName,
        description: newProjectDesc
      });
      setShowNewProject(false);
      setNewProjectName('');
      setNewProjectDesc('');
      fetchDashboardData(); // refresh list
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Dashboard Overview</h2>
        <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowNewProject(true)}>
          <FolderPlus size={18} />
          New Project
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="flex items-center gap-2" style={{ color: 'var(--primary-color)' }}>
            <BarChart2 size={20} />
            <span className="stat-label">Total Assigned Tasks</span>
          </div>
          <div className="stat-value">{stats.total}</div>
        </div>
        
        <div className="glass-panel stat-card" style={{ borderTop: '4px solid var(--warning-color)' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--warning-color)' }}>
            <Clock size={20} />
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-value">{stats.inProgress}</div>
        </div>

        <div className="glass-panel stat-card" style={{ borderTop: '4px solid var(--success-color)' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--success-color)' }}>
            <CheckCircle size={20} />
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-value">{stats.done}</div>
        </div>

        <div className="glass-panel stat-card" style={{ borderTop: '4px solid var(--danger-color)' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--danger-color)' }}>
            <AlertCircle size={20} />
            <span className="stat-label">Overdue</span>
          </div>
          <div className="stat-value">{stats.overdue}</div>
        </div>
      </div>

      <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Your Projects</h3>
      
      {projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          You don't have any projects yet. Create one to get started!
        </div>
      ) : (
        <div className="dashboard-grid">
          {projects.map(project => (
            <Link to={`/project/${project._id}`} key={project._id}>
              <div className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', height: '100%' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'white' }}>{project.name}</h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{project.members.length} members</span>
                  {project.adminId._id === user._id && <span className="badge badge-low">Admin</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Project Modal Overlay */}
      {showNewProject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" className="form-input" required 
                  value={newProjectName} onChange={e => setNewProjectName(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  className="form-input" rows="3"
                  value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} 
                ></textarea>
              </div>
              <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewProject(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
