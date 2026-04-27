import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react'

export interface BuildingPopupProps {
    building: {
        id: string;
        name: string;
    }
}