import React, { useState, useRef } from "react";
import { Layers, PlayCircle, Camera, Search, ArrowRight } from "react-feather";


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
        <div className="flex justify-center gap-12 mb-12 pb-0 border-b"
                    style={{
                        borderColor: "rgba(11, 11, 11, 0.1)"
                    }}>

            {filters.map((filter) => {
                const Icon = filter.icon
                const isActive = activeFilter === filter.id

                return (
                    <div
                        key={filter.id}
                        className={`flex items-center gap-2 px-5 py-10 font-medium cursor-pointer
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
                            <div className="absolute bottom-[10px] left-1/2 transform 
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
        const videoRef = useRef<HTMLVideoElement>(null);


    const isVideo = item.category === "video" || item.image.endsWith(".mp4")

    const getGridClass = (): string => {
        switch(item.id) {
            case 1: return "md:row-span-2 md:h-[800px]" // first item
            case 8: return "md:col-span-2" // wide item
            default: return " "
        }
    };

    return (
        <div className={`relative overflow-hidden h-[400px] ${getGridClass()} group`}
                    onMouseEnter={() => {
      setIsHovered(true);
      if (isVideo) videoRef.current?.play();
  }}
  onMouseLeave={() => {
      setIsHovered(false);
      if (isVideo) videoRef.current?.pause();
  }}>
                    
            <div className="absolute inset-0 z-10 transition-opacity duration-400"
                        style={{
                            backgroundColor: "rgba(11, 11, 11, 0.8)",
                            opacity: isHovered ? 1 : 0
                        }}>
            </div>

            {/* background image & video */}
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={item.image}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                            ${isHovered ? "scale-110" : " "}`}
                            
                            style={{
                                filter: isHovered ? "brightness(0.6)" : "brightness(0.9)"
                            }}>

                </video>
            ) : (
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
            )}

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
                                    color: "#D4B483"
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
        { id: 1, category: 'photo', image: 'https://i.pinimg.com/736x/02/b2/82/02b28276f08e31c440e05dad99854db4.jpg', title: 'John & Sarah Wedding', date: 'Wedding • 12 Oct 2024' },
        { id: 2, category: 'photo', image: 'https://i.pinimg.com/1200x/39/1f/52/391f520e652a821484f4e94fd0c4e07f.jpg', title: 'Corporate Gala Dubai', date: 'Corporate • 5 Nov 2024' },
        { id: 3, category: 'photo', image: 'https://i.pinimg.com/736x/6c/b4/4e/6cb44e54c96383e2d0c7ec687a4afc60.jpg', title: 'Annual Awards Night', date: 'Event • 20 Dec 2024' },
        { id: 4, category: 'video', image:  '/videos/event1.mp4', title: 'Event Highlight Reel', date: 'Video • 8 Sep 2024' },
        { id: 5, category: 'photo', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop', title: 'Birthday Celebration', date: 'Birthday • 15 Jul 2024' },
        { id: 6, category: 'video', image: 'https://images.unsplash.com/photo-1533230393025-56220df6e84d?q=80&w=800&auto=format&fit=crop', title: 'Product Launch Film', date: 'Video • 22 Aug 2024' },
        { id: 7, category: 'photo', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop', title: 'Charity Gala Night', date: 'Charity • 1 Dec 2024' },
        { id: 8, category: 'photo', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop', title: 'Live Music Festival', date: 'Music • 15 Jan 2025' },
        { id: 9, category: 'video', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop', title: 'Stage Performance', date: 'Video • 22 Feb 2025' },
        { id: 10, category: 'photo', image: 'https://images.unsplash.com/photo-1452623668442-c69b8f635e0a?q=80&w=800&auto=format&fit=crop', title: 'Grand Opening Crowd', date: 'Event • 30 Mar 2025' },
    ];


    const handleFilterChange = (filter: FilterType) => {
        setGridOpacity(0.5) // fade out

        setTimeout(() => {
            setActiveFilter(filter) // update filter
            setGridOpacity(1)
        }, 300)
    }

    // filter gallery items
    const filteredItems = activeFilter === "all"
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter)

    
    return (
        <section id="gallery" className="w-full min-h-screen py-20 bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8]">
            <div className="w-full mx-auto text-center">

                {/* header */}
                <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]" />

                        <span className="font-[Poppins] text-sm uppercase tracking-[0.3em] font-semibold text-[#9B2D2D]">
                        The Art of Celebration
                        </span>

                    <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]" />
                </div>

                <h1 className="font-[Poppins] text-5xl md:text-6xl leading-[1.1] font-semibold">
                    <span className="text-[#9B2D2D]"> Beautiful</span> 
                    <span className="text-[#0F0F0F]"> & </span> 
                    <span className="text-[#D4B483]"> Unforgettable </span><br />
                    <span className="text-[#0F0F0F]"> Times</span>
                </h1>
            </div>

            {/* filter button */}
            <GalleryFilter
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-16 transition-opacity duration-300"
                        style={{
                            opacity: gridOpacity
                        }}>

                {filteredItems.map((item) => (
                    <GalleryItem key={item.id} item={item} />
                ))}

            </div>

            <div className="gallery-footer mt-5 flex justify-center items-center">
                <button className="relative bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white px-10 py-4 rounded-[50px] 
                                                font-semibold tracking-wide overflow-hidden group transition-all duration-400 hover:-translate-y-1 
                                                hover:shadow-xl hover:shadow-[#9B2D2D]/20">
                
                    <span className="flex items-center gap-3">
                        View All Gallery
                        
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                group-hover:translate-x-full transition-transform duration-600" />
                
                </button>

            </div>
        </section>
    )
    
};

export default GallerySection