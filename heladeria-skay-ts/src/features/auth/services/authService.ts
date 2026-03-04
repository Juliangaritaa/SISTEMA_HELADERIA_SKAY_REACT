import axios from 'axios'

interface LoginRequest {
    correo: string
    password: string
}

interface LoginResponse {
    exito: boolean
    mensaje?: string
    datos?: {
        idUsuario: number
        nombreUsuario: string
        correo: string
        token: string
    }
}

const API_URL = 'http://localhost:8000/login'

export const authService = {
  async login(data: LoginRequest) {
    const response = await axios.post(API_URL, data)
    return response.data
  },
}

export const authData = {
  async login(data: LoginResponse) {
    const response = await axios.post(API_URL, data)
    return response.data
  },
}