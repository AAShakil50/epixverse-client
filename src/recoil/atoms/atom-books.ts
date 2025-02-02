import { Book } from '@/types/book'
import { atom } from 'recoil'

const booksAtom = atom<Book[]>({
    key: 'booksAtom',
    default: [],
})

const activeBookAtom = atom<string | null>({
    key: 'activeBookAtom',
    default: null
})

export { booksAtom , activeBookAtom }