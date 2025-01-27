import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/site.configs";
import { activeBookAtom, booksAtom } from "@/recoil/atoms/atom-books";
import { Book } from "@/types/book";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export function useBooks( projectID : string | null) {
    const [books, setBooks] = useRecoilState(booksAtom)
    const [activeBook, setActiveBook] = useRecoilState(activeBookAtom)

    const booksApiUrl = `${API_URL}/books?projectID=${projectID}`;
    const { isLoading, error } = useSWR<Book[]>(projectID ? booksApiUrl : null,
        fetcher, {
        fallbackData: [],
        onSuccess(booksData) {
            if (booksData){ 
                setBooks({ books: booksData });
                if (booksData.length > 0)
                    setActiveBook(booksData[0].id)
            }
        },
    }
    );

    useEffect(() => {

    }, [projectID])

    return {
        books: books?.books,
        activeBook: activeBook,
        setActiveBooks: setActiveBook,
        isLoading,
        error
    };
}