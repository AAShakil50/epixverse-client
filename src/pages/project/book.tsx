import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronsRight } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { SectionTable } from "@/pages/project";
import { useProjectByBookID } from "@/hooks/use-projects";

const ProjectBook = () => {
  const [params] = useSearchParams();
  const resId = params.get("id");

  const { data: project, loading } = useProjectByBookID(resId);

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
