import { Scene } from '@/types/scene'
import { atom } from 'recoil'

const scenesAtom = atom<Scene[]>({
    key: 'scenesAtom',
    default: [],
})

const activeSceneAtom = atom<string | null>({
    key: 'activeSceneAtom',
    default: null
})

export { scenesAtom, activeSceneAtom }