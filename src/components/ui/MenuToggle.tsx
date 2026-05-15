"use client";

import React from 'react';

export default function MenuToggle({ open }: { open: boolean }) {
  return (
    <div className="relative w-6 h-5 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute w-5 h-4 transition-opacity duration-500 ${open ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden
      >
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute w-5 h-4 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      >
        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
