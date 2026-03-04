import React, { useRef, useEffect } from 'react';
import './Card.css';

const Card = ({ card, onSwipeLeft, onSwipeRight }) => {
  const cardRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const handleStart = (clientX, clientY) => {
    startX.current = clientX;
    startY.current = clientY;
    isDragging.current = true;
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging.current || !cardRef.current) return;

    currentX.current = clientX - startX.current;
    currentY.current = clientY - startY.current;

    // Calculate rotation effect based on horizontal movement
    const rotate = currentX.current / 10;
    cardRef.current.style.transform = `translateX(${currentX.current}px) translateY(${currentY.current}px) rotate(${rotate}deg)`;
  };

  const handleEnd = () => {
    if (!isDragging.current || !cardRef.current) return;
    
    isDragging.current = false;
    cardRef.current.style.transition = 'transform 0.3s ease';

    // Determine swipe direction based on horizontal movement
    if (Math.abs(currentX.current) > 100) {
      if (currentX.current > 0) {
        // Swipe right
        cardRef.current.style.transform = `translateX(500px) rotate(30deg)`;
        setTimeout(() => onSwipeRight(), 300);
      } else {
        // Swipe left
        cardRef.current.style.transform = `translateX(-500px) rotate(-30deg)`;
        setTimeout(() => onSwipeLeft(), 300);
      }
    } else {
      // Return to original position
      cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0)';
    }
  };

  // Mouse events
  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add/remove event listeners
  useEffect(() => {
    const cardElement = cardRef.current;
    
    // Mouse events
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`card ${card.type}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <div className="card-actions">
        <button onClick={(e) => { e.stopPropagation(); onSwipeLeft(); }} className="swipe-btn left">
          ← Отклонить
        </button>
        <button onClick={(e) => { e.stopPropagation(); onSwipeRight(); }} className="swipe-btn right">
          Выбрать →
        </button>
      </div>
    </div>
  );
};

export default Card;