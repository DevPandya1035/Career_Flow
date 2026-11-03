import React, { useRef } from 'react'
import { FileText, Upload, Trash2, CheckCircle2, Star, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useStore } from '../../store'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useToast } from '../../hooks/useToast'

export const ResumeManager: React.FC = () => {
  const resumes = useStore((state) => state.student.resumes)
  const addResume = useStore((state) => state.addResume)
  const deleteResume = useStore((state) => state.deleteResume)
  const setPrimaryResume = useStore((state) => state.setPrimaryResume)
  const { success, warning, info } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 2MB limit = 2 * 1024 * 1024 bytes
    const maxSizeBytes = 2 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      warning('File Too Large', 'Resume file size must not exceed 2MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const sizeKB = Math.round(file.size / 1024)
    addResume({
      filename: file.name,
      sizeKB: sizeKB || 45,
      isPrimary: resumes.length === 0,
      url: '#'
    })

    success('Resume Uploaded', `${file.name} is now available to attach to job applications.`)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = (id: string, filename: string) => {
    deleteResume(id)
    info('Resume Removed', `${filename} has been deleted.`)
  }

  const handleSetPrimary = (id: string, filename: string) => {
    setPrimaryResume(id)
    success('Primary Resume Set', `${filename} will be pre-selected on your job applications.`)
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-surface-border shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-slate-900">Resume Management</h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {resumes.length} / 5 Max Resumes
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Maintain tailored resumes for different roles (e.g. Software Engineering vs. Data Analyst). Set your primary resume for 1-click applications.
      </p>

      {/* Resumes List */}
      <div className="space-y-3">
        {resumes.map((resume) => {
          const formattedDate = (() => {
            try {
              return format(parseISO(resume.uploadedAt), 'MMM d, yyyy')
            } catch {
              return 'Recent'
            }
          })()

          return (
            <div
              key={resume.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                resume.isPrimary
                  ? 'bg-primary/5 border-primary/30 shadow-xs'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    resume.isPrimary ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {resume.filename}
                    </span>
                    {resume.isPrimary && (
                      <Badge variant="teal" size="sm">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {resume.sizeKB} KB • Uploaded {formattedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!resume.isPrimary && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimary(resume.id, resume.filename)}
                    leftIcon={<Star className="w-3.5 h-3.5 text-amber-500" />}
                  >
                    Set as Primary
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(resume.id, resume.filename)}
                  aria-label={`Delete ${resume.filename}`}
                  className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload Dropzone */}
      <div className="pt-2">
        <label
          htmlFor="resume-upload"
          className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/[0.02] rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800 group-hover:text-primary">
            Upload Resume
          </span>
          <span className="text-xs text-slate-400 mt-1">
            PDF files only up to 2MB. Make sure contact info is ATS friendly.
          </span>
          <input
            ref={fileInputRef}
            id="resume-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  )
}
