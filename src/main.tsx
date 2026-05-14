import { StrictMode } from 'react'
import './index.css'

const rootElement = document.getElementById('root')!

/**
 * Bootstrap the app asynchronously so any module-level errors (e.g. missing
 * Supabase env vars) are caught and shown as a readable message instead of a
 * silent blank page.
 */
async function bootstrap() {
  try {
    const { configError } = await import('./lib/supabase')

    if (configError) {
      rootElement.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;background:#0f172a;color:#f1f5f9;padding:1rem;">
          <div style="text-align:center;max-width:520px;">
            <div style="font-size:2.5rem;margin-bottom:1rem;">⚙️</div>
            <h1 style="color:#f87171;font-size:1.5rem;font-weight:700;margin-bottom:0.75rem;">Configuration Required</h1>
            <p style="color:#94a3b8;margin-bottom:1.25rem;line-height:1.6;">${configError}</p>
            <p style="color:#64748b;font-size:0.8rem;">After adding the variables, redeploy the project on Vercel.</p>
          </div>
        </div>
      `
      return
    }

    // Dynamically import App only after confirming env is healthy
    const { default: App } = await import('./App')
    const { createRoot: makeRoot } = await import('react-dom/client')

    makeRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  } catch (err) {
    console.error('[nidus] Failed to start:', err)
    const message = err instanceof Error ? err.message : String(err)
    rootElement.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;background:#0f172a;color:#f1f5f9;padding:1rem;">
        <div style="text-align:center;max-width:520px;">
          <div style="font-size:2.5rem;margin-bottom:1rem;">⚠️</div>
          <h1 style="color:#f87171;font-size:1.5rem;font-weight:700;margin-bottom:0.75rem;">Application Error</h1>
          <p style="color:#94a3b8;margin-bottom:1.25rem;line-height:1.6;">The application could not start. Please check the browser console for details.</p>
          <code style="display:block;background:#1e293b;padding:0.75rem 1rem;border-radius:0.5rem;color:#94a3b8;font-size:0.8rem;word-break:break-word;">${message}</code>
        </div>
      </div>
    `
  }
}

bootstrap()
