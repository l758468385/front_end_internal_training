document.addEventListener('DOMContentLoaded', function() {

  let top = -50; // 初始位置
  let arr = [];


  const show = document.getElementById('show');

  const txt = document.getElementById('txt');
  const sub = document.getElementById('sub');
  const clean = document.getElementById('clean');

  sub.addEventListener('click', function() {
    const value = txt.value.trim();
    if (value === '') return;
    sendBarrage(value);
    txt.value = '';
  });

  txt.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      sub.click();
    }
  });

  clean.addEventListener('click', function() {
    arr = [];
    show.innerHTML = '';
    top = -50;
  });

  function sendBarrage(content) {
    const barrage = document.createElement('div');

    barrage.className = 'barrage';
    barrage.textContent = content;
    barrage.style.fontSize = Math.floor(Math.random() * 20 + 12) + 'px';
    barrage.style.color = getRandomColor();
    barrage.style.top = top + 'px';
    barrage.style.left = '100%';

    show.appendChild(barrage);

    const duration = Math.random() * 10 + 5; // 随机持续时间
    const speed = (show.clientWidth + barrage.clientWidth) / duration;

    barrage.style.transition = `transform ${duration}s linear`;
    barrage.style.transform = `translateX(-${show.clientWidth + barrage.clientWidth}px)`;

    setTimeout(function() {
      barrage.remove();
    }, duration * 1000);

    top += 50; // 调整下一个Barrage的位置

    function getRandomColor() {
      return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }
  }

  function getAndShow() {
    if (arr.length > 0) {
      const index = Math.floor(Math.random() * arr.length);
      sendBarrage(arr[index]);
    }
    setTimeout(getAndShow, 2000);
  }

  getAndShow();
});
