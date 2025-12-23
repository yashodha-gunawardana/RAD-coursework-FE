import React, { useState } from "react";
import { Layers, PlayCircle, Camera, Search } from "react-feather";


type GalleryCategory = "photo" | "video"
type FilterType = "all" | GalleryCategory