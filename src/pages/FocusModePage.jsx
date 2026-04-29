import { useEffect, useState } from 'react'

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const FocusModePage = () => {
  const [seconds, setSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning) return undefined
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning])

  useEffect(() => {
    if (seconds === 0) setIsRunning(false)
  }, [seconds])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setSeconds(25 * 60)
    setIsRunning(true)
  }

  return (
    <div className="min-h-screen bg-background text-on-background px-6 py-12 md:px-12 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100/50 text-center space-y-8">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">Focus Mode</h1>
          <p className="font-body-md text-on-surface-variant">Start the timer and keep distractions low.</p>
        </div>
        <div className="text-6xl font-h1 text-primary">{formatTime(seconds)}</div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-3 rounded-full bg-secondary-container text-on-secondary-container font-label-md" onClick={handlePause} type="button">
            Pause
          </button>
          <button className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md" onClick={handleStart} type="button">
            Start
          </button>
          <button className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-label-md" onClick={handleReset} type="button">
            Reset
          </button>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-4 text-body-sm text-on-surface-variant">
          Tip: Put your phone away and focus on one task.
        </div>
      </div>
    </div>
  )
}

export default FocusModePage
