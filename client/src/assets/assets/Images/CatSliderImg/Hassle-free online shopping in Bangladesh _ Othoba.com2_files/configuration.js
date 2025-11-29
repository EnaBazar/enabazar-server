function ReveChatWidget(a) {
	
	$_REVECHAT_API.account_id = a;
    function b() {
        $_REVECHAT_API.account_id = a
    }
	
	var CHAT_WIDGET_VERSION = 2;
	
	
	if($_REVECHAT_API.account_id === "28495")
	{
	   CHAT_WIDGET_VERSION = 2;
	}
	
	if($_REVECHAT_API.account_id === "28286")
	{
		CHAT_WIDGET_VERSION = 1;
	}		

	
	 function addEmbededStyleSheet()
    {
       var stylesheet = '@media only screen and (max-device-width:667px),screen and (max-width:450px){@media (max-width:667px){#reve-chat-container-div{min-width:82px;right:0!important;max-height:inherit;border-radius:0!important}.reve-chat-container-div{top:0!important}}} body.revechat-no-scroll{position: fixed; overflow: hidden; text-size-adjust: 100%; width: 100%; min-height: 100%; margin: 0px;}';
       
        var cssTag = document.createElement("style");
        cssTag.type = "text/css";
        cssTag.innerHTML = stylesheet;
        document.body.appendChild(cssTag); 
    }

    function c() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|WPDesktop|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }

    function d() {
        var a = "10px",
            b = "0px",
            d = document.createElement("div");
        return c() && (a = "12px"), d.id = "reve-chat-container-div", d.style.bottom = b, d.style.right = a, d.style.position = "fixed", d.style.zIndex = 2147483647, d.style.border = "0px none", d.style.overflow = "hidden", d.style.marginTop = "0px", d.style.marginBottom = "0px", d.style.marginRight = "0px", d.style.padding = "0px", d.style.width = "400px", d.style.height = "39px", c() && (l = !0, k = document.querySelector("meta[name=viewport]") ? !0 : !1, k ? console.log("view port exists ! following the general responsive rules") : d.style.marginBottom = "10px"), d
    }

    function e() {
        var a = document.createElement("iframe");
        return a.id = "reve-chat-widget-holder", a.frameBorder = "0", a.src = "about:blank", a.name = "reve-chat-widget-holder", a.style.zIndex = 2147483647, a.style.margin = "0px", a.style.overflow = "hidden", a.style.position = "relative", a.style.verticalAlign = "text-bottom", a.style.width = "100%", a.style.height = "100%", a
    }

    function f() {
		
		
		
        var a = d(),
            b = e();
			
			
		if(CHAT_WIDGET_VERSION ==2)	
		{ 
	        addEmbededStyleSheet();	
	    }
       	
			
        a.appendChild(b), b.addEventListener ? b.addEventListener("load", g, !0) : b.attachEvent("onload", g), document.body ? document.body.insertBefore(a, document.body.firstChild) : setTimeout(function c() {
            document.body ? document.body.insertBefore(a, document.body.firstChild) : setTimeout(c, 100)
        }, 100)
    }

    function g() {
        b(), 0 == n && (i(m, $_REVECHAT_API.writeIframeContent), n = !0)
    }

    function h() {
        for (var a = !1, b = 0; b < o.length; b++) {
            try {
                a = o[b]()
            } catch (c) {
                continue
            }
            break
        }
        return a
    }

    function i(a, b) {
        if (window.XDomainRequest) {
            var c = new XDomainRequest;
            c && (c.onload = function() {
                b(c.responseText)
            }, c.open("get", a, !0), c.send())
        } else {
            var c = h();
            c.onreadystatechange = function() {
                4 == c.readyState && 200 == c.status && b(c.responseText)
            }, c.open("GET", a), c.send()
        }
    }

    function j(a) {
        var b = document.getElementById("reve-chat-widget-holder"),
            c = b.contentDocument;
        null != c && (c.open(), $_REVECHAT_API.IS_IFRAME_CONTENT_READY= true, c.write(a), c.close())
    }
    var k, l, m = "https://static.revechat.com/widget/d/html/client_version_2.html?" + new Date().getTime();
	
	    if(CHAT_WIDGET_VERSION == 2)
		{ 
	      m = "https://static.revechat.com/widget/d/html/client_version_2.html?" + new Date().getTime();
        } 

        if(CHAT_WIDGET_VERSION == 1)
		{ 
	      m = "https://static.revechat.com/widget/d/html/client.html?" + new Date().getTime();
        } 			
	   
        n = !1,
        o = [function() {
            return new XMLHttpRequest
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function() {
            return new ActiveXObject("Msxml3.XMLHTTP")
        }, function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }];
    $_REVECHAT_API.writeIframeContent = j, f()
}
$_REVECHAT_API = window.$_REVECHAT_API || {}, "object" != typeof JSON && (JSON = {}),
    function() {
        "use strict";

        function f(a) {
            return 10 > a ? "0" + a : a
        }

        function quote(a) {
            return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
                var b = meta[a];
                return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + a + '"'
        }

        function str(a, b) {
            var c, d, e, f, g, h = gap,
                i = b[a];
            switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
                case "string":
                    return quote(i);
                case "number":
                    return isFinite(i) ? String(i) : "null";
                case "boolean":
                case "null":
                    return String(i);
                case "object":
                    if (!i) return "null";
                    if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                        for (f = i.length, c = 0; f > c; c += 1) g[c] = str(c, i) || "null";
                        return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e
                    }
                    if (rep && "object" == typeof rep)
                        for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                    else
                        for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                    return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        });
        var cx, escapable, gap, indent, meta, rep;
        "function" != typeof JSON.stringify && (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, JSON.stringify = function(a, b, c) {
            var d;
            if (gap = "", indent = "", "number" == typeof c)
                for (d = 0; c > d; d += 1) indent += " ";
            else "string" == typeof c && (indent = c);
            if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
            return str("", {
                "": a
            })
        }), "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function(text, reviver) {
            function walk(a, b) {
                var c, d, e = a[b];
                if (e && "object" == typeof e)
                    for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]);
                return reviver.call(a, b, e)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(), (reve_chat_ie_fallback = function() {
        var a = !0;
        window.objectSize = function(a) {
            var b, c = 0;
            for (b in a) a.hasOwnProperty(b) && c++;
            return c
        }, "function" != typeof String.prototype.trim && (String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "")
        }), Array.prototype.forEach || (Array.prototype.forEach = function(a) {
            "use strict";
            if (void 0 === this || null === this) throw new TypeError;
            var b = Object(this),
                c = b.length >>> 0;
            if ("function" != typeof a) throw new TypeError;
            for (var d = arguments[1], e = 0; c > e; e++) e in b && a.call(d, b[e], e, b)
        }), ("undefined" == typeof console || "undefined" == typeof console.log) && (console = {}, console.log = a ? function() {} : function() {}), "function" != typeof Object.create && (Object.create = function(a) {
            function b() {}
            return b.prototype = a, new b
        }), Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
            for (var c = b || 0, d = this.length; d > c; c++)
                if (this[c] === a) return c;
            return -1
        }), window.isIE = function() {
            var a = navigator.userAgent.toLowerCase();
            return -1 != a.indexOf("msie") ? parseInt(a.split("msie")[1]) : !1
        }
    })();