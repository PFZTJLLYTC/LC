function $(a) {
    return document.getElementById(a)
};

function attachevent(a, b, c) {
    b = b.toLowerCase();
    a.attachEvent ? a.attachEvent('on' + b, c) : a.addEventListener(b, c, false)
};

function nextSibling(a) {
    var n = a.nextSibling;
    return n && n.nodeType != 1 ? arguments.callee(n) : n
};

function preSibling(a) {
    var n = a.previousSibling;
    return n && n.nodeType != 1 ? arguments.callee(n) : n
};

function trim(s) {
    return s.replace(/^\s*/, '').replace(/\s*$/, '')
};

function get(a) {
    return encodeURI(trim(typeof a == 'object' ? a.value : $(a).value))
};

function addCookie(a, b) {
    var c = new Date();
    c.setFullYear(c.getFullYear() + 1);
    document.cookie = a + '=' + encodeURIComponent(b) + '; path=/; max-age=' + (31536000) + '; expires=' + c.toGMTString()
};

function getCookie(a) {
    var b = new RegExp('(^|;) ?' + a + '=([^;]+)(;|$)');
    var c = b.exec(document.cookie);
    return c == null ? false : decodeURIComponent(c[2])
};

function delCookie(a) {
    var b = new Date();
    b.setFullYear(b.getFullYear() - 1);
    document.cookie = a + '= ; path=/; max-age=0; expires=' + b.toGMTString()
};
ajax = {
    createXMLHttpRequest: function () {
        return window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject('Microsoft.XMLHTTP')
    }, startRequest: function (a) {
        var b = ajax.createXMLHttpRequest();
        b.onreadystatechange = function () {
            if (b.readyState == 4) {
                if (b.status == 200 && a.doRequest) {
                    a.doRequest(b.responseXML)
                }
            }
        };
        b.open(a.method || 'get', a.url, true);
        b.setRequestHeader('Content-type', a.enctype || 'application/x-www-form-urlencoded');
        b.setRequestHeader('If-Modified-Since', '0');
        b.setRequestHeader('Cache-Control', 'no-cache');
        b.send(a.action || null)
    }
};
base64 = {
    map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    decode: function (a) {
        var b = binary = '';
        for (var i = 0; i < a.length; i++) {
            if (a[i] == '=') {
                break
            };
            var c = this.map.indexOf(a[i]).toString(2);
            binary += {
                1: '00000',
                2: '0000',
                3: '000',
                4: '00',
                5: '0',
                6: ''
            }[c.length] + c
        };
        binary = binary.match(/[0-1]{8}/g);
        for (var i = 0; i < binary.length; i++) {
            b += String.fromCharCode(parseInt(binary[i], 2))
        };
        return b
    }
};

function tab(a, c, d) {
    function show(t, b) {
        for (var i = 0; e[i]; i++) {
            e[i].className = e[i] == t ? 'current' : ''
        };
        for (var i = 0; c[i]; i++) {
            c[i].style.display = c[i] == b ? 'block' : 'none'
        }
    };
    var e = a.getElementsByTagName('div');
    for (var i = 0; e[i]; i++) {
        if (i == 0) {
            e[i].className = 'current';
            if (d && (typeof d[i] == 'function')) {
                d[i]()
            }
        };
        e[i].onclick = (function (i) {
            return function () {
                show(this, c[i]);
                if (c[i].childNodes.length == 0 && d && typeof d[i] == 'function') {
                    d[i]()
                }
            }
        })(i)
    }
};

function searchbook() {
    if (!$('keyword')) {
        return false
    };
    $('search_b').onclick = function () {
        if ($('keyword').value == '') {
            message.flash('请输入搜索内容...');
            $('keyword').focus();
            return false
        }
    }
};

