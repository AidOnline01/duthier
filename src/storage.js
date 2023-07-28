import fs from 'fs';

class Storage {
  constructor() {
    this.savePath = `${__dirname}/save.json`;
  }

  load() {
    if(!fs.existsSync(this.savePath)) {
      return false;
    }

    const json = fs.readFileSync(this.savePath, 'utf8');

    return JSON.parse(json);
  }

  save(activeWords, wordsProgress) {
    const data = JSON.stringify({
      activeWords, wordsProgress
    });
    
    fs.writeFileSync(this.savePath, data);
  }
}

export default new Storage();