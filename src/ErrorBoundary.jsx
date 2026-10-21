import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Error di <Page>:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen w-full justify-center items-center'>
          <div className='p-5 text-red-600 w-xl flex flex-col gap-3'>
            <h2 className='text-xl'>Ups, Error!</h2>
            <details>
              <summary>Klik Detail Error</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
            <p className='italic'>Coba cek console browser untuk info lebih lanjut.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;