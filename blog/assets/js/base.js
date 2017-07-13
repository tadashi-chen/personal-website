window.onscroll = function() {
	if (document.documentElement.clientWidth < 600) return;

    var top = document.documentElement.scrollTop || document.body.scrollTop;
    var topDiv = document.getElementById("back_to_top");
    topDiv.style.display = top >= 100 ? "block" : "none";
}

//动态改变rem的比率
window.onresize = function () {
    let clientWidth = document.documentElement.clientWidth;
    document.querySelector("html").style.fontSize = clientWidth < 600 ?
    	clientWidth / 360 * 312.5 + "%" : '300%';
    
    var topDiv = document.getElementById("back_to_top");
    if (clientWidth < 600) {
    	topDiv.style.display = 'none';
    } else if (document.body.scrollTop >= 100) {
    	topDiv.style.display = 'block';
    }
}
window.onresize();

