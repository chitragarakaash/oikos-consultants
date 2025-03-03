// Simple logger utility for consistent error handling
export const logger = {
  error: (message: string, error?: unknown) => {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(message, error)
    } else {
      // In production, log to console for AWS CloudWatch
      console.error(message, error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error)
    }
    // In production, you would typically send this to a logging service
    // For example: Sentry, LogRocket, etc.
  },
  
  info: (message: string, data?: unknown) => {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(message, data)
    } else {
      // In production, log to console for AWS CloudWatch
      console.log(message, data)
    }
    // In production, you would typically send this to a logging service
  }
} 