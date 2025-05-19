document.addEventListener("DOMContentLoaded", function () {
  const countdownElement = document.getElementById("countdown");

  const eventDate = new Date("2025-07-20T10:00:00").getTime(); // التاريخ الصحيح
  const updateCountdown = () => {
    const now = new Date().getTime();
    const diff = eventDate - now;

    if (diff <= 0) {
      countdownElement.innerHTML = "لقد بدأ الحدث!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownElement.innerHTML =
      `يتبقى ${days} يوم و ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
});

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', () => {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});
