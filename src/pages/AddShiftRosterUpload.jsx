const AddShiftRosterUpload = () => {
  return (
    <div className="bg-surface font-body-md text-on-surface">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex flex-col p-4 gap-2 h-screen w-64 border-r border-slate-200 bg-slate-50 text-sm">
          <div className="px-4 py-6">
            <h1 className="text-lg font-black text-sky-700">BalanceBridge</h1>
            <p className="text-xs text-slate-500">Academic Flow</p>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            <a className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200" href="/dashboard-weekly-overview">
              <span className="material-symbols-outlined">dashboard</span> Dashboard
            </a>
            <a className="flex items-center gap-3 bg-sky-100/50 text-sky-700 rounded-lg px-4 py-3 font-semibold translate-x-1 duration-200" href="/add-shift-roster-upload">
              <span className="material-symbols-outlined">upload_file</span> Roster Upload
            </a>
            <a className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200" href="/shift-checker-status-trends">
              <span className="material-symbols-outlined">query_stats</span> Shift Limits
            </a>
            <a className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200" href="/exam-protection-mode">
              <span className="material-symbols-outlined">timer</span> Exam Deadlines
            </a>
            <a className="mt-auto flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-100 transition-all translate-x-1 duration-200" href="/settings">
              <span className="material-symbols-outlined">settings</span> Settings
            </a>
          </nav>
        </aside>
        <main className="flex-1 flex flex-col min-w-0">
          <header className="flex justify-between items-center w-full px-6 h-16 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 shadow-sm shadow-sky-900/5 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-primary" type="button">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <span className="text-xl font-bold tracking-tight text-sky-700">Roster Upload</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95 duration-200" type="button">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95 duration-200" type="button">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </header>
          <div className="flex-1 px-margin py-lg md:px-xl md:py-xl overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-lg">
              <div className="space-y-sm max-w-2xl">
                <h2 className="font-h2 text-h2 text-on-surface">Automate your schedule</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Upload a photo of your printed or digital roster. Our AI will detect your shifts and sync them with your academic calendar.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-[16px] shadow-card border border-outline-variant p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3a627f_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  <div className="relative z-10 flex flex-col items-center text-center space-y-md">
                    <div className="w-20 h-20 bg-primary-fixed text-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined !text-4xl">cloud_upload</span>
                    </div>
                    <div className="space-y-xs">
                      <p className="font-h3 text-h3">Drop roster image here</p>
                      <p className="text-on-surface-variant font-body-sm">PNG, JPG, or PDF up to 10MB</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md hover:opacity-90 transition-opacity flex items-center gap-2" type="button">
                        <span className="material-symbols-outlined">photo_library</span> Choose File
                      </button>
                      <button className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-label-md hover:opacity-90 transition-opacity flex items-center gap-2" type="button">
                        <span className="material-symbols-outlined">camera_alt</span> Take Photo
                      </button>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col gap-gutter">
                  <div className="bg-surface-container-high rounded-[16px] p-6 border border-outline-variant flex items-center gap-gutter relative overflow-hidden">
                    <div className="flex-1 space-y-xs">
                      <p className="font-label-md text-primary uppercase tracking-widest text-[10px]">Processing</p>
                      <p className="font-h3 text-xl">Auto-detecting shifts...</p>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-secondary h-full rounded-full w-2/3"></div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl border-2 border-primary border-dashed animate-pulse flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-surface-container-lowest rounded-[16px] shadow-card border border-outline-variant overflow-hidden group">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        alt="Preview of a schedule roster"
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxgcX2JoPAePDW7qny9rtFgedm6xXHiO49uxHCKmBQCD4PGUc1HKqLrwL8K7b01ypVqXXS_CIyv1r1bo5pFKFOmXFabT42w4F34iG0Yw5nzl1EhjsNZcqWWXN7IKdNGWYCqq6udOGGk13uDixJuvqm_RknkyQI7YIz5EKbUWUTcdAdGPmYGH-zVc8w1oilrfRtoQfMuoDaHKa7IdyR8F-HQTLtArcUt2_2u90NePkd3jLMh77F4-etjUb_OqPZRSUZTJiiL33dcW3y"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <p className="text-white font-label-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">image</span> current_roster_july.jpg
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-label-md flex items-center justify-center gap-2 hover:brightness-95 transition-all" type="button">
                        <span className="material-symbols-outlined">auto_fix_high</span> Auto-detect shifts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-h3 text-h3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">list_alt</span> Detected Shifts
                  </h3>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm">4 Shifts Found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { date: 'Jul 12', title: 'Night Shift • Emergency Dept', time: '22:00 — 06:00 (8h)' },
                    { date: 'Jul 14', title: 'Afternoon Shift • Ward 4B', time: '14:00 — 22:00 (8h)' },
                    { date: 'Jul 15', title: 'Morning Shift • Ward 4B', time: '06:00 — 14:00 (8h)' },
                    { date: 'Jul 16', title: 'Morning Shift • Ward 4B', time: '06:00 — 14:00 (8h)' },
                  ].map((shift) => (
                    <div key={shift.date} className="bg-white p-4 rounded-xl border border-outline-variant hover:border-primary/50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-container rounded-lg flex flex-col items-center justify-center text-on-surface">
                          <span className="text-[10px] uppercase font-bold text-slate-500 leading-none">{shift.date.split(' ')[0]}</span>
                          <span className="text-lg font-bold leading-none">{shift.date.split(' ')[1]}</span>
                        </div>
                        <div>
                          <p className="font-label-md">{shift.title}</p>
                          <p className="text-on-surface-variant text-body-sm">{shift.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-outline hover:text-primary transition-colors" type="button">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="p-2 text-outline hover:text-error transition-colors" type="button">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-8">
                  <button className="bg-primary text-on-primary px-12 py-4 rounded-full font-label-md text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2" type="button">
                    <span className="material-symbols-outlined">save_alt</span> Save to Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pb-6 pt-2">
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/dashboard-weekly-overview">
          <span className="material-symbols-outlined">home_work</span>
          <span className="text-[11px] font-medium">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/add-shift-form">
          <span className="material-symbols-outlined">calendar_view_week</span>
          <span className="text-[11px] font-medium">Shifts</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 px-4 py-1.5 hover:text-sky-500 transition-all duration-300 ease-out" href="/exam-protection-mode">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-[11px] font-medium">Exams</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-sky-50 text-sky-700 rounded-2xl px-4 py-1.5 transition-all duration-300 ease-out" href="/settings">
          <span className="material-symbols-outlined">person_outline</span>
          <span className="text-[11px] font-medium">Profile</span>
        </a>
      </nav>
    </div>
  )
}

export default AddShiftRosterUpload
