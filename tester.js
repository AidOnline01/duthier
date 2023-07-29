const { exec, spawn } = require('node:child_process');
const en = require('./src/dictionaries-full/en.json');
const nl = require('./src/dictionaries-full/nl.json');

async function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function runTests() {
  const command = spawn('npm.cmd', ['run', 'play']);

  let question;
  let answers;
  let userAnswer;
  let correctAnswersCount = 0;
  let wrongAnswersCount = 0;

  // fix stuck test
  setInterval(() => {
    command.stdin.write('Y');
    command.stdin.write('Y');
  }, 1000);

  command.stdout.on('data', output => {
    const questionRegex = /\"([^\"]*)\"\:/;
    const isQuestion = output.toString().match(questionRegex);
    const isAnswers = output.toString().includes('|');
    const isEndGame = output.toString().includes('GAME IS WON!!!!');
    const pressAnyKeyMessage = output.toString().includes('Press any key to continue...');
    const isDebug = output.toString().includes('DEBUG: ');
    const isCorrectAnswer = output.toString().includes('Correct answer:');
    const isUserAnswer = output.toString().includes('Your answer:');

    if(isDebug) {
      return;
    }

    if(pressAnyKeyMessage) {
      command.stdin.write('Y');
      return;
    }

    if(isQuestion) {
      question = output.toString().match(questionRegex)[1];
      return;
    }

    if(isAnswers) {
      const shouldBeWrong = Math.random() > 0.9;

      answers = output.toString().replace('\n', '');
      answers = answers.split('|').map(answer => answer.trim());

      const wordIndex = en.words.indexOf(question);
      const correctAnswer = nl.words[wordIndex];
      const correctAnswerIndex = answers.indexOf(correctAnswer) + 1;

      const wrongIndex = answers.indexOf(answers.filter(item => item !== correctAnswer)[0]) + 1;
      command.stdin.write(shouldBeWrong ? wrongIndex.toString() : correctAnswerIndex.toString());
      return;
    }

    if(isUserAnswer) {
      userAnswer = output.toString().split(' ').pop();
    }

    if(isCorrectAnswer) {
      const correctAnswer = output.toString().split(' ').pop();

      if(userAnswer === correctAnswer) {
        correctAnswersCount += 1;
      }
      else {
        wrongAnswersCount += 1;
      }
    }

    if(isEndGame) {
      console.log("We won!");
      console.log('Correct answers count: ' + correctAnswersCount);
      console.log('Wrong answers count: ' + wrongAnswersCount);
      return;
    }
  });
}

runTests();