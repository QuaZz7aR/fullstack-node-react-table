import * as React from "react";

interface Props {
    children: React.ReactNode
    isOpen: boolean,
    onClose: () => void
}

function Drawer({ children, isOpen, onClose }: Props) {
    return (
        <>
            {isOpen && <div
                className="fixed inset-0 bg-black/30 z-10"
                onClick={onClose} />
            }

            <div className={`fixed top-0 left-0 h-full bg-white z-20 shadow-xl w-1/4
            transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-semibold">Filters</span>
                    <button onClick={onClose} className="text-gray-500 hover:text-black hover:cursor-pointer">✕</button>
                </div>
                <div className="overflow-y-auto h-full pb-16 transition-transform duration-300">{children}</div>
            </div>
        </>
    )
}

export default Drawer;