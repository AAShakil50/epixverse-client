import { Link, useSearchParams } from "react-router-dom";
import { useProjectOne } from "@/hooks/use-projects";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideNav from "@/components/sidenav";
import Header from "@/components/header";
import { Pen } from "lucide-react";
import { Project } from "@/types/project";

const ProjectPage = () => {
    const [params] = useSearchParams();
    const projectId = params.get('id');

    const { project, } = useProjectOne(projectId)

    return <SidebarProvider>
        <SideNav />
        <main className="w-full">
            <Header />
            <SectionProject
                project={project} />
        </main>
    </SidebarProvider>
}

const SectionProject = ({ project }: { project: Project | null }) => {
    if (!project)
        return <section
            className="m-8 text-4xl font-bold josefin-sans 
                my-2 flex flex-row items-center">
            <h1>Project not found. Go to
                <Link to="/projects">Projects</Link>
            </h1>
        </section>

    return <section className="m-4">
        <div
            className="mx-4">
            <h1
                className="group text-4xl font-bold josefin-sans 
                    my-2 flex flex-row items-center">
                <IconEditable />
                {project.title}
            </h1>
            <h2
                className="group text-lg text-gray-400 kanit-400">
                <IconEditable />
                {project.description}
            </h2>
        </div>
    </section>
}

const IconEditable = () => {
    return <Pen
        role="button"
        size="1em"
        className={`
            mr-1
            opacity-0 hidden
            group-hover:inline group-hover:opacity-100
            group-hover-within:inline group-hover-within:opacity-100
            transition-all
            duration-500`
        }
        style={
            { marginRight: '0.33em' }
        } />
}

export default ProjectPage