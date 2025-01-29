import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./ui/sidebar";
import { ChevronsDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { ReactElement, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "./ui/skeleton";
import { useBooks } from "@/hooks/use-books";
import { Badge } from "./ui/badge";
import { useChapters } from "@/hooks/use-chapters";
import { useRecoilState } from "recoil";
import { activeProjectAtom } from "@/recoil/atoms/atom-projects";
import { activeBookAtom } from "@/recoil/atoms/atom-books";
import { useScenes } from "@/hooks/use-scenes";
import { activeChapterAtom } from "@/recoil/atoms/atom-chapters";

// type SideNavProps = {
//     title: string,
//     children: ReactNode
// };

const SideNav = () => {
    const [openPopup, setOpenPopup] = useState(false);

    const { projects, activeProject, setActiveProject, isLoading } = useProjects();


    return <Sidebar>
        <SidebarContent>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Popover open={openPopup} onOpenChange={setOpenPopup}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded="true"
                                    className="w-full justify-between text-sm"
                                    onClick={() => setOpenPopup(!openPopup)}>
                                    {isLoading ? "Loading Projects" :
                                        (projects && activeProject ?
                                            projects.find((project) => project.id === activeProject)?.title :
                                            "No Project")
                                    }
                                    <ChevronsDown />
                                </Button>
                            </PopoverTrigger>
                            {projects &&
                                <PopoverContent
                                    className="p-0 ml-2">
                                    <Command>
                                        <CommandInput placeholder="Select a project..." />
                                        <CommandList>
                                            <CommandGroup>
                                                {projects.map((project) => {
                                                    return <CommandItem
                                                        key={project.id}
                                                        value={project.title}
                                                        className={`${activeProject === project.id &&
                                                            'italic font-bold'}`}
                                                        onSelect={
                                                            () => {
                                                                setActiveProject(project.id);
                                                                setOpenPopup(false);
                                                            }
                                                        }>
                                                        {project.title}
                                                    </CommandItem>
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            }
                        </Popover>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {activeProject && <>
                <SideNavBooks />
                <SideNavChapters />
                <SideNavScenes />
            </>}
        </SidebarContent>
    </Sidebar>
}

const SideNavBooks = () => {
    const [activeProject] = useRecoilState(activeProjectAtom);
    const {
        books,
        activeBook,
        isLoading,
        error
    } = useBooks(activeProject);

    if (!activeProject) {
        return null;
    }

    return <SideNavSubElements
        title="Books"
        isLoading={isLoading}
        error={error}
        subElements={books}
        activeElement={activeBook}
    />
}

const SideNavChapters = () => {
    const [activeBook] = useRecoilState(activeBookAtom);
    const {
        chapters,
        activeChapter,
        isLoading,
        error
    } = useChapters(activeBook);

    if (!activeBook) {
        return null;
    }

    return <SideNavSubElements
        title="Chapters"
        isLoading={isLoading}
        error={error}
        subElements={chapters}
        activeElement={activeChapter}
    />
}

const SideNavScenes = () => {
    const [activeChapter] = useRecoilState(activeChapterAtom);
    const {
        scenes,
        activeScene,
        isLoading,
        error
    } = useScenes(activeChapter);

    if (!activeChapter) {
        return null;
    }

    return <SideNavSubElements
        title="Scenes"
        isLoading={isLoading}
        error={error}
        subElements={scenes?.map(
            scene => ({
                id: scene.id,
                title: scene.title ? scene.title : `Scene ${scene.index}`
            })
        )}
        activeElement={activeScene}
    />
}

type SideNavElementsTypes = {
    title: string,
    itemCount?: number
    children: ReactElement<typeof SideBarNavSubElement>
    | ReactElement<typeof SideBarNavSubElement>[]
}

const SideNavElements = ({ title, itemCount, children }: SideNavElementsTypes) => {
    const [open, setOpen] = useState(false);

    return <Collapsible
        defaultOpen
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible w-full">
        <CollapsibleTrigger asChild>
            <SidebarMenuButton className="pl-4">
                {title}
                {itemCount !== undefined && <Badge
                    variant="outline">
                    {itemCount}
                </Badge>}
                <Button
                    variant="ghost"
                    size="icon"
                    className={`ml-auto transition-transform ${open && '-rotate-180'}`}>
                    <ChevronsDown />
                </Button>
            </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <SidebarMenuSub>
                {children}
            </SidebarMenuSub>
        </CollapsibleContent>
    </Collapsible>
}

type SideNavSubElementsType = {
    title: string
    isLoading: boolean
    // @ts-expect-error error is of any type from SWR
    error
    subElements: {
        id: string
        title: string
    }[] | undefined
    activeElement: string | null
}

const SideNavSubElements = ({ title, isLoading, error, subElements, activeElement }
    : SideNavSubElementsType) => {
    if (isLoading) return <SidebarMenuItem>
        <Skeleton className="w-full rounded-full" />
    </SidebarMenuItem>

    if (error || !subElements)
        return <SidebarMenuItem>
            No {title}
        </SidebarMenuItem>

    return <SidebarMenuItem>
        <SideNavElements
            title={title}
            itemCount={subElements.length}>
            {subElements.map((subElement) =>
                <SideBarNavSubElement
                    key={subElement.id}
                    title={subElement.title}
                    isActive={subElement.id === activeElement} />
            )}
        </SideNavElements>
    </SidebarMenuItem>
}

type SideBarNavSubElementType = {
    title: string,
    isActive: boolean
}

const SideBarNavSubElement = ({ title, isActive }: SideBarNavSubElementType) => {
    return <SidebarMenuSubItem
        key={title}
        className="text-sm">
        <SidebarMenuSubButton
            isActive={isActive}
            size="md">
            {title}
        </SidebarMenuSubButton>
    </SidebarMenuSubItem>
}

export default SideNav;