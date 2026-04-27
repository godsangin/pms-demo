import { apiClient } from '@/shared/api/client'
import type { User } from '@/shared/types/pms'

export interface LoginResponse {
  access_token: string
  user: User
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', {
    username,
    password,
  })
  return data
}

export async function getProfileApi(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/profile')
  return data
}
