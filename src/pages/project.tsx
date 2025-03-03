import SideNav from "@/components/containers/sidenav";
import { Editable } from "@/components/elements/editable";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProjectQuery } from "@/graphql/generated/types";
import {
  useProjectByBookID,
  useProjectByChapterID,
} from "@/hooks/use-projects";
import { PageLayout } from "@/layouts/page-layout";
import { ChevronLeft } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";

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

const ProjectPage = () => {
  const landing: TypeLanding = (() => {
    switch (location.pathname) {
      case "/project":
        return "project";
      case "/project/book":
        return "book";
      case "/project/chapter":
        return "chapter";
      default:
        return "project";
    }
  })();

  const [params] = useSearchParams();
  const resId = params.get("id");

  const { project, loading } = getDataByLanding({ landing, resId });

  return (
    <SidebarProvider>
      <SideNav />
      <PageLayout showHeader>
        {loading ? (
          <section className="mx-auto text-center">
            <Skeleton className="w-full h-20 m-4" />
          </section>
        ) : !project ? (
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
            <SectionMeta
              title={project.title}
              description={project.description ?? ""}
            />
            <Outlet />
          </>
        )}
      </PageLayout>
    </SidebarProvider>
  );
};

type SectionProjectProps = {
  title: string;
  description: string;
};

const SectionMeta = forwardRef<HTMLElement, SectionProjectProps>(
  ({ title: projectTitle, description: projectDescription }, ref) => {
    const [title, setTitle] = useState(projectTitle);
    const [desc, setDesc] = useState(projectDescription);

    useEffect(() => {
      setTitle(projectTitle);
      setDesc(projectDescription);
    }, [projectTitle, projectDescription]);

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

SectionMeta.displayName = "SectionProject";

type SectionTableProps = {
  caption: JSX.Element;
  headings: string[];
  rows: JSX.Element[][];
};

const SectionTable = forwardRef<HTMLElement, SectionTableProps>(
  ({ caption, headings, rows }, ref) => {
    return (
      <section ref={ref} className="m-4 p-4">
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {headings.map((item, index) => {
                return <TableHead key={index}>{item}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((items, index) => {
              return (
                <TableRow key={index}>
                  {items.map((item, index2) => {
                    return <TableCell key={index2}>{item}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    );
  }
);

SectionTable.displayName = "SectionBooks";

export default ProjectPage;
export { SectionTable };
