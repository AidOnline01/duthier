import store from './store.js';

function initApplication() {
    const question = store.getRandomWord();
    const answers = store.getRandomTranslations(question.word, question.translation);
    console.log(question, answers);
}

initApplication();