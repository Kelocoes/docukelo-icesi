import React, { useState, useRef } from 'react';
import Mermaid from '@theme/Mermaid';
import styles from './styles.module.css';

export default function ZoomableMermaid({ value }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const openModal = () => {
        setIsOpen(true);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.5, 8));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, 0.5));
    };

    const handleReset = (e) => {
        e.stopPropagation();
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <>
            <div className={styles.mermaidPreviewWrapper} onClick={openModal} title="Clic para ampliar y hacer zoom">
                <div className={styles.zoomHint}>Clic para ampliar</div>
                <Mermaid value={value} />
            </div>

            {isOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div 
                        className={styles.modalContent} 
                        onClick={(e) => e.stopPropagation()}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {/* Control panel */}
                        <div className={styles.controlPanel}>
                            <button className={styles.controlBtn} onClick={handleZoomIn} title="Acercar">+</button>
                            <button className={styles.controlBtn} onClick={handleZoomOut} title="Alejar">-</button>
                            <button className={styles.controlBtn} onClick={handleReset} title="Restablecer">1:1</button>
                            <button className={styles.controlBtnClose} onClick={closeModal} title="Cerrar">×</button>
                        </div>
                        
                        {/* Drag and Zoom Container */}
                        <div 
                            className={`${styles.diagramContainer} ${isDragging ? styles.grabbing : styles.grab}`}
                            onMouseDown={handleMouseDown}
                        >
                            <div 
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    transformOrigin: 'center center',
                                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                                    pointerEvents: 'none'
                                }}
                            >
                                <Mermaid value={value} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
