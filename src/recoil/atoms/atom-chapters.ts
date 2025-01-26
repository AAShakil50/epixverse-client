import { Chapter } from '@/types/chapter'
import { atom } from 'recoil'

type ChaptersAtomType = {
    // chapters with data
    chapters: Chapter[],
}

const chaptersAtom = atom<ChaptersAtomType | null>({
    key: 'chaptersAtom',
    default: null,
})

const activeChapterAtom = atom<string | null>({
    key: 'activeChapterAtom',
    default: null
})

export { chaptersAtom , activeChapterAtom }