import React, { useState } from "react";
import { Layers, PlayCircle, Camera, Search } from "react-feather";


// type defenitions
type GalleryCategory = "photo" | "video"
type FilterType = "all" | GalleryCategory


// gallery item structure (single)
interface GalleryItemType {
    id: number
    category: GalleryCategory
    image: string
    title: string
    date: string
}

// --------------- gallery filter component ------------------

interface GalleryFilterProps {

    // current active filter
    activeFilter: FilterType
    onFilterChange: (filter: FilterType) => void
}

const GalleryFilter: React.FC <GalleryFilterProps> = ({
    activeFilter,
    onFilterChange
}) => {

    const filters = [
        { id: "all" as const, label: "All Gallery", icon: Layers },
        { id: "video" as const, label: "Video Gallery", icon: PlayCircle },
        { id: "photo" as const, label: "Photo Gallery", icon: Camera }
    ];

    return (
        <div className="flex hustify-center gap-8 mb-12 pb-4 border-b"
                    style={{
                        borderColor: "rgba(11, 11, 11, 0.1)"
                    }}>

            {filters.map((filter) => {
                const Icon = filter.icon
                const isActive = activeFilter === filter.id

                return (
                    <div
                        key={filter.id}
                        className={`flex items-center gap-2 px-5 py-3 font-medium cursor-pointer
                                    transition-all duration-300 relative select-none
                                    ${isActive ? " " : "text-[#C2B49A] hover:text-[#0B0B0B]"}
                                `}
                                  
                                onClick={() => onFilterChange(filter.id)}
                                style={{
                                    color: isActive ? "#8B0000" : "#D4B483"
                                }}>

                        <Icon className="w-4 h-4" />
                        <span className="text-sm md:text-base">{filter.label}</span>

                        {isActive && (
                            <div className="absolute bottom-[-16px] left-1/2 transform 
                                            -translate-x-1/2 w-10 h-1 rounded"
                                        
                                        style={{
                                            backgroundColor: "#8B0000"
                                        }}>
                            </div>
                        )}

                    </div>
                )
            })}

        </div>
    )
};


// -------------------- gallery item component -------------------

interface GalleryItemProps {
    item: GalleryItemType
}

// individual gallery item card
const GalleryItem: React.FC <GalleryItemProps> = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false)

    const getGridClass = (): string => {
        switch(item.id) {
            case 1: return "md:row-span-2 md:h-[800px]" // first item
            case 8: return "md:col-span-2" // wide item
            default: return " "
        }
    };

    return (
        <div className={`relative overflow-hidden h-[400px] ${getGridClass()} group`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    
            <div className="absolute inset-0 z-10 transition-opacity duration-400"
                        style={{
                            backgroundColor: "rgba(11, 11, 11, 0.8)",
                            opacity: isHovered ? 1 : 0
                        }}>
            </div>

            {/* background image */}
            <img
                src={item.image}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all diuration-500
                            ${isHovered ? "scale-110" : " "

                        }`}
                        
                        style={{
                            filter: isHovered ? "brightness(0.6)" : "brightness(0.9)"
                        }}>
            </img>

        </div>
    )
}