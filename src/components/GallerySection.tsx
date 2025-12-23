import React, { useState } from "react";
import { Layers, PlayCircle, Camera, Search } from "react-feather";


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

// gallery filter component
interface GalleryFilterProps {
    activeFilter: FilterType
}