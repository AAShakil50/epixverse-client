import { Editable } from "@/components/elements/editable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, Chapter, Project, useGetProjectQuery } from "@/graphql/generated/types";
import { PageLayout } from "@/layouts/page-layout";
import { ChevronDown, ChevronLeft, Pen } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ProjectPage = () => {
    const [params] = useSearchParams();
    const projectId = params.get('id');

    const { data, loading } = useGetProjectQuery({
        variables: { id: projectId! },
        skip: !projectId
    });

    if (loading)
        return <PageLayout showHeader>
            <section
                className="mx-auto text-center">
                <Skeleton
                    className="w-full h-20 m-4" />
            </section>
        </PageLayout>

    return <PageLayout showHeader>
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
    </PageLayout>
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
                <Editable
                    text={title ?? null}
                    onContentChange={(value) => setTitle(value)}
                />
            </h1>
            <h2
                className="group text-lg text-gray-400 kanit-400">
                <Editable
                    text={desc ?? null}
                    onContentChange={(value) => setDesc(value)}
                />
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