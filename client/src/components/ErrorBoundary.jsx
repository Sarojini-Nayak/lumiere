import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Surface the real error in the console instead of a silent blank page
    console.error("Lumière crashed while rendering:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ivory">
          <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body mb-4">
            Lumière
          </span>
          <h1 className="font-heading text-noir text-2xl md:text-3xl">Something went wrong</h1>
          <p className="font-body text-noir/50 text-sm mt-3 max-w-md">
            This page ran into an unexpected error. Open your browser console (F12) for the
            technical details.
          </p>
          {this.state.error?.message && (
            <pre className="mt-4 max-w-lg text-left text-[11px] font-mono text-red-500 bg-red-50 p-4 rounded-luxury overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="mt-6 bg-noir text-ivory px-6 py-3 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
