const AddShiftForm = () => {
  return (
    <div className="bg-background text-on-background min-h-screen font-body-md">
      <header className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm shadow-sky-900/5 flex justify-between items-center w-full px-6 h-16">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-sky-700 font-h1">BalanceBridge</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a className="text-slate-500 hover:bg-slate-100 transition-colors px-3 py-2 rounded-lg font-label-md" href="/dashboard-weekly-overview">
            Home
          </a>
          <a className="text-sky-700 font-semibold px-3 py-2 rounded-lg font-label-md" href="/add-shift-form">
            Shifts
          </a>
          <a className="text-slate-500 hover:bg-slate-100 transition-colors px-3 py-2 rounded-lg font-label-md" href="/exam-protection-mode">
            Exams
          </a>
          <a className="text-slate-500 hover:bg-slate-100 transition-colors px-3 py-2 rounded-lg font-label-md" href="/settings">
            Profile
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all active:scale-95 duration-200" type="button">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all active:scale-95 duration-200" type="button">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-xl">
        <div className="flex flex-col md:flex-row gap-lg">
          <div className="flex-1 space-y-lg">
            <section>
              <h1 className="font-h1 text-h1 text-primary mb-sm">Academic Flow</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Maintain your equilibrium. Organize your work life around your studies with intentionality and peace.
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-container-high">
                <div className="flex items-center gap-sm mb-sm text-secondary">
                  <span className="material-symbols-outlined">event_available</span>
                  <span className="font-label-md text-label-md">Next Shift</span>
                </div>
                <p className="font-h3 text-h3 text-on-surface">Hospitality</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Tomorrow, 08:00 AM - 02:00 PM</p>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-container-high">
                <div className="flex items-center gap-sm mb-sm text-tertiary">
                  <span className="material-symbols-outlined">history_edu</span>
                  <span className="font-label-md text-label-md">Next Exam</span>
                </div>
                <p className="font-h3 text-h3 text-on-surface">Microeconomics</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Friday, Oct 24 • 10:00 AM</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-72">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
              <img
                alt="Students studying"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1_7EAMv8htFtnscGlYlMG0_6W_UD295WUHk3PBB-YtmMT4u430TJN4BHpUJlo_CWgNahEAu8ExDf9FAhhaaUvZ29FF0KBtnV9DiZ2p9rxRzIok6ysbRgXGeQrs0DML8Y3Iihs6Db-MIsZBSQ-p6_bJwhiaB2U6MBmOWBEuT41gd6LuhvXG8Wfjo-fDWV2eU1CgYIklam1OFP3vGgOmnviATCVMBy14KklmBz-VaEzO3ENOhquzhnv2NYqgwEA6dsbEet93G0oj14l"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              <div className="absolute bottom-md left-md right-md text-white">
                <p className="font-label-sm text-label-sm uppercase tracking-widest opacity-80 mb-xs">Daily Insight</p>
                <p className="font-body-md font-semibold italic">"The secret of getting ahead is getting started."</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/10 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl shadow-sky-900/10 border border-surface-container-high overflow-hidden flex flex-col max-h-[921px]">
          <div className="px-md pt-md pb-sm flex justify-between items-center border-b border-surface-container">
            <div>
              <h2 className="font-h3 text-h3 text-primary">New Shift</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Log your working hours</p>
            </div>
            <a className="p-2 text-outline hover:bg-surface-container-low rounded-full transition-colors active:scale-90" href="/add-shift-roster-upload">
              <span className="material-symbols-outlined">close</span>
            </a>
          </div>
          <form className="p-md space-y-md overflow-y-auto">
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block ml-1">Job Category</label>
              <div className="relative">
                <select className="w-full appearance-none bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary transition-all">
                  <option value="hospitality">Hospitality</option>
                  <option value="retail">Retail</option>
                  <option value="tutoring">Academic Tutoring</option>
                  <option value="new">+ Add New Job</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                  <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>
              </div>
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block ml-1">Date</label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary transition-all"
                  type="date"
                  defaultValue="2023-10-24"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-gutter">
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant block ml-1">Start Time</label>
                <input
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary transition-all"
                  type="time"
                  defaultValue="09:00"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant block ml-1">End Time</label>
                <input
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary transition-all"
                  type="time"
                  defaultValue="17:00"
                />
              </div>
            </div>
            <div className="bg-secondary-container/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                <span className="font-label-md text-secondary">Total Duration</span>
              </div>
              <span className="font-h3 text-secondary-fixed-dim text-[20px] font-bold">8.0 hrs</span>
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block ml-1">Notes (Optional)</label>
              <textarea
                className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary transition-all resize-none"
                placeholder="Add details about tasks or requirements..."
                rows="3"
              ></textarea>
            </div>
          </form>
          <div className="p-md border-t border-surface-container bg-surface-container-lowest flex flex-col sm:flex-row gap-sm">
            <a
              className="flex-1 bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-label-md transition-all hover:bg-surface-container-highest active:scale-95 duration-200 text-center"
              href="/add-shift-roster-upload"
            >
              Cancel
            </a>
            <button className="flex-[2] bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md transition-all hover:opacity-90 shadow-md shadow-primary/20 active:scale-95 duration-200 flex items-center justify-center gap-2" type="button">
              <span className="material-symbols-outlined text-[20px]">save</span>
              Save Shift
            </button>
          </div>
        </div>
      </div>
      <nav className="fixed bottom-0 w-full z-50 border-t border-slate-100 bg-white/95 backdrop-blur-lg shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pb-6 pt-2 md:hidden">
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/dashboard-weekly-overview">
          <span className="material-symbols-outlined">home_work</span>
          <span className="text-[11px] font-medium">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-sky-50 text-sky-700 rounded-2xl px-4 py-1.5 transition-all duration-300 ease-out" href="/add-shift-form">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            calendar_view_week
          </span>
          <span className="text-[11px] font-medium">Shifts</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/exam-protection-mode">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-[11px] font-medium">Exams</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/settings">
          <span className="material-symbols-outlined">person_outline</span>
          <span className="text-[11px] font-medium">Profile</span>
        </a>
      </nav>
    </div>
  )
}

export default AddShiftForm
