import { Link } from 'react-router-dom'

const OnboardingDefineGoals = () => {
  return (
    <div className="font-body-md bg-surface-bright min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      <main className="max-w-5xl w-full flex flex-col gap-lg">
        <header className="text-center flex flex-col gap-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            <span className="w-8 h-1 bg-surface-container-highest rounded-full"></span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface tracking-tight">What are your priorities?</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Help us tailor your Academic Sanctuary by selecting your top 2 focus areas. We'll use these to suggest better shifts and rest periods.
          </p>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <button className="flex flex-col text-left bg-surface-container-lowest p-8 rounded-xl border-2 border-primary shadow-card transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-primary-container text-3xl">
                shield_with_heart
              </span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Study Protection</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              Focus on academic excellence by ensuring your work shifts never interfere with crucial lecture or library time.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="font-label-sm text-label-sm px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full">
                Grade Focus
              </span>
              <span className="font-label-sm text-label-sm px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full">
                Exam Shield
              </span>
            </div>
            <img
              alt="Study focus"
              className="mt-6 w-full h-32 object-cover rounded-lg opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwR_mURHJ_8d3FOPI5gEClfK0pDEgxE3VLHzC_N7hZCmGq8eCLzgEMcZ1NdD4RNOwvI16-F9L2M6gHSGQY9ZM8_TDFkDWvkUUnL-SND1YOxjvGL8Wp__8M-jYyKm8yIx8pcLrq4xiwZF3r6SPYWPlYrimWUN3qLpRZi-9RYDrimQI9us3LYIjnGTBk5IFz3g8-xq3WBZY8rcuRZM2YzI2pTtsJ5OLHAipZkKvTnhdft7FmQeqJJTEuFUmGXFrvV5wc2l9UNs1wH7ha"
            />
          </button>
          <button className="flex flex-col text-left bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:border-primary-container transition-all duration-300 shadow-card relative overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-surface-variant text-3xl">work_history</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Work-Hour Safety</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              Avoid overworking and physical burnout. Set hard limits on consecutive shifts and total weekly hours.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="font-label-sm text-label-sm px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full">
                Fatigue Alert
              </span>
              <span className="font-label-sm text-label-sm px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full">
                Shift Cap
              </span>
            </div>
            <img
              alt="Balanced work"
              className="mt-6 w-full h-32 object-cover rounded-lg opacity-40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVQ-_oW8Sh3Yt-X-ZrA7YDgIibecbKNeTzVSL8I158YungWuMyTSrTZEY0uFsoJugxGfjJ8uD4yJ9BVcVk1L-YbaWLXZBS5h_Xn0IraB6ZmTDyamZ4vlJlDRUGqorU6vvkI2BoPDB8UBy9pxMwuj7gAUnybaCUJlVqubQCD4RA-O-QpvR_Isoc7S5JF_iILYmSvLr8xaXRE3fwCaQzp5zjZbPvz8ef2UI1SUWw9CX24jWwDWIjtGnS4sNoCLMxtjLYhn1DN6uMhJI8"
            />
          </button>
          <button className="flex flex-col text-left bg-surface-container-lowest p-8 rounded-xl border-2 border-primary shadow-card transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-secondary-container text-3xl">self_care</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Wellbeing</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              Prioritize rest and recovery. Dedicated time for sleep, social connections, and mental health check-ins.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="font-label-sm text-label-sm px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full">
                Sleep Goal
              </span>
              <span className="font-label-sm text-label-sm px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full">
                Rest Match
              </span>
            </div>
            <img
              alt="Rest and wellbeing"
              className="mt-6 w-full h-32 object-cover rounded-lg opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUdHmeD1uhj_rZOzPiqf2rQWRhjmn5Sq5QR4zMRAAJnhIUVV8PDG5-5aEh_U8OOxvlThxGM7CjH0CwIR22vrC-R-4_O8J5lDIjQWdAZKRznhBNWclz1FkJb6LURiCfSnuNs_wSwiBS9YdBHtyGsJOVCGW9fkJv0PyRT5ICoYGUmh2nWPBN7Ucvbhq_fmOwMn3Ex6duO3O1d3Dg10eY3BmJasCMZlNymgZUuYYo0njYuw6yFsmpnzSoFWI6uhWyD8IVgHTb42NxxDJr"
            />
          </button>
        </section>
        <footer className="mt-lg flex flex-col md:flex-row items-center justify-between gap-md border-t border-outline-variant/30 pt-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Selected: <span className="text-on-surface font-semibold">2 of 2</span>
            </p>
          </div>
          <div className="flex items-center gap-md w-full md:w-auto">
            <Link
              to="/onboarding-verification"
              className="flex-1 md:flex-none font-label-md text-label-md px-8 py-3 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg text-center"
            >
              Back
            </Link>
            <Link
              to="/onboarding-connect-calendar"
              className="flex-1 md:flex-none font-label-md text-label-md px-10 py-3 bg-primary text-on-primary rounded-lg shadow-sm hover:brightness-110 transition-all text-center"
            >
              Continue to Dashboard
            </Link>
          </div>
        </footer>
      </main>
      <button
        type="button"
        className="fixed bottom-8 right-8 w-14 h-14 bg-surface-container-highest rounded-full shadow-lg flex items-center justify-center hover:bg-surface-dim transition-all group"
      >
        <span className="material-symbols-outlined text-on-surface">help</span>
        <span className="absolute right-16 bg-on-surface text-surface px-3 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Support
        </span>
      </button>
    </div>
  )
}

export default OnboardingDefineGoals
