import nl from '@/dictionaries/nl.json';
import en from '@/dictionaries/en.json';

class Store {
  constructor() {
    this.state = {
      wordsProgress: {},
      activeWords: [],
    };

    this.init();
  }

  init() {
    this.state.wordsProgress = this.mapWords();
    this.state.activeWords = [...nl.words];
  }

  mapWords() {
    const wordsMap = {};

    nl.words.forEach((word, index) => {
        wordsMap[word] = {
            hits: 0,
            translation: en.words[index]
        };
    });

    return wordsMap;
  }

  getRandomWord() {
    const randomIndex = Math.floor(Math.random() * this.state.activeWords.length);
    
    const word = this.state.activeWords[randomIndex];

    const wordData = this.state.wordsProgress[word];
    return {word, hits: wordData.hits, translation: wordData.translation};
  }

  getRandomTranslations(word, translation) {
    const wordsPool = [...en.words];
    const chosenWords = [];

    for(let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * en.words.length);

      const chosenWord = wordsPool.splice(randomIndex, 1)[0];
      
      if(chosenWord !== word) chosenWords.push(chosenWord);
    }

    chosenWords.push(translation);
    
    return chosenWords.sort(() => 0.5 - Math.random());
  }
}

export default new Store();
