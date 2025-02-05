import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/header";
import { ChevronDown, ChevronLeft, Pen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useGetProjectQuery, Project, Book, Chapter } from "@/graphql/generated/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const ProjectPage = () => {
    const [params] = useSearchParams();
    const projectId = params.get('id');

    const { data } = useGetProjectQuery({
        variables: { id: projectId! },
        skip: !projectId
    });

    return <main className="w-full">
        <Header />
        {
            !data?.project ?
                <section
                    className="m-8 text-4xl font-bold josefin-sans 
        my-2 flex flex-row items-center justify-center">
                    <h1>Project not found. Go to&nbsp;
                        <Link
                            to="/projects"
                            className="underline">Projects</Link>
                    </h1>
                </section> :
                <>
                    <SectionProject
                        project={data.project} />
                    <SectionBooks
                        books={data.project.books} />
                </>
        }
    </main>
}

const SectionProject = ({ project }: { project: Project }) => {
    const [titleEditing, setTitleEditing] = useState(false);
    const [title, setTitle] = useState(
        [project?.title ?? "", project?.title ?? ""]
    ); // [preserved title, alterable title]

    const [descEditing, setDescEditing] = useState(false);
    const [desc, setDesc] = useState(
        [project?.description ?? "", project?.description ?? ""]
    ); // [preserved title, alterable title]

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current)
            inputRef.current.focus()
    })

    return <section className="m-4">
        <div
            className="my-8 mx-4 josefin-sans
                flex flex-row ">
            <ChevronLeft />
            <Link to="/projects">
                <span className="underline text-lg cursor-pointer">Projects</span>
            </Link>
        </div>
        <div
            className="mx-4">
            <h1
                className="group text-4xl font-bold josefin-sans text-black
                    my-2 flex flex-row items-center">
                {!titleEditing ?
                    <>
                        <IconEditable
                            onClick={() => {
                                setTitleEditing(true)
                            }} />
                        {title[0]}
                    </> :
                    <Input
                        ref={inputRef}
                        value={title[1]}
                        onBlur={() => {
                            setTitleEditing(false);
                            setTitle([title[0], title[0]]);
                        }}
                        onChange={(e) => {
                            setTitle([title[0], e.currentTarget.value])
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setTitleEditing(false);
                                setTitle([e.currentTarget.value, e.currentTarget.value]);
                            } else if (e.key === 'Escape') {
                                setTitleEditing(false);
                                setTitle([title[0], title[0]]);
                            }
                        }} />
                }
            </h1>
            <h2
                className="group text-lg text-gray-400 kanit-400">
                {!descEditing ?
                    <>
                        <IconEditable
                            onClick={() => {
                                setDescEditing(true)
                            }} />
                        {desc[0]}
                    </> :
                    <Input
                        ref={inputRef}
                        value={desc[1]}
                        onBlur={() => {
                            setDescEditing(false);
                            setDesc([desc[0], desc[0]]);
                        }}
                        onChange={(e) => {
                            setDesc([desc[0], e.currentTarget.value])
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setDescEditing(false);
                                setDesc([e.currentTarget.value, e.currentTarget.value]);
                            } else if (e.key === 'Escape') {
                                setDescEditing(false);
                                setDesc([desc[0], desc[0]]);
                            }
                        }} />
                }
            </h2>
        </div>
    </section>
}

const SectionBooks = ({ books }: { books: Book[] | null | undefined }) => {
    const [opened, setOpened] = useState<string | null>(null);

    if (!books || !books.length) return null;
    return <section className="m-4 p-4 mt-8
    grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {
            books.map((book) => <SectionBook
                key={book.id}
                book={book}
                isOpen={book.id === opened}
                toggleOpen={
                    () =>
                        setOpened(state => state === book.id ? null : book.id)
                } />)
        }
    </section>
}

const SectionBook = ({ book, isOpen, toggleOpen }:
    { book: Book, isOpen: boolean, toggleOpen: VoidFunction }) => {
    return <Collapsible
        open={isOpen}
        onOpenChange={toggleOpen}>
        <Card
            key={book.id}>
            <CardHeader>
                <CardTitle
                    className="flex flex-row gap-2 justify-between josefin-sans">{book.title}
                    <CollapsibleTrigger asChild>
                        <ChevronDown
                            className={`${isOpen && '-rotate-180'}
                        transition-transform`} />
                    </CollapsibleTrigger>
                </CardTitle>
                <CardDescription>{book.description}</CardDescription>
            </CardHeader>
            <CardContent
                className={`${isOpen ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500 kanit-400`}>
                <CollapsibleContent>
                    {
                        book.chapters &&
                        book.chapters.map(
                            (chapter) => <ChapterCollapsible
                                key={chapter.id}
                                chapter={chapter} />
                        )
                    }
                </CollapsibleContent>
            </CardContent>
        </Card>
    </Collapsible>
}

const ChapterCollapsible = ({ chapter }: { chapter: Chapter }) => {
    return <div
        role="button"
        className="hover:underline decoration-solid decoration-slate-400
        w-full flex gap-1 justify-between">
        {chapter.title}
        <Badge variant="outline">{chapter.scenes?.length}</Badge>
    </div>
}

const IconEditable = ({ onClick }: { onClick: VoidFunction }) => {
    return <Pen
        role="button"
        size="0.7em"
        onClick={() => onClick()}
        className={`
            mr-1
            opacity-0 hidden
            group-hover:inline group-hover:opacity-100
            group-hover-within:inline group-hover-within:opacity-100
            transition-all
            duration-500`
        }
        style={
            { marginRight: '0.22em' }
        } />
}

export default ProjectPage