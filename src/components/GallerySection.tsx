import React, { useState } from "react";
import { Layers, PlayCircle, Camera, Search } from "react-feather";
import { isContext } from "vm";


// type defenitions
type GalleryCategory = "photo" | "video"
type FilterType = "all" | GalleryCategory


// gallery item structure
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

                    </div>
                )
            })}

        </div>
    )
}