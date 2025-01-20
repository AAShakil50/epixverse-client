import { gql, useQuery } from "@apollo/client";
import Expandable from "../components/expandable";
import SideNav from "../components/sidenav";

const GQL_PROJECTS = gql`
    query GetProjects {
        projects { id title description }
    }
`;

type GQL_PROJECT_TYPE = {
    projects: {
        id: string;
        title: string;
        description: string;
    }[]
};

const ProjectsPage = () => {
    const { loading, error, data } = useQuery<GQL_PROJECT_TYPE>(
        GQL_PROJECTS, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' }
    );

    if (loading) return <ProjectPageLoading />;
    if (error || !data) return <ProjectPageError />;

    return (
        <main className="flex flex-col flex-grow h-full">
            <div className="flex flex-row flex-grow h-full">
                <SideNav></SideNav>
                <div className="m-8 flex flex-col gap-4 h-full">
                    {
                        data.projects.map(
                            project => (
                                <Expandable
                                    key={project.id}
                                    title={project.title}
                                    description={project.description}
                                ><ProjectDetails id={project.id} /></Expandable>
                            )
                        )
                    }
                </div>
            </div>
        </main>
    )
}

const GQL_COUNT_PROJECT = gql`
    query counts($projectId: ID!) {
        project(id: $projectId) { books { chapters {  id } }  }
    }
`;

type GQL_COUNT_PROJECT_TYPE = {
    project: { books: { chapters: { id: string; }[] }[] }
};

const ProjectDetails = ({ id }: { id: string }) => {
    const { loading, error, data } = useQuery<GQL_COUNT_PROJECT_TYPE>(
        GQL_COUNT_PROJECT, { variables: { projectId: id } }
    );

    if (loading) return <div>Loading...</div>;
    if (error || !data) return <div>Error...</div>;

    return (
        <div className="josefin-sans ml-2 text-gray-500">
            <div className="">Books: {data.project.books.length}</div>
            <div>Chapters: {data.project.books.reduce((acc, book) => acc + book.chapters.length, 0)}</div>
        </div>
    )
};

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