import { Link } from 'react-router-dom'

const OnboardingVerification = () => {
  return (
    <div className="font-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <main className="min-h-screen flex flex-col items-center justify-center px-margin py-xl">
        <div className="mb-lg flex flex-col items-center gap-base">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-lg">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </div>
          <h2 className="font-h2 text-h2 text-on-surface tracking-tight">BalanceBridge</h2>
          <p className="font-body-md text-body-md text-outline">Academic Sanctuary</p>
        </div>
        <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-xl p-md md:p-lg border border-surface-container shadow-card">
          <div className="mb-lg space-y-xs">
            <h1 className="font-h1 text-h1 text-on-surface">Verify your student ID</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              To keep our community safe and focused on academic wellbeing, we need to confirm your university status.
            </p>
          </div>
          <div className="space-y-md">
            <button
              type="button"
              className="w-full group relative flex items-center justify-center gap-sm bg-primary text-on-primary font-label-md text-label-md py-4 px-lg rounded-full shadow-md hover:bg-on-primary-fixed-variant transition-all focus:ring-4 focus:ring-primary-fixed outline-none"
            >
              <span className="material-symbols-outlined">school</span>
              Sign in with Deakin SSO
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <div className="flex items-center gap-md py-base">
              <div className="h-[1px] flex-1 bg-outline-variant"></div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">or verify manually</span>
              <div className="h-[1px] flex-1 bg-outline-variant"></div>
            </div>
            <form className="space-y-md">
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant px-1" htmlFor="student_id">
                  Student ID Number
                </label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-md font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-outline"
                  id="student_id"
                  placeholder="e.g. 219485721"
                  type="text"
                />
              </div>
              <button
                className="w-full bg-secondary-container text-on-secondary-container font-label-md text-label-md py-4 px-lg rounded-full hover:bg-secondary-fixed transition-all focus:ring-4 focus:ring-secondary-fixed-dim outline-none flex items-center justify-center gap-sm"
                type="submit"
              >
                Submit ID for Review
              </button>
            </form>
          </div>
        </div>
        <div className="mt-lg max-w-[520px] text-center space-y-md">
          <div className="inline-flex items-center gap-xs bg-secondary-fixed/30 text-on-secondary-fixed px-sm py-1 rounded-full border border-secondary-fixed">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <span className="font-label-sm text-label-sm">Privacy-First Verification</span>
          </div>
          <div className="space-y-sm px-md">
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              We use student authentication to ensure every member of BalanceBridge is a verified peer. We do not store your university login credentials, and your student data is used only for the initial verification process.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Questions?{' '}
              <a className="text-primary font-semibold hover:underline decoration-primary/30" href="/onboarding-welcome">
                Read our Privacy Commitment
              </a>
            </p>
          </div>
        </div>
        <div className="mt-xl flex gap-lg opacity-40">
          <div className="h-1 w-24 bg-primary-container rounded-full"></div>
          <div className="h-1 w-12 bg-secondary-container rounded-full"></div>
          <div className="h-1 w-8 bg-tertiary-container rounded-full"></div>
        </div>
        <div className="mt-lg">
          <Link
            to="/onboarding-define-goals"
            className="inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:text-on-primary-container"
          >
            Continue
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </main>
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-fixed/20 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary-fixed/20 blur-[100px]"></div>
      </div>
    </div>
  )
}

export default OnboardingVerification
