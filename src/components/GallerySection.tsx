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

            {/* search icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 duration-400"
                        style={{
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered
                                ? "translate(-50%, -50%) scale(1)"
                                : "translate(-50%, -50%) scale(0)"
                        }}>

                <Search className="w-14 h-14"
                                style={{
                                    color: "#8B0000"
                                }}
                />

            </div>

            <div className="absolute bottom-6 left-6 z-20 text-left transition-all duration-400"
                        style={{
                            transform: isHovered ? "translateY(0)" : "translateY(20px)",
                            opacity: isHovered ? 1 : 0
                        }}>

                <h3 className="text-xl font-semibold"
                            style={{
                                color: "#F4F4F2"
                            }}>
                                
                    {item.title}

                </h3>

                <p className="text-sm mt-1" 
                            style={{
                                color: "#C2B49A"
                            }}>

                    {item.date}            

                </p>

            </div>

        </div>
    )
};


// ------------------ gallery section component ------------------

const GallerySection: React.FC = () => {

    const [activeFilter, setActiveFilter] = useState<FilterType>("all")
    const [gridOpacity, setGridOpacity] = useState<number>(1)


    const galleryItems: GalleryItemType[] = [
        { id: 1, category: 'photo', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop', title: 'John & Sarah Wedding', date: 'Wedding • 12 Oct 2024' },
        { id: 2, category: 'photo', image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&auto=format&fit=crop', title: 'Corporate Gala Dubai', date: 'Corporate • 5 Nov 2024' },
        { id: 3, category: 'photo', image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800&auto=format&fit=crop', title: 'Annual Awards Night', date: 'Event • 20 Dec 2024' },
        { id: 4, category: 'video', image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?q=80&w=800&auto=format&fit=crop', title: 'Event Highlight Reel', date: 'Video • 8 Sep 2024' },
        { id: 5, category: 'photo', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop', title: 'Birthday Celebration', date: 'Birthday • 15 Jul 2024' },
        { id: 6, category: 'video', image: 'https://images.unsplash.com/photo-1533230393025-56220df6e84d?q=80&w=800&auto=format&fit=crop', title: 'Product Launch Film', date: 'Video • 22 Aug 2024' },
        { id: 7, category: 'photo', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop', title: 'Charity Gala Night', date: 'Charity • 1 Dec 2024' },
        { id: 8, category: 'photo', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop', title: 'Live Music Festival', date: 'Music • 15 Jan 2025' },
        { id: 9, category: 'video', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop', title: 'Stage Performance', date: 'Video • 22 Feb 2025' },
        { id: 10, category: 'photo', image: 'https://images.unsplash.com/photo-1452623668442-c69b8f635e0a?q=80&w=800&auto=format&fit=crop', title: 'Grand Opening Crowd', date: 'Event • 30 Mar 2025' },
    ];
    
}