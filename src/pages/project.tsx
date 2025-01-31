import { Link, useSearchParams } from "react-router-dom";
import { useProjectOne } from "@/hooks/use-projects";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideNav from "@/components/sidenav";
import Header from "@/components/header";
import { Pen } from "lucide-react";
import { Project } from "@/types/project";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
    const [titleEditing, setTitleEditing] = useState(false);
    const [title, setTitle] = useState(
        [project?.title ?? "", project?.title ?? ""]
    ); // [preserved title, alterable title]

    const [descEditing, setDescEditing] = useState(false);
    const [desc, setDesc] = useState(
        [project?.description ?? "", project?.description ?? ""]
    ); // [preserved title, alterable title]

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
                className="group text-4xl font-bold josefin-sans text-black
                    my-2 flex flex-row items-center">
                {!titleEditing ?
                    <>
                        <IconEditable
                            onClick={() => {
                                setTitleEditing(true)
                            }} />
                        {title[0]}
                    </> :
                    <Input
                        value={title[1]}
                        onBlur={() => {
                            setTitleEditing(false);
                            setTitle([title[0], title[0]]);
                        }}
                        onChange={(e) => {
                            setTitle([title[0], e.currentTarget.value])
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setTitleEditing(false);
                                setTitle([e.currentTarget.value, e.currentTarget.value]);
                            } else if (e.key === 'Escape') {
                                setTitleEditing(false);
                                setTitle([title[0], title[0]]);
                            }
                        }} />
                }
            </h1>
            <h2
                className="group text-lg text-gray-400 kanit-400">
                {!descEditing ?
                    <>
                        <IconEditable
                            onClick={() => {
                                setDescEditing(true)
                            }} />
                        {desc[0]}
                    </> :
                    <Input
                        value={desc[1]}
                        onBlur={() => {
                            setDescEditing(false);
                            setDesc([desc[0], desc[0]]);
                        }}
                        onChange={(e) => {
                            setDesc([desc[0], e.currentTarget.value])
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setDescEditing(false);
                                setDesc([e.currentTarget.value, e.currentTarget.value]);
                            } else if (e.key === 'Escape') {
                                setDescEditing(false);
                                setDesc([desc[0], desc[0]]);
                            }
                        }} />
                }
            </h2>
        </div>
    </section>
}

const IconEditable = ({ onClick }: { onClick: VoidFunction }) => {
    return <Pen
        role="button"
        size="1em"
        onClick={() => onClick()}
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