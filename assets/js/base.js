let gvFnResize = function () {
    let clientWidth = document.documentElement.clientWidth;
    if (clientWidth < 980) {
    	document.querySelector("html").style.fontSize = clientWidth / 360 * 312.5 + "%";
    }
}
gvFnResize();

window.onresize = gvFnResize;