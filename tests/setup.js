require('@testing-library/jest-dom')

global.Request = class Request {
    constructor(input, init = {}) {
        this.url = input
        this.method = init.method || 'GET'
        this.headers = init.headers || {}
        this._body = init.body
    }
    
    async json() {
        return JSON.parse(this._body)
    }
    
    async formData() {
        const formData = new FormData()
        return formData
    }
}

global.Response = class Response {
    constructor(body, init = {}) {
        this.status = init.status || 200
        this._body = body
        this.headers = init.headers || {}
    }
    
    async json() {
        return JSON.parse(this._body)
    }
}

global.FormData = class FormData {
    constructor() {
        this._data = {}
    }
    
    append(key, value) {
        this._data[key] = value
    }
    
    get(key) {
        return this._data[key]
    }
}
