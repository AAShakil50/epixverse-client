import { Book } from '@/types/book'
import { atom } from 'recoil'

type BooksAtomType = {
    // books with data
    books: Book[],
}

const booksAtom = atom<BooksAtomType | null>({
    key: 'booksAtom',
    default: null,
})

const activeBookAtom = atom<string | null>({
    key: 'activeBookAtom',
    default: null
})

export { booksAtom , activeBookAtom }