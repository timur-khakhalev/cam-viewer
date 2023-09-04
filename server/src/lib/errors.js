class AuthenticationError extends Error {
  constructor (message, errors) {
    super(message || 'Unauthorized')
    this.name = 'AuthenticationError'
    this.status = 401
    this.errors = errors
  }
}

class AuthorizationError extends Error {
  constructor (message, errors) {
    super(message || 'Access denied')
    this.name = 'AuthorizationError'
    this.status = 403
    this.errors = errors
  }
}

class ValidationError extends Error {
  constructor (message, errors) {
    super(message || 'Bad Request')
    this.name = 'ValidationError'
    this.errors = errors
    this.status = 400
  }
}

class NotFoundError extends Error {
  constructor (item) {
    super(`${item.charAt(0).toUpperCase() + item.slice(1)} not found`)
    this.name = 'NotFoundError'
    this.status = 404
  }
}

class AWSFetchingError extends Error {
  constructor (status, message, errors) {
    super(message)
    this.name = 'AWSFetchingError'
    this.errors = errors
    this.status = status
  }
}

class FetchingError extends Error {
  constructor (status, message, errors) {
    super(message || 'Fetching error')
    this.name = 'FetchingError'
    this.errors = errors
    this.status = status || 500
  }
}

module.exports = {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  AWSFetchingError,
  FetchingError
}
