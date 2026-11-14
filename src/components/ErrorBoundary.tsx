import { Component, type ReactNode } from 'react'

/** If one screen crashes, show a friendly message instead of a blank app. */
export default class ErrorBoundary extends Component<{ children: ReactNode; onHome: () => void }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('Screen crashed:', error)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="stack">
        <section className="card hero">
          <h1>Something went wrong on this screen</h1>
          <p className="muted">Your data is safe. Try again, or go back to Today.</p>
          <p className="field-hint">{String(this.state.error.message || this.state.error.name).slice(0, 200)}</p>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => this.setState({ error: null })}>
              Try again
            </button>
            <button
              className="btn"
              onClick={() => {
                this.setState({ error: null })
                this.props.onHome()
              }}
            >
              Go to Today
            </button>
          </div>
        </section>
      </div>
    )
  }
}
