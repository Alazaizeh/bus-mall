"use strict";

let products = [];
let img1Index = null;
let img2Index = null;
let img3Index = null;
let img1 = document.getElementById("img1");
let img2 = document.getElementById("img2");
let img3 = document.getElementById("img3");
let attempts = 0;
let maxAttempts = 25;

function product(path) {
  this.name = path.split(".")[0];
  this.path = `img/${path}`;
  this.clicks = 0;
  this.views = 0;
  products.push(this);
}
function getRandomIndex() {
  return Math.floor(Math.random() * imgsPath.length);
}

function render() {
  img1Index = getRandomIndex();
  img2Index = getRandomIndex();
  img3Index = getRandomIndex();
  while (
    img1Index === img2Index ||
    img1Index === img3Index ||
    img2Index === img3Index
  ) {
    img1Index = getRandomIndex();
    img2Index = getRandomIndex();
  }
  img1.setAttribute("src", products[img1Index].path);
  img2.setAttribute("src", products[img2Index].path);
  img3.setAttribute("src", products[img3Index].path);
  products[img1Index].views++;
  products[img2Index].views++;
  products[img3Index].views++;
}

img1.addEventListener("click", vote);
img2.addEventListener("click", vote);
img3.addEventListener("click", vote);

function vote(event) {
  if (attempts >= maxAttempts) {
    resultButton();
    img1.removeEventListener("click", vote);
    img2.removeEventListener("click", vote);
    img3.removeEventListener("click", vote);
  } else {
    if (event.target.id === "img1") {
      products[img1Index].clicks++;
    }
    if (event.target.id === "img2") {
      products[img2Index].clicks++;
    }
    if (event.target.id === "img3") {
      products[img3Index].clicks++;
    }
    attempts++;
    document.getElementById("attempts").textContent = attempts;
    render();
  }
}

function showResult() {
  let ul = document.getElementById("result");
  let li;
  let span;
  for (let i = 0; i < products.length; i++) {
    li = document.createElement("li");
    span = document.createElement("span");
    span.textContent = `${products[i].name}`;
    span.id = "product-name";
    li.appendChild(span);
    span = document.createElement("span");
    span.textContent = ` has ${products[i].views} views and has ${products[i].clicks} vote. `;
    li.appendChild(span);
    ul.appendChild(li);
  }
  // resultBtn.style.display = "none";
  resultBtn.removeEventListener("click", showResult);
}

function resultButton() {
  let main = document.getElementsByTagName("main")[0];
  let resultBtn = document.createElement("button");
  resultBtn.id = "resultBtn";
  resultBtn.textContent = "Result";
  main.appendChild(resultBtn);

  resultBtn.addEventListener("click", showResult);
}

let imgsPath = [
  "wine-glass.jpg",
  "water-can.jpg",
  "unicorn.jpg",
  "tauntaun.jpg",
  "shark.jpg",
  "sweep.png",
  "scissors.jpg",
  "pet-sweep.jpg",
  "pen.jpg",
  "dragon.jpg",
  "chair.jpg",
  "cthulhu.jpg",
  "dog-duck.jpg",
  "bubblegum.jpg",
  "breakfast.jpg",
  "boots.jpg",
  "banana.jpg",
  "bag.jpg",
  "bathroom.jpg",
];

for (let i = 0; i < imgsPath.length; i++) {
  new product(imgsPath[i]);
}
render();
