
const mocks: MockXHR[] = []

interface IHeaders {
  [key: string]: string | number
}

class MockXHR {
  public readyState = 1 // open

  public responseText: string

  public withCredentials: boolean

  public onprogress: () => any
  public onreadystatechange: () => any
  public status: number
  public statusText: string

  public mockHeaders: IHeaders

  constructor() {
    mocks.push(this)
  }

  public open() {
    return
  }

  public send() {
    return
  }

  public abort() {
    return
  }

  public getResponseHeader(header) {
    return (this.mockHeaders || {})[header]
  }
}

export default {
  mockResponse(body: string[], headers: IHeaders = {}) {
    mocks.forEach((mock) => {
      mock.mockHeaders = headers
      mock.readyState = 2
      mock.onreadystatechange()
      mock.readyState = 3
      mock.onreadystatechange()
      mock.mockHeaders = headers
      body.forEach((chunk) => {
        mock.responseText = mock.responseText + chunk
        mock.onprogress()
      })
    })
  },

  createMock() {
    MockXHR.prototype.responseText = ""
    MockXHR.prototype.withCredentials = true
    MockXHR.prototype.status = 200
    MockXHR.prototype.statusText = "200 Okay"

    return MockXHR
  }
}

