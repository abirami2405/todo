import React, { useState, useEffect } from 'react';
import { User, Plus, Edit3, Trash2, CheckCircle, Circle, LogOut, Mail, Facebook, Github} from 'lucide-react';
import { authAPI, tasksAPI } from './services/api';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    authAPI.googleLogin();
  };
   const handleFacebookLogin = () => {
    setIsLoading(true);
    authAPI.facebookLogin();
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    authAPI.githubLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#795548] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <img
              src="/logo.png"
              alt="Tickify Logo"
              className="w-24 h-24 mx-auto mb-4 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#ffccbc] drop-shadow-sm mb-2">Tickify</h1>
          <p className="text-[#d7ccc8] text-lg">Tick it off, stress off</p>
        </div>
      
        {isLoading ? (
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80">Signing you in...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Mail className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
            
            <button
              onClick={handleFacebookLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Facebook className="w-5 h-5" />
              <span>Continue with Facebook</span>
            </button>
            
            <button
              onClick={handleGithubLogin}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>
          </div>
        )}
        
        <p className="text-center text-white/60 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

// Updated AuthSuccess Component with proper routing hooks
const AuthSuccess = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('No authentication token received');
          return;
        }

        localStorage.setItem('token', token);
        
        // Get user data
        const userData = await authAPI.getCurrentUser();
        onLogin(userData);
        
        // Navigate to dashboard
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleAuth();
  }, [location, onLogin, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#795548] flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md mx-4">
          <div className="text-red-400 mb-4">
            <Circle className="w-12 h-12 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-[#ffccbc] mb-2">Authentication Error</h2>
          <p className="text-[#d7ccc8] mb-4">{error}</p>
          <p className="text-[#d7ccc8] text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#795548] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#ffccbc]/30 border-t-[#ffccbc] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#ffccbc] text-lg">Completing sign-in...</p>
      </div>
    </div>
  );
};

// Task Form Component
const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-[#3e2723]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-[#ffccbc] to-[#d7ccc8] rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-[#795548]/20">
        <h2 className="text-2xl font-bold text-[#3e2723] mb-6">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5d4037] mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-[#795548]/30 rounded-xl focus:ring-2 focus:ring-[#795548] focus:border-[#795548] transition-all bg-white/80 text-[#3e2723]"
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#5d4037] mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-[#795548]/30 rounded-xl focus:ring-2 focus:ring-[#795548] focus:border-[#795548] transition-all h-24 resize-none bg-white/80 text-[#3e2723]"
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#5d4037] mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 border border-[#795548]/30 rounded-xl focus:ring-2 focus:ring-[#795548] focus:border-[#795548] transition-all bg-white/80 text-[#3e2723]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#5d4037] mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-3 border border-[#795548]/30 rounded-xl focus:ring-2 focus:ring-[#795548] focus:border-[#795548] transition-all bg-white/80 text-[#3e2723]"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title.trim()}
              className="flex-1 bg-[#795548] hover:bg-[#5d4037] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:transform-none"
            >
              {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 bg-[#8d6e63] hover:bg-[#6d4c41] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const formatDate = (date) => {
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const handleToggle = async () => {
    setIsUpdating(true);
    await onToggle(task._id);
    setIsUpdating(false);
  };

  return (
    <div className={`bg-gradient-to-br from-[#ffccbc]/90 to-[#d7ccc8]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-red-300' : 'border-[#795548]/20'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={handleToggle}
            disabled={isUpdating}
            className="text-[#795548] hover:text-[#5d4037] transition-colors disabled:opacity-50"
          >
            {task.completed ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-[#8d6e63]' : 'text-[#3e2723]'}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                {task.priority.toUpperCase()}
              </span>
              {isOverdue && (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  OVERDUE
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-[#8d6e63] hover:text-[#795548] hover:bg-white/50 rounded-lg transition-all"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-[#8d6e63] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className={`text-[#5d4037] mb-4 ${task.completed ? 'line-through' : ''}`}>
          {task.description}
        </p>
      )}
      
      {task.dueDate && (
        <p className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-[#8d6e63]'}`}>
          Due: {formatDate(task.dueDate)}
        </p>
      )}
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await tasksAPI.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      await fetchTasks();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.updateTask(editingTask._id, taskData);
      await fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        await fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    try {
      await tasksAPI.updateTask(taskId, { completed: !task.completed });
      await fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await authAPI.logout();
        onLogout();
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#795548] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ffccbc]/30 border-t-[#ffccbc] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#ffccbc] text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#ffccbc]/20 to-[#d7ccc8]/20 backdrop-blur-lg shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#ffccbc] rounded-lg flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Tickify Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-[#ffccbc]">Tickify</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#795548] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#ffccbc]" />
                </div>
                <span className="text-[#d7ccc8] font-medium hidden sm:inline">{user?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#ffccbc]/90 to-[#d7ccc8]/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5d4037] text-sm">Total</p>
                <p className="text-2xl font-bold text-[#3e2723]">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-[#795548]/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#795548]" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#ffccbc]/90 to-[#d7ccc8]/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5d4037] text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#ffccbc]/90 to-[#d7ccc8]/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5d4037] text-sm">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Circle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#ffccbc]/90 to-[#d7ccc8]/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5d4037] text-sm">Overdue</p>
                <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Circle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            {['all', 'pending', 'completed'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-xl font-medium transition-all capitalize ${
                  filter === filterType
                    ? 'bg-[#795548] text-[#ffccbc] shadow-lg'
                    : 'bg-[#ffccbc]/80 text-[#5d4037] hover:bg-[#ffccbc]'
                }`}
              >
                {filterType} {filterType === 'all' ? `(${stats.total})` : filterType === 'pending' ? `(${stats.pending})` : `(${stats.completed})`}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-[#795548] hover:bg-[#5d4037] text-[#ffccbc] font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#ffccbc]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#ffccbc] mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </h3>
            <p className="text-[#d7ccc8] mb-6">
              {filter === 'all' ? 'Create your first task to get started!' : `You have no ${filter} tasks.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#795548] hover:bg-[#5d4037] text-[#ffccbc] font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#795548] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ffccbc]/30 border-t-[#ffccbc] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#ffccbc] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/auth/success" 
          element={<AuthSuccess onLogin={handleLogin} />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
