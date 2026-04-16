import React, { useState } from 'react';
import CardSwiper from './components/CardSwiper';
import ReadingView from './components/ReadingView';
import SnakeGame from './components/SnakeGame';
import './App.css';

function App() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'swiper', 'reading', 'snake'
  
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
      {currentView === 'snake' ? (
        <SnakeGame />
      ) : currentView === 'swiper' ? (
        <>
          <header className="app-header">
            <h1>Эзотерическое приложение для борьбы с апатией и прокрастинацией</h1>
            <p>Выберите до 10 карт, чтобы получить уникальное гадание</p>
          </header>

          <CardSwiper 
            onCardSelect={handleCardSelection} 
            selectedCardsCount={selectedCards.length}
            maxCardsReached={selectedCards.length >= 10}
          />

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
        </>
      ) : currentView === 'reading' ? (
        <>
          <header className="app-header">
            <h1>Эзотерическое приложение для борьбы с апатией и прокрастинацией</h1>
            <p>Выберите до 10 карт, чтобы получить уникальное гадание</p>
          </header>
          <ReadingView cards={selectedCards} />
          <div className="app-controls">
            <button onClick={resetApp}>Новый выбор карт</button>
          </div>
        </>
      ) : (
        <>
          <header className="app-header">
            <h1>Эзотерическое приложение для борьбы с апатией и прокрастинацией</h1>
            <p>Выберите режим:</p>
          </header>
          <div className="main-menu">
            <button onClick={() => setCurrentView('swiper')} className="menu-btn-large">
              🎴 Гадание на картах
            </button>
            <button onClick={() => setCurrentView('snake')} className="menu-btn-large">
              🐍 Змейка: Слова
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
