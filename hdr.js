let Header = `<div id="usi_header">
 <a href="https://www.uni-siegen.de"><img src="unis.svg" width="250" style="z-index:9; position:relative; top:30px"></img></a>
 <a href="https://ubicomp.eti.uni-siegen.de"><img src="logo.svg" width="250" style="z-index:1; position:absolute; top:47px; right:10px;"></img></a>
 </div>`;

document.getElementById("hdr").innerHTML = Header;

function draw_header(redraw) {
  var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName("body")[0],
    x_size = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y_size = win.innerHeight || docElem.clientHeight || body.clientHeight;
  if (!redraw) {
    var hdr = doc.getElementById('usi_header');
    var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("z-index", 5);
    svg.setAttribute("width", x_size);
    svg.setAttribute("height", 125);
    svg.setAttribute("style", "position:absolute;left:0px");
    var x = [0, 240, 300, 0],
      w = 245, rightW = 257,
      c = [ "#0d3f00", "#0d4f30", "#0e5f50", "#0e6f60", "#0e7f70", "#0f8f80", "#0f9f90", "#0faea0", "#0fbfb0",  "#0fcec0", "#0fdfd0", "#ffffff" ],
      maxP = c.length;
    for (p = 0; p < maxP; p++) {
      var poly = doc.createElementNS("http://www.w3.org/2000/svg","polygon");
      poly.setAttribute("fill", c[p]);
      poly.setAttribute("points", x[0] + ",0 " + x[1] + ",0 " + x[2] + ",125 " + x[3] + ",125" );
      if (p == 0) x[3] = 60;
      for (i = 0; i < 4; i++) x[i] += w;
      if (p==maxP-2) { x[1] = x[2] = x_size;}
      if (p==0) { w = Math.floor( (x_size - rightW - 300) / (maxP-2) ); x[1] = x[0]+w; x[2]=x[3]+w;}
      svg.appendChild(poly);
    }
    hdr.appendChild(svg);
  }
}
draw_header(false);