import nl from '@/dictionaries/nl.json';
import en from '@/dictionaries/en.json';

class Store {
  constructor() {
    this.state = {
      wordsProgress: {},
    };

    this.init();
  }

  init() {
    this.state.wordsProgress = this.mapWords();
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
}

export default new Store();
