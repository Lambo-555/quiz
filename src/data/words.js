// Список слов для игры
export const wordSets = [
  {
    id: 1,
    words: ['КОТ', 'ТОК', 'ОТ'],
    description: 'Простые слова из 3 букв'
  },
  {
    id: 2,
    words: ['ДОМ', 'МОД', 'РОД', 'ЛОМ'],
    description: 'Слова на тему "дом"'
  },
  {
    id: 3,
    words: ['МИР', 'РИМ', 'ИР'],
    description: 'Географические названия'
  },
  {
    id: 4,
    words: ['ЛЕС', 'СЕЛ', 'ЕЛЬ'],
    description: 'Природа'
  },
  {
    id: 5,
    words: ['РУКА', 'КУР', 'РАК', 'УРА'],
    description: 'Разные слова'
  }
];

// Получить все уникальные буквы из набора слов
export const getLettersForWordSet = (wordSetId) => {
  const wordSet = wordSets.find(set => set.id === wordSetId);
  if (!wordSet) return [];
  
  const allLetters = wordSet.words.join('').split('');
  return [...new Set(allLetters)];
};

// Проверить, образует ли массив букв валидное слово
export const isValidWord = (letters, wordSetId) => {
  const wordSet = wordSets.find(set => set.id === wordSetId);
  if (!wordSet) return false;
  
  const word = letters.join('');
  return wordSet.words.includes(word);
};

// Получить очки за слово
export const getScoreForWord = (word, wordSetId) => {
  const wordSet = wordSets.find(set => set.id === wordSetId);
  if (!wordSet || !wordSet.words.includes(word)) return 0;
  return word.length * 10;
};
