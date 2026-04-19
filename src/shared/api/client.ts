import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 장비 교체 시 네트워킹 불안정을 고려한 넉넉한 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock 모드인지 실제 WAS 모드인지 판별하는 유틸리티
export const isMockMode = () => useMock
