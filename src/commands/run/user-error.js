// @flow

// Represents an error cause by wrong user input,
// opposed to a programmer error.
//
// User errors are supposed to be displayed in a user-friendly way,
// programmer errors with a stack trace.
module.exports = class UserError extends Error {
  constructor (message: string) {
    super(message)
  }
}
