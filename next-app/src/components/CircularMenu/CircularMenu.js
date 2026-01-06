"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Howl } from 'howler';
import styles from './CircularMenu.module.css';

const MENU_ITEMS = [
    { label: 'Home', icon: 'ri-home-line', href: '/' },
    { label: 'Events', icon: 'ri-calendar-event-line', href: '/events' },
    { label: 'Schedule', icon: 'ri-calendar-line', href: '/schedule' },
    { label: 'Charity', icon: 'ri-heart-line', href: '/charity' },
    { label: 'Music', icon: 'ri-music-line', href: '/music' },
    { label: 'News', icon: 'ri-newspaper-line', href: '/news' },
];

// Sound effects
let rotateSound = null;
let openSound = null;

if (typeof window !== 'undefined') {
    rotateSound = new Howl({
        src: ['/sounds/deploy.mp3'],
        volume: 0.3,
    });
    openSound = new Howl({
        src: ['/sounds/expand.mp3'],
        volume: 0.25,
    });
}

export default function CircularMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mouseAngle, setMouseAngle] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0); // Track actual rotation
    const pathname = usePathname();
    const router = useRouter();
    const menuRef = useRef(null);
    const centerRef = useRef({ x: 0, y: 0 });

    // Set mounted state to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const index = MENU_ITEMS.findIndex(item => item.href === pathname);
        if (index !== -1) {
            setActiveIndex(index);
            // Set initial rotation based on current page
            const segmentAngle = 360 / MENU_ITEMS.length;
            setRotationAngle(-index * segmentAngle);
        }
    }, [pathname, isMounted]);

    // Calculate center position when menu opens
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
            centerRef.current = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            };
        }
    }, [isOpen]);

    // Mouse tracking for magnetic pull effect
    const handleMouseMove = useCallback((e) => {
        if (!isOpen) return;
        
        const cx = centerRef.current.x;
        const cy = centerRef.current.y;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only calculate angle if outside the center button area
        if (distance > 50 && distance < 250) {
            // Calculate angle from center (0 = top, clockwise)
            let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
            if (angle < 0) angle += 360;
            setMouseAngle(angle);
            
            // Determine which segment the mouse is in
            const segmentAngle = 360 / MENU_ITEMS.length;
            // Account for current rotation
            const adjustedAngle = (angle - rotationAngle + segmentAngle / 2 + 360) % 360;
            const segmentIndex = Math.floor(adjustedAngle / segmentAngle);
            setHoveredIndex(segmentIndex % MENU_ITEMS.length);
        } else if (distance <= 50) {
            setHoveredIndex(null);
            setMouseAngle(null);
        }
    }, [isOpen, rotationAngle]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isOpen, handleMouseMove]);

    const toggleMenu = () => {
        if (!isOpen && openSound) {
            openSound.play();
        }
        setIsOpen(!isOpen);
        setHoveredIndex(null);
        setMouseAngle(null);
    };

    const handleItemClick = (e, index) => {
        e.preventDefault(); // Prevent default Link navigation
        
        const targetHref = MENU_ITEMS[index].href;
        
        // Calculate new rotation to bring clicked item to top
        const segmentAngle = 360 / MENU_ITEMS.length;
        const newRotation = -index * segmentAngle;
        
        // Play rotation sound
        if (rotateSound && newRotation !== rotationAngle) {
            rotateSound.play();
        }
        
        // Animate rotation
        setRotationAngle(newRotation);
        setActiveIndex(index);
        
        // Wait for rotation animation, then navigate and close
        setTimeout(() => {
            router.push(targetHref);
            setIsOpen(false);
            setHoveredIndex(null);
        }, 500);
    };

    // Calculate position for each segment's icon (no rotation offset - handled by CSS)
    const getIconPosition = (index) => {
        const total = MENU_ITEMS.length;
        const segmentAngle = 360 / total;
        const angle = index * segmentAngle; // 0 = top
        const radius = 105; // Distance from center to icon
        
        const rad = (angle - 90) * (Math.PI / 180);
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        
        return { x, y, angle };
    };

    // Generate SVG path for a pie segment (no rotation offset - handled by CSS)
    const getSegmentPath = (index) => {
        const total = MENU_ITEMS.length;
        const segmentAngle = 360 / total;
        const startAngle = index * segmentAngle - segmentAngle / 2 - 90;
        const endAngle = startAngle + segmentAngle;
        
        const innerRadius = 50;
        const outerRadius = 150;
        
        const startRad = startAngle * (Math.PI / 180);
        const endRad = endAngle * (Math.PI / 180);
        
        const x1 = Math.cos(startRad) * innerRadius;
        const y1 = Math.sin(startRad) * innerRadius;
        const x2 = Math.cos(startRad) * outerRadius;
        const y2 = Math.sin(startRad) * outerRadius;
        const x3 = Math.cos(endRad) * outerRadius;
        const y3 = Math.sin(endRad) * outerRadius;
        const x4 = Math.cos(endRad) * innerRadius;
        const y4 = Math.sin(endRad) * innerRadius;
        
        const largeArc = segmentAngle > 180 ? 1 : 0;
        
        return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1} Z`;
    };

    return (
        <nav className={`${styles.navContainer} ${isOpen ? styles.open : ''}`} ref={menuRef}>
            <div className={styles.menuBackdrop} onClick={() => setIsOpen(false)} />

            {/* Toggle Button */}
            <button className={styles.toggleBtn} onClick={toggleMenu}>
                <i className={`ri-menu-3-line ${styles.menuIcon}`}></i>
                <i className={`ri-close-line ${styles.closeIcon}`}></i>
            </button>

            {/* Pie Menu - only render after mount to avoid hydration mismatch */}
            {isMounted && (
                <div className={styles.pieMenu}>
                    {/* Rotating container for segments and icons */}
                    <div 
                        className={styles.rotatingContainer}
                        style={{ transform: `rotate(${rotationAngle}deg)` }}
                    >
                        <svg 
                            viewBox="-160 -160 320 320" 
                            className={styles.pieSvg}
                        >
                            {/* Segment backgrounds */}
                            {MENU_ITEMS.map((item, index) => {
                                const isHovered = hoveredIndex === index;
                                const isActive = activeIndex === index;
                                
                                return (
                                    <g key={index}>
                                        {/* Segment path */}
                                        <path
                                            d={getSegmentPath(index)}
                                            className={`${styles.segment} ${isHovered ? styles.segmentHovered : ''} ${isActive ? styles.segmentActive : ''}`}
                                            onClick={(e) => handleItemClick(e, index)}
                                        />
                                        
                                        {/* Segment border */}
                                        <path
                                            d={getSegmentPath(index)}
                                            className={styles.segmentBorder}
                                        />
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Icons positioned on segments */}
                        {MENU_ITEMS.map((item, index) => {
                            const pos = getIconPosition(index);
                            const isHovered = hoveredIndex === index;
                            const isActive = activeIndex === index;
                            
                            return (
                                <a
                                    key={index}
                                    href={item.href}
                                    className={`${styles.segmentIcon} ${isHovered ? styles.iconHovered : ''} ${isActive ? styles.iconActive : ''}`}
                                    style={{
                                        '--x': `${pos.x}px`,
                                        '--y': `${pos.y}px`,
                                        // Counter-rotate icons so they stay upright
                                        '--counter-rotate': `${-rotationAngle}deg`,
                                    }}
                                    onClick={(e) => handleItemClick(e, index)}
                                >
                                    <i className={item.icon}></i>
                                    <span className={styles.iconLabel}>{item.label}</span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Center circle with close button only */}
                    <button className={styles.centerCircle} onClick={() => setIsOpen(false)}>
                        <i className="ri-close-line" style={{ fontSize: 28, color: '#c72071' }}></i>
                    </button>
                </div>
            )}
        </nav>
    );
}