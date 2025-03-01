import { useSearchParams } from "react-router-dom";
import { SectionTable } from "../project";
import { useGetProjectQuery } from "@/graphql/generated/types";
import { Skeleton } from "@/components/ui/skeleton";

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
      headings={["Title", "Description", "Items"]}
      rows={[
        data.project.books?.map((item) => item.title) ?? [],
        data.project.books?.map((item) => item.description ?? "") ?? [],
      ]}
    />
  );
};

export default ProjectIndex;
