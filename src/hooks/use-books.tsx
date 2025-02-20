import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeBookAtom, booksAtom } from "@/recoil/atoms/atom-books";
import { activeProjectAtom } from "@/recoil/atoms/atom-projects";
import { Book } from "@/types/book";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export function useBooks(projectID: string | null) {
  const [books, setBooks] = useState<Book[] | null>(null);

  const { isLoading, error } = useSWR<Book[]>(
    projectID ? `${API_URL}/books?projectID=${projectID}` : null,
    fetcher,
    {
      fallbackData: [],
      onSuccess(booksData) {
        setBooks(booksData);
      },
    },
  );

  return {
    books,
    setBooks,
    isLoading,
    error,
  };
}

export function useBooksAtomized() {
  const [atomBooks, setAtomBooks] = useRecoilState(booksAtom);
  const [activeBook, setActiveBook] = useRecoilState(activeBookAtom);

  const [activeProject] = useRecoilState(activeProjectAtom);
  const { books, isLoading, error } = useBooks(activeProject);
  const isAtomBooksEmpty = !atomBooks.length;

  // change books-atom to whatever SWR (books) responds
  useEffect(() => {
    setAtomBooks(books ?? []);
  }, [books, setAtomBooks]);

  // change active-book-atom whenever books-atom changes
  useEffect(() => {
    if (atomBooks.length > 0) {
      setActiveBook(atomBooks[0].id);
    } else {
      setActiveBook(null);
    }
  }, [atomBooks, setActiveBook]);

  // empty books-atom whenever active-project-atom nulls,
  // because null active-project-atom prevents SWR request
  useEffect(() => {
    if (!activeProject) {
      setAtomBooks([]);
    }
  }, [activeProject, setAtomBooks]);

  return {
    books: atomBooks,
    activeBook,
    setActiveBook,
    isLoading: isAtomBooksEmpty ? isLoading : false,
    error,
  };
}
