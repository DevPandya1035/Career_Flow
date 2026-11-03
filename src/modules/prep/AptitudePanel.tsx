import React, { useState } from 'react'
import { Brain, Play, CheckCircle2, History, Award } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useStore } from '../../store'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../hooks/useToast'

export const AptitudePanel: React.FC = () => {
  const aptitudeHistory = useStore((state) => state.prep.aptitude)
  const recordAptitudeAttempt = useStore((state) => state.recordAptitudeAttempt)
  const { success } = useToast()

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const sampleQuestions = [
    {
      q: 'A train 120m long passes a telegraph post in 6 seconds. What is the speed of the train in km/hr?',
      options: ['60 km/hr', '72 km/hr', '80 km/hr', '90 km/hr'],
      correct: 1
    },
    {
      q: 'If 12 men can complete a project in 15 days, how many men will complete it in 10 days?',
      options: ['15 men', '16 men', '18 men', '20 men'],
      correct: 2
    },
    {
      q: 'Complete the number series: 4, 9, 25, 49, 121, ___ ?',
      options: ['144', '169', '196', '225'],
      correct: 1
    }
  ]

  const handleStartQuiz = () => {
    setCurrentQuestionIdx(0)
    setSelectedAnswers([])
    setIsQuizModalOpen(true)
  }

  const handleSelectAnswer = (optionIdx: number) => {
    const updated = [...selectedAnswers]
    updated[currentQuestionIdx] = optionIdx
    setSelectedAnswers(updated)
  }

  const handleNextOrFinish = () => {
    if (currentQuestionIdx < sampleQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
    } else {
      // Calculate score
      let correctCount = 0
      sampleQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) correctCount++
      })
      const score = Math.round((correctCount / sampleQuestions.length) * 100)
      recordAptitudeAttempt(score, sampleQuestions.length)
      setIsQuizModalOpen(false)
      success(
        'Practice Assessment Completed!',
        `You scored ${score}% (${correctCount}/${sampleQuestions.length} correct). Logged to your placement records.`
      )
    }
  }

  const latestScore = aptitudeHistory[0]?.score ?? 0

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-slate-900">
              Quantitative, Logical & Verbal Aptitude
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Industry aptitude tests are the first elimination round for 90% of campus recruiters.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleStartQuiz}
          className="font-bold shrink-0 shadow-sm"
        >
          <Play className="w-4 h-4 mr-1.5 fill-current" />
          <span>Launch Practice Quiz</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Performance Summary */}
        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Latest Assessment Performance</span>
          </h4>

          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
              {latestScore}%
            </span>
            <span className="text-xs text-slate-500 block mt-1 font-semibold">
              Recent Benchmark Score
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Target a consistent 80%+ benchmark to clear aptitude rounds at Deloitte, JP Morgan, and Infosys.
          </p>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-surface-border shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span>Test Attempt History</span>
          </h4>

          {aptitudeHistory.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No tests attempted yet.</p>
          ) : (
            <div className="space-y-2">
              {aptitudeHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Aptitude Assessment
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {format(parseISO(item.date), 'MMM dd, yyyy • hh:mm a')}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary">
                    {item.score}% Score
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Practice Quiz Interactive Modal */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title="Campus Aptitude Practice Simulator"
        subtitle={`Question ${currentQuestionIdx + 1} of ${sampleQuestions.length}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="font-semibold text-sm text-slate-900 leading-relaxed">
              {sampleQuestions[currentQuestionIdx].q}
            </p>
          </div>

          <div className="space-y-2">
            {sampleQuestions[currentQuestionIdx].options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(optIdx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-primary bg-blue-50 text-primary font-bold ring-1 ring-primary'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-5 inline-block font-bold">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={selectedAnswers[currentQuestionIdx] === undefined}
              onClick={handleNextOrFinish}
            >
              {currentQuestionIdx === sampleQuestions.length - 1 ? 'Finish & Record' : 'Next Question'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
