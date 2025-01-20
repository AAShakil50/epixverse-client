import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Book, ChevronsDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";

// type SideNavProps = {
//     title: string,
//     children: ReactNode
// };

const SideNav = () => {

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
                                    Select Project
                                    <ChevronsDown />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                            className="p-0 ml-2">
                                <Command>
                                    <CommandInput placeholder="Select a novel..."/>
                                    <CommandList>
                                        <CommandGroup>
                                            <CommandItem
                                            value="thirst">
                                                Thirst
                                            </CommandItem>
                                            <CommandItem
                                            value="wave">
                                                Wave
                                            </CommandItem>
                                            <CommandSeparator />
                                            <CommandItem
                                            value="thunder">
                                                Thunder
                                            </CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
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