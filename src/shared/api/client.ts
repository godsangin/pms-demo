import axios from 'axios'
import { getStoredToken } from '@/shared/lib/storage'

// 통합 서버 환경(3000번 포트)에서는 상대 경로를 사용하고, 
// Vite 개발 서버 환경(5173번 포트)에서는 백엔드 주소를 명시합니다.
const isDev = import.meta.env.DEV
const baseURL = isDev ? 'http://localhost:3000/api' : '/api'

const useMock = import.meta.env.VITE_MOCK_MODE === 'true'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Add Token
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Mock 모드인지 실제 WAS 모드인지 판별하는 유틸리티
export const isMockMode = () => {
  // .env에 명시적으로 설정되어 있거나, URL 파라미터로 강제할 수 있음
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('mock') === 'true') return true
  return useMock
}
