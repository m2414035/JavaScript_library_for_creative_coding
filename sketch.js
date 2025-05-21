let table;
let numRows;
let correctAnswer;
let buttons = [];
let nextButton;
let message = "";

function preload() {
  table = loadTable('trans.csv', 'csv', 'header');
}

function setup() {
  // Создаём canvas и помещаем его под HTML
  noCanvas(); // отключает canvas

  textAlign(CENTER, CENTER);
  textSize(24);
  textFont('PT Sans'); // Используем шрифт

  numRows = table.getRowCount();

  // Кнопка Next
  nextButton = createButton("Next word");
  nextButton.addClass("next-button");
  nextButton.position((windowWidth - 110) / 2, height - 90);
  nextButton.mousePressed(generateQuestion);
  nextButton.hide();

  generateQuestion();
}

function draw() {
  clear(); // очищает canvas

  // Рисуем белую подложку
  fill(255, 200); // белый с небольшой прозрачностью (240 из 255)
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height / 2, 500, 900, 20); // x, y, ширина, высота, скругление

  fill(0);
  textSize(28);
  // Перенос текста по 4 слова
  let instruction = "Choose the correct translation for the following word:";
  let words = instruction.split(" ");
  let maxWordsPerLine = 4;
  let lines = [];

  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine).join(" "));
  }

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width / 2, 70 + i * 30);
  }

  if (correctAnswer) {
    fill(0, 102, 204);
    textSize(36);
    text(correctAnswer.question, width / 2, 150);
  }

  if (message) {
    textSize(22);
    if (message.startsWith("Wrong!")) {
      let parts = message.split(": ");
      fill(0);
      text(parts[0] + ":", width / 2, height - 140);
      fill('#4CAF50');
      text(parts[1], width / 2, height - 110);
    } else {
      fill(0);
      text(message, width / 2, height - 120);
    }
  }
}

function generateQuestion() {
  message = "";
  nextButton.hide();
  buttons.forEach(btn => btn.remove());
  buttons = [];

  let validRows = [];
  for (let i = 0; i < numRows; i++) {
    let eng = table.getString(i, 2);
    let rus = table.getString(i, 3);
    if (eng && rus) {
      validRows.push({ eng, rus });
    }
  }

  let rndIndex = int(random(validRows.length));
  let selected = validRows[rndIndex];
  correctAnswer = {
    question: selected.eng,
    answer: selected.rus
  };

  let wrongAnswers = [];
  while (wrongAnswers.length < 2) {
    let randomIndex = int(random(validRows.length));
    let wrong = validRows[randomIndex].rus;
    if (wrong !== correctAnswer.answer && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }

  let options = [correctAnswer.answer, ...wrongAnswers];
  shuffle(options, true);

  for (let i = 0; i < 3; i++) {
    let btn = createButton(options[i]);
    btn.addClass("answer-button");
    btn.position(width / 2 - 100, 200 + i * 70);
    btn.size(200, 50);
    btn.mousePressed(() => checkAnswer(btn, options[i]));
    buttons.push(btn);
  }
}

function checkAnswer(btn, selected) {
  buttons.forEach(b => b.attribute('disabled', ''));
  if (selected === correctAnswer.answer) {
    btn.style('background-color', '#4CAF50');
    message = "Correct answer!";
  } else {
    btn.style('background-color', '#F44336');
    message = `Wrong! The correct translation is: ${correctAnswer.answer}`;
  }
  nextButton.show();
}
