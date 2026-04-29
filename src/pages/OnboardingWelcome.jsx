import { Link } from 'react-router-dom'

const OnboardingWelcome = () => {
  return (
    <div className="bg-surface font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <main className="min-h-screen flex flex-col items-center justify-between px-6 py-12 md:px-xl md:py-xl max-w-7xl mx-auto">
        <header className="w-full flex justify-center mb-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">shield_with_heart</span>
            <span className="font-h2 text-h3 tracking-tight text-on-surface">BalanceBridge</span>
          </div>
        </header>
        <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-lg md:gap-xl">
          <div className="flex-1 text-center md:text-left space-y-md max-w-xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md mb-xs">
              Academic Sanctuary
            </div>
            <h1 className="font-h1 text-h1 text-on-surface leading-tight">
              Find Your Academic <span className="text-primary italic">Rhythm</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto md:mx-0">
              Transform your high-stress study cycles into a sustainable flow. BalanceBridge helps you manage shifts, track exam prep, and prioritize your wellbeing.
            </p>
            <div className="pt-sm space-y-sm">
              <div className="flex items-center gap-3 justify-center md:justify-start group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">self_care</span>
                </div>
                <span className="font-body-md text-on-surface-variant">
                  Guided mental health breaks between study sessions
                </span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <span className="font-body-md text-on-surface-variant">
                  Visual shift planning for working students
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  alt="Student life"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGt7nAV8g0jqfF8Cfy0DIysZ5lRkGAtQR0vvjMNI3pTGQTo-K-R9iN0Hj5oz0okq8uqRNKXa1HLcT4RDMoekx7kDnd92sknUBzd-pqkZDuNnUpICy7QWZWv_Y5BkpRXe96Z12jD4-39UhRtqQn2zGl8sEbokOblG94xsT7KbGL1J0ovP0iCmtXckpXMwyZ51cuP64I4vg4Ce1zNpu0YMKyqh8yFSxogIluocyughhOMWJpQxQEpC4kZAAgm7nbN64n4T5yh_IzV43N"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-label-sm text-label-sm uppercase tracking-widest opacity-80">Our Community</p>
                  <p className="font-h3 text-h3">15k+ Students Thriving</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-center gap-2">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield_with_heart
                </span>
                <h3 className="font-h3 text-label-md text-on-surface">Exam Shield</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Focus mode that blocks distractions automatically.
                </p>
              </div>
              <div className="bg-secondary-container p-6 rounded-3xl shadow-sm border border-secondary-fixed-dim/20 flex flex-col justify-center gap-2">
                <span className="material-symbols-outlined text-on-secondary-container text-4xl">groups</span>
                <h3 className="font-h3 text-label-md text-on-secondary-container">Break Match</h3>
                <p className="font-body-sm text-body-sm text-on-secondary-container/80">
                  Connect with peers for shared rest periods.
                </p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-tertiary-fixed-dim/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
        <footer className="w-full mt-xl flex flex-col items-center gap-6">
          <div className="w-full max-w-md space-y-4">
            <Link
              to="/onboarding-verification"
              className="w-full py-4 px-8 bg-primary text-on-primary rounded-full font-label-md text-body-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Get Started
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link
              to="/dashboard-weekly-overview"
              className="w-full py-4 px-8 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-body-md hover:bg-secondary-fixed transition-colors flex items-center justify-center"
            >
              I already have an account
            </Link>
          </div>
          <div className="flex items-center gap-8 mt-4">
            <div className="flex -space-x-3">
              <img
                alt="Portrait of a diverse female student smiling"
                className="w-8 h-8 rounded-full border-2 border-surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAzEy9pzHnDBb9AW-GgmLLApbTTZPnsOCmKCCv4zoqgpLhJbNIq5XyfrMstjeApRQEd8eqPSaPlk9PK9OUoNaWFbUAM1oiTJhwEvhYe6s05WYGdoCBjM_zuJ9G4k1lYTebKOjdnbepBJQKfRVrhvwFK-QO0zBQkTiyhizI5NpIBU5tw6nZi4tMNhJZNHwFiw_kdr8tOI82TLlZv23jHZPeV3rnzOre_sIgtL6scnYcmuJUXJGSaOyuI757dr8261q72mLdAg6IryRJ"
              />
              <img
                alt="Portrait of a smiling male student with glasses"
                className="w-8 h-8 rounded-full border-2 border-surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD68bzQva5-77y84FcXsyD4i7fQkC1z-ryoLMYGNT7PaAzTCMoK4EEqyKZgLMX-PHT5innIHw_ZsaHvIcnp2vOmOIA7ePxyGwYmmPTGfPIkQuC0RkRQDB2PhS689YHBgElmL1UoNONX6UcjJoJdJt-ULOxosKBY4QEmgOPWgLHs7tfs2V3p0y8V1Mkhiz34Fol33sK_jP9UsKcN93hcMwqHP7G4TMBT0PEiIjyzXQDd-GKFJlHuZZtJlI1Q7jgc0QJ97EZRZLua3fQ3"
              />
              <img
                alt="Portrait of a young black male student smiling"
                className="w-8 h-8 rounded-full border-2 border-surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmaVAhGiDf8HgD4m4D_xHbPFDn7zMZNOC3S1hPe9Yjht0x5YaaAozSPEyufv9wyzk5afKCqJzDn5Gf1DcaNuSJ7lRVP_2NRqe98xsYOyiczdr3ABgip8LtJl5LlMC2zq6sUfFDqcZw7_cq4ySJ6y4b8Rf9UQ9wfV2Zt4B-UiYbNB8l8aE2I-ZddbrgYD10kBCWrBFHxnNNAV90EsvjJIU3l0Cki8DrgQEHqKdzaIqfljtq2ShWgTqGFoJHC4n3bYIAKLIGfyHyft8k"
              />
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                99+
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Joined this week from your university
            </p>
          </div>
          <nav className="flex gap-6 mt-8">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/onboarding-verification">
              Privacy
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/onboarding-verification">
              Terms
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/onboarding-verification">
              Support
            </a>
          </nav>
        </footer>
      </main>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary-container/10 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-secondary-container/20 blur-[120px]"></div>
      </div>
    </div>
  )
}

export default OnboardingWelcome
