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
        {showHeader && header ? header : <DefaultHeader />}
        {children}
    </main>
}

const DefaultHeader = () => {
    const headerPages = [
        {
            title: 'Projects',
            href: '/projects',
            icon: <Projector size={16} className="-mt-1" />
        },
        {
            title: "Profile",
            href: "/profile",
            icon: <User size={16} className="-mt-1" />
        }
    ]

    return <Header>
        <Heading
            title={APP_NAME}
            href='/' />
        <NavContainer>
            {
                headerPages.map((page, index) => <NavItemLink
                    {...page}
                    key={index} />
                )
            }
        </NavContainer>
    </Header>
}

export { PageLayout }