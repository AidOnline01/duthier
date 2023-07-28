import store from './store.js';
import cli from './cli.js';

async function initApplication() {
    let progress;
    let totalCount = store.getTotalCount();

    cli.printInstructions();

    do {
        progress = store.getProgress();
        const question = store.getRandomWord();
        const answers = store.getRandomTranslations(question.word, question.translation);

        cli.showQuestionAndAnswers(question, answers);

        const pressedKeyData = await cli.waitForKeypress();
        const pressedKey = pressedKeyData.name;

        const chosenAnswer = answers[+pressedKey - 1];

        cli.exitIfEscIsPressed(pressedKey);
        const progressIsShown = await cli.showProgressIfZeroIsPressed(pressedKey);
        const instructionIsShown = await cli.showInstructionsIfIncorrectKeyIsPressed(chosenAnswer, pressedKey);

        if(instructionIsShown) continue;
        if(progressIsShown) continue;

        store.answer(question.word, chosenAnswer);
        
        cli.showFeedback(chosenAnswer, question.translation);
    } while(progress < totalCount - 1);

    console.log('GAME IS WON!!!!')
}

initApplication();