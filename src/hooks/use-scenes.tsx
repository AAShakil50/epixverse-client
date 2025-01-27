import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeSceneAtom, scenesAtom } from "@/recoil/atoms/atom-scenes";
import { Scene } from "@/types/scene";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export function useScenes( chapterID : string | null) {
    const [scenes, setScenes] = useRecoilState(scenesAtom)
    const [activeScene, setActiveScene] = useRecoilState(activeSceneAtom)

    const scenesApiUrl = `${API_URL}/scenes?chapterID=${chapterID}`;
    const { isLoading, error } = useSWR<Scene[]>(
        chapterID ? scenesApiUrl : null,
        fetcher, {
        fallbackData: [],
        onSuccess(scenesData) {
            if (scenesData){ 
                setScenes({ scenes: scenesData });
                if (scenesData.length > 0)
                    setActiveScene(scenesData[0].id)
            }
        },
    }
    );

    return {
        scenes: scenes?.scenes,
        setScenes: setScenes,
        activeScene: activeScene,
        setActiveScene: setActiveScene,
        isLoading,
        error
    };
}