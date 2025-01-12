import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScrollableX from "../components/scrollable-x";
import { Project, Book, Chapter, Elemental } from "../lib/project.interface";

/**
 * Sends a get request to /api/project/`id
 * @param id the project id
 * @returns json of the request
 */

const fetchProject = async (id: string) => {
    const responseProject = await axios.get<{ data?: Project }>(`http://localhost:3000/api/project/${id}`);
    const responseBooks = await axios.get<{ data?: Book[] }>(`http://localhost:3000/api/${id}/books`);
    const responseChapters = await axios.get<{ data?: Chapter[] }>(`http://localhost:3000/api/${id}/chapters`);
    const responseElementals = await axios.get<{ data?: Elemental[] }>
        (`http://localhost:3000/api/${id}/elementals?structure=true`);

    const projectDetail: ProjectDetail = {
        project: responseProject.data.data ?? { id: '', title: '', description: '' },
        books: structureBooks(responseBooks.data.data ?? [], responseChapters.data.data ?? []),
        elementals: await responseElementals.data.data ?? []
    };

    return projectDetail;
};

const structureBooks = (books: Book[], chapters: Chapter[]) => {
    const booksData: Book[] = books.map((book) => {
        return {
            id: book.id,
            title: book.title,
            description: book.description,
            projectID: book.projectID,
            chapters: chapters.filter(ch => ch.bookID === book.id).map(ch => ch.title)
        };
    });

    return booksData;
};

enum ResponseStatus {
    Loading, Success, Error
}

type ProjectDetail = {
    project: Project,
    books: Book[],
    elementals: Elemental[]
}

const ProjectPage = () => {
    // Get all basic elements(Project, Books, Chapters, Elementals) of the project
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [status, setStatus] = useState(ResponseStatus.Loading);

    const { id: projectID } = useParams<{ id: string }>();

    useEffect(() => {
        if (projectID)
            try {
                fetchProject(projectID).then(data => setProject(data));
                setStatus(ResponseStatus.Success)
            } catch {
                setStatus(ResponseStatus.Error);
            }
    }, [projectID]);

    if (status === ResponseStatus.Loading && !project) {
        return <main className={`text-center`}>
            <h2 className={`text-2xl`}>Loading Project ...</h2>
        </main>;
    }

    return (
        <>
            <main className={`m-8`}>
                {project && <RenderProject projectDetails={project} />}
            </main>
        </>
    )
}

type RenderProjectProps = {
    projectDetails: ProjectDetail;
};

const RenderProject = ({ projectDetails: projectDetails }: RenderProjectProps) => {
    const { project: project, books, elementals } = projectDetails;

    return (
        <>
            <h2 className={`josefin-sans text-4xl font-bold`}>{project.title}</h2>
            <p className={`kanit-400 text-slate-500 text-lg`}>{project.description}</p>
            <div className={`flex flex-row gap-8 justify-between`}>
                {

                    elementals &&
                    <div className={`w-full`}>
                        {
                            elementals.map((elemental, index) =>
                                <DrawElemental key={index} elemental={elemental} />
                            )
                        }
                    </div>
                }

                {books &&
                    <div className={`mt-4 min-w-1.5 w-auto flex flex-col gap-4`}>
                        {
                            books.map((book, index) =>
                                <DrawBook
                                    key={index}
                                    book={book}
                                    chapters={book.chapters}
                                />
                            )
                        }
                    </div>
                }
            </div>
        </>
    );
}

type DrawBookProps = {
    book: Book;
    chapters: string[];
};

const DrawBook = ({ book, chapters }: DrawBookProps) => {
    return (
        <div className={`bg-white p-4 rounded-lg shadow-lg`}>
            <div className={`josefin-sans text-2xl font-bold`}>{book.title} </div>
            <span className={`kanit-400 text-slate-500 text-lg`}> {book.description}</span>
            {chapters.length > 0 && <ScrollableX>
                <div className={`flex gap-2`}>
                    {
                        chapters.map((chapter, index) =>
                            <div key={index}
                                className={`text-sm text-slate-500 bg-gray-100 py-1 px-4 rounded-lg`}>
                                {chapter}
                            </div>
                        )
                    }
                </div>
            </ScrollableX>}
        </div>
    );
}

type DrawElementalProps = {
    elemental: Elemental;
};

const DrawElemental = ({ elemental }: DrawElementalProps) => {
    return <div className={`bg-white p-4 rounded-lg shadow-lg mt-4`}>
        <div className={`josefin-sans text-2xl font-bold`}>{elemental.title}(s)</div>
        {
            elemental.elementals && elemental.elementals.map((cont) =>
                <span key={cont.id}
                    className={`kanit-400 text-slate-500 text-lg
                     bg-slate-50 mx-2 px-4`}
                > <span>{cont.title} - </span><span className={`text-slate-400`}>{cont.description}</span>
                </span>
            )
        }
    </div>
};

export default ProjectPage