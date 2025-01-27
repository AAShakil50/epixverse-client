import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeChapterAtom, chaptersAtom } from "@/recoil/atoms/atom-chapters";
import { Chapter } from "@/types/chapter";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export function useChapters( bookID : string | null) {
    const [chapters, setChapters] = useRecoilState(chaptersAtom)
    const [activeChapter, setActiveChapter] = useRecoilState(activeChapterAtom)

    const chaptersApiUrl = `${API_URL}/chapters?bookID=${bookID}`;
    const { isLoading, error } = useSWR<Chapter[]>(
        bookID ? chaptersApiUrl : null,
        fetcher, {
        fallbackData: [],
        onSuccess(chaptersData) {
            if (chaptersData){ 
                setChapters({ chapters: chaptersData });
                if (chaptersData.length > 0)
                    setActiveChapter(chaptersData[0].id)
            }
        },
    }
    );

    return {
        chapters: chapters?.chapters,
        setChapters: setChapters,
        activeChapter: activeChapter,
        setActiveChapter: setActiveChapter,
        isLoading,
        error
    };
}