import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaFileAlt, FaBookmark, FaPlus, FaTrash, FaEye,
  FaSearch, FaArrowLeft, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCalendarAlt, FaCheckCircle, FaShieldAlt, FaChartLine, FaTimes
} from 'react-icons/fa';
import './Admin.css';

function Admin() {
  const [schemes, setSchemes] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('schemes');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '', description: '', category: '', ministry: '',
    min_age: '', max_age: '', max_income: '', gender: 'All',
    caste: 'All', occupation: 'All', state: 'All India',
    benefits: '', documents: '', apply_steps: '', apply_link: ''
  });

  useEffect(() => {
    fetchStats();
    fetchSchemes();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/schemes');
      const data = await res.json();
      setSchemes(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddScheme = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/scheme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message);
      setShowAddForm(false);
      fetchSchemes();
      fetchStats();
      setFormData({
        name: '', description: '', category: '', ministry: '',
        min_age: '', max_age: '', max_income: '', gender: 'All',
        caste: 'All', occupation: 'All', state: 'All India',
        benefits: '', documents: '', apply_steps: '', apply_link: ''
      });
    } catch (error) {
      alert('Something went wrong!');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/scheme/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        alert(data.message);
        fetchSchemes();
        fetchStats();
      } catch (error) {
        alert('Something went wrong!');
      }
    }
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loader"></div>
        <h2>Loading Admin Panel...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">
        <Link to="/dashboard" className="admin-back-link">
          <FaArrowLeft /> Dashboard
        </Link>
        <div className="admin-header-content">
          <h1><FaShieldAlt /> Admin Panel</h1>
          <p>Manage schemes, users and statistics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon users-icon"><FaUsers /></div>
          <div className="admin-stat-number">{stats.total_users || 0}</div>
          <div className="admin-stat-label">Total Users</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon schemes-icon"><FaFileAlt /></div>
          <div className="admin-stat-number">{stats.total_schemes || 0}</div>
          <div className="admin-stat-label">Total Schemes</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon saved-icon"><FaBookmark /></div>
          <div className="admin-stat-number">{stats.total_saved || 0}</div>
          <div className="admin-stat-label">Total Saves</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon rating-icon"><FaChartLine /></div>
          <div className="admin-stat-number">{stats.total_ratings || 0}</div>
          <div className="admin-stat-label">Total Ratings</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'schemes' ? 'active' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          <FaFileAlt /> Schemes ({schemes.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> Users ({users.length})
        </button>
      </div>

      {/* Schemes Tab */}
      {activeTab === 'schemes' && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2><FaFileAlt /> All Schemes</h2>
            <button
              className={`admin-add-btn ${showAddForm ? 'cancel' : ''}`}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? <FaTimes /> : <FaPlus />}
              {showAddForm ? 'Cancel' : 'Add Scheme'}
            </button>
          </div>

          {/* Search */}
          <div className="admin-search-bar">
            <FaSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search schemes by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="admin-add-form">
              <h3><FaPlus /> Add New Scheme</h3>
              <form onSubmit={handleAddScheme}>
                <div className="admin-form-grid">
                  <input
                    name="name"
                    placeholder="Scheme Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="ministry"
                    placeholder="Ministry *"
                    value={formData.ministry}
                    onChange={handleChange}
                    required
                  />
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category *</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Housing">Housing</option>
                    <option value="Employment">Employment</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Child Welfare">Child Welfare</option>
                    <option value="Energy">Energy</option>
                    <option value="Financial Inclusion">Financial Inclusion</option>
                    <option value="Startup">Startup</option>
                    <option value="Sports">Sports</option>
                    <option value="Food Security">Food Security</option>
                  </select>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                    name="min_age"
                    placeholder="Min Age"
                    type="number"
                    value={formData.min_age}
                    onChange={handleChange}
                  />
                  <input
                    name="max_age"
                    placeholder="Max Age"
                    type="number"
                    value={formData.max_age}
                    onChange={handleChange}
                  />
                  <input
                    name="max_income"
                    placeholder="Max Income"
                    type="number"
                    value={formData.max_income}
                    onChange={handleChange}
                  />
                  <select name="caste" value={formData.caste} onChange={handleChange}>
                    <option value="All">All Castes</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                  <select name="occupation" value={formData.occupation} onChange={handleChange}>
                    <option value="All">All Occupations</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Student">Student</option>
                    <option value="Government Employee">Government Employee</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Daily Wage Worker">Daily Wage Worker</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                  <input
                    name="state"
                    placeholder="State (All India)"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <textarea
                  name="description"
                  placeholder="Description *"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="benefits"
                  placeholder="Benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                />
                <textarea
                  name="documents"
                  placeholder="Documents (comma separated)"
                  value={formData.documents}
                  onChange={handleChange}
                />
                <textarea
                  name="apply_steps"
                  placeholder="Apply Steps (Step 1: ... Step 2: ...)"
                  value={formData.apply_steps}
                  onChange={handleChange}
                />
                <input
                  name="apply_link"
                  placeholder="Apply Link (URL)"
                  value={formData.apply_link}
                  onChange={handleChange}
                />
                <button type="submit" className="admin-submit-btn">
                  <FaCheckCircle /> Add Scheme
                </button>
              </form>
            </div>
          )}

          {/* Schemes Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Scheme Name</th>
                  <th>Category</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchemes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-empty">
                      {searchTerm ? 'No schemes found matching your search' : 'No schemes added yet'}
                    </td>
                  </tr>
                ) : (
                  filteredSchemes.map((scheme, index) => (
                    <tr key={scheme.id}>
                      <td>{index + 1}</td>
                      <td className="admin-scheme-name">{scheme.name}</td>
                      <td>
                        <span className="admin-category-badge">{scheme.category}</span>
                      </td>
                      <td>{scheme.state}</td>
                      <td>
                        <div className="admin-actions">
                          <a href={`/scheme/${scheme.id}`} className="admin-action-view">
                            <FaEye /> View
                          </a>
                          <button
                            onClick={() => handleDeleteScheme(scheme.id)}
                            className="admin-action-delete"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2><FaUsers /> All Users</h2>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">No users registered yet</td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td className="admin-user-name">
                        <FaUserCircle className="admin-user-icon" /> {user.full_name}
                      </td>
                      <td><FaEnvelope className="admin-icon-small" /> {user.email}</td>
                      <td><FaPhone className="admin-icon-small" /> {user.phone || 'N/A'}</td>
                      <td><FaMapMarkerAlt className="admin-icon-small" /> {user.state || 'N/A'}</td>
                      <td><FaCalendarAlt className="admin-icon-small" /> {new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;
