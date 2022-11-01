import { atom } from 'nanostores'
export const user = atom<any>(null)

export const setUser = (curUser: any) => {
  user.set(curUser);
}