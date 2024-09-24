if (window.location.href.includes("uni-siegen.de")) pdfLoc = "pdf/";
else pdfLoc = "https://ubi29.informatik.uni-siegen.de/usi/pdf/";

function BibtexParser() {
	(this.pos = 0),
		(this.input = ""),
		(this.entries = {}),
		(this.strings = {
			JAN: "January",
			FEB: "February",
			MAR: "March",
			APR: "April",
			MAY: "May",
			JUN: "June",
			JUL: "July",
			AUG: "August",
			SEP: "September",
			OCT: "October",
			NOV: "November",
			DEC: "December",
		}),
		(this.currentKey = ""),
		(this.currentEntry = ""),
		(this.setInput = function (a) {
			this.input = a;
		}),
		(this.getEntries = function () {
			return this.entries;
		}),
		(this.isWhitespace = function (a) {
			return " " == a || "\r" == a || "\t" == a || "\n" == a;
		}),
		(this.match = function (a) {
			if (
				(this.skipWhitespace(),
				this.input.substring(this.pos, this.pos + a.length) != a)
			)
				throw (
					"Token mismatch, expected " +
					a +
					", found " +
					this.input.substring(this.pos)
				);
			(this.pos += a.length), this.skipWhitespace();
		}),
		(this.tryMatch = function (a) {
			return (
				this.skipWhitespace(),
				this.input.substring(this.pos, this.pos + a.length) == a
			);
		}),
		(this.skipWhitespace = function () {
			for (; this.isWhitespace(this.input[this.pos]); ) this.pos++;
			if ("%" == this.input[this.pos]) {
				for (; "\n" != this.input[this.pos]; ) this.pos++;
				this.skipWhitespace();
			}
		}),
		(this.value_braces = function () {
			var a = 0;
			this.match("{");
			for (var b = this.pos; ; ) {
				if ("}" == this.input[this.pos] && "\\" != this.input[this.pos - 1]) {
					if (!(a > 0)) {
						var c = this.pos;
						return this.match("}"), this.input.substring(b, c);
					}
					a--;
				} else if ("{" == this.input[this.pos]) a++;
				else if (this.pos == this.input.length - 1) throw "Unterminated value";
				this.pos++;
			}
		}),
		(this.value_quotes = function () {
			this.match('"');
			for (var a = this.pos; ; ) {
				if ('"' == this.input[this.pos] && "\\" != this.input[this.pos - 1]) {
					var b = this.pos;
					return this.match('"'), this.input.substring(a, b);
				}
				if (this.pos == this.input.length - 1)
					throw "Unterminated value:" + this.input.substring(a);
				this.pos++;
			}
		}),
		(this.single_value = function () {
			var a = this.pos;
			if (this.tryMatch("{")) return this.value_braces();
			if (this.tryMatch('"')) return this.value_quotes();
			var b = this.key();
			if (this.strings[b.toUpperCase()]) return this.strings[b];
			if (b.match("^[0-9]+$")) return b;
			throw "Value expected:" + this.input.substring(a);
		}),
		(this.value = function () {
			var a = [];
			for (a.push(this.single_value()); this.tryMatch("#"); )
				this.match("#"), a.push(this.single_value());
			return a.join("");
		}),
		(this.key = function () {
			for (var a = this.pos; ; ) {
				if (this.pos == this.input.length) throw "Runaway key";
				if (!this.input[this.pos].match("[a-zA-Z0-9_:\\./-]"))
					return this.input.substring(a, this.pos).toUpperCase();
				this.pos++;
			}
		}),
		(this.key_equals_value = function () {
			var a = this.key();
			if (this.tryMatch("=")) {
				this.match("=");
				var b = this.value();
				return [a, b];
			}
			throw (
				"... = value expected, equals sign missing:" +
				this.input.substring(this.pos)
			);
		}),
		(this.key_value_list = function () {
			var a = this.key_equals_value();
			for (
				this.entries[this.currentEntry][a[0]] = a[1];
				this.tryMatch(",") && (this.match(","), !this.tryMatch("}"));

			)
				(a = this.key_equals_value()),
					(this.entries[this.currentEntry][a[0]] = a[1]);
		}),
		(this.entry_body = function () {
			(this.currentEntry = this.key()),
				(this.entries[this.currentEntry] = new Object()),
				this.match(","),
				this.key_value_list(),
				(this.entries[this.currentEntry].EKEY = this.currentEntry),
				"Y" != this.currentEntry.charAt(0) &&
					((this.entries[this.currentEntry].PDF =
						pdfLoc + this.currentEntry.toLowerCase() + ".pdf"),
					(this.entries[this.currentEntry].SCHOLAR =
						'http://scholar.google.com/scholar?as_q="' +
						this.entries[this.currentEntry].TITLE +
						'"')),
				void 0 != this.entries[this.currentEntry].DOI &&
					((this.entries[this.currentEntry].URL =
						"http://dx.doi.org/" + this.entries[this.currentEntry].DOI),
					(this.entries[this.currentEntry].BIBTEX =
						"http://api.crossref.org/works/" +
						this.entries[this.currentEntry].DOI +
						"/transform/application/x-bibtex"));
		}),
		(this.directive = function () {
			return this.match("@"), "@" + this.key();
		}),
		(this.string = function () {
			var a = this.key_equals_value();
			this.strings[a[0].toUpperCase()] = a[1];
		}),
		(this.preamble = function () {
			this.value();
		}),
		(this.comment = function () {
			this.value();
		}),
		(this.entry = function () {
			this.entry_body();
		}),
		(this.bibtex = function () {
			for (; this.tryMatch("@"); ) {
				var a = this.directive().toUpperCase();
				this.match("{"),
					"@STRING" == a
						? this.string()
						: "@PREAMBLE" == a
							? this.preamble()
							: "@COMMENT" == a
								? this.comment()
								: this.entry(),
					this.match("}");
			}
		});
}

