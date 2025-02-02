import { Chapter } from '@/types/chapter'
import { atom } from 'recoil'

const chaptersAtom = atom<Chapter[]>({
    key: 'chaptersAtom',
    default: [],
})

const activeChapterAtom = atom<string | null>({
    key: 'activeChapterAtom',
    default: null
})

export { chaptersAtom , activeChapterAtom }