interface Project {
    id: string;
    title: string;
    description: string;
};

interface Book {
    id: string;
    title: string;
    description: string;
    projectID: string;
    chapters: string[];
};

interface Chapter {
    id: string;
    title: string;
    index: number;
    description: string;
    projectID: string;
    bookID: string;
};

interface Elemental {
    id: string,
    title: string,
    description: string,
    projectID: string,
    elementals: Elemental[],
}
export type { Project, Book, Chapter, Elemental };