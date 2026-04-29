import { Link } from 'react-router-dom'

const OnboardingConnectCalendar = () => {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-x-hidden">
      <nav className="h-16 flex items-center px-8 fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <span className="text-lg font-bold text-slate-900 font-h1 tracking-tight">BalanceBridge</span>
        <div className="ml-auto flex items-center gap-4">
          <span className="font-label-sm text-outline">Step 2 of 4</span>
          <div className="w-32 h-1 bg-surface-container rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-primary-container"></div>
          </div>
        </div>
      </nav>
      <main className="flex-grow flex items-center justify-center pt-24 pb-xl px-margin">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
          <div className="md:col-span-5 flex flex-col gap-md">
            <div className="relative w-full aspect-square rounded-[32px] overflow-hidden shadow-card">
              <img
                className="w-full h-full object-cover"
                alt="Minimalist desk setup with an analog calendar and a soft plant"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjfm4rkNd041I0gnV-DkS_a1maPAnr4NV4F6Y2OOPT8AoSF8hSEJheooWiknZ3TwdBOc_pAZeKABqMRuNBAL8fI7TfHS-q_zUzvF58eJdQ-OBdFu3ngqyJjwZY8T_gbY7dw6QrpobghBaqxCQp-gCAZnFl7HielRdOmY3KwQMYW5dkBv3g_TFAhTxk-cpSWjXSRAA3BPXtLEn-376JMsZdOJOPNxM6Mub0Dy_hR86rwczI5gVfFWCCMKrBe1H26A7LgADypxvXrR63"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            <div className="p-sm bg-secondary-container/30 rounded-xl border border-secondary-fixed-dim/30">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  privacy_tip
                </span>
                <p className="font-body-sm text-on-secondary-container">
                  Your data remains private. We only sync event times to prevent academic burnout and shift conflicts.
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-7 flex flex-col gap-lg">
            <header className="flex flex-col gap-xs">
              <h1 className="font-h1 text-h1 text-on-background tracking-tight">Keep Everything in Sync</h1>
              <p className="font-body-lg text-on-surface-variant">
                Connect your calendars to automatically balance your clinical shifts with study blocks and rest periods.
              </p>
            </header>
            <div className="flex flex-col gap-md">
              <div className="group relative flex items-center justify-between p-md bg-surface-container-lowest rounded-xl border border-outline-variant/40 hover:border-primary-container transition-all duration-300 shadow-card">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100">
                    <span className="material-symbols-outlined text-[32px]" style={{ color: '#4285F4' }}>
                      calendar_today
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-h3 text-on-surface">Google Calendar</span>
                    <span className="font-body-sm text-outline">Personal & Academic Schedules</span>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="relative w-20 h-10 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-['OFF'] peer-checked:after:content-['ON'] after:flex after:items-center after:justify-center after:text-[10px] after:font-bold after:absolute after:top-[4px] after:start-[4px] after:bg-white after:text-outline peer-checked:after:text-primary after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
              <div className="group relative flex items-center justify-between p-md bg-surface-container-lowest rounded-xl border border-outline-variant/40 hover:border-primary-container transition-all duration-300 shadow-card">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100">
                    <span className="material-symbols-outlined text-[32px]" style={{ color: '#000000' }}>
                      calendar_month
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-h3 text-on-surface">Apple Calendar</span>
                    <span className="font-body-sm text-outline">iCloud & Device Events</span>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="relative w-20 h-10 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-['OFF'] peer-checked:after:content-['ON'] after:flex after:items-center after:justify-center after:text-[10px] after:font-bold after:absolute after:top-[4px] after:start-[4px] after:bg-white after:text-outline peer-checked:after:text-primary after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-md pt-base">
              <div className="flex flex-col gap-sm border-l-2 border-primary-container/20 pl-md">
                <h4 className="font-label-md text-primary uppercase tracking-widest">Permissions Overview</h4>
                <ul className="flex flex-col gap-xs">
                  <li className="flex items-center gap-2 font-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Read-only access to event times and titles
                  </li>
                  <li className="flex items-center gap-2 font-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Automatic conflict detection for shift matching
                  </li>
                  <li className="flex items-center gap-2 font-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    256-bit encrypted data sync
                  </li>
                </ul>
              </div>
              <div className="flex gap-md mt-sm">
                <Link
                  to="/dashboard-weekly-overview"
                  className="flex-1 bg-primary text-white font-label-md py-4 rounded-xl hover:bg-on-primary-container transition-all shadow-md active:scale-95 text-center"
                >
                  Continue to Sanctuary
                </Link>
                <Link
                  to="/dashboard-weekly-overview"
                  className="px-md bg-secondary-container/20 text-secondary font-label-md rounded-xl hover:bg-secondary-container/40 transition-all border border-secondary-fixed-dim/20 text-center"
                >
                  Skip for now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-secondary-container/20 rounded-full blur-[80px] -z-10"></div>
    </div>
  )
}

export default OnboardingConnectCalendar
