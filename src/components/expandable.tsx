import { ChevronsDown } from "lucide-react"
import { useState } from "react"

type ExpandableProps = {
    title: string,
    description?: string,
    children?: React.ReactNode
}

const Expandable = ({ title, description, children }: ExpandableProps) => {
    const [expand, setExpand] = useState(false);

    return <div className="rounded-xl shadow-lg p-4">
        <div className="flex flex-row justify-between">
            <div>
                <h2 className="josefin-sans text-2xl font-bold inline">{title}</h2>
                <span className="kanit-400 ml-2 text-gray-500 tracking-tighter">{description}</span>
            </div>
            <ChevronsDown
                role="button"
                size={24}
                onClick={() => setExpand(!expand)}
                className={`transition-transform duration-300 ${expand ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        {expand && children}
    </div>
}

export default Expandable