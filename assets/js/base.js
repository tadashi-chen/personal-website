//动态改变rem的比率
window.onresize = function () {
	console.log('resize');
    let clientWidth = document.documentElement.clientWidth;
    document.querySelector("html").style.fontSize = clientWidth < 600 ?
    	clientWidth / 360 * 312.5 + "%" : '300%';
}
window.onresize();

//等背景图片下载完成后，淡入显示
window.onload = function() {
	document.getElementById('main-bg').style.opacity = '1';
}