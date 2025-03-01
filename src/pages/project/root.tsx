import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectQuery } from "@/graphql/generated/types";
import { ChevronsRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { SectionTable } from "../project";

const ProjectIndex = () => {
  const [params] = useSearchParams();
  const resId = params.get("id");

  const { data, loading } = useGetProjectQuery({
    variables: {
      id: resId!,
    },
    skip: !resId,
  });

  return loading ? (
    <Skeleton />
  ) : !data?.project ? (
    <span>Not found</span>
  ) : (
    <SectionTable
      caption="List of Books"
      headings={["Title", "Description", "Expand"]}
      rows={
        data.project.books?.map((item) => {
          return [
            <span key={item.id}>{item.title}</span>,
            <span key={item.id}>{item.description}</span>,
            <Link key={item.id} to={`/project/book?id=${item.id}`}>
              <ChevronsRight key={item.id} />
            </Link>,
          ];
        }) ?? []
      }
    />
  );
};

export default ProjectIndex;
