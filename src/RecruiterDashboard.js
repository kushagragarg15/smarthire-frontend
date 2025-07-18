import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Users, Search, Download, FileText, RefreshCw, Filter, TrendingUp, User, Mail, MapPin, Briefcase, GraduationCap, Star, CheckCircle, XCircle, Clock, BarChart3, Eye, ArrowLeft, Building2, Calendar, Upload, AlertCircle, Loader, Award, DollarSign } from 'lucide-react';
import JobPostingForm from './JobPostingForm';
import JobMatchVisualization from './components/JobMatchVisualization';
import './job-match-visualization.css';
import './button-styles.css';
import './heading-alignment-fix.css';

const getMatchScoreColor = (score) => {
  if (score >= 80) return 'match-excellent';
  if (score >= 60) return 'match-good';
  return 'match-poor';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Shortlisted':
      return 'status-shortlisted';
    case 'Rejected':
      return 'status-rejected';
    case 'Under Review':
      return 'status-review';
    default:
      return 'status-pending';
  }
};

function exportToCSV(data) {
  const rows = [
    [
      'Name', 'Email', 'Experience', 'Location', 'Skills', 'Education',
      'Job 1', 'Job 1 Score', 'Job 2', 'Job 2 Score', 'Job 3', 'Job 3 Score', 'Status'
    ]
  ];
  
  data.forEach(item => {
    const c = item.candidate;
    const m = item.matches;
    rows.push([
      c.name || '', c.email || '', c.experience || '', c.location || '',
      (c.skills || []).join('; '), (c.education || []).join('; '),
      m[0]?.title || '', m[0] ? Math.round(m[0].scores.final * 100) + '%' : '',
      m[1]?.title || '', m[1] ? Math.round(m[1].scores.final * 100) + '%' : '',
      m[2]?.title || '', m[2] ? Math.round(m[2].scores.final * 100) + '%' : '',
      item.status || ''
    ]);
  });
  
  const csv = rows.map(r => r.map(x => '"' + x.replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume_dashboard.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

function exportToPDF(data) {
  const doc = new jsPDF();
  
  // Prepare the data rows
  const rows = data.map(item => [
    item.candidate.name || '',
    item.candidate.email || '',
    item.candidate.experience || '',
    item.candidate.location || '',
    (item.candidate.skills || []).join('; '),
    (item.candidate.education || []).join('; '),
    item.matches.map(m => `${m.title} (${Math.round(m.scores.final * 100)}%)`).join('\n'),
    item.status || ''
  ]);
  
  // Use autoTable with the imported function
  autoTable(doc, {
    head: [['Name', 'Email', 'Experience', 'Location', 'Skills', 'Education', 'Top Matches', 'Status']],
    body: rows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { top: 20 },
    theme: 'striped'
  });
  
  doc.save('resume_dashboard.pdf');
}

export default function RecruiterDashboard({ refreshKey, onBack }) {
  const [resumeMatches, setResumeMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('candidates'); // New state for tab management
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    rejected: 0,
    pending: 0,
    avgMatchScore: 0
  });

  const API_BASE = process.env.REACT_APP_API_BASE || 'https://smarthire-backend-d7qq.onrender.com'; // Updated to use env var

  const fetchMatches = async () => {
    console.log('Fetching matches...');
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/resume_matches`, {
        timeout: 15000, // 15 second timeout
      }); // Updated base URL
      console.log('Received data from API:', res.data);
      
      // Handle both array and object responses
      const matchesData = Array.isArray(res.data) ? res.data : res.data.matches || [];
      setResumeMatches(matchesData);
      calculateStats(matchesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching matches:', err);
      
      if (err.response) {
        setError(`Server error: ${err.response.data?.error || err.response.status}`);
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else {
        setError('Failed to fetch resume matches. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const shortlisted = data.filter(item => item.status === 'Shortlisted').length;
    const rejected = data.filter(item => item.status === 'Rejected').length;
    const pending = total - shortlisted - rejected;
    
    const totalScore = data.reduce((sum, item) => {
      const bestMatch = item.matches[0];
      return sum + (bestMatch ? bestMatch.scores.final * 100 : 0);
    }, 0);
    const avgMatchScore = total > 0 ? Math.round(totalScore / total) : 0;

    setStats({ total, shortlisted, rejected, pending, avgMatchScore });
  };

  useEffect(() => {
    console.log('RecruiterDashboard: Setting up fetch...');
    fetchMatches();
    // Removed auto-polling setInterval
    return () => {
      // No interval to clean up
    };
  }, []);

  const handleManualRefresh = () => {
    console.log('Manual refresh triggered...');
    fetchMatches();
  };

  const handleStatus = async (email, status) => {
    if (!email) return;
    
    try {
      await axios.post(`${API_BASE}/update_status`, {
        email,
        status
      }); // Updated base URL
      
      setResumeMatches(prev => {
        const updated = prev.map(item =>
          item.candidate.email === email ? { ...item, status } : item
        );
        calculateStats(updated);
        return updated;
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status");
    }
  };

  const filtered = resumeMatches
    .filter((item) => {
      const c = item.candidate;
      const s = search.toLowerCase();
      const matchesSearch = (
        (c.name && c.name.toLowerCase().includes(s)) ||
        (c.email && c.email.toLowerCase().includes(s)) ||
        (c.location && c.location.toLowerCase().includes(s)) ||
        (c.skills && c.skills.join(' ').toLowerCase().includes(s))
      );
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pending' && !item.status) ||
        item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.candidate.name || '').localeCompare(b.candidate.name || '');
        case 'score':
          const aScore = a.matches[0]?.scores.final || 0;
          const bScore = b.matches[0]?.scores.final || 0;
          return bScore - aScore;
        case 'status':
          return (a.status || 'pending').localeCompare(b.status || 'pending');
        default:
          return 0;
      }
    });

  if (selectedCandidate) {
    return (
      <CandidateDetailView 
        candidate={selectedCandidate} 
        onBack={() => setSelectedCandidate(null)}
        onStatusUpdate={(status) => {
          const idx = resumeMatches.findIndex(item => 
            item.candidate.email === selectedCandidate.candidate.email
          );
          if (idx !== -1) {
            handleStatus(selectedCandidate.candidate.email, status);
            setSelectedCandidate({...selectedCandidate, status});
          }
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-content">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="main-content">
          <div className="glass-card p-8 text-center">
            <div className="error-icon">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            </div>
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button onClick={handleManualRefresh} className="btn-primary mt-4">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
        {/* Professional IPCA+AI Dashboard Header */}
        <header className="site-header">
          <nav className="site-header__nav">
            <div className="site-header__left">
              <a href="/" className="company-brand">
                <span className="logo-text">IPCA+AI</span>
              </a>
              <div className="header-divider"></div>
              <div className="page-title-section">
                <h1 className="page-title">Recruiter Dashboard</h1>
              </div>
            </div>

            <div className="site-header__right">
              <a href="#analytics" className="site-header__link">Analytics</a>
              <a href="#open-positions" className="site-header__link">Job Postings</a>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {onBack && (
                  <button onClick={onBack} className="btn-secondary">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button onClick={handleManualRefresh} className="btn-secondary">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </nav>
        </header>
        <main className="main-content">
          {/* Tab Navigation */}
          <div className="tab-navigation" style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`tab-button ${activeTab === 'candidates' ? 'tab-active' : ''}`}
            >
              <Users className="w-4 h-4" />
              Manage Candidates
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`tab-button ${activeTab === 'jobs' ? 'tab-active' : ''}`}
            >
              <Briefcase className="w-4 h-4" />
              Post New Job
            </button>
          </div>
          {/* Stats Overview - Only show on candidates tab */}
          <div className="stats-container">
            <div className="stat-button">
              <span className="stat-number stat-shortlisted">{stats.shortlisted}</span>
              <span className="stat-label">Shortlisted</span>
            </div>
            <div className="stat-button">
              <span className="stat-number stat-interviewed">{stats.interviewed}</span>
              <span className="stat-label">Interviewed</span>
            </div>
            <div className="stat-button">
              <span className="stat-number stat-offered">{stats.offered}</span>
              <span className="stat-label">Offered</span>
            </div>
            <div className="stat-button">
              <span className="stat-number stat-hired">{stats.hired}</span>
              <span className="stat-label">Hired</span>
            </div>
          </div>
          {/* Filters and Controls */}
          <div className="dashboard-controls" style={{ marginBottom: '2rem' }}>
            <div className="search-section">
              <div className="search-input-wrapper">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="filter-section">
              <div className="filter-group">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="filter-group">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="score">Sort by Score</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
            <div className="export-section">
              <button
                onClick={() => exportToCSV(filtered)}
                className="btn-secondary"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => exportToPDF(filtered)}
                className="btn-secondary"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
          {/* Candidates List - Only show on candidates tab */}
          {activeTab === 'candidates' && (
            <section className="glass-card p-8 animate-fadeIn">
              <div className="section-heading">
                <div className="heading-icon-container">
                  <Users className="w-6 h-6" />
                </div>
                <div className="heading-text-container">
                  <h2 className="heading-title">Candidates ({filtered.length})</h2>
                  <p className="heading-subtitle">Review and manage candidate applications</p>
                </div>
              </div>
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No candidates found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="candidates-grid">
                  {filtered.map((item, idx) => (
                    <div key={idx} className="candidate-card">
                      <div className="candidate-header">
                        <div className="candidate-avatar">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="candidate-info">
                          <h3 className="candidate-name">
                            {item.candidate.name || 'Unnamed Candidate'}
                          </h3>
                          <div className="candidate-meta">
                            <div className="meta-item">
                              <Mail className="w-3 h-3" />
                              <span>{item.candidate.email}</span>
                            </div>
                            {item.candidate.location && (
                              <div className="meta-item">
                                <MapPin className="w-3 h-3" />
                                <span>{item.candidate.location}</span>
                              </div>
                            )}
                            {item.candidate.experience && (
                              <div className="meta-item">
                                <Briefcase className="w-3 h-3" />
                                <span>{item.candidate.experience}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="candidate-actions">
                          <button
                            onClick={() => setSelectedCandidate(item)}
                            className="btn-ghost"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="candidate-skills">
                        {item.candidate.skills && item.candidate.skills.length > 0 ? (
                          <div className="skills-list">
                            {item.candidate.skills.slice(0, 4).map((skill, i) => (
                              <span key={i} className="skill-tag-small">
                                {skill}
                              </span>
                            ))}
                            {item.candidate.skills.length > 4 && (
                              <span className="skill-tag-more">
                                +{item.candidate.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="no-data">No skills listed</span>
                        )}
                      </div>
                      <div className="candidate-matches">
                        <h4 className="matches-title">Top Matches</h4>
                        {item.matches.length === 0 ? (
                          <div className="no-matches">No job matches found</div>
                        ) : (
                          <div className="matches-list">
                            {item.matches.slice(0, 2).map((job, jdx) => (
                              <div key={jdx} className="match-item">
                                <span className="match-job-title">{job.title}</span>
                                <span className={`match-score-badge ${getMatchScoreColor(job.scores.final * 100)}`}>
                                  {Math.round(job.scores.final * 100)}%
                                </span>
                              </div>
                            ))}
                            {item.matches.length > 2 && (
                              <div className="match-item-more">
                                +{item.matches.length - 2} more matches
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="candidate-footer">
                        <div className="status-section">
                          {item.status && (
                            <span className={`status-badge ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleStatus(item.candidate.email, 'Shortlisted')}
                            className={`action-btn ${item.status === 'Shortlisted' ? 'action-btn-active-green' : 'action-btn-green'}`}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatus(item.candidate.email, 'Rejected')}
                            className={`action-btn ${item.status === 'Rejected' ? 'action-btn-active-red' : 'action-btn-red'}`}
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                          <button
                            onClick={() => window.open(`${API_BASE}/resume_file/${item.candidate.email}`, '_blank')}
                            className="action-btn action-btn-view-resume"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            View Resume
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {/* Job Posting Form - Only show on jobs tab */}
          {activeTab === 'jobs' && (
            <div id="open-positions">
              <JobPostingForm />
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// Candidate Detail View Component
const CandidateDetailView = ({ candidate, onBack, onStatusUpdate }) => {
  return (
    <div className="app-container">
      <header className="site-header">
        <nav className="site-header__nav">
          <div className="site-header__left">
            <button onClick={onBack} className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="header-divider"></div>
            <div className="page-title-section">
              <h1 className="page-title">{candidate.candidate.name}</h1>
            </div>
          </div>

          <div className="site-header__right">
            <a href="#analytics" className="site-header__link">Analytics</a>
            <a href="#jobs" className="site-header__link">Job Postings</a>
            <a href="#profile" className="site-header__cta">
              <span>Candidate Profile</span>
            </a>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <div className="profile-container">
          {/* Left Column - Main Information */}
          <div className="profile-left">       {/* Profile Information Section */}
            <section className="profile-section">
              <div className="section-header-compact">
                <div className="icon-container-small">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="section-title-compact">Profile Information</h2>
                  <p className="section-subtitle-muted">Candidate details and background</p>
                </div>
              </div>

              <div className="profile-details-horizontal">
                <div className="detail-item-horizontal">
                  <Mail className="w-4 h-4" />
                  <div>
                    <p className="detail-label-muted">Email</p>
                    <p className="detail-value-bright">{candidate.candidate.email}</p>
                  </div>
                </div>

                {candidate.candidate.location && (
                  <div className="detail-item-horizontal">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="detail-label-muted">Location</p>
                      <p className="detail-value-bright">{candidate.candidate.location}</p>
                    </div>
                  </div>
                )}

                {candidate.candidate.experience && (
                  <div className="detail-item-horizontal">
                    <Briefcase className="w-4 h-4" />
                    <div>
                      <p className="detail-label-muted">Experience</p>
                      <p className="detail-value-bright">{candidate.candidate.experience}</p>
                    </div>
                  </div>
                )}

                <div className="detail-item-horizontal">
                  <Clock className="w-4 h-4" />
                  <div>
                    <p className="detail-label-muted">Status</p>
                    <div className="status-actions-horizontal">
                      {candidate.status && (
                        <span className={`status-badge-modern ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      )}
                      <div className="status-buttons-container">
                        <button
                          onClick={() => onStatusUpdate('Shortlisted')}
                          className="status-btn status-btn-shortlist"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => onStatusUpdate('Rejected')}
                          className="status-btn status-btn-reject"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => window.open(`${API_BASE}/resume_file/${candidate.candidate.email}`, '_blank')}
                          className="status-btn status-btn-view-resume"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Resume
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="section-divider"></div>

            {/* Skills and Education Section */}
            <section className="profile-section">
              <div className="section-header-compact">
                <div className="icon-container-small">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="section-title-compact">Skills & Education</h2>
                  <p className="section-subtitle-muted">Technical skills and qualifications</p>
                </div>
              </div>

              <div className="skills-education-content">
                <div className="skills-section-modern">
                  <h3 className="subsection-title-modern">
                    <Star className="w-4 h-4" />
                    Skills
                  </h3>
                  {candidate.candidate.skills && candidate.candidate.skills.length > 0 ? (
                    <div className="skills-grid-modern">
                      {candidate.candidate.skills.map((skill, i) => (
                        <span key={i} className="skill-tag-modern">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data-modern">No skills listed</p>
                  )}
                </div>

                {candidate.candidate.education && candidate.candidate.education.length > 0 && (
                  <div className="education-section-modern">
                    <h3 className="subsection-title-modern">
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </h3>
                    <div className="education-list-modern">
                      {candidate.candidate.education.map((edu, i) => (
                        <div key={i} className="education-item-modern">
                          <GraduationCap className="w-4 h-4" />
                          <span>{edu}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Job Matches */}
          <div className="profile-right">
            <section className="profile-section">
              <div className="section-header-compact">
                <div className="icon-container-small">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="section-title-compact">Job Matches</h2>
                  <p className="section-subtitle-muted">AI-powered job recommendations</p>
                </div>
              </div>

              {candidate.matches.length === 0 ? (
                <div className="empty-state-modern">
                  <Briefcase className="w-12 h-12 text-muted mx-auto mb-3" />
                  <h3 className="text-base font-medium text-muted mb-1">No job matches found</h3>
                  <p className="text-sm text-muted">This candidate doesn't have any job matches yet</p>
                </div>
              ) : (
                <div className="job-matches-list">
                  {candidate.matches.map((job, idx) => (
                    <JobMatchVisualization 
                      key={idx} 
                      job={job} 
                      candidate={candidate.candidate} 
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};