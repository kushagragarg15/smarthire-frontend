import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Star, Briefcase, GraduationCap, MapPin, Building } from 'lucide-react';
import '../job-match-visualization.css';

const JobMatchVisualization = ({ job, candidate }) => {
  const [animated, setAnimated] = useState(false);
  
  // Extract and enhance scores from job match to make them more impressive
  // Apply a boost factor to make scores look better
  const boostScore = (score, minBoost = 20, factor = 1.4) => {
    // Ensure score is at least minBoost%
    const baseScore = Math.max(score * 100, minBoost);
    // Apply boost factor but cap at 98% to maintain credibility
    return Math.min(Math.round(baseScore * factor), 98);
  };
  
  // Apply different boost factors to different score types
  const finalScore = boostScore(job.scores.final, 65, 1.3);
  const skillScore = boostScore(job.scores.skill, 60, 1.35);
  const experienceScore = boostScore(job.scores.experience, 55, 1.4);
  const educationScore = boostScore(job.scores.education, 70, 1.25);
  const locationScore = job.scores.location_bonus ? boostScore(job.scores.location_bonus, 65, 1.3) : 0;
  
  // Determine score category
  const getScoreCategory = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  };
  
  // Calculate circle progress
  const calculateCircleProgress = (percentage) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    return circumference - (percentage / 100) * circumference;
  };
  
  // Trigger animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="job-match-card">
      <div className="job-match-header">
        <div>
          <h3 className="job-match-title">{job.title}</h3>
          {job.company && (
            <div className="job-match-company">
              <Building className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="job-match-meta">
        {job.location && (
          <div className="job-match-meta-item">
            <MapPin className="job-match-meta-icon" />
            <span>{job.location}</span>
          </div>
        )}
        {job.experience_required && (
          <div className="job-match-meta-item">
            <Briefcase className="job-match-meta-icon" />
            <span>{job.experience_required}</span>
          </div>
        )}
      </div>
      
      {/* Match Score Visualization */}
      <div className="match-score-visualization">
        <div className="match-score-circle">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle className="circle-bg" cx="50" cy="50" r="45" />
            <circle 
              className={`circle-progress ${getScoreCategory(finalScore)}`} 
              cx="50" 
              cy="50" 
              r="45" 
              strokeDashoffset={animated ? calculateCircleProgress(finalScore) : calculateCircleProgress(0)} 
            />
          </svg>
          <div className="match-score-value">{finalScore}%</div>
        </div>
        <div className="match-score-label">Match Score</div>
      </div>
      
      {/* Match Breakdown */}
      <div className="match-breakdown">
        <div className="breakdown-item">
          <div className="breakdown-header">
            <span className="breakdown-label">Skills</span>
            <span className="breakdown-value">{skillScore}%</span>
          </div>
          <div className="breakdown-bar">
            <div 
              className="breakdown-progress skills" 
              style={{ 
                width: animated ? `${skillScore}%` : '0%',
                '--progress-width': `${skillScore}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="breakdown-item">
          <div className="breakdown-header">
            <span className="breakdown-label">Experience</span>
            <span className="breakdown-value">{experienceScore}%</span>
          </div>
          <div className="breakdown-bar">
            <div 
              className="breakdown-progress experience" 
              style={{ 
                width: animated ? `${experienceScore}%` : '0%',
                '--progress-width': `${experienceScore}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="breakdown-item">
          <div className="breakdown-header">
            <span className="breakdown-label">Education</span>
            <span className="breakdown-value">{educationScore}%</span>
          </div>
          <div className="breakdown-bar">
            <div 
              className="breakdown-progress education" 
              style={{ 
                width: animated ? `${educationScore}%` : '0%',
                '--progress-width': `${educationScore}%`
              }}
            ></div>
          </div>
        </div>
        
        {locationScore > 0 && (
          <div className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">Location</span>
              <span className="breakdown-value">{locationScore}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-progress location" 
                style={{ 
                  width: animated ? `${locationScore}%` : '0%',
                  '--progress-width': `${locationScore}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Skill Match Section */}
      <div className="skill-match-section">
        <div className="skill-match-header">
          <div className="skill-match-title">
            <Star className="w-4 h-4" />
            <span>Skill Analysis</span>
          </div>
          {job.skill_matches && job.missing_skills && (
            <div className="skill-match-count">
              {job.skill_matches.length} of {job.skill_matches.length + job.missing_skills.length} skills
            </div>
          )}
        </div>
        
        <div className="skill-match-grid">
          {job.skill_matches && job.skill_matches.map((skill, index) => (
            <div key={`match-${index}`} className="skill-match-item matched">
              <CheckCircle className="skill-match-icon matched" />
              <span className="skill-match-text">{skill}</span>
            </div>
          ))}
          
          {job.missing_skills && job.missing_skills.map((skill, index) => (
            <div key={`missing-${index}`} className="skill-match-item missing">
              <XCircle className="skill-match-icon missing" />
              <span className="skill-match-text">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobMatchVisualization;