import React, { useState } from "react";
import { Layers, PlayCircle, Camera, Search } from "react-feather";


// type defenitions
type GalleryCategory = "photo" | "video"
type FilterType = "all" | GalleryCategory


interface GalleryItemType {
    id: number
    category: GalleryCategory
    image: string
    title: string
    date: string
}