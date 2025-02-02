import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeChapterAtom } from "@/recoil/atoms/atom-chapters";
import { activeSceneAtom, scenesAtom } from "@/recoil/atoms/atom-scenes";
import { Scene } from "@/types/scene";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export function useScenes(chapterID: string | null) {
    const [scenes, setScenes] = useState<Scene[] | null>();

    const { isLoading, error } = useSWR<Scene[]>(
        chapterID ? `${API_URL}/scenes?chapterID=${chapterID}` : null,
        fetcher,
        {
            fallbackData: [],
            onSuccess(scenesData) {
                if (scenesData) {
                    setScenes(scenesData);
                }
            },
        }
    );

    return {
        scenes,
        setScenes,
        isLoading,
        error
    }
}

export function useScenesAtomized() {
    const [atomScenes, setAtomScenes] = useRecoilState(scenesAtom)
    const [activeScene, setActiveScene] = useRecoilState(activeSceneAtom)

    const [activeChapter] = useRecoilState(activeChapterAtom)
    const { scenes, isLoading, error } = useScenes(activeChapter)
    const isAtomScenesEmpty = !atomScenes.length;

    // change scenes-atom to whatever SWR (scenes) responds
    useEffect(() => {
        setAtomScenes(scenes ?? [])
    }, [scenes, setAtomScenes])

    // change active-scene-atom whenever scenes-atom changes
    useEffect(() => {
        if (atomScenes.length > 0) {
            setActiveScene(atomScenes[0].id)
        } else {
            setActiveScene(null)
        }
    }, [atomScenes, setActiveScene])

    // empty scenes-atom whenever active-chapter-atom nulls,
    // because null active-chapter-atom prevents SWR request
    useEffect(() => {
        if (!activeChapter) {
            setAtomScenes([])
        }
    }, [activeChapter, setAtomScenes])

    return {
        scenes: atomScenes,
        activeScene,
        setActiveScene,
        isLoading: isAtomScenesEmpty ? isLoading : false,
        error
    };
}