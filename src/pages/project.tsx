import { useSearchParams } from "react-router-dom";
import { useProjectOne } from "@/hooks/use-projects";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideNav from "@/components/sidenav";
import Header from "@/components/header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
                        <Card>
                            <CardHeader>
                                <CardTitle
                                    className="group">
                                    <IconEditable />
                                    {project.title}
                                </CardTitle>
                                <CardDescription
                                    className="group">
                                    <IconEditable />
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
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
        } />
}

export default ProjectPage