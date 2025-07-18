"use client"

import { useState, useEffect } from "react"
import {
  Upload,
  FileText,
  Briefcase,
  User,
  Mail,
  Star,
  CheckCircle,
  AlertCircle,
  Loader,
  MapPin,
  Phone,
  GraduationCap,
  TrendingUp,
  Users,
  ArrowRight,
  X,
} from "lucide-react"
import axios from "axios"
import RecruiterDashboard from "./RecruiterDashboard"
import "./success-popup.css"

// Helper function for match score colors
const getMatchScoreColor = (score) => {
  if (score >= 80) return "match-excellent"
  if (score >= 60) return "match-good"
  return "match-poor"
}

function App() {
  const [resumeFile, setResumeFile] = useState(null)
  const [parsedProfile, setParsedProfile] = useState(null)
  const [jobMatches, setJobMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // State for jobs
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);

  // Add refreshKey state
  const [refreshKey, setRefreshKey] = useState(Date.now())

  useEffect(() => {
    async function fetchJobs() {
      setJobsLoading(true);
      setJobsError(null);
      try {
        const API_BASE = process.env.REACT_APP_API_BASE || 'https://smarthire-backend-d7qq.onrender.com'; // Updated to use env var
        const res = await axios.get(`${API_BASE}/jobs`, { params: { limit: 50 } }); // Updated base URL
        const jobsData = res.data.jobs || res.data || [];
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        setJobsError("Failed to load open positions. Please try again later.");
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    }
    fetchJobs();
  }, []);


  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0])
    setError(null)
  }

  const handleUpload = async () => {
    if (!resumeFile) {
      setError("Please select a resume file.")
      return
    }

    // Validate file size (16MB limit)
    if (resumeFile.size > 16 * 1024 * 1024) {
      setError("File size too large. Maximum size is 16MB.")
      return
    }

    // Validate file type
    if (!resumeFile.name.toLowerCase().endsWith('.pdf')) {
      setError("Only PDF files are allowed.")
      return
    }

    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append("resume", resumeFile)

    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'https://smarthire-backend-d7qq.onrender.com'; // Updated to use env var
      // Step 1: Parse resume
      const parseRes = await axios.post(`${API_BASE}/parse_resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      }) // Updated base URL
      
      const profile = parseRes.data.profile
      setParsedProfile(profile)

      // Show success popup and close upload modal
      setShowUploadModal(false)
      setShowSuccessPopup(true)
      setResumeFile(null) // Reset file selection

      // Automatically open dashboard and trigger refresh
      setShowDashboard(true)
      setRefreshKey(Date.now()) // This will force RecruiterDashboard to reload

    } catch (err) {
      console.error("Upload error:", err)
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorData = err.response.data
        if (err.response.status === 422 && errorData.profile) {
          // Partial success - show profile but with warnings
          setParsedProfile(errorData.profile)
          setError(`Resume parsed with warnings: ${errorData.details?.join(', ') || 'Some information may be incomplete'}`)
        } else {
          setError(errorData.error || `Server error: ${err.response.status}`)
        }
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your connection and try again.")
      } else if (err.code === 'ECONNABORTED') {
        // Timeout error
        setError("Upload timeout. Please try again with a smaller file.")
      } else {
        // Other error
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "match-excellent"
    if (score >= 60) return "match-good"
    return "match-poor"
  }

  if (showDashboard) {
    return <RecruiterDashboard onBack={() => setShowDashboard(false)} refreshKey={refreshKey} />
  }

  return (
    <div className="app-container">
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>
      <div className="aurora-blob blob-3"></div>
      {/* Professional IPCA+AI Header */}
      <header className="site-header">
        <nav className="site-header__nav">
          <div className="site-header__left">
            <a href="/" className="company-brand">
              <span className="logo-text">IPCA+AI</span>
            </a>
            <div className="header-divider"></div>
            <div className="page-title-section">
              <h1 className="page-title">Careers</h1>
            </div>
          </div>

          <div className="site-header__right">
            <a href="#analytics" className="site-header__link">Analytics</a>
            <a href="#jobs" className="site-header__link">Job Postings</a>
            <button onClick={() => setShowDashboard(true)} className="site-header__cta">
              <Users className="w-4 h-4" />
              <span>Recruiter Dashboard</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-container">
            <div className="welcome-content">
              <div className="welcome-badge">
                <span>🚀</span>
                Join Our Mission
              </div>
              <h1 className="welcome-title">
                Shape the Future with <span className="highlight">IPCA+AI</span>
              </h1>
              <p className="welcome-description">
                Join a revolutionary team building next-generation AI solutions that 
                transform industries. We're creating the future of intelligent automation, 
                and we want you to be part of it.
              </p>
              <div className="welcome-actions">
                <button className="btn-explore" onClick={() => setShowUploadModal(true)}>
                  Explore Opportunities
                  <span>→</span>
                </button>
                <button className="btn-learn">
                  Learn More
                </button>
              </div>
            </div>
            <div className="welcome-image">
              <div className="image-placeholder">
                <div className="placeholder-content">
                  <Users className="w-24 h-24 text-white opacity-50" />
                  <p className="text-white opacity-75 text-center mt-4">
                    Professional Team<br />Collaboration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-header" style={{flexDirection: 'column', textAlign: 'center', gap: '1.5rem', marginBottom: '2.5rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto'}}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: 0,
              color: '#fff',
              lineHeight: 1.1
            }}>
              Our Core <span style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 60%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                display: 'inline-block'
              }}>Values</span>
            </h2>
            <p style={{
              color: '#e5e7eb',
              fontSize: '1.5rem',
              fontWeight: 400,
              margin: 0,
              maxWidth: '700px',
              lineHeight: 1.4,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Built on principles that drive innovation, foster collaboration, and create lasting impact in the world of artificial intelligence.
            </p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                We push boundaries and embrace new technologies to create breakthrough solutions in healthcare.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="value-title">Collaboration</h3>
              <p className="value-description">
                Together we achieve more. We foster teamwork and knowledge sharing across all levels.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="value-title">Excellence</h3>
              <p className="value-description">
                We strive for the highest standards in everything we do, from research to patient care.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <GraduationCap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="value-title">Learning</h3>
              <p className="value-description">
                Continuous learning and growth are at the heart of our culture and success.
              </p>
            </div>
          </div>
        </section>

        {/* Job Openings Section */}
        <section className="jobs-section">
          <div className="section-header" style={{flexDirection: 'column', textAlign: 'center', gap: '1.5rem', marginBottom: '2.5rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto'}}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: 0,
              color: '#fff',
              lineHeight: 1.1
            }}>
              Open <span style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 60%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                display: 'inline-block'
              }}>Positions</span>
            </h2>
            <p style={{
              color: '#e5e7eb',
              fontSize: '1.5rem',
              fontWeight: 400,
              margin: 0,
              maxWidth: '700px',
              lineHeight: 1.4,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Join our team of innovators and help shape the future of artificial intelligence.
            </p>
          </div>
          <div className="jobs-grid">
            {jobsLoading ? (
              <div className="text-center py-12" style={{gridColumn: '1/-1', width: '100%'}}>
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-gray-300">Loading open positions...</p>
              </div>
            ) : jobsError ? (
              <div className="text-center py-12" style={{gridColumn: '1/-1', width: '100%'}}>
                <p className="text-red-400 font-medium">{jobsError}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12" style={{gridColumn: '1/-1', width: '100%'}}>
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No open positions</h3>
                <p className="text-gray-500">Check back soon for new opportunities!</p>
              </div>
            ) : (
              jobs.map((job, idx) => (
                <div className="job-card" key={job.id || idx}>
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    {job.department && <span className="job-department">{job.department}</span>}
                  </div>
                  <div className="job-details">
                    {job.location && (
                      <div className="job-meta">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.type && (
                      <div className="job-meta">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span>{job.type}</span>
                      </div>
                    )}
                    {job.experience && (
                      <div className="job-meta">
                        <Star className="w-4 h-4 text-gray-500" />
                        <span>{job.experience}</span>
                      </div>
                    )}
                  </div>
                  {job.description && (
                    <p className="job-description">{job.description}</p>
                  )}
                  {job.skills && (
                    <div className="job-skills">
                      {(Array.isArray(job.skills) ? job.skills : String(job.skills).split(",")).map((skill, i) => (
                        <span className="skill-tag" key={i}>{skill.trim()}</span>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setShowUploadModal(true)} className="job-apply-btn">
                    <Upload className="w-4 h-4" />
                    Upload Resume
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Upload Your Resume</h3>
                <button onClick={() => setShowUploadModal(false)} className="modal-close">
                  ×
                </button>
              </div>
              
              <div className="upload-area">
                <div className="upload-dropzone">
                  <div className="upload-icon">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <input type="file" accept=".pdf" onChange={handleResumeChange} className="hidden" id="modal-resume-upload" />
                  <label htmlFor="modal-resume-upload" className="upload-button">
                    <Upload className="w-5 h-5" />
                    Choose Resume File
                  </label>
                  <p className="upload-hint">PDF files only • Max 10MB</p>
                  {resumeFile && (
                    <div className="selected-file">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="file-name">{resumeFile.name}</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="error-alert animate-slideIn">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}
                
                <button onClick={handleUpload} disabled={!resumeFile || isLoading} className="btn-primary w-full">
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing Resume...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Success Popup Dialog */}
        {showSuccessPopup && (
          <div className="success-popup-overlay" onClick={() => setShowSuccessPopup(false)}>
            <div className="success-popup-card" onClick={e => e.stopPropagation()}>
              <div className="success-popup-header">
                <button onClick={() => setShowSuccessPopup(false)} className="success-popup-close">
                  <X size={18} />
                </button>
                <div className="success-popup-icon-container">
                  <div className="success-popup-icon-bg"></div>
                  <div className="success-popup-icon">
                    <CheckCircle size={32} />
                  </div>
                </div>
                <div className="success-popup-header-content">
                  <h2 className="success-popup-title">Resume Submitted!</h2>
                  <p className="success-popup-subtitle">Thank you for your application.</p>
                </div>
              </div>
              
              <div className="success-popup-body">
                <ul className="success-popup-steps">
                  <li className="success-popup-step">
                    <div className="success-popup-step-icon email">
                      <Mail size={20} />
                    </div>
                    <div className="success-popup-step-text">
                      You will receive a confirmation email shortly
                    </div>
                  </li>
                  <li className="success-popup-step">
                    <div className="success-popup-step-icon team">
                      <Users size={20} />
                    </div>
                    <div className="success-popup-step-text">
                      Our team will review your application
                    </div>
                  </li>
                  <li className="success-popup-step">
                    <div className="success-popup-step-icon opportunity">
                      <Briefcase size={20} />
                    </div>
                    <div className="success-popup-step-text">
                      We'll contact you for suitable opportunities
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="success-popup-footer">
                <button 
                  className="success-popup-button"
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setShowDashboard(true);
                  }}
                >
                  View Matches
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
