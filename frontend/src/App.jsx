export default function App() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content">Tailwind v4 + DaisyUI v5</h1>
          <p className="text-base-content/60 mt-2">If this looks styled, you're good to go ✅</p>
        </div>

        {/* Buttons */}
        <div className="card bg-base-100 shadow p-6 space-y-3">
          <h2 className="font-semibold text-lg">Buttons</h2>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-accent">Accent</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-outline">Outline</button>
            <button className="btn btn-error">Error</button>
          </div>
        </div>

        {/* Alerts */}
        <div className="card bg-base-100 shadow p-6 space-y-3">
          <h2 className="font-semibold text-lg">Alerts</h2>
          <div role="alert" className="alert alert-success">✅ DaisyUI is working!</div>
          <div role="alert" className="alert alert-warning">⚠️ Tailwind v4 is active.</div>
          <div role="alert" className="alert alert-error">🚫 This is just a test alert.</div>
        </div>

        {/* Badge + Input */}
        <div className="card bg-base-100 shadow p-6 space-y-3">
          <h2 className="font-semibold text-lg">Form & Badges</h2>
          <input type="text" placeholder="Type something..." className="input input-bordered w-full" />
          <div className="flex gap-2 flex-wrap">
            <span className="badge badge-primary">Primary</span>
            <span className="badge badge-secondary">Secondary</span>
            <span className="badge badge-accent">Accent</span>
            <span className="badge badge-outline">Outline</span>
          </div>
        </div>

        {/* Theme switcher */}
        <div className="card bg-base-100 shadow p-6 space-y-3">
          <h2 className="font-semibold text-lg">Theme Switcher</h2>
          <div className="flex gap-2 flex-wrap">
            {["light", "dark", "cupcake", "dracula", "cyberpunk"].map((theme) => (
              <button
                key={theme}
                className="btn btn-sm btn-outline capitalize"
                onClick={() => document.documentElement.setAttribute("data-theme", theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}