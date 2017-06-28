document.onready = function(e) {
	let fnResize = function () {
	    let clientWidth = document.documentElement.clientWidth;
	    document.querySelector("html").style.fontSize = clientWidth < 600 ?
	    	clientWidth / 360 * 312.5 + "%" : '300%';
	}
	fnResize();

	window.onresize = fnResize;
}
