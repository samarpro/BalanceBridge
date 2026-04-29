import { useState } from 'react'
import { useUser } from '../context/UserContext'

const DashboardWeeklyOverview = () => {
  const { name } = useUser()
  const [showProfile, setShowProfile] = useState(false)
  return (
    <div className="font-body-md bg-background text-on-background min-h-screen">
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 border-r border-slate-100 bg-white shadow-xl shadow-sky-900/5 z-50 py-8 px-4 gap-y-2 text-sm font-medium">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-extrabold text-sky-500 tracking-tight">BalanceBridge</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Your Academic Sanctuary</p>
        </div>
        <nav className="flex-1 space-y-3">
          <a className="flex items-center gap-3 px-4 py-3 text-sky-600 border-r-2 border-sky-400 bg-sky-50/50 transition-all" href="/dashboard-weekly-overview">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Overview</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/calendar">
            <span className="material-symbols-outlined">calendar_month</span>
            <span>Calendar</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/wellbeing">
            <span className="material-symbols-outlined">self_care</span>
            <span>Wellbeing</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/settings">
            <span className="material-symbols-outlined">workspace_premium</span>
            <span>Achievements</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/focus-mode">
            <span className="material-symbols-outlined">timer</span>
            <span>Focus Mode</span>
          </a>
          <div className="px-4 pt-4">
            <p className="text-[11px] uppercase tracking-widest text-slate-300">Shifts</p>
          </div>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/add-shift-form">
            <span className="material-symbols-outlined">edit_calendar</span>
            <span>Add Shift</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/add-shift-roster-upload">
            <span className="material-symbols-outlined">upload_file</span>
            <span>Roster Upload</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/shift-checker-status-trends">
            <span className="material-symbols-outlined">query_stats</span>
            <span>Shift Limits</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-sky-500 transition-all" href="/exam-protection-mode">
            <span className="material-symbols-outlined">verified_user</span>
            <span>Exam Protection</span>
          </a>
        </nav>
        <div className="mt-auto space-y-1 pt-6 border-t border-slate-100">
          <a
            className="w-full bg-primary text-white rounded-xl py-3 font-semibold mb-4 shadow-sm active:scale-95 transition-transform text-center block"
            href="/focus-mode"
          >
            Start Focus Session
          </a>
          <a className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-sky-500 transition-all" href="/settings">
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-sky-500 transition-all" href="/onboarding-welcome">
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </aside>
      <main className="md:ml-64 min-h-screen">
        <header className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/50 shadow-sm shadow-sky-900/5 flex justify-between items-center h-16 px-6 md:px-12 w-full">
          <div className="flex items-center gap-4">
            <span className="md:hidden material-symbols-outlined text-slate-500">menu</span>
            <h2 className="text-xl font-bold tracking-tight text-sky-500">Overview</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-white/50 border border-slate-200 rounded-full px-4 py-1.5 gap-2 w-64 shadow-inner">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full" placeholder="Search tasks..." type="text" />
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <button className="material-symbols-outlined hover:bg-slate-100/50 p-2 rounded-full transition-colors active:scale-95" type="button">
                notifications
              </button>
              <a className="material-symbols-outlined hover:bg-slate-100/50 p-2 rounded-full transition-colors active:scale-95" href="/settings">
                settings
              </a>
              <button
                className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary-container shadow-sm"
                type="button"
                onClick={() => setShowProfile((prev) => !prev)}
              >
                <img
                  alt="Student Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLWFqBTQmMQwpP8pfjNe_UWVznQ-3PTJOt1q4gZ9U-XzKYsLK7JYnIMPuN8hnSlvSulazZYRoW-BzLOXbHYh3zLZ1BO15k7enQnYZZrrxgwuzafj2F1lI13CkQJmN6KMz5NLBxC4-AVsoQnMI8b3XqSfUcJuqWf3P1mBL5CgSFt21iDcjSpQ2NnrOGYip_Djc9gZccoQwdCxsMWCYP8naEqW1DUewACGfH394J1LYnFMCUmIkfa7HBK1z6-rODZdKhH6g5q1sU7mUY"
                />
              </button>
            </div>
          </div>
        </header>
        {showProfile && (
          <div className="px-6 md:px-12 pt-6">
            <div className="bg-secondary-container/20 border border-secondary-container/40 rounded-2xl px-4 py-3 text-body-sm text-on-secondary-container">
              Logged in as <span className="font-semibold text-on-surface">{name}</span>
            </div>
          </div>
        )}
        <div className="p-6 md:p-12 space-y-8 animate-fade-in">
          <div className="flex flex-wrap gap-4">
            <div className="bg-tertiary-container/20 text-tertiary-fixed-dim flex items-center gap-2 px-4 py-2 rounded-full border border-tertiary-container/30 shadow-sm">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_stories
              </span>
              <span className="font-label-md">Exam Mode Active</span>
            </div>
            <div className="bg-secondary-container/30 text-secondary flex items-center gap-2 px-4 py-2 rounded-full border border-secondary-container/50 shadow-sm">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="font-label-md">Work Hours OK</span>
            </div>
            <div className="bg-primary-container/20 text-primary flex items-center gap-2 px-4 py-2 rounded-full border border-primary-container/30 shadow-sm">
              <span className="material-symbols-outlined text-sm">relax</span>
              <span className="font-label-md">Next Break in 20 mins</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100/50">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="font-h3 text-on-surface">Weekly Flow</h3>
                  <p className="text-body-sm text-outline">Oct 23 - Oct 29, 2023</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 border border-slate-100 transition-all">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 border border-slate-100 transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-4 text-center">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
                  <div key={day} className="space-y-4">
                    <span className={`font-label-sm ${index === 2 ? 'text-sky-600 font-bold' : 'text-slate-400'}`}>
                      {day}
                    </span>
                    <div
                      className={`h-64 rounded-2xl relative overflow-hidden p-2 space-y-2 ${
                        index === 2 ? 'bg-sky-50/50 ring-2 ring-sky-100' : 'bg-surface-container'
                      }`}
                    >
                      {index === 0 && (
                        <>
                          <div className="bg-primary-container/40 text-on-primary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-primary">
                            Work: Shift A
                          </div>
                          <div className="bg-secondary-container/40 text-on-secondary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-secondary">
                            Study: Math
                          </div>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <div className="bg-secondary-container/40 text-on-secondary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-secondary">
                            Study: History
                          </div>
                          <div className="bg-tertiary-container/30 text-on-tertiary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-tertiary">
                            Yoga Class
                          </div>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <div className="bg-primary-container/40 text-on-primary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-primary">
                            Work: Shift B
                          </div>
                          <div className="bg-secondary-container/40 text-on-secondary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-secondary">
                            Library Session
                          </div>
                        </>
                      )}
                      {index === 3 && (
                        <div className="bg-secondary-container/40 text-on-secondary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-secondary">
                          Study: Logic
                        </div>
                      )}
                      {index === 4 && (
                        <div className="bg-primary-container/40 text-on-primary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-primary">
                          Work: Shift C
                        </div>
                      )}
                      {index === 5 && (
                        <div className="bg-tertiary-container/30 text-on-tertiary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-tertiary">
                          Personal: Brunch
                        </div>
                      )}
                      {index === 6 && (
                        <div className="bg-tertiary-container/30 text-on-tertiary-container text-[10px] p-2 rounded-xl text-left border-l-4 border-tertiary">
                          Rest Day
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-6 border-t border-slate-50 pt-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-xs text-slate-500">Work</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-secondary"></div>
                  <span className="text-xs text-slate-500">Study</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-tertiary"></div>
                  <span className="text-xs text-slate-500">Rest</span>
                </div>
              </div>
            </section>
            <div className="lg:col-span-4 space-y-8">
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-label-md text-on-surface">October 2023</h4>
                  <div className="flex gap-1">
                    <span className="material-symbols-outlined text-sm cursor-pointer">chevron_left</span>
                    <span className="material-symbols-outlined text-sm cursor-pointer">chevron_right</span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-2 text-center text-[11px]">
                  {'MTWTFSS'.split('').map((day) => (
                    <span key={day} className="text-slate-400">
                      {day}
                    </span>
                  ))}
                  {Array.from({ length: 28 }).map((_, index) => {
                    const day = index + 1
                    const isActive = day === 23
                    return (
                      <span
                        key={day}
                        className={
                          isActive
                            ? 'bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center mx-auto'
                            : day > 27
                            ? 'text-slate-300'
                            : ''
                        }
                      >
                        {day}
                      </span>
                    )
                  })}
                </div>
              </section>
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-md text-on-surface">Visa Compliance</h4>
                  <span className="material-symbols-outlined text-sky-400">info</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-body-sm mb-2">
                      <span className="text-slate-500">Weekly Limit (24h)</span>
                      <span className="font-semibold">18 / 24 hrs</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary transition-all w-[75%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-body-sm mb-2">
                      <span className="text-slate-500">Fortnightly Limit (48h)</span>
                      <span className="font-semibold">32 / 48 hrs</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container transition-all w-[66%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-container/20 p-4 rounded-2xl border border-secondary-container/50">
                  <p className="text-[11px] text-secondary leading-relaxed font-medium">
                    You have 6 working hours left this week to stay within your visa conditions. Rest well!
                  </p>
                </div>
              </section>
              <section className="relative h-48 rounded-3xl overflow-hidden group">
                <img
                  alt="Motivation"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTD2SC708g_qDsFrgbMgrW_YgbAl1rDLZySrzr_nS2ojk52fBm_mAaHoMUmvdpgAAwUBKcIKusdDJ6fP_coqByBG73SyYdFHy07RcAzVWro6rvIE04crlnxTVep7DyIIe1sebV6EvMv4PM1PRUXzGBTN-nj-qQfglPzqOVRzPsQZTYPrrgoo9t7QqvRmR9TqEevR8Z3WXukN6Tb0JF2jkGC0Wj98irXDd1mc0eajKc6yjl8F2J6QRnRbDH115NPpZLENAuyjwcBqPH"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                  <h5 className="text-white font-h3">Breathe Deeply</h5>
                  <p className="text-white/80 text-body-sm">Your well-being is as important as your grades.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 bg-white/90 backdrop-blur-lg border-t border-slate-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-50 rounded-t-3xl text-[10px] font-semibold">
        <a className="flex flex-col items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl px-4 py-1.5 transition-transform scale-90" href="/dashboard-weekly-overview">
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 transition-transform scale-90" href="/calendar">
          <span className="material-symbols-outlined">event_note</span>
          <span>Schedule</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 transition-transform scale-90" href="/shift-checker-status-trends">
          <span className="material-symbols-outlined">analytics</span>
          <span>Insights</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 transition-transform scale-90" href="/settings">
          <span className="material-symbols-outlined">person</span>
          <span>Me</span>
        </a>
      </nav>
      <button className="fixed bottom-24 right-8 md:bottom-12 md:right-12 h-14 w-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-all hover:bg-on-primary-fixed-variant z-40">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  )
}

export default DashboardWeeklyOverview
