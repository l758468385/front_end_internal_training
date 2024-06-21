document.addEventListener("DOMContentLoaded", () => {
    const map = new AMap.Map('map-container', {
    viewMode: '2D',
    zoom: 18,
    center: [119.241215,26.052994]
  });
  const markerContent = '' +
        '<div class="custom-content-marker">' +
        '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">' +
        '</div>';

    const marker = new AMap.Marker({
        position: [119.241215,26.052994],
        // 将 html 传给 content
        content: markerContent,
        // 以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-13, -30)
    });
  marker.setMap(map);
  console.log('map',map);
})