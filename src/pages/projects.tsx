import SideNav from "../components/sidenav";
import { useProjectOne, useProjects } from "@/hooks/use-projects";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectsPage = () => {
    const { projects, isLoading, error } = useProjects();

    if (isLoading) return <ProjectPageLoading />;
    if (error || !projects) return <ProjectPageError />;

    return (
        <SidebarProvider>
            <SideNav />
            <main className="w-full">
                <Header />
                <section className="grid gap-4 grid-cols-4 m-8">
                    {
                        projects.map(
                            (project) => (
                                <ProjectDetails
                                    key={project.id}
                                    projectId={project.id} />
                            )
                        )
                    }
                </section>
            </main>
        </SidebarProvider>
    )
}


const ProjectDetails = ({ projectId }: { projectId: string }) => {
    const { project, books, chapters, scenes, isLoading } = useProjectOne(projectId);

    if (isLoading)
        return <Skeleton className="w-10 h-2" />;

    if (!project) return null;

    return <Card
        className="flex flex-col h-full josefin-sans">
        <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription
                className="kanit-400">
                {project.description}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {
                books &&
                <ElementsSpan
                    title="Books"
                    count={books.length}
                    tooltip={true}
                    elements={
                        books.map(item =>
                        ({
                            title: item.title,
                            link: `/book?id=${item.id}`
                        })
                        )
                    } />
            }
            {
                chapters &&
                <ElementsSpan
                    title="Chapters"
                    count={chapters.length}
                    tooltip={true}
                    elements={
                        chapters.map(
                            item =>
                            ({
                                title: item.title,
                                link: `/chapter?id=${item.id}`
                            })
                        )
                    } />
            }
            {
                scenes &&
                <ElementsSpan
                    title="Scenes"
                    count={scenes.length}
                    tooltip={false}
                    elements={
                        scenes.map(
                            item =>
                            ({
                                title: item.title,
                                link: `/scene?id=${item.id}`
                            })
                        )
                    }
                />
            }
        </CardContent>
        <CardFooter
            className="mt-auto">
            <Link
                to={`/project?id=${projectId}`}
                className=" w-full kanit-400">
                <Button
                    role="link"
                    className="w-full">
                    Expand Project <MoveRight />
                </Button>
            </Link>
        </CardFooter>
    </Card>
};

type ElementsSpanType = {
    title: string
    count: number
    tooltip: boolean
    elements: {
        title: string
        link: string
    }[]
}

const ElementsSpan = ({ title, count, tooltip, elements }: ElementsSpanType) => {
    return <div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className="">
                        {title}:&nbsp;
                        <span
                            className={`${tooltip && count > 0 && 'border-b-2'}
                            border-dotted border-gray-400`}>
                            {count}
                        </span>
                    </div>
                </TooltipTrigger>
                {tooltip && elements && elements.length > 0 &&
                    <TooltipContent
                        className="flex flex-row gap-2">
                        {
                            elements.map((item, index) =>
                                <Link
                                    key={index}
                                    to={item.link}>
                                    <span
                                        className="border-b-2 border-dotted border-gray-400"
                                    >{item.title}</span>
                                </Link>
                            )
                        }
                    </TooltipContent>
                }
            </Tooltip>
        </TooltipProvider>
    </div>
}

const ProjectPageLoading = () => {
    return (
        <main className="flex justify-center items-center">
            <h1 className="text-4xl">Loading Projects...</h1>
        </main>
    )
};

const ProjectPageError = () => {
    return (
        <main className="flex justify-center items-center text-red-500">
            <h1 className="text-4xl">Error loading projects. Try reloading.</h1>
        </main>
    )
};

export default ProjectsPage;