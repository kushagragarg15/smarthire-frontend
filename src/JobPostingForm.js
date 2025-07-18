"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Award,
  Loader,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Star,
  Edit3,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react"

// Job Card Component
const JobCard = ({ job, onEdit, onDelete, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2 text-lg">{job.title}</h3>

          <div className="space-y-1 mb-3">
            {job.company && job.company !== "Company Not Specified" && (
              <p className="text-sm text-gray-600 flex items-center">
                <Building2 className="w-3 h-3 mr-2" />
                {job.company}
              </p>
            )}
            {job.location && job.location !== "Location Not Specified" && (
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-3 h-3 mr-2" />
                {job.location}
              </p>
            )}
            {job.salary && job.salary !== "Salary Not Specified" && (
              <p className="text-sm text-gray-600 flex items-center">
                <DollarSign className="w-3 h-3 mr-2" />
                {job.salary}
              </p>
            )}
            {job.experience && (
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-3 h-3 mr-2" />
                {job.experience}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Active
          </span>

          <div className="flex gap-1">
            <button
              onClick={() => onView(job)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(job)}
              className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
              title="Edit Job"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(job)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Required Skills:
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(job.skills) ? (
              job.skills.slice(0, isExpanded ? job.skills.length : 3).map((skill, i) => (
                <span key={i} className="skill-tag-small">
                  {skill}
                </span>
              ))
            ) : (
              <span className="skill-tag-small">{job.skills}</span>
            )}
            {Array.isArray(job.skills) && job.skills.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="skill-tag-more hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {isExpanded ? "Show less" : `+${job.skills.length - 3} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Description Preview */}
      {job.description && job.description !== job.title && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
        </div>
      )}

      {/* Created Date */}
      {job.created_at && (
        <div className="text-xs text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Posted {new Date(job.created_at).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}

// Job Detail Modal Component
const JobDetailModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {job.company && job.company !== "Company Not Specified" && (
                  <span className="flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {job.company}
                  </span>
                )}
                {job.location && job.location !== "Location Not Specified" && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.salary && job.salary !== "Salary Not Specified" && (
                <div className="info-item">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="info-label">Salary</p>
                    <p className="info-value">{job.salary}</p>
                  </div>
                </div>
              )}
              {job.experience && (
                <div className="info-item">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="info-label">Experience</p>
                    <p className="info-value">{job.experience}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(job.skills) ? (
                    job.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="skill-tag">{job.skills}</span>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {job.description && job.description !== job.title && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements !== job.skills && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Requirements
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}

            {/* Metadata */}
            {job.created_at && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Posted on{" "}
                  {new Date(job.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function JobPostingForm() {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
    skills: "",
    experience: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedJob, setSelectedJob] = useState(null)
  const [showJobDetail, setShowJobDetail] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  // Validation rules
  const validateForm = () => {
    const errors = []

    if (!jobData.title.trim()) {
      errors.push("Job title is required")
    }

    if (!jobData.skills.trim()) {
      errors.push("Skills are required")
    }

    if (!jobData.experience.trim()) {
      errors.push("Experience requirement is required")
    }

    if (jobData.skills.trim() && jobData.skills.split(",").length > 20) {
      errors.push("Maximum 20 skills allowed")
    }

    return errors
  }

  const fetchJobs = useCallback(async () => {
    try {
      setLoadingJobs(true)
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/jobs`, {
        params: {
          status: filterStatus === "all" ? undefined : filterStatus,
          limit: 50,
        },
      })

      // Handle both old and new API response formats
      const jobsData = res.data.jobs || res.data || []
      setJobs(Array.isArray(jobsData) ? jobsData : [])
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("Failed to load jobs. Please try again.")
      setJobs([])
    } finally {
      setLoadingJobs(false)
    }
  }, [filterStatus])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const resetForm = () => {
    setJobData({
      title: "",
      company: "",
      location: "",
      description: "",
      requirements: "",
      salary: "",
      skills: "",
      experience: "",
    })
    setIsEditing(false)
    setEditingJob(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const jobPayload = {
        title: jobData.title.trim(),
        company: jobData.company.trim() || "Company Not Specified",
        location: jobData.location.trim() || "Location Not Specified",
        description: jobData.description.trim() || jobData.title.trim(),
        requirements: jobData.requirements.trim() || jobData.skills.trim(),
        salary: jobData.salary.trim() || "Salary Not Specified",
        skills: jobData.skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s),
        experience: jobData.experience.trim(),
      }

      const endpoint = isEditing ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/jobs/${editingJob.id}` : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/add_job`

      const method = isEditing ? "PUT" : "POST"

      await axios({
        method,
        url: endpoint,
        data: jobPayload,
      })

      setSubmitSuccess(true)
      resetForm()

      setTimeout(() => setSubmitSuccess(false), 3000)
      await fetchJobs() // Refresh jobs after adding/updating
    } catch (err) {
      console.error("Error posting job:", err)
      const errorMessage = err.response?.data?.error || "Failed to save job. Please try again."
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (job) => {
    setJobData({
      title: job.title || "",
      company: job.company === "Company Not Specified" ? "" : job.company || "",
      location: job.location === "Location Not Specified" ? "" : job.location || "",
      description: job.description === job.title ? "" : job.description || "",
      requirements: job.requirements === job.skills ? "" : job.requirements || "",
      salary: job.salary === "Salary Not Specified" ? "" : job.salary || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      experience: job.experience || "",
    })
    setIsEditing(true)
    setEditingJob(job)

    // Scroll to form
    document.querySelector(".glass-card").scrollIntoView({ behavior: "smooth" })
  }

  const handleDelete = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/jobs/${job.id}`)
      await fetchJobs()
    } catch (err) {
      console.error("Error deleting job:", err)
      setError("Failed to delete job. Please try again.")
    }
  }

  const handleView = (job) => {
    setSelectedJob(job)
    setShowJobDetail(true)
  }

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      job.title?.toLowerCase().includes(searchLower) ||
      job.company?.toLowerCase().includes(searchLower) ||
      job.location?.toLowerCase().includes(searchLower) ||
      (Array.isArray(job.skills) && job.skills.some((skill) => skill.toLowerCase().includes(searchLower)))
    )
  })

  return (
    <div className="space-y-8">
      {/* Job Posting Form */}
      <div className="modern-form-container animate-fadeIn">
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            flexShrink: 0
          }}>
            <Briefcase style={{width: '28px', height: '28px', color: 'white'}} />
          </div>
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              margin: '0',
              lineHeight: '1.2'
            }}>{isEditing ? "Edit Job Posting" : "Post New Job"}</h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#a0aec0',
              marginTop: '4px'
            }}>{isEditing ? "Update job details" : "Find the perfect candidate for your role"}</p>
          </div>
          {isEditing && (
            <button onClick={resetForm} className="btn-secondary ml-auto">
              <X className="w-4 h-4" />
              Cancel Edit
            </button>
          )}
        </div>

        {submitSuccess && (
          <div className="success-alert mb-6 animate-slideIn">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Job {isEditing ? "updated" : "posted"} successfully!</span>
          </div>
        )}

        {error && (
          <div className="error-alert mb-6 animate-slideIn">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modern-form">
          {/* Two Column Grid for Input Fields */}
          <div className="form-grid">
            {/* Job Title */}
            <div className="floating-input-group">
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleInputChange}
                  required
                  className={`floating-input ${jobData.title ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={100}
                />
                <label className="floating-label">Job Title *</label>
              </div>
            </div>

            {/* Company */}
            <div className="floating-input-group">
              <div className="input-wrapper">
                <Building2 className="input-icon" />
                <input
                  type="text"
                  name="company"
                  value={jobData.company}
                  onChange={handleInputChange}
                  className={`floating-input ${jobData.company ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={100}
                />
                <label className="floating-label">Company</label>
              </div>
            </div>

            {/* Location */}
            <div className="floating-input-group">
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleInputChange}
                  className={`floating-input ${jobData.location ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={100}
                />
                <label className="floating-label">Location</label>
              </div>
            </div>

            {/* Salary Range */}
            <div className="floating-input-group">
              <div className="input-wrapper">
                <DollarSign className="input-icon" />
                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleInputChange}
                  className={`floating-input ${jobData.salary ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={50}
                />
                <label className="floating-label">Salary Range</label>
              </div>
            </div>

            {/* Required Skills */}
            <div className="floating-input-group">
              <div className="input-wrapper">
                <Star className="input-icon" />
                <input
                  type="text"
                  name="skills"
                  value={jobData.skills}
                  onChange={handleInputChange}
                  required
                  className={`floating-input ${jobData.skills ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={500}
                />
                <label className="floating-label">Required Skills *</label>
              </div>
              <p className="input-hint">Separate skills with commas. Max 20 skills.</p>
            </div>

            {/* Experience Required */}
            <div className="floating-input-group">
              <div className="input-wrapper">
                <Calendar className="input-icon" />
                <input
                  type="text"
                  name="experience"
                  value={jobData.experience}
                  onChange={handleInputChange}
                  required
                  className={`floating-input ${jobData.experience ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={50}
                />
                <label className="floating-label">Experience Required *</label>
              </div>
            </div>
          </div>

          {/* Full Width Text Areas */}
          <div className="form-full-width">
            {/* Job Description */}
            <div className="floating-textarea-group">
              <div className="textarea-wrapper">
                <FileText className="textarea-icon" />
                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`floating-textarea ${jobData.description ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={2000}
                />
                <label className="floating-label">Job Description</label>
              </div>
              <p className="input-hint">{jobData.description.length}/2000s</p>
            </div>

            {/* Additional Requirements */}
            <div className="floating-textarea-group">
              <div className="textarea-wrapper">
                <Award className="textarea-icon" />
                <textarea
                  name="requirements"
                  value={jobData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className={`floating-textarea ${jobData.requirements ? "has-value" : ""}`}
                  placeholder=" "
                  maxLength={1000}
                />
                <label className="floating-label">Additional Requirements</label>
              </div>
              <p className="input-hint">{jobData.requirements.length}/1000s</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-submit">
            <button type="submit" disabled={isSubmitting} className="modern-submit-btn">
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {isEditing ? "Updating Job..." : "Posting Job..."}
                </>
              ) : (
                <>
                  {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isEditing ? "Update Job" : "Post Job"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Current Jobs Section */}
      <div className="glass-card p-8 animate-fadeIn">
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            flexShrink: 0
          }}>
            <Users style={{width: '28px', height: '28px', color: 'white'}} />
          </div>
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#111',
              margin: '0',
              lineHeight: '1.2'
            }}>Current Job Postings</h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#A9A9A9',
              marginTop: '4px'
            }}>Manage your active job listings ({filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"})</p>
          </div>
          <button onClick={fetchJobs} disabled={loadingJobs} className="btn-secondary ml-auto">
            <RefreshCw className={`w-4 h-4 ${loadingJobs ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, location, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input min-w-[120px]"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loadingJobs ? (
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm ? "No jobs match your search" : "No jobs posted yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? "Try adjusting your search terms" : "Post your first job to start attracting candidates"}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="btn-secondary mt-4">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredJobs.map((job, idx) => (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <JobCard key={job.id || idx} job={job} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={showJobDetail}
        onClose={() => {
          setShowJobDetail(false)
          setSelectedJob(null)
        }}
      />
    </div>
  )
}

export default JobPostingForm
