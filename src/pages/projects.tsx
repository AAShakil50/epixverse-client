import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CirclePlus, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Project, useGetProjectsQuery } from "@/graphql/generated/types";
import { flattenGetProject } from "@/lib/gql-transformers";
import { motion, Variants } from "motion/react";
import { PageLayout } from "@/layouts/page-layout";

const ProjectsPage = () => {
  const { data, loading } = useGetProjectsQuery({
    pollInterval: 60000, // fetch every 60 secs
  });

  if (loading) return <ProjectPageLoading />;

  return (
    <PageLayout showHeader>
      {data?.projects ? (
        <ProjectsTiles projects={data.projects} />
      ) : (
        <ProjectNew />
      )}
    </PageLayout>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProjectsTiles = ({ projects }: { projects: Project[] }) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 
    grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 m-8"
    >
      {projects.map((project) => (
        <ProjectDetails key={project.id} project={project} />
      ))}
      <ProjectNew />
    </motion.section>
  );
};

const ProjectNew = () => {
  return (
    <motion.div variants={cardVariants}>
      <Link to="/project/new">
        <Card className="h-full josefin-sans flex flex-col">
          <CardContent className="h-full flex-1 flex justify-center items-center">
            <CirclePlus size={100} />
          </CardContent>
          <CardFooter>
            <span className="mx-auto text-lg">Add new project</span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

const ProjectDetails = ({ project }: { project: Project }) => {
  const { books, chapters, scenes } = flattenGetProject(project);

  return (
    <motion.div variants={cardVariants}>
      <Card className="flex flex-col h-full josefin-sans">
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription className="kanit-400">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {books && (
            <ElementsSpan
              title="Books"
              count={books.length}
              tooltip={true}
              elements={books.map((item) => ({
                title: item.title,
                link: `/book?id=${item.id}`,
              }))}
            />
          )}
          {chapters && (
            <ElementsSpan
              title="Chapters"
              count={chapters.length}
              tooltip={true}
              elements={chapters.map((item) => ({
                title: item.title,
                link: `/chapter?id=${item.id}`,
              }))}
            />
          )}
          {scenes && (
            <ElementsSpan
              title="Scenes"
              count={scenes.length}
              tooltip={false}
              elements={scenes.map((item, index) => ({
                title: item.title ?? `Scene ${index}`,
                link: `/scene?id=${item.id}`,
              }))}
            />
          )}
        </CardContent>
        <CardFooter className="mt-auto">
          <Link to={`/project?id=${project.id}`} className=" w-full kanit-400">
            <Button role="link" className="w-full">
              Expand Project <MoveRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

type ElementsSpanType = {
  title: string;
  count: number;
  tooltip: boolean;
  elements: {
    title: string;
    link: string;
  }[];
};

const ElementsSpan = ({
  title,
  count,
  tooltip,
  elements,
}: ElementsSpanType) => {
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="">
              {title}:&nbsp;
              <span
                className={`${tooltip && count > 0 && "border-b-2"}
                            border-dotted border-gray-400`}
              >
                {count}
              </span>
            </div>
          </TooltipTrigger>
          {tooltip && elements && elements.length > 0 && (
            <TooltipContent className="flex flex-row gap-2">
              {elements.slice(0, 3).map((item, index) => (
                <Link key={index} to={item.link}>
                  <span className="border-b-2 border-dotted border-gray-400">
                    {item.title}
                  </span>
                </Link>
              ))}
              {elements.length > 3 && (
                <span className="font-semibold">
                  & {elements.length - 3} more
                </span>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const ProjectPageLoading = () => {
  return (
    <main className="flex justify-center items-center">
      <h1 className="text-4xl">Loading Projects...</h1>
    </main>
  );
};

const ProjectPageError = () => {
  return (
    <main className="flex justify-center items-center text-red-500">
      <h1 className="text-4xl">Error loading projects. Try reloading.</h1>
    </main>
  );
};

export default ProjectsPage;
