const ShiftCheckerStatusTrends = () => {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="fixed top-0 w-full z-[100] bg-slate-50/90 backdrop-blur-md border-b border-slate-200 shadow-sm shadow-sky-900/5 h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-sky-700 font-h1">BalanceBridge</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 transition-colors rounded-full" type="button">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <a className="p-2 text-slate-500 hover:bg-slate-100 transition-colors rounded-full" href="/dashboard-weekly-overview">
            <span className="material-symbols-outlined">account_circle</span>
          </a>
        </div>
      </header>
      <div className="flex pt-16 min-h-screen">
        <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-64px)] fixed left-0 p-4 gap-2 bg-slate-50 border-r border-slate-200 text-sm">
          <div className="px-4 py-2 mb-4">
            <h2 className="text-lg font-black text-sky-700">BalanceBridge</h2>
            <p className="text-xs text-slate-400">Academic Flow</p>
          </div>
          <nav className="flex flex-col gap-1">
            <a className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200 rounded-lg" href="/dashboard-weekly-overview">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </a>
            <a className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200 rounded-lg" href="/add-shift-roster-upload">
              <span className="material-symbols-outlined">upload_file</span>
              <span>Roster Upload</span>
            </a>
            <a className="flex items-center gap-3 bg-sky-100/50 text-sky-700 rounded-lg px-4 py-3 font-semibold translate-x-1 duration-200" href="/shift-checker-status-trends">
              <span className="material-symbols-outlined">query_stats</span>
              <span>Shift Limits</span>
            </a>
            <a className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200 rounded-lg" href="/exam-protection-mode">
              <span className="material-symbols-outlined">timer</span>
              <span>Exam Deadlines</span>
            </a>
            <a className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200 rounded-lg" href="/settings">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </a>
          </nav>
        </aside>
        <main className="flex-1 md:ml-64 p-margin md:p-lg pb-32">
          <div className="max-w-5xl mx-auto space-y-lg">
            <section className="space-y-sm">
              <div className="flex items-end justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">Compliance Monitor</span>
                  <h1 className="font-h1 text-h1 text-on-background mt-2">Shift Checker</h1>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="font-label-md text-label-md text-on-surface-variant">Current Fortnight</p>
                  <p className="font-body-md text-body-md text-outline">Oct 16 - Oct 29, 2023</p>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              <div className="lg:col-span-2 space-y-gutter">
                <div className="bg-surface-container-lowest p-md rounded-xl shadow-card border border-surface-container">
                  <div className="flex justify-between items-start mb-lg">
                    <div>
                      <h3 className="font-h3 text-h3 text-on-surface">Weekly Progress</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Current Week: Oct 23 - Oct 29</p>
                    </div>
                    <div className="text-right">
                      <span className="font-h2 text-h2 text-primary">
                        21.5<span className="text-h3 font-h3 text-outline">/24h</span>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-sm">
                    <div className="flex justify-between font-label-md text-label-md">
                      <span className="text-on-surface">Hours Worked</span>
                      <span className="text-primary">90% of limit</span>
                    </div>
                    <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: '90%' }}></div>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-outline">
                      <span>0h</span>
                      <span className="text-on-error font-semibold">Limit: 24h</span>
                    </div>
                  </div>
                </div>
                <div className="bg-error-container/40 p-md rounded-xl border border-error/10 flex items-start gap-4">
                  <div className="bg-error text-on-error p-2 rounded-lg">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-label-md text-label-md text-on-error-container">Limit Alert</h4>
                    <p className="font-body-sm text-body-sm text-on-error-container/80">
                      You have 2.5 hours remaining for this week. Scheduled shifts on Saturday may exceed your student visa work limit. Please review your roster.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low p-md rounded-xl border border-surface-container-high space-y-lg">
                <h3 className="font-label-md text-label-md text-on-surface-variant">Remaining Balance</h3>
                <div className="space-y-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">hourglass_empty</span>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm text-outline">This Week</p>
                        <p className="font-h3 text-h3 text-on-surface">2.5h</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">calendar_month</span>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm text-outline">Fortnight Total</p>
                        <p className="font-h3 text-h3 text-on-surface">43.0h</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-surface-container-highest">
                  <button className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-opacity" type="button">
                    View Full Compliance Report
                  </button>
                </div>
              </div>
            </div>
            <section className="space-y-md">
              <div className="flex items-center justify-between">
                <h3 className="font-h3 text-h3 text-on-surface">Fortnightly Distribution</h3>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-body-sm font-body-sm text-outline">Worked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                    <span className="text-body-sm font-body-sm text-outline">Planned</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-xs md:gap-sm">
                {[
                  { label: 'Mon 16', hours: '5h', height: '65%' },
                  { label: 'Tue 17', hours: '6h', height: '80%' },
                  { label: 'Wed 18', hours: '0h', height: '0%' },
                  { label: 'Thu 19', hours: '7h', height: '90%' },
                  { label: 'Fri 20', hours: '3.5h', height: '40%' },
                  { label: 'Sat 21', hours: '2h', height: '20%', planned: true },
                  { label: 'Sun 22', hours: '0h', height: '0%' },
                ].map((day) => (
                  <div key={day.label} className="flex flex-col items-center gap-2">
                    <span className={`font-label-sm text-label-sm ${day.planned ? 'text-primary' : 'text-outline'}`}>
                      {day.label}
                    </span>
                    <div className="w-full h-32 bg-surface-container-highest rounded-lg relative overflow-hidden flex flex-col justify-end">
                      <div
                        className={`w-full ${day.planned ? 'bg-primary-container' : 'bg-secondary'}`}
                        style={{ height: day.height }}
                      ></div>
                    </div>
                    <span className={`font-label-md text-label-md ${day.planned ? 'text-primary' : ''}`}>{day.hours}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-surface-container-highest/30 p-md rounded-2xl border border-surface-container-highest flex items-center gap-margin">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img
                    alt="Consultation"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWlelC46DH0z51oSCYe1i44UUkSh_ATJmE0ivoADglpLRTcVZal-cVkC1qq7YS8LQBXTZnWP5oH42gr9eK200kfm0UMNldS5I1-kHvVx47KzK7QRjwqkCLLsV5tCvmdyHCjC5Vi0dRdRLa6HY7ycFj97Bt9-fdhcazsxMdYssBAzHyJHOjOPD9bgNtuWB4vZDQDM4Pl1i1XaYTqTFpMNXLAfZrLYcO_NhsEjuFqLnyxy1CzFwACE9awH2GA-ZQm4A6n55JPELVJLJN"
                  />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface">Visa Compliance Advice</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                    Ensure your work hours match your current visa sub-class regulations.
                  </p>
                  <a className="text-primary font-label-sm flex items-center gap-1" href="/wellbeing">
                    Read more
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
              <div className="bg-secondary-container/20 p-md rounded-2xl border border-secondary-container flex items-center gap-margin">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img
                    alt="Planning"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtg4EVz8LudUdUeAOrcmEi8jZ7uU3sNY7acJp32g9dUPjlAoSVqE56UqnSCCCcEmnkIgs32FyAYy2XAZeSs78EPD_-wJZ5zNXhyrtSPgd-KxTyjH6eBuetV0-4-e2kZG-5Mx9CTpiAUJM07X4QOsS4HOJhp_DJk0uLike8-q68AmxXEEQYWgLM62Zta7kvwOn17U5CsQxtPxHcVfj_zmdM0YZvUNpMnvPllj1siOFLbE4KiZklrDLTGe04NDiMWICwrq3TJbUrfam6"
                  />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-secondary-container">Optimal Balance Tips</h4>
                  <p className="font-body-sm text-body-sm text-on-secondary-container/80 mb-2">
                    Learn how to distribute your 48-hour fortnightly limit for better study time.
                  </p>
                  <a className="text-secondary font-label-sm flex items-center gap-1" href="/calendar">
                    Read more
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pb-6 pt-2">
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/dashboard-weekly-overview">
          <span className="material-symbols-outlined">home_work</span>
          <span className="text-[11px] font-medium mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/add-shift-form">
          <span className="material-symbols-outlined">calendar_view_week</span>
          <span className="text-[11px] font-medium mt-1">Shifts</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-sky-50 text-sky-700 rounded-2xl px-4 py-1.5 transition-all duration-300 ease-out" href="/shift-checker-status-trends">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-[11px] font-medium mt-1">Status</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/settings">
          <span className="material-symbols-outlined">person_outline</span>
          <span className="text-[11px] font-medium mt-1">Profile</span>
        </a>
      </nav>
    </div>
  )
}

export default ShiftCheckerStatusTrends
