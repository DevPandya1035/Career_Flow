import React from 'react'
import { Calendar, User, Clock, CheckCircle2, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useStore } from '../../store'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'

export const MockInterviews: React.FC = () => {
  const slots = useStore((state) => state.prep.mockInterviews)
  const bookMockInterview = useStore((state) => state.bookMockInterview)
  const cancelMockInterview = useStore((state) => state.cancelMockInterview)
  const { success, info } = useToast()

  const handleBook = (slotId: string, interviewer: string) => {
    bookMockInterview(slotId)
    success(
      'Mock Interview Confirmed',
      `Your 1-on-1 placement practice session with ${interviewer} has been scheduled.`
    )
  }

  const handleCancel = (slotId: string) => {
    cancelMockInterview(slotId)
    info('Booking Cancelled', 'Your slot has been released back to the general pool.')
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-slate-900">
              1-on-1 Alumni Mock Interviews
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Practice live technical rounds and managerial feedback with working alumni engineers.
          </p>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const isBooked = slot.status === 'booked'
          const formattedDate = format(parseISO(slot.datetime), 'EEE, MMM dd, yyyy')
          const formattedTime = format(parseISO(slot.datetime), 'hh:mm a')

          return (
            <div
              key={slot.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                isBooked
                  ? 'bg-blue-50/60 border-primary shadow-xs ring-1 ring-primary/30'
                  : 'bg-white border-surface-border shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isBooked
                        ? 'bg-primary text-white font-black'
                        : 'bg-slate-100 text-slate-600 font-semibold'
                    }`}
                  >
                    {isBooked ? 'Booked' : 'Available'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formattedTime}</span>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {slot.type}
                </h4>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.interviewer}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                {isBooked ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>Confirmed</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(slot.id)}
                      className="text-xs text-danger hover:bg-red-50 hover:text-danger font-semibold py-1 px-2.5"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      <span>Cancel Booking</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBook(slot.id, slot.interviewer)}
                    className="w-full text-xs font-bold py-2"
                  >
                    <span>Book Slot</span>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
