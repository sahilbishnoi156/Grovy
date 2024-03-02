"use client"
import React, { Component } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Error in component:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render a fallback UI when an error occurs
      return (
        <div className="min-h-[90vh] flex items-center justify-center">
          <h1>Something Went Wrong</h1>
          <p>Please refresh or try again later</p>
        </div>
      );
    }

    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary;
