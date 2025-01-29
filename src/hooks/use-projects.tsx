import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeProjectAtom, projectsAtom } from "@/recoil/atoms/atom-projects";
import { Project } from "@/types/project";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useSwr from "swr"

/**
 * Custom hook to manage and fetch projects.
 *
 * Fetches (using SWR) the list of projects from the API and sets the active project.
 *
 * @returns {Object} An object containing:
 * - `projects`: An array of projects.
 * - `activeProject`: The ID of the currently active project.
 * - `setActiveProject`: Function to set the active project.
 * - `isLoading`: Boolean indicating if the data is currently being loaded.
 * - `error`: Any error that occurred during data fetching.
 */
export function useProjects() {
    const [projects, setProjects] = useRecoilState(projectsAtom);
    const [activeProject, setActiveProject] = useRecoilState(activeProjectAtom)

    const { data: projectsData, isLoading, error } = useSwr<Project[]>
        (
            `${API_URL}/projects`,
            fetcher,
            {
                fallbackData: [],
            }
        );

    useEffect(() => {
        if (projectsData) {
            setProjects({
                projects: projectsData
            })

            if (!activeProject) {
                if (projectsData.length > 0) setActiveProject(projectsData[0].id);
                else setActiveProject(null);
            }
        }
    }, [activeProject, projectsData, setActiveProject, setProjects]);

    return {
        projects: projects?.projects,
        setProjects: setProjects,
        activeProject: activeProject,
        setActiveProject: setActiveProject,
        isLoading,
        error
    };
}