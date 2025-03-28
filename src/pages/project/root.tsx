import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectQuery } from "@/graphql/generated/types";
import { ChevronsRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { SectionTable } from "../project";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      caption={
        <Breadcrumb>
          <BreadcrumbList className="justify-center">
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      headings={["Title", "Description", "Expand"]}
      rows={
        data.project.books?.map((item) => {
          return [
            <b key={item.id}>{item.title}</b>,
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
