// MongoDB initialization script
db = db.getSiblingDB('smarthire');

// Create collections
db.createCollection('resumes');
db.createCollection('jobs');
db.createCollection('applications');

// Create indexes
db.resumes.createIndex({ "email": 1 }, { unique: true });
db.jobs.createIndex({ "id": 1 }, { unique: true });
db.applications.createIndex({ "candidate_email": 1, "job_id": 1 }, { unique: true });

// Insert sample jobs if none exist
const jobsCount = db.jobs.countDocuments();
if (jobsCount === 0) {
  db.jobs.insertMany([
    {
      "id": "job1",
      "title": "Junior Software Developer",
      "company": "TechStart Inc.",
      "location": "San Francisco, CA",
      "description": "Entry-level software developer position for recent graduates.",
      "skills": ["JavaScript", "HTML", "CSS", "React"],
      "experience_required": "0-1 years",
      "education_required": "Bachelor's degree in Computer Science or related field",
      "salary": "$70,000 - $90,000"
    },
    {
      "id": "job2",
      "title": "Senior Backend Engineer",
      "company": "DataSystems Corp",
      "location": "New York, NY",
      "description": "Experienced backend engineer to develop scalable services.",
      "skills": ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
      "experience_required": "5+ years",
      "education_required": "Bachelor's degree in Computer Science or related field",
      "salary": "$120,000 - $150,000"
    },
    {
      "id": "job3",
      "title": "Full Stack Developer",
      "company": "WebSolutions Ltd",
      "location": "Austin, TX",
      "description": "Full stack developer with experience in modern web technologies.",
      "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
      "experience_required": "3+ years",
      "education_required": "Bachelor's degree in Computer Science or related field",
      "salary": "$90,000 - $120,000"
    }
  ]);
  
  print("Sample jobs inserted successfully");
} else {
  print("Jobs collection already has data, skipping sample data insertion");
}

print("MongoDB initialization completed successfully");