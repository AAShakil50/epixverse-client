import { Project } from "@/graphql/generated/types"

const flattenGetProject = (project: Project) => {
    const books = project.books?.flat();
    const chapters = books?.flatMap(item => item.chapters?.flat() ?? []);
    const scenes = chapters?.flatMap(item => item.scenes?.flat() ?? []);
    const elementals = project.elementals?.flat();

    return {
        books,
        chapters,
        scenes,
        elementals
    }
}

export { flattenGetProject }