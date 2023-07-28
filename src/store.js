import nl from '@/dictionaries-test/nl.json';
import en from '@/dictionaries-test/en.json';

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
      const randomIndex = Math.floor(Math.random() * wordsPool.length);

      const chosenWord = wordsPool.splice(randomIndex, 1)[0];

      if(chosenWord !== word) chosenWords.push(chosenWord);
    }

    chosenWords.push(translation);

    return chosenWords.sort(() => 0.5 - Math.random());
  }

  getTotalCount() {
    return nl.words.length;
  }

  getProgress() {
    return nl.words.length - this.state.activeWords.length;
  }

  answer(word, answer) {
    const wordData = this.state.wordsProgress[word];

    if(wordData.translation !== answer) return;

    wordData.hits += 1;

    if(wordData.hits >= 5) {
      this.deleteWord(word);
    }
  }

  deleteWord(word) {
    delete this.state.wordsProgress[word];
    this.state.activeWords = this.state.activeWords.filter(item => item !== word);
  }
}

export default new Store();
