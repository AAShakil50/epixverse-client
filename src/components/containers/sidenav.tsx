import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsDown,
  GalleryVertical,
  Library,
  LucideIcon,
  Menu,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { memo, ReactElement, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useKeyboardShortcut } from "@/hooks/use-keyboard";
import {
  Book,
  Chapter,
  Project,
  useGetProjectsQuery,
} from "@/graphql/generated/types";
import { activeProjectAtom } from "@/recoil/atoms/atom-projects";
import { useRecoilState } from "recoil";
import { activeBookAtom } from "@/recoil/atoms/atom-books";
import { activeChapterAtom } from "@/recoil/atoms/atom-chapters";
import { useNavigate } from "react-router-dom";

// type SideNavProps = {
//     title: string,
//     children: ReactNode
// };

const SideNavToggler = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="outline"
      role="button"
      size="icon"
      className="px-1"
      onClick={toggleSidebar}
    >
      <Menu />
    </Button>
  );
};

const SideNav = () => {
  const { open: openSidebar } = useSidebar();
  const [openPopup, setOpenPopup] = useState(false);

  useKeyboardShortcut((event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "p") {
      event.preventDefault();
      setOpenPopup((state) => !state);
    }
  });

  const [activeProject, setActiveProject] = useRecoilState(activeProjectAtom);

  const { data, loading } = useGetProjectsQuery();

  useEffect(() => {
    if (data?.projects && !activeProject) {
      setActiveProject(data.projects.length > 0 ? data.projects[0].id : null);
    }
  }, [activeProject, data?.projects, setActiveProject]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              {!openSidebar ? (
                <SideNavToggler />
              ) : (
                <Popover open={openPopup} onOpenChange={setOpenPopup}>
                  <div className="flex w-full gap-1">
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded="true"
                        className="w-full justify-between text-sm"
                        onClick={() => setOpenPopup(!openPopup)}
                      >
                        {loading
                          ? "Loading Projects"
                          : data?.projects && activeProject
                            ? data.projects.find(
                                (project) => project.id === activeProject,
                              )?.title
                            : "No Project"}
                        <ChevronsDown />
                      </Button>
                    </PopoverTrigger>
                    <SideNavToggler />
                  </div>
                  {data?.projects && (
                    <PopoverContent className="p-0 ml-2">
                      <Command>
                        <CommandInput placeholder="Select a project..." />
                        <CommandList>
                          <CommandGroup>
                            {data.projects.map((project) => {
                              return (
                                <CommandItem
                                  key={project.id}
                                  value={project.title}
                                  className={`${
                                    activeProject === project.id &&
                                    "italic font-bold"
                                  }`}
                                  onSelect={() => {
                                    setActiveProject(project.id);
                                    setOpenPopup(false);
                                  }}
                                >
                                  {project.title}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SideNavContents
          project={
            data?.projects.find((project) => project.id === activeProject) ??
            null
          }
        />
      </SidebarContent>
    </Sidebar>
  );
};

const SideNavContents = ({ project }: { project: Project | null }) => {
  const [activeBook] = useRecoilState(activeBookAtom);

  const books = project?.books;
  const chapters = books?.find((book) => book.id === activeBook)?.chapters;

  if (!project) return null;

  return (
    <>
      <SideNavBooks books={books ?? null} />
      <SideNavChapters chapters={chapters ?? null} />
    </>
  );
};

const SideNavBooks = ({ books }: { books: Book[] | null }) => {
  const navigate = useNavigate();
  const [activeBook, setActiveBook] = useRecoilState(activeBookAtom);

  useEffect(() => {
    if (books?.length) {
      setActiveBook(books[0].id);
    }
  }, [books, setActiveBook]);

  if (!books?.length) {
    return null;
  }

  return (
    <SideNavSubElements
      title="Books"
      icon={Library}
      subElements={books}
      activeElement={activeBook}
      onSelect={(active) => setActiveBook(active)}
      onGo={(active) => {
        navigate(`/book/${active}`);
      }}
    />
  );
};

const SideNavChapters = ({ chapters }: { chapters: Chapter[] | null }) => {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useRecoilState(activeChapterAtom);

  useEffect(() => {
    if (chapters?.length) {
      setActiveChapter(chapters[0].id);
    }
  }, [chapters, setActiveChapter]);

  if (!chapters?.length) {
    return null;
  }

  return (
    <SideNavSubElements
      title="Chapters"
      icon={GalleryVertical}
      subElements={chapters}
      activeElement={activeChapter}
      onSelect={(active) => setActiveChapter(active)}
      onGo={(active) => {
        setActiveChapter(active);
        navigate(`/chapter/${active}`);
      }}
    />
  );
};

type SideNavElementsTypes = {
  title: string;
  icon: LucideIcon;
  itemCount?: number;
  children:
    | ReactElement<typeof SideBarNavSubElement>
    | ReactElement<typeof SideBarNavSubElement>[];
};

const SideNavElements = ({
  title,
  icon: Icon,
  itemCount,
  children,
}: SideNavElementsTypes) => {
  const [open, setOpen] = useState(false);
  const { open: openSidebar, toggleSidebar } = useSidebar();

  if (!openSidebar) {
    if (open) setOpen(false);
    return (
      <Button
        variant="ghost"
        className="ml-1"
        size="icon"
        onClick={() => {
          setOpen(!open);
          toggleSidebar();
        }}
      >
        <Icon />
      </Button>
    );
  }

  return (
    <Collapsible
      defaultOpen
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible w-full"
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="pl-4 mx-auto">
          <Icon className="-mt-1" />
          {title}
          {itemCount !== undefined && (
            <Badge variant="outline">{itemCount}</Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`ml-auto transition-transform ${open && "-rotate-180"}`}
          >
            <ChevronsDown />
          </Button>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>{children}</SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

type SideNavSubElementsType = {
  title: string;
  icon: LucideIcon;
  subElements:
    | {
        id: string;
        title: string;
      }[]
    | undefined;
  activeElement: string | null;
  onSelect: (activeElement: string) => void;
  onGo: (activeElement: string) => void;
};

const SideNavSubElements = ({
  title,
  icon,
  subElements,
  activeElement,
  onSelect,
  onGo,
}: SideNavSubElementsType) => {
  if (!subElements) return <SidebarMenuItem>No {title}</SidebarMenuItem>;

  return (
    <SidebarMenuItem>
      <SideNavElements
        title={title}
        mx-auto
        icon={icon}
        itemCount={subElements.length}
      >
        {subElements.map((subElement) => (
          <SideBarNavSubElement
            key={subElement.id}
            title={subElement.title}
            isActive={subElement.id === activeElement}
            onSelect={() => onSelect(subElement.id)}
            onGo={() => onGo(subElement.id)}
          />
        ))}
      </SideNavElements>
    </SidebarMenuItem>
  );
};

type SideBarNavSubElementType = {
  title: string;
  isActive: boolean;
  onSelect: VoidFunction;
  onGo: VoidFunction;
};

const SideBarNavSubElement = ({
  title,
  isActive,
  onSelect,
  onGo,
}: SideBarNavSubElementType) => {
  return (
    <SidebarMenuSubItem key={title} className="text-sm select-none">
      <SidebarMenuSubButton
        onClick={onSelect}
        onDoubleClick={onGo}
        role="button"
        isActive={isActive}
        size="md"
      >
        {title}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

export default memo(SideNav);
