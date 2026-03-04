import React, { useState } from 'react';
import Card from './Card';
import { cards } from '../data/cards';

const CardSwiper = ({ onCardSelect, selectedCardsCount, maxCardsReached }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      onCardSelect(cards[currentIndex]);
    }

    // Move to next card if available
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to beginning if we reach the end
      setCurrentIndex(0);
    }
  };

  // Get current card
  const currentCard = cards[currentIndex];

  return (
    <div className="card-swiper-container">
      <div className="cards-counter">Выбрано: {selectedCardsCount}/10</div>
      
      {currentCard && !maxCardsReached ? (
        <Card 
          card={currentCard} 
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
        />
      ) : (
        <div className="no-more-cards">
          {maxCardsReached ? 
            'Вы достигли максимального количества карт (10). Начните гадание.' :
            'Больше нет доступных карт.'
          }
        </div>
      )}
    </div>
  );
};

export default CardSwiper;