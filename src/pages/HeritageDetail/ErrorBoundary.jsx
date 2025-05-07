import React from 'react'

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console for debugging
    console.error('ErrorBoundary caught an error:', error)
    console.error('Error stack trace:', errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-destructive py-4">
          <h2>Đã xảy ra lỗi</h2>
          <p>{this.state.error?.message || 'Không xác định'}</p>
          {this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Chi tiết lỗi</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary