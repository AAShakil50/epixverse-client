import { IconChevronsLeft } from "@tabler/icons-react";
import { ReactNode } from "react";

type SideNavProps = {
    title: string,
    children: ReactNode
};

const SideNav = (props: SideNavProps) => {
    const { title, children } = props;
    return (
        <div className="h-full flex-shrink-0 p-8 bg-slate-100">
            <div className="flex gap-4 justify-between">
                <h2 className="josefin-sans text-4xl font-bold">{title}</h2>
                <IconChevronsLeft size={32} stroke={2.2} />
            </div>
            {children}
        </div>
    );
}

export default SideNav;