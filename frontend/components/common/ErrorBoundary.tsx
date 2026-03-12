"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`CRITICAL_COMPONENT_FAILURE [${this.props.componentName}]:`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-md border border-red-500/20 rounded-2xl text-center min-h-[300px]">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-500/50">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {this.props.componentName} Unavailable
          </h2>
          <p className="text-white/40 text-sm max-w-xs mb-6 font-medium">
            The Cyber-Fortress has isolated a failure in this component to prevent a global crash.
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl transition border border-white/5 font-bold uppercase tracking-widest text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            Re-Initialize Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
