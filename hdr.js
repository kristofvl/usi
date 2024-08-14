let Header = `<div id="usi_header"><a href="https://www.uni-siegen.de"><img src="unis.svg" width="250" style="z-index:9; position:relative; top:30px"></img></a>
 <a href="index.html"><img src="logo.svg" width="250" style="z-index:1; position:absolute; top:47px; right:10px;"></img></a>
 </div>`;

document.getElementById("hdr").innerHTML = Header;
var bar = document.createElement("div");
bar.setAttribute("id", "bar");
bar.innerHTML =
  `<div id="left-right"><a href="index.html"><span class="ham-menu"></span>
 UbiComp </a> &#x2192; ` +
  document.currentScript.getAttribute("strng") +
  `</div></div><div id="menu">
      <a href="#">Team</a>
      <a href="#">Teaching</a>
      <a href="pubs.html">Publications</a>
      <a href="#">Research</a>
      <a href="#">Datasets</a>
      <a href="#">Videos</a>
      <a href="#">Contact</a>
    </div>`;
document
  .getElementById("hdr")
  .parentNode.insertBefore(bar, document.getElementById("hdr").nextSibling);

function draw_header(redraw) {
  var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName("body")[0],
    x_size = win.innerWidth || docElem.clientWidth || body.clientWidth;
  if (x_size > 1200) x_size = 1200;
  if (!redraw) {
    var hdr = doc.getElementById("usi_header");
    var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("z-index", 5);
    svg.setAttribute("width", x_size);
    svg.setAttribute("height", 125);
    svg.setAttribute("style", "position:absolute;left:0px");
    var x = [0, 240, 300, 0],
      w = 245,
      rightW = 257,
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
        w = Math.floor((x_size - rightW - 300) / (maxP - 2));
        x[1] = x[0] + w;
        x[2] = x[3] + w;
      }
      if (p > 0) poly.setAttribute("opacity", 1);
      svg.appendChild(poly);
    }
    var poly = doc.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("fill", "white");
    poly.setAttribute("points", "240,0  245,0  305,125  300,125");
    svg.appendChild(poly);
    hdr.appendChild(svg);
  }
}
draw_header(false);
setTimeout(function () {
  document.getElementById("usi_header").style.top = "0px";
  document.getElementById("usi_header").style.left = "0px";
  document.getElementById("usi_header").style.opacity = "1";
  for (p = 1; p < 12; p++)
    document.getElementById("poly" + p).style.opacity = ".95";
}, 400);
setTimeout(function () {
  document.getElementById("left-right").style.left = "0px";
  document.getElementById("left-right").style.opacity = "1";
  for (p = 1; p < 12; p++)
    document.getElementById("poly" + p).style.opacity = ".8";
}, 700);
setTimeout(function () {
  for (p = 1; p < 12; p++)
    document.getElementById("poly" + p).style.opacity = ".7";
}, 999);
