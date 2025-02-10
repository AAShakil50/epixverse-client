import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/header";
import { ChevronDown, ChevronLeft, Pen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetProjectQuery, Project, Book, Chapter } from "@/graphql/generated/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

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
    const [title, setTitle] = useState(project?.title ?? "");
    const [desc, setDesc] = useState(project?.description ?? "");

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
                <EditableComp
                    text={title ?? null}
                    onContentChange={(value) => setTitle(value)}
                />
            </h1>
            <h2
                className="group text-lg text-gray-400 kanit-400">
                <EditableComp
                    text={desc ?? null}
                    onContentChange={(value) => setDesc(value)}
                />
            </h2>
        </div>
    </section>
}

const EditableComp = ({ text, onContentChange }:
    { text: string, onContentChange: (value: string) => void }
) => {
    const editableRef = useRef<HTMLSpanElement>(null);
    const saveRef = useRef(false);

    useEffect(() => {
        if (editableRef.current && !saveRef.current) {
            editableRef.current.textContent = text;
        }
    }, [text]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveRef.current = true;
            if (editableRef.current) {
                onContentChange(editableRef.current.textContent || "");
            }
            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            // Revert changes on Escape
            saveRef.current = false;
            if (editableRef.current) {
                editableRef.current.textContent = text;
            }
            e.currentTarget.blur();
        }
    };

    const handleBlur = () => {
        if (!saveRef.current && editableRef.current) {
            // If not saving, revert to original text.
            editableRef.current.textContent = text;
        }
        saveRef.current = false;
    };

    return (
        <span
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            style={{
                display: "inline-block",
                minWidth: "1em",
                outline: "none",
            }}
        />
    );
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
                className={`kanit-400`}>
                <CollapsibleContent>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}>
                        {
                            book.chapters &&
                            book.chapters.map(
                                (chapter) => <ChapterCollapsible
                                    key={chapter.id}
                                    chapter={chapter} />
                            )
                        }
                    </motion.div>
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