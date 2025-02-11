import { Header, Heading, NavContainer, NavItemLink } from "@/components/containers/header"
import { APP_NAME } from "@/lib/site.configs"
import { cn } from "@/lib/utils"
import { Projector, User } from "lucide-react"
import { HTMLAttributes } from "react"

type PageLayoutProps = {
    showHeader?: boolean
    header?: React.ReactNode | undefined
    children: React.ReactNode
} & HTMLAttributes<HTMLElement>

const PageLayout: React.FC<PageLayoutProps> = (
    {
        showHeader = true,
        header,
        children,
        className,
        ...props
    }: PageLayoutProps
) => {
    return <main
        {...props}
        className={cn('w-full', className)}>
        {showHeader && header ? header : <Header>
            <Heading
                title={APP_NAME}
                href='/' />
            <NavContainer>
                <NavItemLink
                    href="/projects"
                    title="Projects"
                    icon={<Projector size={16}
                        className="-mt-1" />} />
                <NavItemLink
                    href="/profile"
                    title="Profile"
                    icon={<User size={16}
                        className="-mt-1" />} />
            </NavContainer>
        </Header>}
        {children}
    </main>
}

export { PageLayout }