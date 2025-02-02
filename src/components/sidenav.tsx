import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "./ui/sidebar";
import { ChevronsDown, GalleryVertical, Library, LucideIcon, Menu, Shapes, Sprout } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { memo, ReactElement, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useProjectsAtomized } from "@/hooks/use-projects";
import { Skeleton } from "./ui/skeleton";
import { useBooks } from "@/hooks/use-books";
import { Badge } from "./ui/badge";
import { useChapters } from "@/hooks/use-chapters";
import { useRecoilState } from "recoil";
import { activeProjectAtom } from "@/recoil/atoms/atom-projects";
import { activeBookAtom } from "@/recoil/atoms/atom-books";
import { useScenes } from "@/hooks/use-scenes";
import { activeChapterAtom } from "@/recoil/atoms/atom-chapters";
import { useKeyboardShortcut } from "@/hooks/use-keyboard";

// type SideNavProps = {
//     title: string,
//     children: ReactNode
// };

const SideNavToggler = () => {
    const { toggleSidebar } = useSidebar()
    return <Button
        variant="outline"
        role="button"
        size="icon"
        className="px-1"
        onClick={toggleSidebar}>
        <Menu />
    </Button>
}

const SideNav = () => {
    const { open: openSidebar } = useSidebar()
    const [openPopup, setOpenPopup] = useState(false);

    useKeyboardShortcut((event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            event.preventDefault();
            setOpenPopup((state) => !state);
        }
    })

    const {
        projects,
        activeProject,
        setActiveProject,
        isLoading,
    } = useProjectsAtomized();

    return <Sidebar
        collapsible="icon">
        <SidebarContent>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {
                            !openSidebar ?
                                <SideNavToggler /> :
                                <Popover open={openPopup} onOpenChange={setOpenPopup}>
                                    <div
                                        className="flex w-full gap-1">
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
                                        <SideNavToggler />
                                    </div>
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
                        }
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {activeProject && <>
                <SideNavBooks />
                <SideNavChapters />
                <SideNavScenes />
                <SideNavElementals />
            </>}
        </SidebarContent>
    </Sidebar>
};

const SideNavBooks = () => {
    const [activeProject] = useRecoilState(activeProjectAtom);
    const {
        books,
        activeBook,
        isLoading,
        error
    } = useBooks(activeProject);

    if (!books?.length) {
        return null;
    }

    return <SideNavSubElements
        title="Books"
        icon={Library}
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

    if (!chapters?.length) {
        return null;
    }

    return <SideNavSubElements
        title="Chapters"
        icon={GalleryVertical}
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

    if (!scenes?.length) {
        return null;
    }

    return <SideNavSubElements
        title="Scenes"
        icon={Sprout}
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

// ! Unresolved Elementals Sidenav item
const SideNavElementals = () => {
    return <SideNavSubElements
        title="Elementals"
        icon={Shapes}
        isLoading={false}
        error={null}
        activeElement={null}
        subElements={[
            { id: "498t93438th3", title: "Characters" },
            { id: "498t989h4545", title: "Scenes" }
        ]}
    />
}

type SideNavElementsTypes = {
    title: string,
    icon: LucideIcon,
    itemCount?: number
    children: ReactElement<typeof SideBarNavSubElement>
    | ReactElement<typeof SideBarNavSubElement>[]
}

const SideNavElements = ({ title, icon: Icon, itemCount, children }: SideNavElementsTypes) => {
    const [open, setOpen] = useState(false);
    const { open: openSidebar, toggleSidebar } = useSidebar();

    if (!openSidebar) {
        if (open) setOpen(false);
        return <Button
            variant="ghost"
            className="ml-1"
            size="icon"
            onClick={() => {
                setOpen(!open);
                toggleSidebar();
            }}>
            <Icon />
        </Button>
    }

    return <Collapsible
        defaultOpen
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible w-full">
        <CollapsibleTrigger asChild>
            <SidebarMenuButton className="pl-4 mx-auto">
                <Icon className="-mt-1" />
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
    title: string,
    icon: LucideIcon,
    isLoading: boolean
    // @ts-expect-error error is of any type from SWR
    error
    subElements: {
        id: string
        title: string
    }[] | undefined
    activeElement: string | null
}

const SideNavSubElements = ({ title, icon, isLoading, error, subElements, activeElement }
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
            title={title} mx-auto
            icon={icon}
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

export default memo(SideNav);