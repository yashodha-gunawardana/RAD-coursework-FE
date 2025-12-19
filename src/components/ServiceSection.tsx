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
    
}