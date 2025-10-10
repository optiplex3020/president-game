import React, { Component } from 'react';
import type { ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '2rem',
          background: '#1e293b',
          color: 'white',
          minHeight: '100vh'
        }}>
          <h1 style={{ color: '#ef4444' }}>Erreur JavaScript</h1>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3>Message d'erreur:</h3>
            <p>{this.state.error?.message}</p>
            
            <h3>Stack trace:</h3>
            <pre style={{ 
              fontSize: '0.8rem', 
              overflow: 'auto',
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '4px'
            }}>
              {this.state.error?.stack}
            </pre>

            {this.state.errorInfo && (
              <>
                <h3>Component Stack:</h3>
                <pre style={{ 
                  fontSize: '0.8rem', 
                  overflow: 'auto',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '1rem',
                  borderRadius: '4px'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>

          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}