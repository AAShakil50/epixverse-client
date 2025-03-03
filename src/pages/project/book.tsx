import { ChevronsRight } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { SectionTable } from "@/pages/project";
import { useProjectByBookID } from "@/hooks/use-projects";
import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Book } from "@/graphql/generated/types";

const ProjectBook = () => {
  const [params] = useSearchParams();
  const resId = params.get("id");

  const { data, loading } = useProjectByBookID(resId);

  const project = useMemo(() => {
    if (!data) return null;
    else {
      const filteredBooks =
        data.books?.filter((book) => book.id === resId) || [];

      return {
        ...data,
        books: filteredBooks,
      };
    }
  }, [data]);

  const book = useMemo(() => {
    return project?.books.find((book) => book.id === resId) ?? null;
  }, [project]);

  return <BookTable loading={loading} project={project} book={book} />;
};

type BookTableProps = {
  loading: boolean;
  project: {
    id: string;
    title: string;
  } | null;
  book: Book | null;
};

const BookTable = ({ loading, project, book }: BookTableProps) => {
  return (
    <SectionTable
      caption={
        <Breadcrumb>
          <BreadcrumbList className="justify-center">
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {loading ? (
              <BreadcrumbItem>Loading...</BreadcrumbItem>
            ) : (
              <>
                {project && (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/project?id=${project.id}`}>
                      {project.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {book && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{book.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      }
      headings={["Title", "Expand"]}
      rows={
        book?.chapters?.map((item) => {
          return [
            <b key={item.id}>{item.title}</b>,
            <Link key={item.id} to={`/project/chapter?id=${item.id}`}>
              <ChevronsRight key={item.id} />
            </Link>,
          ];
        }) ?? []
      }
    />
  );
};

export default ProjectBook;
