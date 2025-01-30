import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeProjectAtom, projectsAtom } from "@/recoil/atoms/atom-projects";
import { Book } from "@/types/book";
import { Chapter } from "@/types/chapter";
import { Project } from "@/types/project";
import { Scene } from "@/types/scene";
import { useEffect, useState } from "react";
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

    const { isLoading, error } = useSwr<Project[]>
        (
            `${API_URL}/projects`,
            fetcher,
            {
                fallbackData: [],
                onSuccess(projectsData) {
                    if (projectsData) {
                        setProjects({
                            projects: projectsData
                        });
                        if (!activeProject) {
                            if (projectsData.length > 0) setActiveProject(projectsData[0].id);
                            else setActiveProject(null);
                        }
                    }
                },
            }
        );

    return {
        projects: projects?.projects,
        setProjects: setProjects,
        activeProject: activeProject,
        setActiveProject: setActiveProject,
        isLoading,
        error
    };
}

export function useProjectOne(projectId: string | null) {
    // Fetch project
    const { data: project, isLoading: isProjectLoading } = useSwr<Project[]>(
        projectId ? `${API_URL}/projects?id=${projectId}` : null,
        fetcher,
    );

    // Fetch books for this project
    const { data: books, isLoading: isBooksLoading } = useSwr<Book[]>(
        `${API_URL}/books?projectID=${projectId}`,
        fetcher,
    );

    const [chapters, setChapters] = useState<Chapter[] | null>(null);
    const [isChaptersLoading, setIsChaptersLoading] = useState(true);

    // Fetch chapters for all books (individual requests per book)
    useEffect(() => {
        const fetchChapters = async () => {
            const chaptersResponses = await Promise.all<Chapter[] | null>(
                books!.map((book) => fetcher<Chapter[] | null>(
                    `${API_URL}/chapters?bookID=${book.id}`
                ))
            );

            const validResponses = chaptersResponses.filter(
                (response) => response != null
            );

            const finalChapters = validResponses.flat();

            setChapters(finalChapters)
            setIsChaptersLoading(false);
        }

        if (books) {
            fetchChapters();
            setIsChaptersLoading(true);
        }
    }, [books]);

    const [scenes, setScenes] = useState<Scene[] | null>(null);
    const [isScenesLoading, setIsScenesLoading] = useState(true);

    // Fetch chapters for all books (individual requests per book)
    useEffect(() => {
        const fetchScenes = async () => {
            const scenesResponses = await Promise.all<Scene[] | null>(
                chapters!.map((chapter) => fetcher<Scene[] | null>(
                    `${API_URL}/scenes?chapterID=${chapter.id}`
                ))
            );

            const validResponses = scenesResponses.filter(
                (response) => response != null
            );

            const finalScenes = validResponses.flat();

            setScenes(finalScenes);
            setIsScenesLoading(false);
        }

        if (chapters) {
            fetchScenes()
            setIsScenesLoading(true);
        }
    }, [chapters]);

    return {
        isLoading: isProjectLoading || isBooksLoading || isChaptersLoading || isScenesLoading,
        project: project && project.length ? project[0] : null,
        books: books,
        chapters: chapters,
        scenes: scenes
    }
}