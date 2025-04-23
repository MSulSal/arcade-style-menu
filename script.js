const menuItems = ["Start Game", "Options", "High Scores", "Credits", "Exit"];
const listEl = document.querySelector(".menu-list");
const upArrow = document.querySelector(".arrow-up");
const downArrow = document.querySelector(".arrow-down");
const ITEM_H = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue("--item-height")
);
let activeIndex = 0;
let isAnimating = false;

// create exactly three slots
const slots = Array.from({ length: 3 }).map(() => {
  let d = document.createElement("div");
  d.className = "menu-item";
  listEl.append(d);
  return d;
});

// fill slots: [above, active, below]
function fillSlots() {
  slots[0].textContent =
    menuItems[(activeIndex - 1 + menuItems.length) % menuItems.length];
  slots[1].textContent = menuItems[activeIndex];
  slots[2].textContent = menuItems[(activeIndex + 1) % menuItems.length];
  slots.forEach((el, i) => el.classList.toggle("active", i === 1));
}

// snap back to center without transition
function resetPosition() {
  listEl.style.transition = "none";
  listEl.style.transform = `translateY(${-ITEM_H}px)`;
  // force reflow to flush transition removal
  listEl.offsetHeight;
  listEl.style.transition = "";
}

// perform a step (+1 or -1)
function step(delta) {
  if (isAnimating) return;
  isAnimating = true;

  // animate list up or down by one slot
  listEl.style.transform = `translateY(${-(1 + delta)}rem)`;
  // after transition, update activeIndex, refill slots, reset position
  listEl.addEventListener(
    "transitionend",
    function handler() {
      listEl.removeEventListener("transitionend", handler);
      activeIndex = (activeIndex + delta + menuItems.length) % menuItems.length;
      fillSlots();
      resetPosition();
      isAnimating = false;
    },
    { once: true }
  );
}

// initial setup
listEl.style.transform = `translateY(${-ITEM_H}px)`;
listEl.style.transition = "";
fillSlots();

// nav handlers
upArrow.addEventListener("click", () => step(-1));
downArrow.addEventListener("click", () => step(+1));
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") step(-1);
  if (e.key === "ArrowDown") step(+1);
});
document.querySelector(".menu-container").addEventListener("wheel", (e) => {
  e.preventDefault();
  step(e.deltaY > 0 ? +1 : -1);
});
let touchStartY = null;
document
  .querySelector(".menu-container")
  .addEventListener("touchstart", (e) => {
    touchStartY = e.changedTouches[0].clientY;
  });
document.querySelector(".menu-container").addEventListener("touchend", (e) => {
  let delta = touchStartY - e.changedTouches[0].clientY;
  if (delta > 20) step(+1);
  else if (delta < -20) step(-1);
});
