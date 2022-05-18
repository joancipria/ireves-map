export type FileError = { type: 'error'; message: string }
export type NetWorkError = { type: 'error'; message: string, httpCode: number }

export type Success<T> = { type: 'success'; result: T }
export type Result<T> = Success<T> | FileError
