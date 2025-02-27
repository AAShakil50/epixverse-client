import { Editable } from "@/components/elements/editable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Book,
  Chapter,
  Project,
  useGetProjectQuery,
} from "@/graphql/generated/types";
import {
  useProjectByBookID,
  useProjectByChapterID,
} from "@/hooks/use-projects";
import { PageLayout } from "@/layouts/page-layout";
import { Book as BookIcon, ChevronDown, ChevronLeft, Pen } from "lucide-react";
import { motion } from "motion/react";
import { createContext, forwardRef, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const getProjectByID = (projectId: string | null) => {
  const { data, loading } = useGetProjectQuery({
    variables: { id: projectId! },
    skip: !projectId,
  });

  return { project: data?.project, loading };
};

const getProjectByBook = (bookID: string | null) => {
  const { data, loading } = useProjectByBookID(bookID);

  return { project: data, loading };
};

const getProjectByChapter = (chapterID: string | null) => {
  const { data, loading } = useProjectByChapterID(chapterID);

  return { project: data, loading };
};

const getDataByLanding = ({
  landing,
  resId,
}: {
  landing: TypeLanding;
  resId: string | null;
}) => {
  const { project, loading } = (() => {
    switch (landing) {
      case "project":
        return getProjectByID(resId);
      case "book":
        return getProjectByBook(resId);
      case "chapter":
        return getProjectByChapter(resId);
      default:
        return { project: null, loading: false };
    }
  })();

  return { project, loading };
};

type TypeLanding = "project" | "book" | "chapter";

type ProjectPageProps = {
  landing: TypeLanding;
};

type ProjectContextType = {
  activeTab: "books" | "chapters" | "scenes" | "elementals";
};

const ProjectContext = createContext<ProjectContextType>({
  activeTab: "books",
});

const ProjectPage = ({ landing }: ProjectPageProps) => {
  const [params] = useSearchParams();
  const resId = params.get("id");
  const targetRef = useRef<HTMLElement>(null);

  const { project, loading } = getDataByLanding({ landing, resId });

  useEffect(() => {
    targetRef.current?.scrollIntoView();
  }, [landing]);

  if (loading)
    return (
      <PageLayout showHeader>
        <section className="mx-auto text-center">
          <Skeleton className="w-full h-20 m-4" />
        </section>
      </PageLayout>
    );

  return (
    <ProjectContext.Provider value={{ activeTab: "books" }}>
      <PageLayout showHeader>
        {!project ? (
          <section
            className="m-8 text-4xl font-bold josefin-sans
          my-2 flex flex-row items-center justify-center"
          >
            <h1>
              Project not found. Go to&nbsp;
              <Link to="/projects" className="underline">
                Projects
              </Link>
            </h1>
          </section>
        ) : (
          <>
            <SectionProject
              ref={landing === "project" ? targetRef : null}
              project={project}
            />
            <SectionBooks
              ref={landing === "book" ? targetRef : null}
              books={project.books}
            />
          </>
        )}
      </PageLayout>
    </ProjectContext.Provider>
  );
};

type SectionProjectProps = {
  project: Project;
};

const SectionProject = forwardRef<HTMLElement, SectionProjectProps>(
  ({ project }, ref) => {
    const [title, setTitle] = useState(project.title ?? "");
    const [desc, setDesc] = useState(project.description ?? "");

    useEffect(() => {
      setTitle(project.title ?? "");
      setDesc(project.description ?? "");
    }, [project]);

    return (
      <section ref={ref} className="m-4">
        <div
          className="my-8 mx-4 josefin-sans
                flex flex-row "
        >
          <ChevronLeft />
          <Link to="/projects">
            <span className="underline text-lg cursor-pointer">Projects</span>
          </Link>
        </div>
        <div className="mx-4">
          <h1
            className="group text-4xl font-bold josefin-sans text-black
                    my-2 flex flex-row items-center"
          >
            <Editable
              text={title ?? null}
              onContentChange={(value) => setTitle(value)}
            />
          </h1>
          <h2 className="group text-lg text-gray-400 kanit-400">
            <Editable
              text={desc ?? null}
              onContentChange={(value) => setDesc(value)}
            />
          </h2>
        </div>
      </section>
    );
  }
);

SectionProject.displayName = "SectionProject";

type SectionBooksProps = {
  books: Book[] | null | undefined;
};

const SectionBooks = forwardRef<HTMLElement, SectionBooksProps>(
  ({ books }, ref) => {
    const [opened, setOpened] = useState<string | null>(null);

    if (!books || !books.length) return null;
    return (
      <section
        ref={ref}
        className="m-4 p-4 mt-8
          flex flex-col gap-4"
      >
        {books.map((book) => (
          <SectionBook
            key={book.id}
            book={book}
            isOpen={book.id === opened}
            toggleOpen={() =>
              setOpened((state) => (state === book.id ? null : book.id))
            }
          />
        ))}
      </section>
    );
  }
);

SectionBooks.displayName = "SectionBooks";

const SectionBook = ({
  book,
  isOpen,
  toggleOpen,
}: {
  book: Book;
  isOpen: boolean;
  toggleOpen: VoidFunction;
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={toggleOpen}>
      <Card key={book.id}>
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 justify-between josefin-sans">
            <span className="flex gap-2">
              <BookIcon size="0.8em" />
              {book.title}
            </span>
            <CollapsibleTrigger asChild>
              <ChevronDown
                role="button"
                className={`${isOpen && "-rotate-180"}
                            transition-transform`}
              />
            </CollapsibleTrigger>
          </CardTitle>
          <CardDescription className="flex flex-row gap-2 justify-between">
            {book.description}
            <Pen size="1em" role="button" className="mx-1" />
          </CardDescription>
        </CardHeader>
        <CardContent className={`kanit-400`}>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-2"
            >
              {book.chapters &&
                book.chapters.map((chapter) => (
                  <ChapterCollapsible key={chapter.id} chapter={chapter} />
                ))}
            </motion.div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
};

const ChapterCollapsible = ({ chapter }: { chapter: Chapter }) => {
  return (
    <div className="w-full bg-slate-50 px-4 py-2">
      <div className="w-full flex gap-1 justify-between">
        {chapter.title}
        <Pen size="1em" />
      </div>
      <span>{chapter.scenes?.length}</span>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IconEditable = ({ onClick }: { onClick: VoidFunction }) => {
  return (
    <Pen
      role="button"
      size="0.7em"
      onClick={() => onClick()}
      className={`
            mr-1
            opacity-0 hidden
            group-hover:inline group-hover:opacity-100
            group-hover-within:inline group-hover-within:opacity-100
            transition-all
            duration-500`}
      style={{ marginRight: "0.22em" }}
    />
  );
};

export default ProjectPage;
