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
        }
    );

    return {
        books,
        setBooks,
        isLoading,
        error
    }
}

export function useBooksAtomized() {
    const [atomBooks, setAtomBooks] = useRecoilState(booksAtom)
    const [activeBook, setActiveBook] = useRecoilState(activeBookAtom)

    const [activeProject] = useRecoilState(activeProjectAtom)
    const { books, isLoading, error} = useBooks(activeProject)
    const isAtomBooksEmpty = !atomBooks || !atomBooks.books.length;

    useEffect(() => {
        if(books && books.length > 0){
            setAtomBooks({
                books: books
            })
        }
    }, [books, setAtomBooks]);

    useEffect(() => {
        if (atomBooks && atomBooks.books.length > 0){
            setActiveBook(atomBooks.books[0].id);
        }
    }, [atomBooks, setActiveBook])
    
    return {
        books: atomBooks?.books,
        activeBook,
        setActiveBook,
        isLoading: isAtomBooksEmpty ? isLoading : false,
        error
    };
}