import React, { useState } from 'react'
import { Sparkles, Plus, X } from 'lucide-react'
import { useStore } from '../../store'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'

export const SkillTags: React.FC = () => {
  const skills = useStore((state) => state.student.skills)
  const addSkill = useStore((state) => state.addSkill)
  const removeSkill = useStore((state) => state.removeSkill)
  const { success, warning } = useToast()

  const [inputVal, setInputVal] = useState('')

  const handleAdd = () => {
    const trimmed = inputVal.trim()
    if (!trimmed) return
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      warning('Skill Exists', `${trimmed} is already listed in your competencies.`)
      return
    }
    addSkill(trimmed)
    setInputVal('')
    success('Skill Added', `${trimmed} added to your profile.`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-surface-border shadow-xs space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-surface-border">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-slate-900">Technical Skills & Competencies</h2>
      </div>

      <p className="text-xs text-slate-500">
        Skills are used by recruiters and the Eligibility Engine to calculate algorithmic match scores and identify gap areas.
      </p>

      {/* Input row */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill (e.g. Docker, Kubernetes, AWS)"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add
        </Button>
      </div>

      {/* Skills list */}
      <div className="flex flex-wrap gap-2 pt-2" aria-label="Skills list">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="w-4 h-4 rounded-full flex items-center justify-center text-primary/70 hover:bg-primary/20 hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
