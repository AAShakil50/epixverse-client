import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./ui/sidebar";
import { ChevronsDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "./ui/skeleton";
import { useBooks } from "@/hooks/use-books";
import { Badge } from "./ui/badge";
import { useChapters } from "@/hooks/use-chapters";
import { useRecoilState } from "recoil";
import { activeProjectAtom } from "@/recoil/atoms/atom-projects";

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
            {activeProject && <SideNavBooks />}
        </SidebarContent>
    </Sidebar>
}

const SideNavBooks = () => {
    const [ activeProject ] = useRecoilState(activeProjectAtom);
    const { books, activeBook, isLoading, error } = useBooks(activeProject);

    if (!activeProject) return null;

    if (isLoading) return <SidebarMenuItem>
        <Skeleton className="w-full rounded-full" />
    </SidebarMenuItem>

    if (error || !books)
        return <SidebarMenuItem>
            No Books
        </SidebarMenuItem>

    return <SidebarMenuItem>
        <SideNavElements
            title="Books"
            itemCount={books.length}>
            {books.map((book) =>
                <SideBarNavSubElement
                    key={book.id}
                    title={book.title}
                    isActive={book.id === activeBook} />
            )}
        </SideNavElements>
    </SidebarMenuItem>
}

type SideNavChaptersType = {
    bookID: string
}

const SideNavChapters = ({ bookID }: SideNavChaptersType) => {
    const { chapters, activeChapter, isLoading, error } = useChapters(bookID);

    if (isLoading) return <SidebarMenuItem>
        <Skeleton className="w-full rounded-full" />
    </SidebarMenuItem>

    if (error || !chapters)
        return <SidebarMenuItem>
            No Chapters
        </SidebarMenuItem>

    return <SidebarMenuItem>
        <SideNavElements
            title="Chapters"
            itemCount={chapters.length}>
            {chapters.map((chapter) =>
                <SideBarNavSubElement
                    key={chapter.id}
                    title={chapter.title}
                    isActive={chapter.id === activeChapter} />
            )}
        </SideNavElements>
    </SidebarMenuItem>
}

type SideNavElementsTypes = {
    title: string,
    itemCount?: number
    children: React.ReactNode
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
                {itemCount && <Badge
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