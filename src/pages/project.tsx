import { useSearchParams } from "react-router-dom";
import { useProjectOne } from "@/hooks/use-projects";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideNav from "@/components/sidenav";
import Header from "@/components/header";
import { Pen } from "lucide-react";

const ProjectPage = () => {
    const [params] = useSearchParams();
    const projectId = params.get('id');

    const { project, } = useProjectOne(projectId)

    return <SidebarProvider>
        <SideNav />
        <main className="w-full">
            <Header />
            <section className="m-4">
                {
                    !project ? <span>Project not found</span> :
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
                }
            </section>
        </main>
    </SidebarProvider>
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