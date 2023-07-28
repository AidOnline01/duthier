import readline from "readline";
import store from './store';

class Cli {
  constructor() {
    this.resolve = null;

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);

    process.stdin.on('keypress', (chunk, key) => {
      if(this.resolve) {
        this.resolve(key);
      }
    });
  }

  async waitForKeypress() {
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  printInstructions() {
    console.log('');
    console.log('Press 1-9 numbers to choose an answer');
    console.log('Press 0 to show progress');
    console.log('Press ESC to exit');
  }

  exitIfEscIsPressed(pressedKey) {
    if(pressedKey === 'escape') {
      console.log('');
      console.log('EXIT. Your game is saved');
      process.exit();
    }
  }

  async showProgressIfZeroIsPressed(pressedKey) {
    if(pressedKey === '0') {
      this.showProgress();

      console.log('');
      console.log('Press any key to continue...');
      await this.waitForKeypress();

      return true;
    }

    return false;
  }

  showQuestionAndAnswers(question, answers) {
    console.log('');
    console.log(`"${question.word}":`);
    console.log(answers.join(' | '));
  }

  async showInstructionsIfIncorrectKeyIsPressed(chosenAnswer, pressedKey) {
    if(!chosenAnswer && pressedKey !== '0') {
        this.printInstructions();

        console.log('');
        console.log('Press any key to continue...');
        await this.waitForKeypress();

        return true;
    }

    return false;
  }

  showFeedback(chosenAnswer, correctAnswer) {
    const colorRed = "\x1b[31m";
    const colorGreen = "\x1b[32m";
    const colorReset = "\x1b[0m";

    console.log('');
    console.log(chosenAnswer === correctAnswer ? colorGreen : colorRed, `Your answer: ${chosenAnswer}`);
    console.log(colorGreen, `Correct answer: ${correctAnswer}`);
    console.log(colorReset, '');

  }

  showProgress() {
    const totalCount = store.getTotalCount();
    const progress = store.getProgress();
    const hits = store.countHits();

    console.log('');
    console.log(`Progress words: ${progress}/${totalCount}`);
    console.log(`Progress hits: ${hits}/${totalCount * 5}`);
  }

  showThatGameWasLoadedFromSave() {
    console.log('');
    console.log('Your game was successfully loaded');
    this.showProgress();
  }
}

export default new Cli();