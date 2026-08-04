"use client";

import { useRef, useState, useEffect } from "react";
import StoryCard from "./StoryCard";

export default function StoriesCarousel({ stories }: { stories: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    
    // Calculate which card is currently most visible
    // Each card is ~360px wide + 32px gap, but we can just use scrollLeft / clientWidth as a rough proxy
    // or precisely by index:
    const newIndex = Math.round(scrollLeft / (scrollRef.current.scrollWidth / stories.length));
    
    // Keep within bounds
    const clampedIndex = Math.max(0, Math.min(newIndex, stories.length - 1));
    setActiveIndex(clampedIndex);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const itemWidth = scrollRef.current.scrollWidth / stories.length;
    scrollRef.current.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  // Add scroll event listener
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [stories.length]);

  return (
    <div className="carousel-container">
      <div className="stories-carousel" ref={scrollRef}>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      
      {/* Pagination Dots */}
      <div className="carousel-indicators">
        {stories.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot ${idx === activeIndex ? "active" : ""}`}
            onClick={() => scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
