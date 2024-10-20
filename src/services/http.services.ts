import axios, { type AxiosInstance } from 'axios'

export const apiUrl = 'http://localhost:8000'

export function http(headersParams: any = {}): AxiosInstance {
    const headers = {
        'Content-Type': 'application/json',
        ...headersParams
    }

    const instance = axios.create({
        baseURL: apiUrl,
        headers: {
            ...headers
        }
    })

    instance.defaults.withCredentials = true
    //instance.defaults.withXSRFToken = true

    return instance
}
