document.addEventListener('DOMContentLoaded', function () {
  const screen = document.getElementById('screen');
  const txt = document.getElementById('txt');
  const sub = document.getElementById('sub');
  const clean = document.getElementById('clean');

  sub.addEventListener('click', function () {
    const value = txt.value.trim();
    if (value === '') return;
    sendBarrage(value);
    txt.value = '';
  });

  txt.addEventListener('keypress', function (event) {
    event.keyCode === 13 && sub.click();
  });

  clean.addEventListener('click', function () {
    screen.innerHTML = '';
  });

  function sendBarrage(content) {
    const barrage = document.createElement('div');
    barrage.className = 'barrage';
    barrage.textContent = content;

    // 随机字体大小
    barrage.style.fontSize = Math.floor(Math.random() * 25 + 12) + 'px';

    // 随机颜色
    barrage.style.color = getRandomReadableColor();

    // 随机位置
    const maxHeight = screen.clientHeight - parseInt(barrage.style.fontSize);
    barrage.style.top = Math.floor(Math.random() * maxHeight) + 'px';
    barrage.style.left = '100%';

    screen.appendChild(barrage);

    // 随机持续时间
    const duration = Math.random() * 5 + 5;

    barrage.style.transition = `transform ${duration}s linear`;
    barrage.style.transform = `translateX(-${screen.clientWidth + barrage.clientWidth}px)`;

    setTimeout(function () {
      barrage.remove();
    }, duration * 1000);
  }

  function getRandomReadableColor() {
    // 生成对比度良好的随机颜色
    let color;
    do {
      color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    } while (!isReadableColor(color));
    return color;
  }

  function isReadableColor(color) {
    // 确保颜色对比度良好
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(1, 3), 16);
    const b = parseInt(color.slice(1, 3), 16);
    // 简单的亮度计算
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125; // 确保亮度足够
  }
});
