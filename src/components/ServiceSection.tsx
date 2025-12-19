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
        
    }
}