function clickStat() {
    var a = location.pathname;
    ajax.startRequest({
        url: '/command/clickstat.php?href=' + decodeURIComponent(a)
    })
};
list = {
    init: function (a) {
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.className = 'mask';
            document.body.appendChild(this.mask);
            this.mask.show = function () {
                list.mask.style.display = 'block';
                list.mask.style.left = Math.floor((document.documentElement.clientWidth - list.mask.offsetWidth) / 2 + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)) + 'px';
                list.mask.style.top = Math.floor((document.documentElement.clientHeight - list.mask.offsetHeight) / 2 + Math.max(document.documentElement.scrollTop, document.body.scrollTop)) + 'px'
            };
            this.mask.Hidden = function () {
                list.mask.style.display = 'none'
            }
        };
        var b = new this.List();
        b.create = a.create;
        b.url = a.url + '?';
        for (var c in a.att) {
            b.url += c + '=' + encodeURI(a.att[c]) + '&'
        };
        var d = document.createElement('dl');
        b.box = document.createElement('dd');
        d.appendChild(b.box);
        a.box.appendChild(d);
        b.init();
        return b
    }, List: function () {
        this.page = 1;
        this.queue = [];
        this.load = function (c) {
            if (this.totalPage < c.page) {
                return false
            };
            if (!c.pre) {
                list.mask.show()
            };
            var d = this;
            ajax.startRequest({
                url: this.url + (c.stat ? 'stat=true&' : '') + 'page=' + c.page,
                doRequest: function (a) {
                    if (c.stat) {
                        var b = a.getElementsByTagName('stat');
                        if (b[0]) {
                            d.totalPage = b[0].getAttribute('page') - 0;
                            d.total = b[0].getAttribute('total') - 0;
                            d.number = b[0].getAttribute('number') - 0;
                            d.url += '&total=' + d.total + '&'
                        }
                    };
                    d.queue[c.page] = d.create(a);
                    d.box.appendChild(d.queue[c.page]);
                    if (!c.pre) {
                        list.mask.Hidden();
                        d.nav(c.stat);
                        d.queue[d.page].style.display = 'block';
                        if (!d.queue[d.page + 1]) {
                            d.load({
                                page: d.page + 1,
                                pre: true
                            })
                        }
                    }
                }
            })
        };
        this.init = function () {
            this.load({
                stat: true,
                page: this.page
            })
        };
        this.nav = function (b) {
            if (this.totalPage < 2) {
                return false
            };
            if (b) {
                var c = document.createElement('dd');
                this.next = document.createElement('span');
                this.pre = document.createElement('span');
                var d = document.createElement('span');
                this.next.appendChild(document.createTextNode('下一页'));
                this.pre.appendChild(document.createTextNode('上一页'));
                c.className = 'page';
                this.select = document.createElement('select');
                for (var i = 1; i <= this.totalPage; i++) {
                    var e = document.createElement('option');
                    e.appendChild(document.createTextNode('第' + i + '页'));
                    e.value = i;
                    if (i == this.page) {
                        e.selected = true
                    };
                    this.select.appendChild(e)
                };
                this.select.onchange = (function (a) {
                    return function () {
                        if (this.options[this.selectedIndex].value !== a.page) {
                            a.show(this.options[this.selectedIndex].value - 0)
                        }
                    }
                })(this);
                d.appendChild(this.select);
                c.appendChild(this.pre);
                c.appendChild(d);
                c.appendChild(this.next);
                this.box.parentNode.appendChild(c)
            };
            if (this.page == 1) {
                this.pre.className = 'null';
                this.pre.onclick = null
            } else {
                this.pre.className = '';
                this.pre.onclick = (function (a) {
                    return function () {
                        a.show(a.page - 1)
                    }
                })(this)
            }; if (this.page == this.totalPage) {
                this.next.className = 'null';
                this.next.onclick = null
            } else {
                this.next.className = '';
                this.next.onclick = (function (a) {
                    return function () {
                        a.show(a.page + 1)
                    }
                })(this)
            }; if (!b) {
                this.select.options[this.select.selectedIndex].selected = false;
                this.select.options[this.page - 1].selected = true
            }
        };
        this.show = function (a) {
            window.scroll(0, 0);
            this.queue[this.page].style.display = 'none';
            this.page = a;
            if (this.queue[this.page]) {
                this.queue[this.page].style.display = 'block';
                this.nav();
                if (!this.queue[a + 1]) {
                    this.load({
                        page: a + 1,
                        pre: true
                    })
                };
                return false
            }
            this.box.className = 'loading';
            this.load({
                page: a
            })
        }
    }
};
dir = {
    page: 0,
    queue: [],
    init: function () {
        var a = $('dir').getElementsByTagName('dl');
        var b = $('dir').getElementsByTagName('span');
        var c = $('dir').getElementsByTagName('select');
        for (var i = 0; i < a.length; i++) {
            if (a[i].className == 'dir') {
                if (this.page == 0 && a[i].querySelector('.current')) {
                    this.page = i - 1
                };
                this.queue.push(a[i])
            }
        };
        this.queue[this.page].style.display = 'block';
        if (b.length != 3 || c.length != 1) {
            return false
        };
        this.pre = b[0];
        this.next = b[2];
        this.select = c[0];
        this.pre.onclick = function () {
            if (dir.page == 0) {
                return false
            };
            dir.show(dir.page - 1)
        };
        this.next.onclick = function () {
            if (dir.page == dir.queue.length - 1) {
                return false
            };
            dir.show(dir.page + 1)
        };
        this.select.onchange = function () {
            if (this.options[this.selectedIndex].value !== dir.page) {
                dir.show(this.options[this.selectedIndex].value - 1)
            }
        };
        this.nav()
    }, nav: function () {
        this.pre.className = this.next.className = '';
        if (this.page == 0) {
            this.pre.className = 'null'
        } else if (this.page == this.queue.length - 1) {
            this.next.className = 'null'
        };
        this.select.options[this.select.selectedIndex].selected = false;
        this.select.options[this.page].selected = true
    }, show: function (a) {
        this.queue[this.page].style.display = 'none';
        this.page = a;
        if (this.queue[this.page]) {
            this.queue[this.page].style.display = 'block';
            this.nav();
            return false
        }
    }
};
message = {
    box: null,
    init: function () {
        if (this.box) {
            return
        };
        var a = document.createElement('div');
        a.id = 'message';
        document.body.appendChild(a);
        this.box = a
    }, show: function (a) {
        this.init();
        this.write(a);
        this.box.style.display = 'block';
        this.box.style.left = Math.floor((document.documentElement.clientWidth - this.box.offsetWidth) / 2 + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)) + 'px';
        this.box.style.top = Math.floor((document.documentElement.clientHeight - this.box.offsetHeight) / 3 + Math.max(document.documentElement.scrollTop, document.body.scrollTop)) + 'px'
    }, hidden: function () {
        message.box.style.display = 'none'
    }, flash: function (a) {
        this.show(a);
        setTimeout(function () {
            message.hidden()
        }, 1000)
    }, write: function (a) {
        this.box.innerHTML = a
    }
};

function emailCheck(a) {
    if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(a)) {
        return true
    };
    return false
};

function createLoginWin() {

};

function attLoginWin() {

};

function attLogout() {

};

function checkLogin() {

};

function loginAction(d) {

};

function favorite(c, d, e) {

};

function relead() {
    if (getCookie('state') != 'true') {
        if (!$('login_win')) {
            createLoginWin()
        };
        $('login_win').style.display = 'block';
        return false
    };
    return true
};

function findFather(e, a) {
    while (e) {
        if (e.className == a) {
            return true
        };
        e = e.parentNode
    };
    return false
};

function c_message(i, s, m) {
    if (i) {
        i.style.backgroundPosition = 'right ' + (s == false ? '-74px' : '-47px');
        i.setAttribute('status', s)
    };
    if (m && !s) {
        message.flash(m)
    }
};

function setPositionNull(i) {
    i.style.backgroundPosition = '0 90px'
};
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F6c92d20e0050c4df80279c45ef02c962' type='text/javascript'%3E%3C/script%3E"));
