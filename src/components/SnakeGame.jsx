import React, { useState, useEffect, useCallback, useRef } from 'react';
import { wordSets, getLettersForWordSet, isValidWord, getScoreForWord } from '../data/words';
import './SnakeGame.css';

const GRID_SIZE = 20;
const INITIAL_SPEED = 200;
const MIN_SPEED = 80;
const SPEED_INCREMENT = 10;

const SnakeGame = () => {
  const [currentWordSet, setCurrentWordSet] = useState(wordSets[0]);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [letters, setLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [lifePoints, setLifePoints] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [formedWords, setFormedWords] = useState([]);
  
  const gameLoopRef = useRef(null);
  const directionRef = useRef(direction);

  // Инициализация букв на поле
  const initializeLetters = useCallback(() => {
    const availableLetters = getLettersForWordSet(currentWordSet.id);
    const newLetters = [];
    
    for (let i = 0; i < 8; i++) {
      const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
      const position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      
      // Проверка, чтобы буква не появилась на змейке
      const onSnake = snake.some(segment => segment.x === position.x && segment.y === position.y);
      if (!onSnake) {
        newLetters.push({ ...position, letter: randomLetter, id: Date.now() + i });
      }
    }
    
    setLetters(newLetters);
  }, [currentWordSet, snake]);

  // Старт новой игры
  const startNewGame = (wordSetId) => {
    const selectedWordSet = wordSets.find(set => set.id === wordSetId) || wordSets[0];
    setCurrentWordSet(selectedWordSet);
    setSnake([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setLifePoints(5);
    setGameOver(false);
    setFormedWords([]);
    setSpeed(INITIAL_SPEED);
    setGameStarted(true);
    
    // Небольшая задержка перед инициализацией букв
    setTimeout(() => {
      initializeLetters();
    }, 100);
  };

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return;
      
      const currentDir = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ц':
        case 'Ц':
          if (currentDir.y !== 1) {
            directionRef.current = { x: 0, y: -1 };
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ы':
        case 'Ы':
          if (currentDir.y !== -1) {
            directionRef.current = { x: 0, y: 1 };
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ф':
        case 'Ф':
          if (currentDir.x !== 1) {
            directionRef.current = { x: -1, y: 0 };
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'в':
        case 'В':
          if (currentDir.x !== -1) {
            directionRef.current = { x: 1, y: 0 };
            setDirection({ x: 1, y: 0 });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  // Игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + directionRef.current.x,
          y: prevSnake[0].y + directionRef.current.y
        };

        // Проверка столкновения со стенами
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setLifePoints(prev => {
            const newLife = prev - 1;
            if (newLife <= 0) {
              setGameOver(true);
            }
            return newLife;
          });
          // Возвращаем змейку в центр
          directionRef.current = { x: 1, y: 0 };
          setDirection({ x: 1, y: 0 });
          return [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        }

        // Проверка столкновения с хвостом
        const collisionWithSelf = prevSnake.some(
          segment => segment.x === newHead.x && segment.y === newHead.y
        );

        if (collisionWithSelf) {
          setLifePoints(prev => {
            const newLife = prev - 1;
            if (newLife <= 0) {
              setGameOver(true);
            }
            return newLife;
          });
          directionRef.current = { x: 1, y: 0 };
          setDirection({ x: 1, y: 0 });
          return [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        }

        const newSnake = [newHead, ...prevSnake];

        // Проверка сбора буквы
        const collectedLetterIndex = letters.findIndex(
          l => l.x === newHead.x && l.y === newHead.y
        );

        if (collectedLetterIndex !== -1) {
          const collectedLetter = letters[collectedLetterIndex];
          
          // Проверяем, образует ли змейка слово
          const snakeLetters = newSnake.map(segment => {
            const letterOnSegment = letters.find(l => l.x === segment.x && l.y === segment.y);
            return letterOnSegment ? letterOnSegment.letter : null;
          }).filter(Boolean);

          if (snakeLetters.length >= 2 && isValidWord(snakeLetters, currentWordSet.id)) {
            const word = snakeLetters.join('');
            const points = getScoreForWord(word, currentWordSet.id);
            setScore(prev => prev + points);
            setLifePoints(prev => Math.min(prev + 2, 10)); // Добавляем жизни, но не больше 10
            
            if (!formedWords.includes(word)) {
              setFormedWords(prev => [...prev, word]);
              // Увеличиваем скорость
              setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
            }
          }

          // Удаляем собранную букву и добавляем новую
          setLetters(prev => {
            const newLetters = prev.filter((_, index) => index !== collectedLetterIndex);
            const availableLetters = getLettersForWordSet(currentWordSet.id);
            const newLetter = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
              letter: availableLetters[Math.floor(Math.random() * availableLetters.length)],
              id: Date.now()
            };
            return [...newLetters, newLetter];
          });
        } else {
          // Если не съели букву, удаляем хвост
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, letters, currentWordSet, formedWords, speed]);

  // Рендеринг экрана выбора набора слов
  if (!gameStarted) {
    return (
      <div className="snake-game">
        <div className="game-menu">
          <h1>🐍 Змейка: Слова</h1>
          <p className="game-description">
            Собирайте буквы так, чтобы тело змейки образовывало слова!
            Каждая собранная буква добавляется к телу змейки.
            Если змейка образует валидное слово - вы получаете очки и дополнительные жизни.
          </p>
          <h2>Выберите набор слов:</h2>
          <div className="word-sets">
            {wordSets.map(set => (
              <button
                key={set.id}
                onClick={() => startNewGame(set.id)}
                className="word-set-btn"
              >
                <div className="set-title">{set.description}</div>
                <div className="set-words">{set.words.join(', ')}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Создание сетки для рендеринга
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let content = null;
      let cellClass = 'cell';

      // Проверка, есть ли здесь часть змейки
      const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
      if (snakeIndex !== -1) {
        cellClass += ' snake';
        if (snakeIndex === 0) {
          cellClass += ' head';
        }
        content = snakeIndex === 0 ? '🐍' : '';
      }

      // Проверка, есть ли здесь буква
      const letter = letters.find(l => l.x === x && l.y === y);
      if (letter) {
        cellClass += ' letter';
        content = (
          <span className="letter-content">
            {letter.letter}
          </span>
        );
      }

      grid.push(
        <div key={`${x}-${y}`} className={cellClass}>
          {content}
        </div>
      );
    }
  }

  return (
    <div className="snake-game">
      <div className="game-header">
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Очки:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Жизни:</span>
            <span className="stat-value life-points">{lifePoints}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Слова:</span>
            <span className="stat-value">{formedWords.length}</span>
          </div>
        </div>
        <div className="current-word-set">
          Набор: {currentWordSet.description}
        </div>
      </div>

      <div className="game-board">
        <div className="grid" style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}>
          {grid}
        </div>
      </div>

      <div className="game-info">
        <div className="formed-words">
          <h3>Собранные слова:</h3>
          <div className="words-list">
            {formedWords.length > 0 ? (
              formedWords.map((word, index) => (
                <span key={index} className="formed-word">{word}</span>
              ))
            ) : (
              <span className="no-words">Пока нет слов</span>
            )}
          </div>
        </div>
        <div className="controls-info">
          <p>Управление: стрелки или WASD</p>
          <button onClick={() => startNewGame(currentWordSet.id)} className="restart-btn">
            Заново
          </button>
          <button onClick={() => setGameStarted(false)} className="menu-btn">
            Меню
          </button>
        </div>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over">
            <h2>💀 Игра окончена!</h2>
            <p>Ваш счет: {score}</p>
            <p>Собрано слов: {formedWords.length}</p>
            {formedWords.length > 0 && (
              <p>Слова: {formedWords.join(', ')}</p>
            )}
            <button onClick={() => startNewGame(currentWordSet.id)} className="restart-btn">
              Играть снова
            </button>
            <button onClick={() => setGameStarted(false)} className="menu-btn">
              В меню
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
