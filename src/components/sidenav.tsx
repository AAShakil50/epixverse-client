import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./ui/sidebar";
import { ChevronsDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useProjects } from "@/hooks/use-projects";

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
                        <Popover open={openPopup}>
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
            <SidebarMenuItem>
                <_SideNavElements
                    title="Books"
                    items={["Ignition", "Extinguish"]} />
            </SidebarMenuItem>
            <SidebarMenuItem>
                <_SideNavElements
                    title="Chapters"
                    items={["Thirst", "Wave"]} />
            </SidebarMenuItem>
        </SidebarContent>
    </Sidebar>
}

type _SideNavElementsTypes = {
    title: string,
    items: string[]
}

const _SideNavElements = ({ title, items }: _SideNavElementsTypes) => {
    return <Collapsible defaultOpen className="group/collapsible w-full">
        <CollapsibleTrigger asChild>
            <SidebarMenuButton className="pl-4">
                {title}
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto">
                    <ChevronsDown />
                </Button>
            </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <SidebarMenuSub>
                {items.map((item) =>
                    <SidebarMenuSubItem className="text-sm">
                        <SidebarMenuSubButton
                            size="md">
                            {item}
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                )}
            </SidebarMenuSub>
        </CollapsibleContent>
    </Collapsible>
}

export default SideNav;