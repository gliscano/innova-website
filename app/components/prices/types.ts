export type { Finish, FamilyItem, Family } from '@/app/data/pricesData'

export interface Sel {
  familyId: string
  largoIndex: number | null
  finish: import('@/app/data/pricesData').Finish
}
