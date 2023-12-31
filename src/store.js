import nl from '@/dictionaries-full/nl.json';
import en from '@/dictionaries-full/en.json';
import storage from './storage';

class Store {
  constructor() {
    this.state = {
      wordsProgress: {},
      activeWords: [],
    };

    this.init();
  }

  init() {
    const savedProgress = storage.load();

    if(savedProgress) {
      console.log('');
      console.log('Your game was successfully loaded from save file');

      this.state.wordsProgress = savedProgress.wordsProgress;
      this.state.activeWords = savedProgress.activeWords;
    }
    else {
      this.state.wordsProgress = this.mapWords();
      this.state.activeWords = [...en.words];
    }
  }

  mapWords() {
    const wordsMap = {};

    en.words.forEach((word, index) => {
        wordsMap[word] = {
            hits: 0,
            translation: nl.words[index]
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
    const wordsPool = [...nl.words];
    let chosenWords = [];

    for(let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * wordsPool.length);

      const chosenWord = wordsPool.splice(randomIndex, 1)[0];

      if(chosenWord !== word) chosenWords.push(chosenWord);
    }

    chosenWords = chosenWords.slice(0, 3);
    chosenWords.push(translation);

    return chosenWords.sort(() => 0.5 - Math.random());
  }

  getTotalCount() {
    return en.words.length;
  }

  getProgress() {
    return en.words.length - this.state.activeWords.length;
  }

  countHits() {
    let activeHitsCount = 0;

    this.state.activeWords.forEach((word) => {
      activeHitsCount += this.state.wordsProgress[word].hits;
    });

    let deadHits = (en.words.length - this.state.activeWords.length) * 5;

    return activeHitsCount + deadHits;
  }

  answer(word, answer) {
    const wordData = this.state.wordsProgress[word];

    if(wordData.translation === answer) {
      wordData.hits += 1;
  
      if(wordData.hits >= 5) {
        this.deleteWord(word);
      }
    }
    else {
      wordData.hits = 0;
    }

    storage.save(this.state.activeWords, this.state.wordsProgress);
  }

  deleteWord(word) {
    delete this.state.wordsProgress[word];
    this.state.activeWords = this.state.activeWords.filter(item => item !== word);
  }
}

export default new Store();
