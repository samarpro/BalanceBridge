const ExamProtectionMode = () => {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <header className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm shadow-sky-900/5">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-sky-700 font-h1">BalanceBridge</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-slate-500 font-label-md hover:bg-slate-100 transition-colors px-3 py-2 rounded-lg" href="/dashboard-weekly-overview">
              Home
            </a>
            <a className="text-slate-500 font-label-md hover:bg-slate-100 transition-colors px-3 py-2 rounded-lg" href="/add-shift-form">
              Shifts
            </a>
            <a className="text-sky-700 font-semibold font-label-md px-3 py-2 rounded-lg bg-sky-100/50" href="/exam-protection-mode">
              Exams
            </a>
            <a className="text-slate-500 font-label-md hover:bg-slate-100 transition-colors px-3 py-2 rounded-lg" href="/settings">
              Profile
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-outline" type="button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-outline" type="button">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-margin py-lg flex flex-col gap-lg">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h1 className="font-h1 text-h1 text-on-background mb-xs">Exams & Protection</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Your focus is our priority. Activate protection mode to automatically secure your study time against conflicting work requests.
            </p>
          </div>
          <div className="p-gutter rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-gutter w-full md:w-auto bg-white/70 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary">Exam Protection Mode</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Block shift requests during finals</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" value="" />
              <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-surface-container-high">
              <div className="flex justify-between items-center mb-md">
                <h2 className="font-h3 text-h3 text-on-surface">Upcoming Deadlines</h2>
                <button className="bg-primary text-on-primary font-label-md px-md py-sm rounded-lg flex items-center gap-xs hover:opacity-90 transition-all active:scale-95" type="button">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add Exam/Assignment
                </button>
              </div>
              <div className="space-y-sm">
                <div className="group flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-transparent hover:border-primary-container transition-all">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">timer</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-body-md text-on-surface">Advanced Macroeconomics Final</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">May 14, 2024 • 09:00 AM • Main Hall</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full text-label-sm">Exam</span>
                    <button className="text-outline hover:text-error transition-colors" type="button">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="group flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-transparent hover:border-primary-container transition-all">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">edit_note</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-body-md text-on-surface">Policy Brief Assignment</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">May 18, 2024 • 11:59 PM • Portal Submission</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full text-label-sm">Assignment</span>
                    <button className="text-outline hover:text-error transition-colors" type="button">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="group flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-transparent hover:border-primary-container transition-all opacity-75">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined">history</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-body-md text-on-surface">Intro to Ethics Midterm</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Completed on April 22, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="bg-surface-container-highest text-on-surface-variant px-sm py-xs rounded-full text-label-sm">Past</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-tertiary-container/10 border border-tertiary-container/30 p-md rounded-xl flex items-start gap-md">
              <span className="material-symbols-outlined text-tertiary mt-1">auto_awesome</span>
              <div>
                <h4 className="font-label-md text-on-tertiary-container">Proactive Support Active</h4>
                <p className="font-body-sm text-on-tertiary-container/80">
                  BalanceBridge has detected a cluster of exams from May 14 to May 20. Protection mode is automatically suggesting a 24-hour buffer before each date.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-surface-container-high">
              <img
                className="w-full h-40 object-cover"
                alt="Calm bright study space with a notebook, a green plant"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwVCMo9X5Mj1thQckqXHLLBXHdRu1f_qNWf89hoJOwBcapym69nuWXWOPWYuMJMLSuwDj58bEQlvDLrxXNIQRw6BVYkdtqwdiVfX2OhkfUPOQ7qi-hWzC6GjOiQxa9WtLqznT5JsC1YS7kBMVx2vaau_mfGLZgxSDxE4i_oXCH8lyKB0EE_9xew477JJguOwThOHchcWCGcGBq-PNBnDlTigLnBym27oI9WYzU9vSW6LWtz3kRMvxN35paO8o3H1JJV6iirVyFt1Y8"
              />
              <div className="p-md">
                <h3 className="font-h3 text-h3 mb-sm">Calendar Preview</h3>
                <div className="grid grid-cols-7 gap-xs text-center mb-sm">
                  {'MTWTFSS'.split('').map((day) => (
                    <span key={day} className="text-label-sm text-outline">
                      {day}
                    </span>
                  ))}
                  {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((day) => (
                    <div
                      key={day}
                      className={`h-8 flex items-center justify-center font-label-sm ${
                        day === 14
                          ? 'bg-primary text-on-primary rounded-full ring-4 ring-primary-container/20'
                          : day === 18
                          ? 'bg-secondary text-on-secondary rounded-full'
                          : 'text-on-surface'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">2 protected days remaining this month.</p>
              </div>
            </div>
            <div className="bg-surface-container-high p-md rounded-xl border border-outline-variant/20">
              <div className="flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined text-primary">shield</span>
                <h4 className="font-label-md text-on-surface">Protection Settings</h4>
              </div>
              <ul className="space-y-md">
                <li className="flex items-center justify-between">
                  <span className="font-body-sm text-on-surface">Block shift requests</span>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-body-sm text-on-surface">Notify Manager automatically</span>
                  <span className="material-symbols-outlined text-outline">circle</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-body-sm text-on-surface">Include 24h prep buffer</span>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-margin">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
          <div className="p-md text-center">
            <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-primary text-3xl">lock_clock</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-sm">Confirm Protection?</h3>
            <p className="font-body-md text-on-surface-variant mb-lg">
              Would you like to <b>block all new shifts</b> during your upcoming exam dates (May 14 - May 18)? This ensures you have uninterrupted study time.
            </p>
            <div className="flex flex-col gap-sm">
              <button className="w-full bg-primary text-on-primary py-sm rounded-xl font-label-md hover:opacity-90 transition-all" type="button">
                Yes, block new shifts
              </button>
              <a
                className="w-full bg-transparent text-primary py-sm rounded-xl font-label-md hover:bg-primary-container/10 transition-all text-center"
                href="/dashboard-weekly-overview"
              >
                Keep my schedule open
              </a>
            </div>
          </div>
        </div>
      </div>
      <nav className="md:hidden fixed bottom-0 w-full z-50 border-t border-slate-100 bg-white/95 backdrop-blur-lg shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pb-6 pt-2">
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 text-[11px] font-medium transition-all duration-300 ease-out hover:text-sky-500" href="/dashboard-weekly-overview">
          <span className="material-symbols-outlined">home_work</span>
          <span>Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 text-[11px] font-medium transition-all duration-300 ease-out hover:text-sky-500" href="/add-shift-form">
          <span className="material-symbols-outlined">calendar_view_week</span>
          <span>Shifts</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-sky-50 text-sky-700 rounded-2xl px-4 py-1.5 text-[11px] font-medium transition-all duration-300 ease-out" href="/exam-protection-mode">
          <span className="material-symbols-outlined">verified_user</span>
          <span>Exams</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 text-[11px] font-medium transition-all duration-300 ease-out hover:text-sky-500" href="/settings">
          <span className="material-symbols-outlined">person_outline</span>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  )
}

export default ExamProtectionMode
