import React from 'react';

interface DetailsModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
    isOpen,
    title,
    children,
    onClose,
}) => {
    if (!isOpen) return null


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#8B0000] dark:text-red-500">
                        
                        {title}

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl leading-none transition"
                        aria-label="Close modal">
                    
                        ×
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                    
                    {children}
                    
                </div>
            </div>
        </div>
    )
}

export default DetailsModal