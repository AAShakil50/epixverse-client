import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Book, ChevronsDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import useSwr from "swr";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/site.configs";

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
        if(data && data.length > 0)
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
            <SidebarGroup>
                <SidebarGroupLabel>Chapters</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="#">
                                <Book size={24} />
                                <span>Thirst</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
}

export default SideNav;