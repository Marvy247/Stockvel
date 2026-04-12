import { Component, ReactNode } from 'react';
interface State { hasError: boolean; }
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="glass rounded-2xl p-12 border border-app-border text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="font-bold text-xl mb-2">Something went wrong</p>
        <button onClick={() => this.setState({ hasError: false })}
          className="px-6 py-3 rounded-xl bg-accent-indigo text-white font-medium mt-4">
          Try again
        </button>
      </div>
    );
    return this.props.children;
  }
}
