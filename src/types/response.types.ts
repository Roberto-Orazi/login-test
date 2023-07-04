export interface Res<T> {
  status: boolean
  message: string
  data: T
}