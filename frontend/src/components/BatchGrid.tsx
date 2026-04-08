"use client";

import React from "react";

interface BatchGridProps {
  occupiedSeats: number[];
  selectedSeat?: number;
  onSelect?: (seat: number) => void;
  maxSeats?: number;
  isAdmin?: boolean;
}

export default function BatchGrid({ 
  occupiedSeats, 
  selectedSeat, 
  onSelect, 
  maxSeats = 30,
  isAdmin = false
}: BatchGridProps) {
  const seats = Array.from({ length: maxSeats }, (_, i) => i + 1);

  return (
    <div className="bg-birch-dark/50 p-6 rounded-3xl border border-evergreen/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-evergreen font-serif text-xl font-semibold">Computer Lab Layout</h3>
        <div className="flex gap-4 text-xs font-sans uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-white border border-evergreen/20" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-moss" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-berry" />
            <span>Selected</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
        {seats.map((seat) => {
          const isOccupied = occupiedSeats.includes(seat);
          const isSelected = selectedSeat === seat;
          
          return (
            <button
              key={seat}
              disabled={(!isAdmin && isOccupied) || !onSelect}
              onClick={() => onSelect?.(seat)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all text-[10px] font-bold
                ${isOccupied 
                  ? `bg-moss/20 border-moss text-moss ${isAdmin ? "cursor-pointer hover:bg-moss/30" : "cursor-not-allowed opacity-50"}` 
                  : isSelected 
                    ? "bg-berry border-berry text-white shadow-lg shadow-berry/25 scale-110 z-10" 
                    : "bg-white border-evergreen/10 text-evergreen hover:border-berry/50 hover:bg-birch"
                }
              `}
            >
              <div className="mb-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              {seat}
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-evergreen/10 flex justify-center">
        <div className="px-12 py-2 bg-evergreen/10 rounded-full text-evergreen/60 text-xs font-serif italic">
          Instructor Table / Screen Area
        </div>
      </div>
    </div>
  );
}
