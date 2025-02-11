import Header from "@/components/containers/header"
import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

type PageLayoutProps = {
    showHeader?: boolean
    header?: React.ReactNode
    children: React.ReactNode
} & HTMLAttributes<HTMLElement>

const PageLayout: React.FC<PageLayoutProps> = (
    {
        showHeader = true,
        header: HeaderComp = <Header />,
        children,
        className,
        ...props
    }: PageLayoutProps
) => {
    return <main
        {...props}
        className={cn('w-full', className)}>
        {showHeader && HeaderComp}
        {children}
    </main>
}

export { PageLayout }