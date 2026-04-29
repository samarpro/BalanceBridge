import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendar.css'

const CalendarPage = () => {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([
    { id: 1, title: 'Work Shift', date: new Date() },
    { id: 2, title: 'Study Focus', date: new Date() },
  ])
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0])

  const handleAddEvent = (event) => {
    event.preventDefault()
    if (!newTitle.trim()) return
    const dateValue = new Date(`${newDate}T00:00:00`)
    setEvents((prev) => [...prev, { id: Date.now(), title: newTitle.trim(), date: dateValue }])
    setNewTitle('')
  }

  const eventsForSelected = events.filter(
    (evt) => evt.date.toDateString() === date.toDateString(),
  )

  return (
    <div className="min-h-screen bg-background text-on-background px-6 py-12 md:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface">Calendar</h1>
            <p className="font-body-md text-on-surface-variant">Manage shifts, study blocks, and recovery time.</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md" href="/add-shift-form">
              Add Event
            </a>
            <a className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md" href="/add-shift-roster-upload">
              Sync Schedule
            </a>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50">
            <div className="calendar-shell">
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full border-0 text-sm"
              tileClassName={({ date: tileDate }) => {
                const hasEvent = events.some((evt) => evt.date.toDateString() === tileDate.toDateString())
                return hasEvent ? 'rounded-xl ring-1 ring-primary/30' : 'rounded-xl'
              }}
            />
            </div>
          </section>
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50">
              <h2 className="font-h3 text-h3 text-on-surface mb-4">Add Event</h2>
              <form className="space-y-3" onSubmit={handleAddEvent}>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-body-md focus:border-primary focus:ring-2 focus:ring-primary-container outline-none"
                  placeholder="Event title"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                />
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-body-md focus:border-primary focus:ring-2 focus:ring-primary-container outline-none"
                  type="date"
                  value={newDate}
                  onChange={(event) => setNewDate(event.target.value)}
                />
                <button className="w-full px-4 py-2 rounded-full bg-primary text-on-primary font-label-md" type="submit">
                  Add to Calendar
                </button>
              </form>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-slate-100/50">
              <h2 className="font-h3 text-h3 text-on-surface mb-4">Today</h2>
              <div className="space-y-4">
                <div className="bg-primary-container/30 rounded-2xl p-4">
                  <p className="font-label-md text-on-primary-container">Work Shift</p>
                  <p className="text-body-sm text-on-surface-variant">08:00 AM - 02:00 PM</p>
                </div>
                <div className="bg-secondary-container/40 rounded-2xl p-4">
                  <p className="font-label-md text-on-secondary-container">Study Focus</p>
                  <p className="text-body-sm text-on-surface-variant">03:00 PM - 05:00 PM</p>
                </div>
                <div className="bg-tertiary-container/30 rounded-2xl p-4">
                  <p className="font-label-md text-on-tertiary-container">Rest</p>
                  <p className="text-body-sm text-on-surface-variant">Evening walk + journaling</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50">
              <h2 className="font-h3 text-h3 text-on-surface mb-4">Selected Day</h2>
              <div className="space-y-3">
                {eventsForSelected.length === 0 ? (
                  <p className="text-body-sm text-on-surface-variant">No events on this day.</p>
                ) : (
                  eventsForSelected.map((evt) => (
                    <div key={evt.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-label-md text-on-surface">{evt.title}</p>
                        <p className="text-body-sm text-on-surface-variant">{evt.date.toDateString()}</p>
                      </div>
                      <span className="text-secondary font-label-sm">Event</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
