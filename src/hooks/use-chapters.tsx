import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeBookAtom } from "@/recoil/atoms/atom-books";
import { activeChapterAtom, chaptersAtom } from "@/recoil/atoms/atom-chapters";
import { Chapter } from "@/types/chapter";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export function useChapters(bookID: string | null) {
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

  const { isLoading, error } = useSWR<Chapter[]>(
    bookID ? `${API_URL}/chapters?bookID=${bookID}` : null,
    fetcher,
    {
      fallbackData: [],
      onSuccess(chaptersData) {
        setChapters(chaptersData);
      },
    },
  );

  return {
    chapters,
    setChapters,
    isLoading,
    error,
  };
}

export function useChaptersAtomized() {
  const [atomChapters, setAtomChapters] = useRecoilState(chaptersAtom);
  const [activeChapter, setActiveChapter] = useRecoilState(activeChapterAtom);

  const [activeBook] = useRecoilState(activeBookAtom);
  const { chapters, isLoading, error } = useChapters(activeBook);
  const isAtomChaptersEmpty = !atomChapters.length;

  // change chapters-atom to whatever SWR (chapters) responds
  useEffect(() => {
    setAtomChapters(chapters ?? []);
  }, [chapters, setAtomChapters]);

  // change active-chapter-atom whenever chapters-atom changes
  useEffect(() => {
    if (atomChapters.length > 0) {
      setActiveChapter(atomChapters[0].id);
    } else {
      setActiveChapter(null);
    }
  }, [atomChapters, setActiveChapter]);

  // empty chapters-atom whenever active-book-atom nulls,
  // because null active-book-atom prevents SWR request
  useEffect(() => {
    if (!activeBook) {
      setAtomChapters([]);
    }
  }, [activeBook, setAtomChapters]);

  return {
    chapters: atomChapters,
    activeChapter,
    setActiveChapter,
    isLoading: isAtomChaptersEmpty ? isLoading : false,
    error,
  };
}
