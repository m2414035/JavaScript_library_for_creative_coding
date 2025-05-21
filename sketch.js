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
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
  numRows = table.getRowCount();

  nextButton = createButton("Next word");
  nextButton.addClass("next-button");
  nextButton.position((windowWidth - 120) / 2, height - 80); // Центрируем по ширине
  nextButton.mousePressed(generateQuestion);
  nextButton.hide();

  generateQuestion();
}

function draw() {
  background();
  fill(0);
  textSize(28);

  // Перенос текста по 4 слова в строке
  let instruction = "Choose the correct translation for the following word:";
  let words = instruction.split(" ");
  let maxWordsPerLine = 4;
  let lines = [];

  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine).join(" "));
  }

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width / 2, 30 + i * 30);
  }

  if (correctAnswer) {
    fill(20, 30, 180);
    textSize(36);
    text(correctAnswer.question, width / 2, 150);
  }

  if (message) {
    textSize(22);
    if (message.startsWith("Wrong!")) {
      let parts = message.split(": ");
      fill(0);
      text(parts[0] + ":", width / 2, height - 140);
      fill('#4CAF50'); // зелёный для правильного слова
      text(parts
