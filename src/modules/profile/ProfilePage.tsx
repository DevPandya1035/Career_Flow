import React from 'react'
import { UserCheck } from 'lucide-react'
import { AcademicForm } from './AcademicForm'
import { SkillTags } from './SkillTags'
import { ResumeManager } from './ResumeManager'

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Keep your academic metrics, verified skills, and job-tailored resumes updated for accurate company eligibility and 1-click applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Academic Form) */}
        <div className="lg:col-span-2 space-y-6">
          <AcademicForm />
        </div>

        {/* Right Column (Skills & Resumes) */}
        <div className="space-y-6">
          <SkillTags />
          <ResumeManager />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
