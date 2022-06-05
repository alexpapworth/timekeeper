"use strict";

let container;

let colors = ["red", "orange", "yellow", "limegreen", "green", "aqua", "blue", "purple"]
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

function saveContent() {
  let name = this.dataset.name;
  let color = this.dataset.color;
  let time = this.dataset.time;
  let text = this.querySelector(".text").innerHTML;

  let value = JSON.stringify({"color": color, "text": text, "time": time});
  localStorage.setItem(name, value);
}

function resetTime() {
  let parent = this.parentElement
  parent.dataset.time = new Date().getTime()
  this.innerHTML = "🎉"

  saveContent.call(parent);
}

function decideNextTimekeeperColor() {
  let countOfTimekeepers = document.querySelectorAll('.input').length;
  var colorIndex = countOfTimekeepers%7;

  if (colorIndex > 7) {
    colorIndex = 0;
  }

  let nextColor = colors[colorIndex];

  document.querySelector('.add-timekeeper').dataset.hover = nextColor;
  document.querySelector('.github').dataset.hover = nextColor;
}

function calculateDays(timestamp) {
  let DAY = 86400000
  let HOUR = 3600000
  let MINUTE = 60000

  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0

  let currentTime = new Date().getTime()
  let interval = currentTime - timestamp

  while (interval > DAY) {
    days += 1
    interval -= DAY
  }

  while (interval > HOUR) {
    hours += 1
    interval -= HOUR
  }

  while (interval > MINUTE) {
    minutes += 1
    interval -= MINUTE
  }

  seconds = parseInt(interval)

  return {days: days, hours: hours}
}

function formatTime(timestamp) {
  let result = calculateDays(timestamp)
  let days = result.days
  let hours = result.hours

  let text = ""

  if (days > 0) {
    text = days
    text += days == 1 ? " day" : " days"
  }
  else if (hours > 0) {
    text = hours
    text += hours == 1 ? " hour" : " hours"
  } else {
    text = "🎉"
  }

  return text
}

function createTimekeeper(color, letter, text = "", time = 0) {
  if (time == 0) {
    time = new Date().getTime()
  }

  let timekeeperContainer = document.createElement('div');
  timekeeperContainer.classList.add('input-container');

  let input = document.createElement('div');

  input.classList.add("input", color);
  input.dataset.color = color;
  input.dataset.name = letter;
  input.dataset.time = time;

  let textElement = document.createElement('div');
  textElement.classList.add("text");
  textElement.innerHTML = text;
  textElement.contentEditable = true;

  let timeElement = document.createElement('div');
  timeElement.classList.add("time");
  timeElement.innerHTML = formatTime(time);

  input.appendChild(textElement);
  input.appendChild(timeElement);
  timekeeperContainer.appendChild(input);

  container.appendChild(timekeeperContainer);
  addTimekeeperEventListeners();

  decideNextTimekeeperColor();
}

function createNewTimekeeper() {
  if (document.querySelectorAll('.input').length == 0) {
    var chosenLetter = "a";
  }
  else {
    let countOfTimekeepers = document.querySelectorAll('.input').length;
    let numberOfCharacters = (Math.floor(countOfTimekeepers / 26) + 1);

    var testExistingLetter = "";
    var chosenLetter = "";

    for (var i = 0; i <= countOfTimekeepers; i++) {

      testExistingLetter = "";

      for (var j = 0; j < numberOfCharacters; j++) {
        testExistingLetter += letters[i];
      }

      if (!document.querySelector(`.input[data-name="${testExistingLetter}"`)) {
        chosenLetter = testExistingLetter;
        i = countOfTimekeepers;
      }
    }
  }

  let nextColor = document.querySelector('.add-timekeeper').dataset.hover;

  createTimekeeper(nextColor, chosenLetter);

  window.scrollTo(0,document.body.scrollHeight);
}

function removeTimekeeper() {
  let count = document.querySelectorAll('.input').length
  let timekeeper = document.querySelectorAll('.input')[count - 1]
  let name = timekeeper.dataset.name;

  localStorage.removeItem(name);
  container.removeChild(timekeeper.parentElement);

  decideNextTimekeeperColor();
}

function loadTimekeepers() {
  let length = JSON.parse(localStorage.length);

  for (var index = 0; index < length; index++) {
    let name = localStorage.key(index);
    let storage = JSON.parse(localStorage.getItem(name));

    createTimekeeper(storage.color, name, storage.text, storage.time);
  }
}

let ready;
let addTimekeeperEventListeners;

ready = function() {
  container = document.querySelector('#items');

  loadTimekeepers();
  decideNextTimekeeperColor();

  document.querySelector('.add-timekeeper').addEventListener("click", createNewTimekeeper);
  document.querySelector('.remove-timekeeper').addEventListener("click", removeTimekeeper);

  addTimekeeperEventListeners();
}

addTimekeeperEventListeners = function() {
  for (var i = 0; i < document.querySelectorAll('.input').length; i++) {
    document.querySelectorAll('.input')[i].addEventListener("input", saveContent);
    document.querySelectorAll('.input')[i].querySelector(".time").addEventListener("click", resetTime);
  }
}

document.addEventListener('DOMContentLoaded', ready);