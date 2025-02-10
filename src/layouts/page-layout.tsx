import Header from "@/components/header"

type PageLayoutProps = {
    showHeader?: boolean
    header?: React.ReactNode
    children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = (
    {
        showHeader = true,
        header: HeaderComp = <Header />,
        children
    }: PageLayoutProps
) => {
    return <main
        className='w-full'>
        {showHeader && HeaderComp}
        {children}
    </main>
}

export { PageLayout }