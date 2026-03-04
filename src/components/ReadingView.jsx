import React from 'react';

const ReadingView = ({ cards }) => {
  // Generate reading based on selected cards
  const generateReading = () => {
    // Simple algorithm to generate personalized reading
    const positiveCards = cards.filter(card => card.type === 'light');
    const negativeCards = cards.filter(card => card.type === 'dark');
    const neutralCards = cards.filter(card => card.type === 'neutral');

    let reading = [];
    
    // Add opening statement
    reading.push({
      title: "Вступление",
      message: `Вы выбрали ${cards.length} карт${cards.length === 1 ? '' : (cards.length < 5 ? '' : '')}. Это расклад отражает ваше текущее состояние и дает рекомендации для преодоления апатии и прокрастинации.`
    });

    // Add insights based on card types
    if (positiveCards.length > 0) {
      reading.push({
        title: "Светлая энергия",
        message: `В вашем раскладе присутствует ${positiveCards.length} светл${positiveCards.length === 1 ? 'ая' : (positiveCards.length < 5 ? 'ые' : 'ых')} карта${positiveCards.length === 1 ? '' : (positiveCards.length < 5 ? '' : '')}, символизирующих позитивные аспекты вашей ситуации. Это источники внутренней силы и вдохновения.`
      });
    }

    if (negativeCards.length > 0) {
      reading.push({
        title: "Теневые аспекты",
        message: `В вашем раскладе присутствует ${negativeCards.length} тёмн${negativeCards.length === 1 ? 'ая' : (negativeCards.length < 5 ? 'ые' : 'ых')} карта${negativeCards.length === 1 ? '' : (negativeCards.length < 5 ? '' : '')}, указывающ${negativeCards.length === 1 ? 'ая' : (negativeCards.length < 5 ? 'ие' : 'ие')} на возможные препятствия или страхи. Работа с этими аспектами поможет вам освободиться от негативных влияний.`
      });
    }

    if (neutralCards.length > 0) {
      reading.push({
        title: "Балансирующие силы",
        message: `В вашем раскладе присутствует ${neutralCards.length} нейтральн${neutralCards.length === 1 ? 'ая' : (neutralCards.length < 5 ? 'ые' : 'ых')} карта${neutralCards.length === 1 ? '' : (neutralCards.length < 5 ? '' : '')}, которая${neutralCards.length === 1 ? '' : (neutralCards.length < 5 ? 'е' : 'й')} может${neutralCards.length === 1 ? '' : (neutralCards.length < 5 ? '' : '')} служить${neutralCards.length === 1 ? '' : (neutralCards.length < 5 ? 'ть' : 'ть')} точкой равновесия между светлыми и тёмными силами.`
      });
    }

    // Add specific card interpretations
    cards.forEach((card, index) => {
      reading.push({
        title: `${index + 1}. ${card.title}`,
        message: `"${card.description}" - Эта карта указывает на важный аспект вашей ситуации. Она может содержать ключ к пониманию вашего внутреннего состояния и возможных путей развития событий.`
      });
    });

    // Add closing recommendation
    reading.push({
      title: "Рекомендация",
      message: "Для преодоления апатии и прокрастинации важно использовать энергию светлых карт как источник вдохновения и мотивации, при этом работать с теневыми аспектами, чтобы устранить внутренние блоки. Нейтральные карты помогут найти баланс и принять решения."
    });

    return reading;
  };

  const reading = generateReading();

  return (
    <div className="reading-view">
      <h2>Ваше эзотерическое гадание</h2>
      <div className="reading-cards">
        {reading.map((section, index) => (
          <div key={index} className="reading-section">
            <h3>{section.title}</h3>
            <p>{section.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingView;