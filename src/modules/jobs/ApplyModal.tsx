import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import type { Job, Student } from '../../types'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'

export interface ApplyModalProps {
  isOpen: boolean
  job: Job | null
  student: Student
  onClose: () => void
  onSubmit: (payload: { jobId: string; resumeId: string }) => void
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  job,
  student,
  onClose,
  onSubmit
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    student.resumes.find((r) => r.isPrimary)?.id || student.resumes[0]?.id || ''
  )
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!job) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedResumeId) {
      setErrorMsg('Please select a resume to attach to this application.')
      return
    }
    if (!hasConfirmed) {
      setErrorMsg('Please check the confirmation box to proceed.')
      return
    }
    setErrorMsg('')
    onSubmit({ jobId: job.id, resumeId: selectedResumeId })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to ${job.company}`}
      subtitle={`${job.role} • ₹${job.ctcLPA} LPA`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Verification Banner */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">Academic Eligibility Verified</p>
            <p className="mt-0.5 text-slate-600 leading-relaxed">
              Your profile satisfies the published criteria (CGPA {student.cgpa.toFixed(2)}, {student.branch} department, 0 backlogs).
            </p>
          </div>
        </div>

        {/* Resume Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Select Your Active Resume
          </label>

          {student.resumes.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>No resumes uploaded yet in your profile.</span>
              </div>
              <Link
                to="/profile"
                className="font-bold text-primary hover:underline"
              >
                Upload Now →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {student.resumes.map((resume) => {
                const isSelected = selectedResumeId === resume.id
                return (
                  <label
                    key={resume.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-blue-50/50 ring-1 ring-primary'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="resume-selection"
                        value={resume.id}
                        checked={isSelected}
                        onChange={() => setSelectedResumeId(resume.id)}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <FileText className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="font-semibold text-xs text-slate-900">
                          {resume.filename}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {resume.sizeKB} KB {resume.isPrimary && '• Primary resume'}
                        </p>
                      </div>
                    </div>
                    {resume.isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        Default
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* Mandatory Confirmation Checkbox (HCI Error Prevention) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="confirm-application"
              aria-label="Confirm application submission"
              checked={hasConfirmed}
              onChange={(e) => {
                setHasConfirmed(e.target.checked)
                if (e.target.checked) setErrorMsg('')
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-0.5">Application Confirmation</strong>
              I confirm that all my profile information is accurate, the selected resume is current, and I understand this application will be formally registered with the college placement office.
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="text-xs text-danger font-semibold flex items-center gap-1.5 p-2 bg-red-50 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!hasConfirmed || !selectedResumeId}
            className="font-bold min-w-[160px]"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>Submit Application</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
