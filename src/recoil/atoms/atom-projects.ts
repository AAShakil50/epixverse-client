import { Project } from '@/types/project'
import { atom } from 'recoil'

type ProjectsAtomType = {
    // projects with data
    projects: Project[],
}

const projectsAtom = atom<ProjectsAtomType | null>({
    key: 'projectsAtom',
    default: null,
})

const activeProjectAtom = atom<string | null>({
    key: 'activeProjectsAtom',
    default: null
})

export { projectsAtom, activeProjectAtom }