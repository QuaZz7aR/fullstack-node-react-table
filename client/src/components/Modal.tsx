import { createPortal } from "react-dom";
import * as React from "react";

interface Props {
    children: React.ReactNode,
    onClose: () => void,
    title: string,
    isOpen: boolean
}

function Modal({ children, onClose, title, isOpen }: Props) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto ">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold">{title}</h2>
                    <button onClick={onClose} className="hover:text-red hover:font-semibold hover:cursor-pointer">✕</button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>, 
        document.getElementById('modals')!)
}

export default Modal;