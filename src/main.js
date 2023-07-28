import store from './store.js';

function initApplication() {
    let progress;
    let totalCount = store.getTotalCount();
    do {
        progress = store.getProgress();
        const question = store.getRandomWord();
        const answers = store.getRandomTranslations(question.word, question.translation);

        store.answer(question.word, question.translation);
    } while(progress < totalCount - 1);

    console.log('GAME IS WON!!!!')
}

initApplication();