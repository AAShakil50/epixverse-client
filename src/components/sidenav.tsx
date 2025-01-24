import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./ui/sidebar";
import { ChevronsDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import useSwr from "swr";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/site.configs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

// type SideNavProps = {
//     title: string,
//     children: ReactNode
// };

interface _ProjectsSkeleton {
    id: string,
    title: string,
    description: string
}

const projectFetcher = async (url: string) => {
    const response = await axios.get<_ProjectsSkeleton[]>(url);
    return response.data;
}

const SideNav = () => {
    const { data, error, isLoading } = useSwr<_ProjectsSkeleton[]>(
        `${API_URL}/projects`, projectFetcher);

    const [selected, setSelected] = useState<_ProjectsSkeleton | null>(null);

    useEffect(() => {
        if (data && data.length > 0)
            setSelected(data[0]);
    }, [data])

    const buttonText = isLoading ?
        "Loading Projects..." : error ?
            "Error Loading..." : "Select";


    return <Sidebar>
        <SidebarContent>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded="true"
                                    className="w-full justify-between text-sm">
                                    {selected ? selected.title : buttonText}
                                    <ChevronsDown />
                                </Button>
                            </PopoverTrigger>
                            {data &&
                                <PopoverContent
                                    className="p-0 ml-2">
                                    <Command>
                                        <CommandInput placeholder="Select a project..." />
                                        <CommandList>
                                            <CommandGroup>
                                                {data.map((project) => {
                                                    return <CommandItem
                                                        key={project.id}
                                                        value={project.title}>
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