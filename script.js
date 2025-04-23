const items = ["Start Game", "Options", "High Scores", "Credits", "Exit"];
const list = document.querySelector(".menu-list");
const up = document.querySelector(".arrow-up");
const down = document.querySelector(".arrow-down");
let idx = 0,
  anim = false,
  upInt,
  downInt;
const slots = Array.from({ length: 3 }, () => {
  const d = document.createElement("div");
  d.className = "menu-item";
  list.append(d);
  return d;
});
function fill() {
  slots[0].textContent = items[(idx - 1 + items.length) % items.length];
  slots[1].textContent = items[idx];
  slots[2].textContent = items[(idx + 1) % items.length];
  slots.forEach((e, i) => e.classList.toggle("active", i === 1));
}
fill();
const H = slots[0].offsetHeight;
list.style.transform = `translateY(0px)`;
function step(d) {
  if (anim) return;
  anim = true;
  const tgt = d > 0 ? -H : H;
  list.style.transition = "transform .4s ease-out";
  list.style.transform = `translateY(${tgt}px)`;
  list.addEventListener(
    "transitionend",
    function h() {
      list.removeEventListener("transitionend", h);
      idx = (idx + d + items.length) % items.length;
      fill();
      list.style.transition = "none";
      list.style.transform = "translateY(0px)";
      anim = false;
    },
    { once: true }
  );
}
const delay = 600;
const hoverOK = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
if (hoverOK) {
  up.addEventListener(
    "pointerenter",
    () => (upInt = setInterval(() => step(-1), delay))
  );
  up.addEventListener("pointerleave", () => clearInterval(upInt));
  down.addEventListener(
    "pointerenter",
    () => (downInt = setInterval(() => step(1), delay))
  );
  down.addEventListener("pointerleave", () => clearInterval(downInt));
} else {
  up.addEventListener(
    "pointerdown",
    () => (upInt = setInterval(() => step(-1), delay))
  );
  up.addEventListener("pointerup", () => clearInterval(upInt));
  up.addEventListener("pointercancel", () => clearInterval(upInt));
  down.addEventListener(
    "pointerdown",
    () => (downInt = setInterval(() => step(1), delay))
  );
  down.addEventListener("pointerup", () => clearInterval(downInt));
  down.addEventListener("pointercancel", () => clearInterval(downInt));
}
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") step(-1);
  if (e.key === "ArrowDown") step(1);
});
document.querySelector(".menu-container").addEventListener("wheel", (e) => {
  e.preventDefault();
  step(e.deltaY > 0 ? 1 : -1);
});
let y0 = null;
const cnt = document.querySelector(".menu-container");
cnt.addEventListener("touchstart", (e) => (y0 = e.changedTouches[0].clientY));
cnt.addEventListener("touchend", (e) => {
  const d = y0 - e.changedTouches[0].clientY;
  if (d > 20) step(1);
  if (d < -20) step(-1);
});
