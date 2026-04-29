import { useMemo, useState } from 'react'

const defaultTodos = [
  { id: 1, label: '10 min meditation', done: false },
  { id: 2, label: 'Evening journaling', done: false },
]

const WellbeingPage = () => {
  const [todos, setTodos] = useState(defaultTodos)
  const [newTask, setNewTask] = useState('')

  const totals = useMemo(
    () => ({ work: 18, focus: 12, goalWork: 24, goalFocus: 15 }),
    [],
  )

  const handleAdd = (event) => {
    event.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, { id: Date.now(), label: trimmed, done: false }])
    setNewTask('')
  }

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  return (
    <div className="min-h-screen bg-background text-on-background px-6 py-12 md:px-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface">Wellbeing</h1>
            <p className="font-body-md text-on-surface-variant">Track balance between work and focus study.</p>
          </div>
          <button className="hidden md:inline-flex px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md" type="button">
            Adjust Goals
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 space-y-6">
            <div>
              <h2 className="font-h3 text-h3 text-on-surface">This Week</h2>
              <p className="text-body-sm text-on-surface-variant">Hours logged and progress to goals.</p>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span className="text-slate-500">Work Hours</span>
                  <span className="font-semibold">
                    {totals.work} / {totals.goalWork} hrs
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(totals.work / totals.goalWork) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span className="text-slate-500">Focus Study</span>
                  <span className="font-semibold">
                    {totals.focus} / {totals.goalFocus} hrs
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${(totals.focus / totals.goalFocus) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-secondary-container/20 rounded-2xl p-4 border border-secondary-container/40">
              <p className="text-body-sm text-on-secondary-container">
                You are on track. Keep your focus sessions steady, and plan a rest block this weekend.
              </p>
            </div>
          </section>

          <section className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-h3 text-h3 text-on-surface">Todo List</h2>
                <p className="text-body-sm text-on-surface-variant">Small habits that support recovery.</p>
              </div>
            </div>
            <form className="flex gap-2" onSubmit={handleAdd}>
              <input
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-body-md focus:border-primary focus:ring-2 focus:ring-primary-container outline-none"
                placeholder="Add a new habit"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
              />
              <button className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md" type="submit">
                Add
              </button>
            </form>
            <div className="space-y-3">
              {todos.map((todo) => (
                <label key={todo.id} className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded"
                      checked={todo.done}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span className={`text-body-sm ${todo.done ? 'line-through text-outline' : 'text-on-surface'}`}>
                      {todo.label}
                    </span>
                  </div>
                  <span className="text-xs text-outline">Today</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default WellbeingPage
