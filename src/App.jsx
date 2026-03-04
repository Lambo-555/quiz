import React, { useState } from 'react';
import CardSwiper from './components/CardSwiper';
import ReadingView from './components/ReadingView';
import './App.css';

function App() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentView, setCurrentView] = useState('swiper'); // 'swiper' or 'reading'

  const handleCardSelection = (card) => {
    if (selectedCards.length < 10 && !selectedCards.some(c => c.id === card.id)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleRemoveCard = (cardId) => {
    setSelectedCards(selectedCards.filter(card => card.id !== cardId));
  };

  const startReading = () => {
    if (selectedCards.length > 0) {
      setCurrentView('reading');
    }
  };

  const resetApp = () => {
    setSelectedCards([]);
    setCurrentView('swiper');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Эзотерическое приложение для борьбы с апатией и прокрастинацией</h1>
        <p>Выберите до 10 карт, чтобы получить уникальное гадание</p>
      </header>

      {currentView === 'swiper' ? (
        <CardSwiper 
          onCardSelect={handleCardSelection} 
          selectedCardsCount={selectedCards.length}
          maxCardsReached={selectedCards.length >= 10}
        />
      ) : (
        <ReadingView cards={selectedCards} />
      )}

      <div className="app-controls">
        {currentView === 'swiper' && selectedCards.length > 0 && (
          <button onClick={startReading} disabled={selectedCards.length === 0}>
            Начать гадание ({selectedCards.length}/10)
          </button>
        )}
        
        {currentView === 'reading' && (
          <button onClick={resetApp}>Новый выбор карт</button>
        )}

        {currentView === 'swiper' && selectedCards.length > 0 && (
          <div className="selected-cards-preview">
            <h3>Ваша колода:</h3>
            <div className="selected-cards-list">
              {selectedCards.map(card => (
                <div key={card.id} className="selected-card">
                  <span>{card.title}</span>
                  <button onClick={() => handleRemoveCard(card.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;