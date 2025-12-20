import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import '../App.css';

interface Service {
    id: number;
    name: string;
    price: string;
    img: string;
}

const ServiceSection: React.FC = () => {

    const [currentPage, setCurrentPage] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLButtonElement[]>([]);

    const services: Service[][] = [
        [
          { id: 1, name: "Wedding Party", price: "$3,000 – $15,000", img: "https://i.pinimg.com/1200x/07/4a/f1/074af19376f100b5f2b9b74c852512aa.jpg" },
          { id: 2, name: "Engagement", price: "$1,500 – $4,000", img: "https://i.pinimg.com/736x/a3/23/31/a32331d2248119587f9b5c7aa502d7fb.jpg" },
          { id: 3, name: "Anniversary", price: "$1,000 – $3,000", img: "https://i.pinimg.com/736x/1e/21/02/1e2102728840f96fadb52bbec4e5846f.jpg" },
        ],
        [
          { id: 4, name: "Business Meeting", price: "$1,500 – $5,000", img: "https://i.pinimg.com/736x/2d/3d/67/2d3d6771bc43b90cc8fef5ebb88744f0.jpg" },
          { id: 5, name: "Conference", price: "$5,000 – $20,000", img: "https://i.pinimg.com/736x/ec/b9/f8/ecb9f8211f801b3e1c6b85b372b2ae2e.jpg" },
          { id: 6, name: "Birthday Party", price: "$800 – $3,000", img: "https://i.pinimg.com/736x/bd/7c/51/bd7c514e341392bfdf1b9357a624b10a.jpg" },
        ],
        [
          { id: 7, name: "Holiday Party", price: "$2,000 – $6,000", img: "https://i.pinimg.com/1200x/47/33/4c/47334ce7bea0a829af25e9b751763fea.jpg" },
          { id: 8, name: "Fashion Show Event", price: "$10,000 – $40,000", img: "https://i.pinimg.com/1200x/33/a9/f3/33a9f3c79baaa9b5f497bfda5dd4310c.jpg" },
          { id: 9, name: "Award Ceremony", price: "$3,000 – $10,000", img: "https://i.pinimg.com/1200x/9a/29/62/9a29629df04893b73cb8fa0ae49c225d.jpg" },
        ],
        [
          { id: 10, name: "Festival Plan", price: "$15,000 – $100,000+", img: "https://i.pinimg.com/1200x/09/6e/ba/096eba45463fe1aee3d0d7dbc50dc18a.jpg" },
          { id: 11, name: "Live Concert", price: "$25,000 – $250,000+", img: "https://i.pinimg.com/1200x/13/7c/33/137c3358202eaa5defc938223f48afb6.jpg" },
          { id: 12, name: "Product Launch", price: "$5,000 – $25,000", img: "https://i.pinimg.com/1200x/a2/bc/7a/a2bc7a79d3b8dc57fc436aef34a79792.jpg" },
        ],
    ];


    // update ui when page changes (active dots)
    const updateUI = (index: number): void => {
        setCurrentPage(index)

        // check scroll conatiner exists
        if (containerRef.current) {
            containerRef.current.scrollTo({
                left: index * containerRef.current.clientWidth,
                behavior: "smooth"
            })
        }

        // update active pagination dots
        dotsRef.current.forEach((dot, i) => {
            if (dot) {
                dot.classList.toggle("active", i === index)
            }
        })
    }


    // handle scroll events to update current page
    const handleScroll = (): void => {
        if (containerRef.current) {

            // calculate current page index from scroll position
            const index = Math.round(
                containerRef.current.scrollLeft / containerRef.current.clientWidth
            )

            if (index !== currentPage) {
                setCurrentPage(index)

                dotsRef.current.forEach((dot, i) => {
                    if (dot) {
                        dot.classList.toggle("active", i === index)
                    }
                })
            }
        }
    }

    // navigate to next page
    const nextPage = (): void => {
        if (currentPage < services.length -1) 
            // move to next page
            updateUI(currentPage + 1)
    }

    // navigate  to previous page
    const prevPage = (): void => {
        if (currentPage > 0)
            updateUI(currentPage - 1)
    }


    useEffect(() => {
        const container = containerRef.current

        if (container) {
            container.addEventListener("scroll", handleScroll)
            return () => container.removeEventListener("scroll", handleScroll)
        }
    },[currentPage]);


    return (
        <div id='services' className='relative min-h-screen overflow-x-hidden bg-[#FDFCFB] py-10 font-[Poppins]'>
            <div className='absolute inset-0 z-0 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-[#FDFCFB] via-[#F9F5F0] to-[#F5F1EA]'></div>

                {/* wave 1 */}
                <div className='absolute -top-24 -left-16 w-[140%] h-64 opacity-20'
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, #8B0000 50%, transparent 100%)',
                        borderRadius: '50%',
                        transform: 'rotate(-5deg)'
                    }}>
                </div>

                {/* wave 2 */}
                <div className='absolute top-3/4 -right-28 w-[125%] h-60 opacity-30'
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, #8B0000 60%, #D4B483 70%, transparent 100%)',
                        borderRadius: '50%',
                        transform: 'rotate(5deg)'
                    }}>
                </div>
            </div>

            {/* circle
            <div className='fixed -top-[200px] -left-[200px] h-[600px] w-[600px] rounded-full border-[120px]
                            border-[rgba(139,0,0,0.04)] pointer-events-none z-0'
                aria-hidden='true'>
            </div>

            <div className='fixed -bottom-[200px] -right-[200px] h-[700px] w-[700px] rounded-full border-[140px] 
                            border-[rgba(212,180,131,0.05)] pointer-events-none z-0'
                aria-hidden='true'>
            </div> */}

            {/* main content */}
            <section className='relative mx-auto max-w-[1400px] px-10 z-10'
                style={{
                    boxShadow: '0 0 80px rgba(28, 28, 28, 0.03)',
                    background: 'rgba(253, 252, 251, 0.75)',
                    backdropFilter: 'blur(10px)'
                }}>

                {/* lines */}
                <div className='absolute left-1/2 top-0 h-full w-[3px] z-0 pointer-events-none'
                    style={{
                        background: 'linear-gradient(to bottom, transparent, #D4B483 50%, transparent)',
                        opacity: 0.2,
                    }}
                    aria-hidden='true'>

                </div>

                <div className='absolute left-0 top-1/2 h-[2px] w-full z-0 pointer-events-none'
                    style={{
                        background: 'linear-gradient(to right, transparent, #8B0000 50%, transparent)',
                        opacity: 0.15
                    }}
                    aria-hidden='true'>
                </div>

                {/* header */}
                <div className='expertise-header mb-20 flex flex-col items-center pt-10 text-center'>
                    <div className='header-top-row mb-3 flex items-center justify-center gap-6'>

                        <div className='w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]'></div>

                        <span className='text-sm uppercase tracking-[0.3em] font-semibold text-[#9B2D2D]'>
                            The Art of Celebration
                        </span>

                        <div className='w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]'></div>

                    </div>

                    <h1 className='text-5xl md:text-6xl leading[1.1] font-semibold text-[#0F0F0F]'>
                        Transform your<span className='text-[#9B2D2D]'> Vision</span> Into <br />
                        <span className='text-[#D4B483]'>Reality</span>
                    </h1>
                </div>

                {/* cards wrapper */}
                <div className='cards-wrapper relative overflow-hidden'>
                    <div className='nav-arrows pointer-events-none absolute left-0 right-0 top-[45%] z-20 flex -translate-y-1/2
                                        justify-between px-1'>

                        <button
                            onClick={prevPage}
                            className='arrow pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center 
                                            rounded-full border border-[rgba(212,180,131,0.3)] bg-white text-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] 
                                            transition-all duration-300 hover:border-[#8B0000] hover:bg-[#8B0000] hover:!text-white hover:shadow-[0_4px_20px_rgba(139,0,0,0.2)]'

                            style={{ color: '#1C1C1C' }}
                            aria-label='Next page'>

                            <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />

                        </button>

                        <button
                            onClick={nextPage}
                            className='arrow pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center 
                                            rounded-full border border-[rgba(212,180,131,0.3)] bg-white text-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] 
                                            transition-all duration-300 hover:border-[#8B0000] hover:bg-[#8B0000] hover:!text-white hover:shadow-[0_4px_20px_rgba(139,0,0,0.2)]'

                            style={{ color: '#1C1C1C' }}
                            aria-label='Next page'>

                            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />

                        </button>
                    </div>

                    {/* card scroll */}
                    <div
                        ref={containerRef}
                        className='cards-container snap-x snap-mandatory overflow-x-auto pb-20 pt-0 scrollbar-hide'

                        style={{
                            scrollBehavior: 'smooth',
                            display: 'flex'
                        }}>

                        {/* map through services pages */}
                        {services.map((pageServices, pageIndex) => (
                            <div 
                                key={pageIndex}
                                className='page flex w-full flex-shrink-0 snap-start gap-16 px-20'
                                style={{ flex: '0 0 100%' }}>

                                {/* map through services in current page */}
                                {pageServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className='expertise-card group relative min-w-0 flex-1 transition-all duration-500 hover:-translate-y-3'>

                                        <div className='vertical-text absolute -left-3 bottom-6 z-10 -rotate-90 origin-bottom-left text-[13px]
                                                            font-semibold uppercase tracking-[7px] text-[#D4B483]/90 opacity-90'>

                                            Eventora Events
                                        </div>

                                        {/* card image container */}
                                        <div className='card-image-wrapper relative h-[480px] overflow-hidden rounded-[2px] 
                                                            shadow-[0_20px_40px_rgba(28,28,28,0.15)] transition-shadow duration-500 
                                                            group-hover:shadow-[0_25px_50px_rgba(28,28,28,0.2)]'>

                                            <img
                                                src={service.img}
                                                alt={service.name}
                                                className='h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </div>

                                        {/* card info */}
                                        <div className='card-info-floating absolute -bottom-7 left-1/2 z-20 w-[85%] -translate-x-1/2 bg-white px-4 py-6 text-center shadow-[0_10px_30px_rgba(139,0,0,0.08)] transition-all 
                                                            duration-500 group-hover:shadow-[0_15px_35px_rgba(139,0,0,0.15)] group-hover:-bottom-6'

                                            style={{
                                                borderBottom: '3px solid #D4B483',
                                            }}>

                                            <h3 className="mb-1 text-xl font-bold text-[#1C1C1C]">

                                                {service.name}

                                            </h3>

                                            <p className="text-sm font-semibold text-[#8B0000]">

                                                {service.price}

                                            </p>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* pagination dots */}
                <div className='pagination-dots mt-5 flex justify-center gap-4 pb-10'>

                    {services.map((_, index) => (

                        <button
                            key={index}
                            // store dot reference for active state control
                            ref={(el) => {
                                if (el) dotsRef.current[index] = el;
                            }}
                            onClick={() => updateUI(index)}
                            className={`dot h-2 w-2 cursor-pointer rounded-full border-none transition-all duration-300 
                                            ${currentPage === index ? 'active scale-125 shadow-[0_0_10px_rgba(139,0,0,0.3)]' : ''}`
                            }

                            style={{
                                backgroundColor: currentPage === index ? '#8B0000' : '#E0E0E0'
                            }}
                            data-page={index}
                            aria-label={`Go to page ${index + 1}`}>


                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default ServiceSection