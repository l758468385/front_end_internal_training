document.addEventListener("DOMContentLoaded", () => {
  var map = new AMap.Map('map-container', {
    viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
    zoom: 18, // 初始化地图层级
    center: [119.241215,26.052994] // 初始化地图中心点
  });
  var markerContent = '' +
        '<div class="custom-content-marker">' +
        '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">' +
        '</div>';

    var marker = new AMap.Marker({
        position: [119.241215,26.052994],
        // 将 html 传给 content
        content: markerContent,
        // 以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-13, -30)
    });
  marker.setMap(map);
  console.log('map',map);
})