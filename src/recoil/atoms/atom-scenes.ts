import { Scene } from '@/types/scene'
import { atom } from 'recoil'

type ScenesAtomType = {
    // scenes with data
    scenes: Scene[],
}

const scenesAtom = atom<ScenesAtomType | null>({
    key: 'scenesAtom',
    default: null,
})

const activeSceneAtom = atom<string | null>({
    key: 'activeSceneAtom',
    default: null
})

export { scenesAtom , activeSceneAtom }