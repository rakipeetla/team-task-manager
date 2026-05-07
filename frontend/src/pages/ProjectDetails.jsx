import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Plus, Calendar, AlertCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assigneeId: '' });

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`/api/projects/${id}`),
        axios.get(`/api/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project data:', error);
      if (error.response && error.response.status === 403) {
        navigate('/');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/projects/${id}/members`, { email: newMemberEmail });
      setShowMemberModal(false);
      setNewMemberEmail('');
      fetchProjectData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assigneeId: '' });
      fetchProjectData();
    } catch (error) {
      alert('Error creating task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (error) {
      alert('Error updating task status. Make sure you are the assignee or project admin.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Project...</div>;
  if (!project) return <div>Project not found</div>;

  const isAdmin = project.adminId._id === user._id;

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{project.name}</h1>
            <p>{project.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Users size={18} />
              <span>{project.members.length} Members</span>
            </div>
            {isAdmin && (
              <button className="btn btn-secondary flex items-center gap-2" onClick={() => setShowMemberModal(true)}>
                <Plus size={16} /> Add Member
              </button>
            )}
            <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowTaskModal(true)}>
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {columns.map(status => (
          <div key={status} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              {status}
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div className="flex flex-col gap-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="glass-panel" style={{ padding: '1rem', background: 'var(--surface-color)' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{task.title}</h4>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </div>
                  {task.description && <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{task.description}</p>}
                  
                  <div className="flex justify-between items-center" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {task.assigneeId ? task.assigneeId.name : 'Unassigned'}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <select 
                      className="form-input" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                    >
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem', fontSize: '0.9rem' }}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Add Team Member</h3>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="form-label">User Email</label>
                <input 
                  type="email" className="form-input" required 
                  value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} 
                />
              </div>
              <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" className="form-input" required 
                  value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" rows="3"
                  value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} 
                ></textarea>
              </div>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Due Date</label>
                  <input 
                    type="date" className="form-input"
                    value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-input"
                    value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} 
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select 
                  className="form-input"
                  value={newTask.assigneeId} onChange={e => setNewTask({ ...newTask, assigneeId: e.target.value })} 
                >
                  <option value="">Unassigned</option>
                  {project.members.map(member => (
                    <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
