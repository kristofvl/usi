let imgwidth = "250px",
	i1adj = "30px",
	i2adj = "47px",
	isMobile = false; // defaults for non-mobile
var doc = document,
	win = window;
var dwidth = doc.documentElement.clientWidth;
var dheight = doc.documentElement.clientHeight;
if (dwidth < 700 || dheight < 700) isMobile = true;
if (isMobile) {
	(imgwidth = "140px"), (i1adj = "-4px"), (i2adj = "7px"); // header tweaks for mobile users
}
let Header =
	`<div id="usi_header"><a href="https://www.uni-siegen.de"><img src="img/unis.svg" width="` +
	imgwidth +
	`" style="z-index:9; position:relative; top:` +
	i1adj +
	`"></img></a>
 <a href="index.html"><img src="img/logo.svg" width="` +
	imgwidth +
	`" style="z-index:1; position:absolute; top:` +
	i2adj +
	`; right:10px;"></img></a>
 </div>`;
let menuItems = [
	["team", "Team"],
	["teach", "Teaching"],
	["pubs", "Publications"],
	["res", "Research"],
	["data", "Datasets"],
	["vids", "Videos"],
	["cont", "Contact"],
];
doc.getElementById("hdr").innerHTML = Header;
var bar = doc.createElement("div");
bar.setAttribute("id", "bar");
let inhtml =
	`<div style="overflow:hidden;"><div id="left-right" onclick="menuClick()"><span class="ham-menu"></span>
 UbiComp &#x2192; ` +
	doc.currentScript.getAttribute("strng") +
	`</div></div></div><div id="menu">`;

const outsideMenuListener = (event) => {
	if (
		!(
			doc.getElementById("left-right").contains(event.target) ||
			doc.getElementById("menu").contains(event.target)
		)
	) {
		doc.getElementById("menu").style.height = "0px";
		removeMenuClickListener();
	}
};
const removeMenuClickListener = () => {
	doc.removeEventListener("click", outsideMenuListener);
};
function menuClick() {
	let s = doc.getElementById("menu").style;
	s.height = s.height === "0px" ? "320px" : "0px";
	if (s.height === "320px") doc.addEventListener("click", outsideMenuListener);
}

for (var i = 0; i < menuItems.length; i++)
	inhtml +=
		`<a href="` + menuItems[i][0] + `.html">` + menuItems[i][1] + `</a>`;
inhtml += `</div >`;
bar.innerHTML = inhtml;
doc
	.getElementById("hdr")
	.parentNode.insertBefore(bar, doc.getElementById("hdr").nextSibling);

function draw_header() {
	var x_size =
		win.innerWidth ||
		doc.documentElement.clientWidth ||
		doc.getElementsByTagName("body")[0].clientWidth;
	if (x_size > 1200) x_size = 1200;
	var hdr = doc.getElementById("usi_header");
	var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("z-index", 5);
	svg.setAttribute("width", x_size);
	svg.setAttribute("height", 125);
	svg.setAttribute("style", "position:absolute;left:0px");
	var x = [0, isMobile ? 130 : 240, isMobile ? 190 : 300, 0],
		w = isMobile ? 135 : 245,
		rightW = isMobile ? 147 : 257,
		c = [
			"#0d3f00",
			"#0d4f30",
			"#0e5f50",
			"#0e6f60",
			"#0e7f70",
			"#0f8f80",
			"#0f9f90",
			"#0faea0",
			"#0fbfb0",
			"#0fcec0",
			"#0fdfd0",
			"#ffffff",
		],
		maxP = c.length;
	for (p = 0; p < maxP; p++) {
		var poly = doc.createElementNS("http://www.w3.org/2000/svg", "polygon");
		poly.setAttribute("fill", c[p]);
		poly.setAttribute("id", "poly" + p);
		poly.setAttribute(
			"points",
			x[0] + ",0 " + x[1] + ",0 " + x[2] + ",125 " + x[3] + ",125",
		);
		if (p == 0) x[3] = 60;
		for (i = 0; i < 4; i++) x[i] += w;
		if (p == maxP - 2) {
			x[1] = x[2] = x_size;
		}
		if (p == 0) {
			w = Math.floor((x_size - rightW - (isMobile ? 157 : 300)) / (maxP - 2));
			x[1] = x[0] + w;
			x[2] = x[3] + w;
		}
		if (p > 0) poly.setAttribute("opacity", 1);
		svg.appendChild(poly);
		var poly = doc.createElementNS("http://www.w3.org/2000/svg", "polygon");
		poly.setAttribute("fill", "white");
		if (isMobile) poly.setAttribute("points", "130,0  135,0  195,125  190,125");
		else poly.setAttribute("points", "240,0  245,0  305,125  300,125");
		svg.appendChild(poly);
	}
	previousSVG = hdr.lastChild;
	if (previousSVG.tagName == "svg") previousSVG.remove();
	hdr.appendChild(svg);
	// redo scaling for mobile devices:
	if (isMobile) {
		doc.getElementById("usi_header").style.height = "47px";
		svg.setAttribute("height", "47px");
	} else {
		doc.getElementById("usi_header").style.height = "125px";
	}
}

var FadeInt;

function hdrFade() {
	FadeInt = setInterval(function () {
		if (doc.getElementById("poly11").style.fillOpacity != "1")
			for (p = 1; p < 12; p++)
				doc.getElementById("poly" + p).style.fillOpacity = "1";
		else {
			for (p = 1; p < 11; p++)
				doc.getElementById("poly" + p).style.fillOpacity = "0.7";
			doc.getElementById("poly11").style.fillOpacity = "0.77";
		}
	}, 6000);
}

draw_header();

// add title:
var title = doc.createElement("title");
title.innerHTML = "UbiComp, " + doc.currentScript.getAttribute("strng");
doc.getElementsByTagName("head")[0].appendChild(title);

// menu collapse fix:
doc.getElementById("menu").style.height = "0px";

// add footer:
doc.getElementById("usi_ftr").innerHTML = "made with the usi template by kvl";

setTimeout(function () {
	doc.getElementById("usi_header").style.top = "0px";
	doc.getElementById("usi_header").style.left = "0px";
	doc.getElementById("usi_header").style.opacity = "1";
}, 400);
setTimeout(function () {
	doc.getElementById("left-right").style.left = "0px";
	doc.getElementById("left-right").style.opacity = "1";
	for (p = 1; p < 11; p++)
		doc.getElementById("poly" + p).style.fillOpacity = "0.7";
	doc.getElementById("poly11").style.fillOpacity = "0.77";
}, 790);
hdrFade();
setTimeout(function () {
	var elems = doc.getElementsByClassName("lstEntry");
	for (i = 0; i < elems.length; i++) {
		elems[i].style.height = "170px";
		elems[i].style.opacity = "1";
	}
}, 100);

win.addEventListener(
	"resize",
	function (event) {
		draw_header(false);
		clearInterval(FadeInt);
		hdrFade();
	},
	true,
);
