const menuItems = ["Start Game", "Options", "High Scores", "Credits", "Exit"];
const listEl = document.querySelector(".menu-list");
const upArrow = document.querySelector(".arrow-up");
const downArrow = document.querySelector(".arrow-down");
let activeIndex = 0;
let isAnimating = false;
const slots = Array.from({ length: 3 }, () => {
  const d = document.createElement("div");
  d.className = "menu-item";
  listEl.append(d);
  return d;
});
function fillSlots() {
  slots[0].textContent =
    menuItems[(activeIndex - 1 + menuItems.length) % menuItems.length];
  slots[1].textContent = menuItems[activeIndex];
  slots[2].textContent = menuItems[(activeIndex + 1) % menuItems.length];
  slots.forEach((el, i) => el.classList.toggle("active", i === 1));
}
fillSlots();
const ITEM_H = slots[0].offsetHeight;
listEl.style.transform = `translateY(-${ITEM_H}px)`;
function step(delta) {
  if (isAnimating) return;
  isAnimating = true;
  const target = delta === 1 ? -2 * ITEM_H : 0;
  listEl.style.transition = "transform 0.4s ease-out";
  listEl.style.transform = `translateY(${target}px)`;
  listEl.addEventListener(
    "transitionend",
    function h() {
      listEl.removeEventListener("transitionend", h);
      activeIndex = (activeIndex + delta + menuItems.length) % menuItems.length;
      fillSlots();
      listEl.style.transition = "none";
      listEl.style.transform = `translateY(-${ITEM_H}px)`;
      isAnimating = false;
    },
    { once: true }
  );
}
const intervalDelay = 600;
let upInterval, downInterval;
upArrow.addEventListener("mouseenter", () => {
  upInterval = setInterval(() => step(-1), intervalDelay);
});
upArrow.addEventListener("mouseleave", () => clearInterval(upInterval));
upArrow.addEventListener("pointerdown", () => {
  upInterval = setInterval(() => step(-1), intervalDelay);
});
upArrow.addEventListener("pointerup", () => clearInterval(upInterval));
upArrow.addEventListener("pointercancel", () => clearInterval(upInterval));
downArrow.addEventListener("mouseenter", () => {
  downInterval = setInterval(() => step(1), intervalDelay);
});
downArrow.addEventListener("mouseleave", () => clearInterval(downInterval));
downArrow.addEventListener("pointerdown", () => {
  downInterval = setInterval(() => step(1), intervalDelay);
});
downArrow.addEventListener("pointerup", () => clearInterval(downInterval));
downArrow.addEventListener("pointercancel", () => clearInterval(downInterval));
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") step(-1);
  if (e.key === "ArrowDown") step(1);
});
document.querySelector(".menu-container").addEventListener("wheel", (e) => {
  e.preventDefault();
  step(e.deltaY > 0 ? 1 : -1);
});
let startY = null;
const container = document.querySelector(".menu-container");
container.addEventListener("touchstart", (e) => {
  startY = e.changedTouches[0].clientY;
});
container.addEventListener("touchend", (e) => {
  const delta = startY - e.changedTouches[0].clientY;
  if (delta > 20) step(1);
  if (delta < -20) step(-1);
});
