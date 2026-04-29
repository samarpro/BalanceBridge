import { useState } from 'react'
import { useUser } from '../context/UserContext'

const SettingsPage = () => {
  const { name, setName } = useUser()
  const [draft, setDraft] = useState(name)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!draft.trim()) return
    setName(draft.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="min-h-screen bg-background text-on-background px-6 py-12 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="font-h1 text-h1 text-on-surface">Settings</h1>
          <p className="font-body-md text-on-surface-variant">Update your profile details.</p>
        </header>
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 space-y-6">
          <div>
            <h2 className="font-h3 text-h3 text-on-surface">Change Name</h2>
            <p className="text-body-sm text-on-surface-variant">This will update the profile display name.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-2 focus:ring-primary-container outline-none"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Enter your name"
            />
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md" type="submit">
                Save Name
              </button>
              {saved && <span className="text-body-sm text-secondary">Saved</span>}
            </div>
          </form>
        </section>
        <section className="bg-secondary-container/20 rounded-2xl p-4 border border-secondary-container/40">
          <p className="text-body-sm text-on-secondary-container">
            Current name: <span className="font-semibold text-on-surface">{name}</span>
          </p>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
