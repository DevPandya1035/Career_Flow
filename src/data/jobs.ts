import type { Job } from '../types'

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-google-1',
    company: 'Google',
    companyLogo: 'G',
    role: 'Software Engineer (L3)',
    type: 'SWE',
    ctcLPA: 45,
    deadline: '2026-12-01T23:59:59Z',
    eligibility: {
      minCGPA: 8.5,
      maxBacklogs: 0,
      branches: ['CS', 'IT'],
      minTenthPercent: 85,
      minTwelfthPercent: 85,
      requiredSkills: ['Data Structures', 'Algorithms', 'System Design']
    },
    description: 'Work on large-scale distributed systems, search algorithms, and cloud infrastructure.',
    rounds: ['Online Coding Assessment', 'Technical Round 1 (DSA)', 'Technical Round 2 (System Design)', 'Googlyness & Leadership'],
    locations: ['Bengaluru', 'Hyderabad'],
    isSaved: false
  },
  {
    id: 'job-goldman-1',
    company: 'Goldman Sachs',
    companyLogo: 'GS',
    role: 'Quantitative Financial Analyst',
    type: 'Finance',
    ctcLPA: 40,
    deadline: '2026-11-25T23:59:59Z',
    eligibility: {
      minCGPA: 8.5,
      maxBacklogs: 0,
      branches: ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE'],
      minTenthPercent: 80,
      minTwelfthPercent: 80,
      requiredSkills: ['Financial Modeling', 'Python', 'Probability & Statistics']
    },
    description: 'Build quantitative models and analytical pipelines supporting global trading desks.',
    rounds: ['Aptitude & Math Test', 'Technical Round 1 (Math/Coding)', 'Director Interview'],
    locations: ['Bengaluru', 'Mumbai'],
    isSaved: false
  },
  {
    id: 'job-microsoft-1',
    company: 'Microsoft',
    companyLogo: 'MS',
    role: 'Software Development Engineer',
    type: 'SWE',
    ctcLPA: 35,
    deadline: '2026-12-10T23:59:59Z',
    eligibility: {
      minCGPA: 7.5,
      maxBacklogs: 0,
      branches: ['CS', 'IT', 'ECE'],
      minTenthPercent: 75,
      minTwelfthPercent: 75,
      requiredSkills: ['C++', 'Python', 'Algorithms', 'Object-Oriented Design']
    },
    description: 'Design and deliver resilient enterprise microservices for Azure cloud platform.',
    rounds: ['Online Assessment', 'Technical DSA', 'System Architecture', 'HR Interview'],
    locations: ['Hyderabad', 'Noida', 'Bengaluru'],
    isSaved: false
  },
  {
    id: 'job-amazon-1',
    company: 'Amazon',
    companyLogo: 'A',
    role: 'SDE-1 (Retail Systems)',
    type: 'SWE',
    ctcLPA: 30,
    deadline: '2026-12-05T23:59:59Z',
    eligibility: {
      minCGPA: 7.0,
      maxBacklogs: 0,
      branches: ['CS', 'IT', 'ECE'],
      minTenthPercent: 70,
      minTwelfthPercent: 70,
      requiredSkills: ['Java', 'Algorithms', 'SQL', 'Problem Solving']
    },
    description: 'Innovate customer experiences in payment, checkout, and inventory workflows.',
    rounds: ['Online Assessment (Debugging & DSA)', 'Tech Round 1', 'Tech Round 2', 'Bar Raiser'],
    locations: ['Bengaluru', 'Chennai'],
    isSaved: false
  },
  {
    id: 'job-adobe-1',
    company: 'Adobe',
    companyLogo: 'AD',
    role: 'Member of Technical Staff',
    type: 'SWE',
    ctcLPA: 28,
    deadline: '2026-12-15T23:59:59Z',
    eligibility: {
      minCGPA: 8.0,
      maxBacklogs: 0,
      branches: ['CS', 'IT'],
      minTenthPercent: 80,
      minTwelfthPercent: 80,
      requiredSkills: ['React', 'JavaScript', 'C++', 'Data Structures']
    },
    description: 'Work on cutting-edge Creative Cloud web technologies and AI generative media tools.',
    rounds: ['Online Coding Test', 'Technical Round 1', 'Technical Round 2', 'HR & Culture Fit'],
    locations: ['Noida', 'Bengaluru'],
    isSaved: false
  },
  {
    id: 'job-jp-morgan-1',
    company: 'JP Morgan Chase',
    companyLogo: 'JPM',
    role: 'Technology & Business Analyst',
    type: 'Analyst',
    ctcLPA: 25,
    deadline: '2026-12-08T23:59:59Z',
    eligibility: {
      minCGPA: 7.0,
      maxBacklogs: 0,
      branches: ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE'],
      minTenthPercent: 70,
      minTwelfthPercent: 70,
      requiredSkills: ['SQL', 'Python', 'Excel', 'Problem Solving']
    },
    description: 'Deliver actionable financial intelligence and automated risk dashboards.',
    rounds: ['Coding & Logic Assessment', 'HireVue Video Interview', 'Superday Interviews'],
    locations: ['Mumbai', 'Bengaluru'],
    isSaved: false
  },
  {
    id: 'job-flipkart-1',
    company: 'Flipkart',
    companyLogo: 'F',
    role: 'SDE-1 (Supply Chain Tech)',
    type: 'SWE',
    ctcLPA: 22,
    deadline: '2026-11-30T23:59:59Z',
    eligibility: {
      minCGPA: 6.5,
      maxBacklogs: 0,
      branches: ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE'],
      minTenthPercent: 65,
      minTwelfthPercent: 65,
      requiredSkills: ['Data Structures', 'Java', 'SQL']
    },
    description: 'Build high-throughput logistics tracking and warehouse inventory systems.',
    rounds: ['Machine Coding Round', 'Problem Solving & Data Structures', 'Hiring Manager Round'],
    locations: ['Bengaluru'],
    isSaved: false
  },
  {
    id: 'job-deloitte-1',
    company: 'Deloitte',
    companyLogo: 'D',
    role: 'Analyst - Technology Consulting',
    type: 'Consulting',
    ctcLPA: 18,
    deadline: '2026-12-20T23:59:59Z',
    eligibility: {
      minCGPA: 6.0,
      maxBacklogs: 0,
      branches: ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE'],
      minTenthPercent: 60,
      minTwelfthPercent: 60,
      requiredSkills: ['Communication', 'SQL', 'Project Management']
    },
    description: 'Advise Fortune 500 enterprises on digital cloud transformation and governance.',
    rounds: ['Online Aptitude & Verbal Test', 'Case Study Discussion', 'Partner Interview'],
    locations: ['Hyderabad', 'Gurugram', 'Bengaluru'],
    isSaved: false
  },
  {
    id: 'job-mahindra-1',
    company: 'Mahindra & Mahindra',
    companyLogo: 'M',
    role: 'Graduate Engineer Trainee',
    type: 'Core',
    ctcLPA: 12,
    deadline: '2026-12-12T23:59:59Z',
    eligibility: {
      minCGPA: 6.0,
      maxBacklogs: 0,
      branches: ['ME', 'CE', 'EE'],
      minTenthPercent: 60,
      minTwelfthPercent: 60,
      requiredSkills: ['Thermodynamics', 'AutoCAD', 'Manufacturing Processes']
    },
    description: 'Work at the frontier of Electric Vehicle powertrain research and manufacturing.',
    rounds: ['Technical Written Assessment', 'Core Engineering Interview', 'HR Round'],
    locations: ['Pune', 'Chennai'],
    isSaved: false
  },
  {
    id: 'job-infosys-1',
    company: 'Infosys',
    companyLogo: 'INF',
    role: 'Specialist Programmer (Power Programmer)',
    type: 'SWE',
    ctcLPA: 8,
    deadline: '2026-11-28T23:59:59Z',
    eligibility: {
      minCGPA: 6.0,
      maxBacklogs: 1,
      branches: ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE'],
      minTenthPercent: 60,
      minTwelfthPercent: 60,
      requiredSkills: ['Python', 'Java', 'Data Structures']
    },
    description: 'Develop full stack cloud solutions and AI-assisted automation tooling.',
    rounds: ['HackWithInfy Coding Round', 'Technical Interview', 'HR Discussion'],
    locations: ['Bengaluru', 'Mysuru', 'Pune'],
    isSaved: false
  }
]
