import { useState } from "react";

interface Props {
    title: string,
    children: React.ReactNode,
    defaultOpen?: boolean
}

function CollapseGroup({ title, children, defaultOpen = true }: Props) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return <div className="border-b">

        <button
            onClick={() => setIsOpen(prev => !prev)}
            className="w-full flex justify-between items-center py-2 text-sm font-semibold hover:cursor-pointer"
        >
            {title}
            <span>{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && <div className="flex flex-col gap-3 pb-3">
            {children}
        </div>}
    </div>
}

export default CollapseGroup;