function BibtexDisplay() {
	(this.fixValue = function (a) {
		return (
			(a = a.replace(/\\glqq\s?/g, "&bdquo;")),
			(a = a.replace(/\\grqq\s?/g, "&rdquo;")),
			(a = a.replace(/\\ /g, "&nbsp;")),
			(a = a.replace(/\\url/g, "")),
			(a = a.replace(/---/g, "&mdash;")),
			(a = a.replace(/{\a}/g, "&auml;")),
			(a = a.replace(/\\"o/g, "&ouml;")),
			(a = a.replace(/{\\"u}/g, "&uuml;")),
			(a = a.replace(/{\\"A}/g, "&Auml;")),
			(a = a.replace(/{\\"O}/g, "&Ouml;")),
			(a = a.replace(/{\\"U}/g, "&Uuml;")),
			(a = a.replace(/\\ss/g, "&szlig;")),
			(a = a.replace(/\{(.*?)\}/g, "$1"))
		);
	}),
		(this.displayBibtex2 = function (a, b) {
			var c = new BibtexParser();
			c.setInput(a), c.bibtex();
			var d = c.getEntries(),
				e = b.find("*");
			for (var f in d) {
				var g = $(".bibtex_template").clone().removeClass("bibtex_template");
				g.addClass("unused");
				for (var h in d[f])
					for (
						var i = g.find("." + h.toLowerCase()), a = 0;
						a < i.size();
						a++
					) {
						var j = $(i[a]);
						j.removeClass("unused");
						var k = this.fixValue(d[f][h]);
						if (j.is("a")) j.attr("href", k);
						else {
							var l = j.html() || "";
							l.match("%") ? j.html(l.replace("%", k)) : j.html(k);
						}
					}
				var m = g.find("span .unused");
				m.each(function (a, b) {
					b.innerHTML.match("%") && (b.innerHTML = "");
				}),
					b.append(g),
					g.show();
			}
			e.remove();
		}),
		(this.displayBibtex = function (a, b) {
			var c = new BibtexParser();
			c.setInput(a), c.bibtex();
			var d = b.find("*"),
				e = c.getEntries();
			for (var f in e) {
				var g = e[f],
					h = $(".bibtex_template").clone().removeClass("bibtex_template"),
					i = [];
				for (var j in g) i.push(j.toUpperCase());
				for (;;) {
					var l = h.find(".if");
					if (0 == l.size()) break;
					var m = l.first();
					m.removeClass("if");
					var n = !0,
						o = m.attr("class").split(" ");
					$.each(o, function (a, b) {
						i.indexOf(b.toUpperCase()) < 0 && (n = !1), m.removeClass(b);
					}),
						n || m.remove();
				}
				for (var p in i) {
					var j = i[p],
						q = g[j] || "";
					h.find("span:not(a)." + j.toLowerCase()).html(this.fixValue(q)),
						h.find("a." + j.toLowerCase()).attr("href", this.fixValue(q));
				}
				b.append(h), h.show();
			}
			d.remove();
		});
}

function bibtex_js_draw() {
	$(".bibtex_template").hide(),
		new BibtexDisplay().displayBibtex(
			$("#bibtex_input").val(),
			$("#bibtex_display"),
		);
}

"undefined" == typeof jQuery
	? alert("Please include jquery in all pages using bibtex_js!")
	: $(document).ready(function () {
			0 == $(".bibtex_template").size() &&
				$("body").append(
					'<div class="bibtex_template"><p class="bib_entry"><span class="if url"><a class="url"></span><span class="title"></span><span class="if url">, </a></span><span class="if author"><span class="author"></span>.</span> <span class="if journal"><span class="if journalurl"><a class="journalurl" style="color:black;"></span><span class="journal" style="font-style: italic;"></span><span class="if journalurl"></a>, </span></span> <span class="if booktitle">In <span class="if bookurl"><a class="bookurl" style="color:black;"></span><span class="booktitle" style="font-style: italic;"></span><span class="if bookurl"></a>, </span></span> <span class="if volume"><span class="volume"></span><span class="if number">(<span class="number"></span>)</span><span class="if pages">: <span class="pages"></span></span>,</span> <span class="if chapter">chap. <span class="chapter"></span><span class="if pages">, <span class="pages"></span></span>,</span> <span class="if publisher"><span class="publisher"></span>,</span> <span class="if edition"><span class="edition"></span> edn.,</span> <span class="if year"><span class="if month"><span class="month"></span>,</span><span class="year"></span>.</span><span class="if abstract">[<a class="abs">abstract<span class="ttip"><span class="abstract"></span></span></a>]</span><span class="if fulltexturl">[<b><a class="fulltexturl" style="color:black;">PDF</a></b>]</span><span class="if pdf">[<b><a class="pdf" style="color:black;">pdf</a></b>]</span><span class="if scholar">[<a class="scholar" style="color:black;">scholar</a>]</span><span class="if bibtex">[<a class="bibtex" style="color:black;">bibtex</a>]</span><span class="if note">[<span class="note" style="color:blue;background-color:#ffffcc;padding:0;border:0;"></span>]</span><span class="if y">-<span class="y"></span>-</span></p></div>',
				),
				bibtex_js_draw();
		});
