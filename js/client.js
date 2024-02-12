const socket = io("https://chat-application-skoy.onrender.com");

var audio = new Audio("public/notification.mp3");

const form = document.getElementById("send");
const messageInp = document.getElementById("mesInput");
const displayName = document.getElementById("name");
const messageContainer = document.querySelector(".container");
const activeMembers = document.getElementById("activeMembers");
let mainContent = document.getElementById("mainContent");
let modal = document.getElementById("myModal");
let btn = document.getElementById("submitBtn");
let input = document.getElementById("userName");

let members = [];

const appendActiveMember = () => {
  members.forEach((member) => {
    const activeMember = document.createElement("div");
    activeMember.innerText = member;
    activeMember.classList.add("activeMember");
    activeMembers.append(activeMember);
  });
};

const append = (message, position) => {
  const singleMsgDiv = document.createElement("div");
  singleMsgDiv.innerHTML = `
    <div class="message ${position}">
    ${message} <span class="timestamp-span">${new Date().toLocaleTimeString()}</span
    ></div> `;
  messageContainer.append(singleMsgDiv);
  if (position == "left") {
    audio.play();
  }
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const appendAlert = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("alert");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  audio.play();
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

window.onload = function () {
  modal.style.display = "block";
};

btn.onclick = function () {
  const userName = input.value.trim();
  if (userName !== "") {
    socket.emit("new-user-joined", userName);
    modal.style.display = "none";
    mainContent.style.display = "block";
    displayName.innerText = userName;
  } else {
    alert("Name cannot be empty. Please enter your name to join");
  }
};

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInp.value;
  if (message.trim() !== "") {
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInp.value = "";
  } else {
    alert("Please enter a message before submitting.");
  }
});

socket.on("user-joined", (name) => {
  if (name !== null) {
    appendAlert(`${name} joined the chat`, "left");
    members.push(name);
    appendActiveMember();
  }
});

socket.on("receive", (data) => {
  if (data.name !== null) {
    append(`${data.name} : ${data.message}`, "left");
  }
});

socket.on("left", (name) => {
  if (name !== null) {
    appendAlert(`${name} left the chat`, "left");
    members = members.filter((member) => member !== name);
    appendActiveMember();
  }
});
