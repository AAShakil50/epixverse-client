import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronsRight } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { SectionTable } from "@/pages/project";
import { useProjectByBookID } from "@/hooks/use-projects";
import { useMemo } from "react";

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

  return loading ? (
    <Skeleton />
  ) : !project?.books ? (
    <span>Not found</span>
  ) : (
    <>
      <div
        className="my-8 mx-8 josefin-sans
                flex flex-row "
      >
        <ChevronLeft />
        <Link to={`/project?id=${project.id}`}>
          <span className="underline text-lg cursor-pointer">
            {project.title}
          </span>
        </Link>
      </div>
      <SectionTable
        caption="List of Books"
        headings={["Title", "Expand"]}
        rows={
          project.books
            .find((item) => item.id === resId)
            ?.chapters?.map((item) => {
              return [
                <b key={item.id}>{item.title}</b>,
                <Link key={item.id} to={`/project/chapter?id=${item.id}`}>
                  <ChevronsRight key={item.id} />
                </Link>,
              ];
            }) ?? []
        }
      />
    </>
  );
};

export default ProjectBook;
