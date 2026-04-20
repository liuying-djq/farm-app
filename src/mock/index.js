const MOCK_ENABLED = false

const mockHandlers = {}

export function registerMock(path, handler) {
  mockHandlers[path] = handler
}

export function mockRequest(path, data) {
  if (!MOCK_ENABLED) return null
  const handler = mockHandlers[path]
  if (handler) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = handler(data)
        resolve({
          code: 200,
          message: 'success',
          data: result
        })
      }, 300)
    })
  }
  return null
}

export { MOCK_ENABLED }
