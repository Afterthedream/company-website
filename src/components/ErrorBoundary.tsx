'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.633-1.964-.633-2.732 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-surface-800 mb-2">页面出了点问题</h2>
            <p className="text-sm text-surface-500 mb-6">很抱歉，页面遇到了意外错误。您可以尝试刷新页面或返回首页。</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 min-h-[44px] bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-500 transition-colors"
              >
                刷新页面
              </button>
              <a
                href="/"
                className="px-6 py-3 min-h-[44px] bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
