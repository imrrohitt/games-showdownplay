/*
 TweenJS
 Visit http://createjs.com/ for documentation, updates and examples.

 Copyright (c) 2010 gskinner.com, inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 screenfull
 v5.0.0 - 2019-09-09
 (c) Sindre Sorhus; MIT License
 Platform.js <https://mths.be/platform>
 Copyright 2014-2018 Benjamin Tan <https://bnjmnt4n.now.sh/>
 Copyright 2011-2013 John-David Dalton
 Available under MIT license <https://mths.be/mit>
*/
this.createjs = this.createjs || {};
createjs.extend = function(a, c) {
    function b() {
        this.constructor = a
    }
    b.prototype = c.prototype;
    return a.prototype = new b
};
this.createjs = this.createjs || {};
createjs.promote = function(a, c) {
    var b = a.prototype,
        d = Object.getPrototypeOf && Object.getPrototypeOf(b) || b.__proto__;
    if (d) {
        b[(c += "_") + "constructor"] = d.constructor;
        for (var g in d) b.hasOwnProperty(g) && "function" == typeof d[g] && (b[c + g] = d[g])
    }
    return a
};
this.createjs = this.createjs || {};
createjs.deprecate = function(a, c) {
    return function() {
        var b = "Deprecated property or method '" + c + "'. See docs for info.";
        console && (console.warn ? console.warn(b) : console.log(b));
        return a && a.apply(this, arguments)
    }
};
this.createjs = this.createjs || {};
(function() {
    function a(a, d, c) {
        this.type = a;
        this.currentTarget = this.target = null;
        this.eventPhase = 0;
        this.bubbles = !!d;
        this.cancelable = !!c;
        this.timeStamp = (new Date).getTime();
        this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1
    }
    var c = a.prototype;
    c.preventDefault = function() {
        this.defaultPrevented = this.cancelable && !0
    };
    c.stopPropagation = function() {
        this.propagationStopped = !0
    };
    c.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = !0
    };
    c.remove = function() {
        this.removed = !0
    };
    c.clone = function() {
        return new a(this.type, this.bubbles, this.cancelable)
    };
    c.set = function(a) {
        for (var b in a) this[b] = a[b];
        return this
    };
    c.toString = function() {
        return "[Event (type=" + this.type + ")]"
    };
    createjs.Event = a
})();
this.createjs = this.createjs || {};
(function() {
    function a() {
        this._captureListeners = this._listeners = null
    }
    var c = a.prototype;
    a.initialize = function(a) {
        a.addEventListener = c.addEventListener;
        a.on = c.on;
        a.removeEventListener = a.off = c.removeEventListener;
        a.removeAllEventListeners = c.removeAllEventListeners;
        a.hasEventListener = c.hasEventListener;
        a.dispatchEvent = c.dispatchEvent;
        a._dispatchEvent = c._dispatchEvent;
        a.willTrigger = c.willTrigger
    };
    c.addEventListener = function(a, d, c) {
        var b = c ? this._captureListeners = this._captureListeners || {} : this._listeners =
            this._listeners || {};
        var g = b[a];
        g && this.removeEventListener(a, d, c);
        (g = b[a]) ? g.push(d): b[a] = [d];
        return d
    };
    c.on = function(a, d, c, e, f, l) {
        d.handleEvent && (c = c || d, d = d.handleEvent);
        c = c || this;
        return this.addEventListener(a, function(a) {
            d.call(c, a, f);
            e && a.remove()
        }, l)
    };
    c.removeEventListener = function(a, d, c) {
        if (c = c ? this._captureListeners : this._listeners) {
            var b = c[a];
            if (b)
                for (var g = 0, l = b.length; g < l; g++)
                    if (b[g] == d) {
                        1 == l ? delete c[a] : b.splice(g, 1);
                        break
                    }
        }
    };
    c.off = c.removeEventListener;
    c.removeAllEventListeners = function(a) {
        a ?
            (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
    };
    c.dispatchEvent = function(a, d, c) {
        if ("string" == typeof a) {
            var b = this._listeners;
            if (!(d || b && b[a])) return !0;
            a = new createjs.Event(a, d, c)
        } else a.target && a.clone && (a = a.clone());
        try {
            a.target = this
        } catch (f) {}
        if (a.bubbles && this.parent) {
            c = this;
            for (d = [c]; c.parent;) d.push(c = c.parent);
            b = d.length;
            for (c = b - 1; 0 <= c && !a.propagationStopped; c--) d[c]._dispatchEvent(a, 1 + (0 == c));
            for (c = 1; c < b && !a.propagationStopped; c++) d[c]._dispatchEvent(a, 3)
        } else this._dispatchEvent(a, 2);
        return !a.defaultPrevented
    };
    c.hasEventListener = function(a) {
        var b = this._listeners,
            c = this._captureListeners;
        return !!(b && b[a] || c && c[a])
    };
    c.willTrigger = function(a) {
        for (var b = this; b;) {
            if (b.hasEventListener(a)) return !0;
            b = b.parent
        }
        return !1
    };
    c.toString = function() {
        return "[EventDispatcher]"
    };
    c._dispatchEvent = function(a, d) {
        var b, c, f = 2 >= d ? this._captureListeners : this._listeners;
        if (a && f && (c = f[a.type]) && (b = c.length)) {
            try {
                a.currentTarget =
                    this
            } catch (k) {}
            try {
                a.eventPhase = d | 0
            } catch (k) {}
            a.removed = !1;
            c = c.slice();
            for (f = 0; f < b && !a.immediatePropagationStopped; f++) {
                var l = c[f];
                l.handleEvent ? l.handleEvent(a) : l(a);
                a.removed && (this.off(a.type, l, 1 == d), a.removed = !1)
            }
        }
        2 === d && this._dispatchEvent(a, 2.1)
    };
    createjs.EventDispatcher = a
})();
this.createjs = this.createjs || {};
(function() {
    function a() {
        throw "Ticker cannot be instantiated.";
    }
    a.RAF_SYNCHED = "synched";
    a.RAF = "raf";
    a.TIMEOUT = "timeout";
    a.timingMode = null;
    a.maxDelta = 0;
    a.paused = !1;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a._addEventListener = a.addEventListener;
    a.addEventListener = function() {
        !a._inited && a.init();
        return a._addEventListener.apply(a, arguments)
    };
    a._inited = !1;
    a._startTime = 0;
    a._pausedTime =
        0;
    a._ticks = 0;
    a._pausedTicks = 0;
    a._interval = 50;
    a._lastTime = 0;
    a._times = null;
    a._tickTimes = null;
    a._timerId = null;
    a._raf = !0;
    a._setInterval = function(b) {
        a._interval = b;
        a._inited && a._setupTick()
    };
    a.setInterval = createjs.deprecate(a._setInterval, "Ticker.setInterval");
    a._getInterval = function() {
        return a._interval
    };
    a.getInterval = createjs.deprecate(a._getInterval, "Ticker.getInterval");
    a._setFPS = function(b) {
        a._setInterval(1E3 / b)
    };
    a.setFPS = createjs.deprecate(a._setFPS, "Ticker.setFPS");
    a._getFPS = function() {
        return 1E3 /
            a._interval
    };
    a.getFPS = createjs.deprecate(a._getFPS, "Ticker.getFPS");
    try {
        Object.defineProperties(a, {
            interval: {
                get: a._getInterval,
                set: a._setInterval
            },
            framerate: {
                get: a._getFPS,
                set: a._setFPS
            }
        })
    } catch (d) {
        console.log(d)
    }
    a.init = function() {
        a._inited || (a._inited = !0, a._times = [], a._tickTimes = [], a._startTime = a._getTime(), a._times.push(a._lastTime = 0), a.interval = a._interval)
    };
    a.reset = function() {
        if (a._raf) {
            var b = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame ||
                window.msCancelAnimationFrame;
            b && b(a._timerId)
        } else clearTimeout(a._timerId);
        a.removeAllEventListeners("tick");
        a._timerId = a._times = a._tickTimes = null;
        a._startTime = a._lastTime = a._ticks = a._pausedTime = 0;
        a._inited = !1
    };
    a.getMeasuredTickTime = function(b) {
        var d = 0,
            c = a._tickTimes;
        if (!c || 1 > c.length) return -1;
        b = Math.min(c.length, b || a._getFPS() | 0);
        for (var f = 0; f < b; f++) d += c[f];
        return d / b
    };
    a.getMeasuredFPS = function(b) {
        var c = a._times;
        if (!c || 2 > c.length) return -1;
        b = Math.min(c.length - 1, b || a._getFPS() | 0);
        return 1E3 / ((c[0] -
            c[b]) / b)
    };
    a.getTime = function(b) {
        return a._startTime ? a._getTime() - (b ? a._pausedTime : 0) : -1
    };
    a.getEventTime = function(b) {
        return a._startTime ? (a._lastTime || a._startTime) - (b ? a._pausedTime : 0) : -1
    };
    a.getTicks = function(b) {
        return a._ticks - (b ? a._pausedTicks : 0)
    };
    a._handleSynch = function() {
        a._timerId = null;
        a._setupTick();
        a._getTime() - a._lastTime >= .97 * (a._interval - 1) && a._tick()
    };
    a._handleRAF = function() {
        a._timerId = null;
        a._setupTick();
        a._tick()
    };
    a._handleTimeout = function() {
        a._timerId = null;
        a._setupTick();
        a._tick()
    };
    a._setupTick =
        function() {
            if (null == a._timerId) {
                var b = a.timingMode;
                if (b == a.RAF_SYNCHED || b == a.RAF) {
                    var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
                    if (c) {
                        a._timerId = c(b == a.RAF ? a._handleRAF : a._handleSynch);
                        a._raf = !0;
                        return
                    }
                }
                a._raf = !1;
                a._timerId = setTimeout(a._handleTimeout, a._interval)
            }
        };
    a._tick = function() {
        var b = a.paused,
            c = a._getTime(),
            e = c - a._lastTime;
        a._lastTime = c;
        a._ticks++;
        b && (a._pausedTicks++, a._pausedTime +=
            e);
        if (a.hasEventListener("tick")) {
            var f = new createjs.Event("tick"),
                l = a.maxDelta;
            f.delta = l && e > l ? l : e;
            f.paused = b;
            f.time = c;
            f.runTime = c - a._pausedTime;
            a.dispatchEvent(f)
        }
        for (a._tickTimes.unshift(a._getTime() - c); 100 < a._tickTimes.length;) a._tickTimes.pop();
        for (a._times.unshift(c); 100 < a._times.length;) a._times.pop()
    };
    var c = window,
        b = c.performance.now || c.performance.mozNow || c.performance.msNow || c.performance.oNow || c.performance.webkitNow;
    a._getTime = function() {
        return (b && b.call(c.performance) || (new Date).getTime()) -
            a._startTime
    };
    createjs.Ticker = a
})();
this.createjs = this.createjs || {};
(function() {
    function a(a) {
        this.EventDispatcher_constructor();
        this.ignoreGlobalPause = !1;
        this.loop = 0;
        this.bounce = this.reversed = this.useTicks = !1;
        this.timeScale = 1;
        this.position = this.duration = 0;
        this.rawPosition = -1;
        this._paused = !0;
        this._labelList = this._labels = this._parent = this._prev = this._next = null;
        a && (this.useTicks = !!a.useTicks, this.ignoreGlobalPause = !!a.ignoreGlobalPause, this.loop = !0 === a.loop ? -1 : a.loop || 0, this.reversed = !!a.reversed, this.bounce = !!a.bounce, this.timeScale = a.timeScale || 1, a.onChange && this.addEventListener("change",
            a.onChange), a.onComplete && this.addEventListener("complete", a.onComplete))
    }
    var c = createjs.extend(a, createjs.EventDispatcher);
    c._setPaused = function(a) {
        createjs.Tween._register(this, a);
        return this
    };
    c.setPaused = createjs.deprecate(c._setPaused, "AbstractTween.setPaused");
    c._getPaused = function() {
        return this._paused
    };
    c.getPaused = createjs.deprecate(c._getPaused, "AbstactTween.getPaused");
    c._getCurrentLabel = function(a) {
        var b = this.getLabels();
        null == a && (a = this.position);
        for (var c = 0, e = b.length; c < e && !(a < b[c].position); c++);
        return 0 === c ? null : b[c - 1].label
    };
    c.getCurrentLabel = createjs.deprecate(c._getCurrentLabel, "AbstractTween.getCurrentLabel");
    try {
        Object.defineProperties(c, {
            paused: {
                set: c._setPaused,
                get: c._getPaused
            },
            currentLabel: {
                get: c._getCurrentLabel
            }
        })
    } catch (b) {}
    c.advance = function(a, c) {
        this.setPosition(this.rawPosition + a * this.timeScale, c)
    };
    c.setPosition = function(a, c, g, e) {
        var b = this.duration,
            d = this.loop,
            k = this.rawPosition,
            q = 0;
        0 > a && (a = 0);
        if (0 === b) {
            var h = !0;
            if (-1 !== k) return h
        } else {
            var m = a / b | 0;
            q = a - m * b;
            (h = -1 !== d && a >= d *
                b + b) && (a = (q = b) * (m = d) + b);
            if (a === k) return h;
            !this.reversed !== !(this.bounce && m % 2) && (q = b - q)
        }
        this.position = q;
        this.rawPosition = a;
        this._updatePosition(g, h);
        h && (this.paused = !0);
        e && e(this);
        c || this._runActions(k, a, g, !g && -1 === k);
        this.dispatchEvent("change");
        h && this.dispatchEvent("complete")
    };
    c.calculatePosition = function(a) {
        var b = this.duration,
            c = this.loop,
            e = 0;
        if (0 === b) return 0; - 1 !== c && a >= c * b + b ? (a = b, e = c) : 0 > a ? a = 0 : (e = a / b | 0, a -= e * b);
        return !this.reversed !== !(this.bounce && e % 2) ? b - a : a
    };
    c.getLabels = function() {
        var a = this._labelList;
        if (!a) {
            a = this._labelList = [];
            var c = this._labels,
                g;
            for (g in c) a.push({
                label: g,
                position: c[g]
            });
            a.sort(function(a, b) {
                return a.position - b.position
            })
        }
        return a
    };
    c.setLabels = function(a) {
        this._labels = a;
        this._labelList = null
    };
    c.addLabel = function(a, c) {
        this._labels || (this._labels = {});
        this._labels[a] = c;
        var b = this._labelList;
        if (b) {
            for (var d = 0, f = b.length; d < f && !(c < b[d].position); d++);
            b.splice(d, 0, {
                label: a,
                position: c
            })
        }
    };
    c.gotoAndPlay = function(a) {
        this.paused = !1;
        this._goto(a)
    };
    c.gotoAndStop = function(a) {
        this.paused = !0;
        this._goto(a)
    };
    c.resolve = function(a) {
        var b = Number(a);
        isNaN(b) && (b = this._labels && this._labels[a]);
        return b
    };
    c.toString = function() {
        return "[AbstractTween]"
    };
    c.clone = function() {
        throw "AbstractTween can not be cloned.";
    };
    c._init = function(a) {
        a && a.paused || (this.paused = !1);
        a && null != a.position && this.setPosition(a.position)
    };
    c._updatePosition = function(a, c) {};
    c._goto = function(a) {
        a = this.resolve(a);
        null != a && this.setPosition(a, !1, !0)
    };
    c._runActions = function(a, c, g, e) {
        if (this._actionHead || this.tweens) {
            var b = this.duration,
                d = this.reversed,
                k = this.bounce,
                q = this.loop,
                h, m, n;
            if (0 === b) {
                var p = h = m = n = 0;
                d = k = !1
            } else p = a / b | 0, h = c / b | 0, m = a - p * b, n = c - h * b; - 1 !== q && (h > q && (n = b, h = q), p > q && (m = b, p = q));
            if (g) return this._runActionsRange(n, n, g, e);
            if (p !== h || m !== n || g || e) {
                -1 === p && (p = m = 0);
                a = a <= c;
                c = p;
                do {
                    q = c === p ? m : a ? 0 : b;
                    var w = c === h ? n : a ? b : 0;
                    !d !== !(k && c % 2) && (q = b - q, w = b - w);
                    if ((!k || c === p || q !== w) && this._runActionsRange(q, w, g, e || c !== p && !k)) return !0;
                    e = !1
                } while (a && ++c <= h || !a && --c >= h)
            }
        }
    };
    c._runActionsRange = function(a, c, g, e) {};
    createjs.AbstractTween = createjs.promote(a,
        "EventDispatcher")
})();
this.createjs = this.createjs || {};
(function() {
    function a(b, d) {
        this.AbstractTween_constructor(d);
        this.pluginData = null;
        this.target = b;
        this.passive = !1;
        this._stepTail = this._stepHead = new c(null, 0, 0, {}, null, !0);
        this._stepPosition = 0;
        this._injected = this._pluginIds = this._plugins = this._actionTail = this._actionHead = null;
        d && (this.pluginData = d.pluginData, d.override && a.removeTweens(b));
        this.pluginData || (this.pluginData = {});
        this._init(d)
    }

    function c(a, b, c, d, k, q) {
        this.next = null;
        this.prev = a;
        this.t = b;
        this.d = c;
        this.props = d;
        this.ease = k;
        this.passive = q;
        this.index =
            a ? a.index + 1 : 0
    }

    function b(a, b, c, d, k) {
        this.next = null;
        this.prev = a;
        this.t = b;
        this.d = 0;
        this.scope = c;
        this.funct = d;
        this.params = k
    }
    var d = createjs.extend(a, createjs.AbstractTween);
    a.IGNORE = {};
    a._tweens = [];
    a._plugins = null;
    a._tweenHead = null;
    a._tweenTail = null;
    a.get = function(b, c) {
        return new a(b, c)
    };
    a.tick = function(b, c) {
        for (var d = a._tweenHead; d;) {
            var g = d._next;
            c && !d.ignoreGlobalPause || d._paused || d.advance(d.useTicks ? 1 : b);
            d = g
        }
    };
    a.handleEvent = function(a) {
        "tick" === a.type && this.tick(a.delta, a.paused)
    };
    a.removeTweens =
        function(b) {
            if (b.tweenjs_count) {
                for (var c = a._tweenHead; c;) {
                    var d = c._next;
                    c.target === b && a._register(c, !0);
                    c = d
                }
                b.tweenjs_count = 0
            }
        };
    a.removeAllTweens = function() {
        for (var b = a._tweenHead; b;) {
            var c = b._next;
            b._paused = !0;
            b.target && (b.target.tweenjs_count = 0);
            b._next = b._prev = null;
            b = c
        }
        a._tweenHead = a._tweenTail = null
    };
    a.hasActiveTweens = function(b) {
        return b ? !!b.tweenjs_count : !!a._tweenHead
    };
    a._installPlugin = function(b) {
        for (var c = b.priority = b.priority || 0, d = a._plugins = a._plugins || [], g = 0, k = d.length; g < k && !(c < d[g].priority); g++);
        d.splice(g, 0, b)
    };
    a._register = function(b, c) {
        var d = b.target;
        if (!c && b._paused) d && (d.tweenjs_count = d.tweenjs_count ? d.tweenjs_count + 1 : 1), (d = a._tweenTail) ? (a._tweenTail = d._next = b, b._prev = d) : a._tweenHead = a._tweenTail = b, !a._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", a), a._inited = !0);
        else if (c && !b._paused) {
            d && d.tweenjs_count--;
            d = b._next;
            var g = b._prev;
            d ? d._prev = g : a._tweenTail = g;
            g ? g._next = d : a._tweenHead = d;
            b._next = b._prev = null
        }
        b._paused = c
    };
    d.wait = function(a, b) {
        0 < a && this._addStep(+a, this._stepTail.props,
            null, b);
        return this
    };
    d.to = function(a, b, c) {
        if (null == b || 0 > b) b = 0;
        b = this._addStep(+b, null, c);
        this._appendProps(a, b);
        return this
    };
    d.label = function(a) {
        this.addLabel(a, this.duration);
        return this
    };
    d.call = function(a, b, c) {
        return this._addAction(c || this.target, a, b || [this])
    };
    d.set = function(a, b) {
        return this._addAction(b || this.target, this._set, [a])
    };
    d.play = function(a) {
        return this._addAction(a || this, this._set, [{
            paused: !1
        }])
    };
    d.pause = function(a) {
        return this._addAction(a || this, this._set, [{
            paused: !0
        }])
    };
    d.w = d.wait;
    d.t = d.to;
    d.c = d.call;
    d.s = d.set;
    d.toString = function() {
        return "[Tween]"
    };
    d.clone = function() {
        throw "Tween can not be cloned.";
    };
    d._addPlugin = function(a) {
        var b = this._pluginIds || (this._pluginIds = {}),
            c = a.ID;
        if (c && !b[c]) {
            b[c] = !0;
            b = this._plugins || (this._plugins = []);
            c = a.priority || 0;
            for (var d = 0, g = b.length; d < g; d++)
                if (c < b[d].priority) {
                    b.splice(d, 0, a);
                    return
                } b.push(a)
        }
    };
    d._updatePosition = function(a, b) {
        var c = this._stepHead.next,
            d = this.position,
            g = this.duration;
        if (this.target && c) {
            for (var e = c.next; e && e.t <= d;) c = c.next,
                e = c.next;
            this._updateTargetProps(c, b ? 0 === g ? 1 : d / g : (d - c.t) / c.d, b)
        }
        this._stepPosition = c ? d - c.t : 0
    };
    d._updateTargetProps = function(b, c, d) {
        if (!(this.passive = !!b.passive)) {
            var f, g = b.prev.props,
                e = b.props;
            if (f = b.ease) c = f(c, 0, 1, 1);
            f = this._plugins;
            var h;
            a: for (h in g) {
                var m = g[h];
                var n = e[h];
                m = m !== n && "number" === typeof m ? m + (n - m) * c : 1 <= c ? n : m;
                if (f) {
                    n = 0;
                    for (var p = f.length; n < p; n++) {
                        var w = f[n].change(this, b, h, m, c, d);
                        if (w === a.IGNORE) continue a;
                        void 0 !== w && (m = w)
                    }
                }
                this.target[h] = m
            }
        }
    };
    d._runActionsRange = function(a, b, c, d) {
        var f =
            (c = a > b) ? this._actionTail : this._actionHead,
            g = b,
            e = a;
        c && (g = a, e = b);
        for (var l = this.position; f;) {
            var n = f.t;
            if (n === b || n > e && n < g || d && n === a)
                if (f.funct.apply(f.scope, f.params), l !== this.position) return !0;
            f = c ? f.prev : f.next
        }
    };
    d._appendProps = function(b, c, d) {
        var f = this._stepHead.props,
            g = this.target,
            e = a._plugins,
            h, m, n = c.prev,
            p = n.props,
            w = c.props || (c.props = this._cloneProps(p)),
            t = {};
        for (h in b)
            if (b.hasOwnProperty(h) && (t[h] = w[h] = b[h], void 0 === f[h])) {
                var v = void 0;
                if (e)
                    for (m = e.length - 1; 0 <= m; m--) {
                        var z = e[m].init(this, h,
                            v);
                        void 0 !== z && (v = z);
                        if (v === a.IGNORE) {
                            delete w[h];
                            delete t[h];
                            break
                        }
                    }
                v !== a.IGNORE && (void 0 === v && (v = g[h]), p[h] = void 0 === v ? null : v)
            } for (h in t) {
            var B;
            for (b = n;
                (B = b) && (b = B.prev);)
                if (b.props !== B.props) {
                    if (void 0 !== b.props[h]) break;
                    b.props[h] = p[h]
                }
        }
        if (!1 !== d && (e = this._plugins))
            for (m = e.length - 1; 0 <= m; m--) e[m].step(this, c, t);
        if (d = this._injected) this._injected = null, this._appendProps(d, c, !1)
    };
    d._injectProp = function(a, b) {
        (this._injected || (this._injected = {}))[a] = b
    };
    d._addStep = function(a, b, d, l) {
        b = new c(this._stepTail,
            this.duration, a, b, d, l || !1);
        this.duration += a;
        return this._stepTail = this._stepTail.next = b
    };
    d._addAction = function(a, c, d) {
        a = new b(this._actionTail, this.duration, a, c, d);
        this._actionTail ? this._actionTail.next = a : this._actionHead = a;
        this._actionTail = a;
        return this
    };
    d._set = function(a) {
        for (var b in a) this[b] = a[b]
    };
    d._cloneProps = function(a) {
        var b = {},
            c;
        for (c in a) b[c] = a[c];
        return b
    };
    createjs.Tween = createjs.promote(a, "AbstractTween")
})();
this.createjs = this.createjs || {};
(function() {
    function a(a) {
        if (a instanceof Array || null == a && 1 < arguments.length) {
            var b = a;
            var c = arguments[1];
            a = arguments[2]
        } else a && (b = a.tweens, c = a.labels);
        this.AbstractTween_constructor(a);
        this.tweens = [];
        b && this.addTween.apply(this, b);
        this.setLabels(c);
        this._init(a)
    }
    var c = createjs.extend(a, createjs.AbstractTween);
    c.addTween = function(a) {
        a._parent && a._parent.removeTween(a);
        var b = arguments.length;
        if (1 < b) {
            for (var c = 0; c < b; c++) this.addTween(arguments[c]);
            return arguments[b - 1]
        }
        if (0 === b) return null;
        this.tweens.push(a);
        a._parent = this;
        a.paused = !0;
        b = a.duration;
        0 < a.loop && (b *= a.loop + 1);
        b > this.duration && (this.duration = b);
        0 <= this.rawPosition && a.setPosition(this.rawPosition);
        return a
    };
    c.removeTween = function(a) {
        var b = arguments.length;
        if (1 < b) {
            for (var c = !0, e = 0; e < b; e++) c = c && this.removeTween(arguments[e]);
            return c
        }
        if (0 === b) return !0;
        b = this.tweens;
        for (e = b.length; e--;)
            if (b[e] === a) return b.splice(e, 1), a._parent = null, a.duration >= this.duration && this.updateDuration(), !0;
        return !1
    };
    c.updateDuration = function() {
        for (var a = this.duration =
                0, c = this.tweens.length; a < c; a++) {
            var g = this.tweens[a],
                e = g.duration;
            0 < g.loop && (e *= g.loop + 1);
            e > this.duration && (this.duration = e)
        }
    };
    c.toString = function() {
        return "[Timeline]"
    };
    c.clone = function() {
        throw "Timeline can not be cloned.";
    };
    c._updatePosition = function(a, c) {
        for (var b = this.position, d = 0, f = this.tweens.length; d < f; d++) this.tweens[d].setPosition(b, !0, a)
    };
    c._runActionsRange = function(a, c, g, e) {
        for (var b = this.position, d = 0, k = this.tweens.length; d < k; d++)
            if (this.tweens[d]._runActions(a, c, g, e), b !== this.position) return !0
    };
    createjs.Timeline = createjs.promote(a, "AbstractTween")
})();
this.createjs = this.createjs || {};
(function() {
    function a() {
        throw "Ease cannot be instantiated.";
    }
    a.linear = function(a) {
        return a
    };
    a.none = a.linear;
    a.get = function(a) {
        -1 > a ? a = -1 : 1 < a && (a = 1);
        return function(b) {
            return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a))
        }
    };
    a.getPowIn = function(a) {
        return function(b) {
            return Math.pow(b, a)
        }
    };
    a.getPowOut = function(a) {
        return function(b) {
            return 1 - Math.pow(1 - b, a)
        }
    };
    a.getPowInOut = function(a) {
        return function(b) {
            return 1 > (b *= 2) ? .5 * Math.pow(b, a) : 1 - .5 * Math.abs(Math.pow(2 - b, a))
        }
    };
    a.quadIn = a.getPowIn(2);
    a.quadOut = a.getPowOut(2);
    a.quadInOut = a.getPowInOut(2);
    a.cubicIn = a.getPowIn(3);
    a.cubicOut = a.getPowOut(3);
    a.cubicInOut = a.getPowInOut(3);
    a.quartIn = a.getPowIn(4);
    a.quartOut = a.getPowOut(4);
    a.quartInOut = a.getPowInOut(4);
    a.quintIn = a.getPowIn(5);
    a.quintOut = a.getPowOut(5);
    a.quintInOut = a.getPowInOut(5);
    a.sineIn = function(a) {
        return 1 - Math.cos(a * Math.PI / 2)
    };
    a.sineOut = function(a) {
        return Math.sin(a * Math.PI / 2)
    };
    a.sineInOut = function(a) {
        return -.5 * (Math.cos(Math.PI * a) - 1)
    };
    a.getBackIn = function(a) {
        return function(b) {
            return b * b * ((a + 1) * b - a)
        }
    };
    a.backIn = a.getBackIn(1.7);
    a.getBackOut = function(a) {
        return function(b) {
            return --b * b * ((a + 1) * b + a) + 1
        }
    };
    a.backOut = a.getBackOut(1.7);
    a.getBackInOut = function(a) {
        a *= 1.525;
        return function(b) {
            return 1 > (b *= 2) ? .5 * b * b * ((a + 1) * b - a) : .5 * ((b -= 2) * b * ((a + 1) * b + a) + 2)
        }
    };
    a.backInOut = a.getBackInOut(1.7);
    a.circIn = function(a) {
        return -(Math.sqrt(1 - a * a) - 1)
    };
    a.circOut = function(a) {
        return Math.sqrt(1 - --a * a)
    };
    a.circInOut = function(a) {
        return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    };
    a.bounceIn = function(c) {
        return 1 -
            a.bounceOut(1 - c)
    };
    a.bounceOut = function(a) {
        return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
    };
    a.bounceInOut = function(c) {
        return .5 > c ? .5 * a.bounceIn(2 * c) : .5 * a.bounceOut(2 * c - 1) + .5
    };
    a.getElasticIn = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
            if (0 == d || 1 == d) return d;
            var e = b / c * Math.asin(1 / a);
            return -(a * Math.pow(2, 10 * --d) * Math.sin((d - e) * c / b))
        }
    };
    a.elasticIn = a.getElasticIn(1, .3);
    a.getElasticOut = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
            return 0 == d || 1 == d ? d : a * Math.pow(2, -10 * d) * Math.sin((d - b / c * Math.asin(1 / a)) * c / b) + 1
        }
    };
    a.elasticOut = a.getElasticOut(1, .3);
    a.getElasticInOut = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
            var e = b / c * Math.asin(1 / a);
            return 1 > (d *= 2) ? -.5 * a * Math.pow(2, 10 * --d) * Math.sin((d - e) * c / b) : a * Math.pow(2, -10 * --d) * Math.sin((d - e) * c / b) * .5 + 1
        }
    };
    a.elasticInOut = a.getElasticInOut(1, .3 * 1.5);
    createjs.Ease = a
})();
this.createjs = this.createjs || {};
(function() {
    function a() {
        throw "MotionGuidePlugin cannot be instantiated.";
    }
    a.priority = 0;
    a.ID = "MotionGuide";
    a.install = function() {
        createjs.Tween._installPlugin(a);
        return createjs.Tween.IGNORE
    };
    a.init = function(c, b, d) {
        "guide" == b && c._addPlugin(a)
    };
    a.step = function(c, b, d) {
        for (var g in d)
            if ("guide" === g) {
                var e = b.props.guide,
                    f = a._solveGuideData(d.guide, e);
                e.valid = !f;
                var l = e.endData;
                c._injectProp("x", l.x);
                c._injectProp("y", l.y);
                if (f || !e.orient) break;
                e.startOffsetRot = (void 0 === b.prev.props.rotation ? c.target.rotation ||
                    0 : b.prev.props.rotation) - e.startData.rotation;
                if ("fixed" == e.orient) e.endAbsRot = l.rotation + e.startOffsetRot, e.deltaRotation = 0;
                else {
                    f = void 0 === d.rotation ? c.target.rotation || 0 : d.rotation;
                    l = f - e.endData.rotation - e.startOffsetRot;
                    var k = l % 360;
                    e.endAbsRot = f;
                    switch (e.orient) {
                        case "auto":
                            e.deltaRotation = l;
                            break;
                        case "cw":
                            e.deltaRotation = (k + 360) % 360 + 360 * Math.abs(l / 360 | 0);
                            break;
                        case "ccw":
                            e.deltaRotation = (k - 360) % 360 + -360 * Math.abs(l / 360 | 0)
                    }
                }
                c._injectProp("rotation", e.endAbsRot)
            }
    };
    a.change = function(c, b, d, g, e, f) {
        if ((g =
                b.props.guide) && b.props !== b.prev.props && g !== b.prev.props.guide) {
            if ("guide" === d && !g.valid || "x" == d || "y" == d || "rotation" === d && g.orient) return createjs.Tween.IGNORE;
            a._ratioToPositionData(e, g, c.target)
        }
    };
    a.debug = function(c, b, d) {
        c = c.guide || c;
        var g = a._findPathProblems(c);
        g && console.error("MotionGuidePlugin Error found: \n" + g);
        if (!b) return g;
        var e, f = c.path,
            l = f.length;
        b.save();
        b.lineCap = "round";
        b.lineJoin = "miter";
        b.beginPath();
        b.moveTo(f[0], f[1]);
        for (e = 2; e < l; e += 4) b.quadraticCurveTo(f[e], f[e + 1], f[e + 2], f[e +
            3]);
        b.strokeStyle = "black";
        b.lineWidth = 4.5;
        b.stroke();
        b.strokeStyle = "white";
        b.lineWidth = 3;
        b.stroke();
        b.closePath();
        f = d.length;
        if (d && f) {
            l = {};
            var k = {};
            a._solveGuideData(c, l);
            for (e = 0; e < f; e++) l.orient = "fixed", a._ratioToPositionData(d[e], l, k), b.beginPath(), b.moveTo(k.x, k.y), b.lineTo(k.x + 9 * Math.cos(.0174533 * k.rotation), k.y + 9 * Math.sin(.0174533 * k.rotation)), b.strokeStyle = "black", b.lineWidth = 4.5, b.stroke(), b.strokeStyle = "red", b.lineWidth = 3, b.stroke(), b.closePath()
        }
        b.restore();
        return g
    };
    a._solveGuideData = function(c,
        b) {
        var d;
        if (d = a.debug(c)) return d;
        var g = b.path = c.path;
        b.orient = c.orient;
        b.subLines = [];
        b.totalLength = 0;
        b.startOffsetRot = 0;
        b.deltaRotation = 0;
        b.startData = {
            ratio: 0
        };
        b.endData = {
            ratio: 1
        };
        b.animSpan = 1;
        var e = g.length,
            f, l = {};
        var k = g[0];
        var q = g[1];
        for (d = 2; d < e; d += 4) {
            var h = g[d];
            var m = g[d + 1];
            var n = g[d + 2];
            var p = g[d + 3];
            var w = {
                    weightings: [],
                    estLength: 0,
                    portion: 0
                },
                t = k;
            var v = q;
            for (f = 1; 10 >= f; f++) a._getParamsForCurve(k, q, h, m, n, p, f / 10, !1, l), t = l.x - t, v = l.y - v, v = Math.sqrt(t * t + v * v), w.weightings.push(v), w.estLength += v, t = l.x,
                v = l.y;
            b.totalLength += w.estLength;
            for (f = 0; 10 > f; f++) v = w.estLength, w.weightings[f] /= v;
            b.subLines.push(w);
            k = n;
            q = p
        }
        v = b.totalLength;
        g = b.subLines.length;
        for (d = 0; d < g; d++) b.subLines[d].portion = b.subLines[d].estLength / v;
        d = isNaN(c.start) ? 0 : c.start;
        g = isNaN(c.end) ? 1 : c.end;
        a._ratioToPositionData(d, b, b.startData);
        a._ratioToPositionData(g, b, b.endData);
        b.startData.ratio = d;
        b.endData.ratio = g;
        b.animSpan = b.endData.ratio - b.startData.ratio
    };
    a._ratioToPositionData = function(c, b, d) {
        var g = b.subLines,
            e, f = 0,
            l = c * b.animSpan + b.startData.ratio;
        var k = g.length;
        for (e = 0; e < k; e++) {
            var q = g[e].portion;
            if (f + q >= l) {
                var h = e;
                break
            }
            f += q
        }
        void 0 === h && (h = k - 1, f -= q);
        g = g[h].weightings;
        var m = q;
        k = g.length;
        for (e = 0; e < k; e++) {
            q = g[e] * m;
            if (f + q >= l) break;
            f += q
        }
        h = 4 * h + 2;
        k = b.path;
        a._getParamsForCurve(k[h - 2], k[h - 1], k[h], k[h + 1], k[h + 2], k[h + 3], e / 10 + (l - f) / q * .1, b.orient, d);
        b.orient && (d.rotation = .99999 <= c && 1.00001 >= c && void 0 !== b.endAbsRot ? b.endAbsRot : d.rotation + (b.startOffsetRot + c * b.deltaRotation));
        return d
    };
    a._getParamsForCurve = function(a, b, d, g, e, f, l, k, q) {
        var c = 1 - l;
        q.x = c * c * a +
            2 * c * l * d + l * l * e;
        q.y = c * c * b + 2 * c * l * g + l * l * f;
        k && (q.rotation = 57.2957795 * Math.atan2((g - b) * c + (f - g) * l, (d - a) * c + (e - d) * l))
    };
    a._findPathProblems = function(a) {
        var b = a.path,
            c = b && b.length || 0;
        if (6 > c || (c - 2) % 4) return "\tCannot parse 'path' array due to invalid number of entries in path. There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\nOnly [ " + (c + " ] values found. Expected: " + Math.max(4 *
            Math.ceil((c - 2) / 4) + 2, 6));
        for (var g = 0; g < c; g++)
            if (isNaN(b[g])) return "All data in path array must be numeric";
        b = a.start;
        if (isNaN(b) && void 0 !== b) return "'start' out of bounds. Expected 0 to 1, got: " + b;
        b = a.end;
        if (isNaN(b) && void 0 !== b) return "'end' out of bounds. Expected 0 to 1, got: " + b;
        if ((a = a.orient) && "fixed" != a && "auto" != a && "cw" != a && "ccw" != a) return 'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' + a
    };
    createjs.MotionGuidePlugin = a
})();
this.createjs = this.createjs || {};
(function() {
    var a = createjs.TweenJS = createjs.TweenJS || {};
    a.version = "1.0.0";
    a.buildDate = "Thu, 14 Sep 2017 19:47:47 GMT"
})();
! function() {
    var a = "undefined" != typeof window && void 0 !== window.document ? window.document : {},
        c = "undefined" != typeof module && module.exports,
        b = function() {
            for (var b, c = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "), "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "),
                    "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "), "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")
                ], d = 0, g = c.length, q = {}; d < g; d++)
                if ((b = c[d]) && b[1] in a) {
                    for (d = 0; d < b.length; d++) q[c[0][d]] = b[d];
                    return q
                } return !1
        }(),
        d = {
            change: b.fullscreenchange,
            error: b.fullscreenerror
        },
        g = {
            request: function(c) {
                return new Promise(function(d, e) {
                    var f = function() {
                        this.off("change",
                            f);
                        d()
                    }.bind(this);
                    this.on("change", f);
                    c = c || a.documentElement;
                    Promise.resolve(c[b.requestFullscreen]())["catch"](e)
                }.bind(this))
            },
            exit: function() {
                return new Promise(function(c, d) {
                    if (this.isFullscreen) {
                        var f = function() {
                            this.off("change", f);
                            c()
                        }.bind(this);
                        this.on("change", f);
                        Promise.resolve(a[b.exitFullscreen]())["catch"](d)
                    } else c()
                }.bind(this))
            },
            toggle: function(a) {
                return this.isFullscreen ? this.exit() : this.request(a)
            },
            onchange: function(a) {
                this.on("change", a)
            },
            onerror: function(a) {
                this.on("error", a)
            },
            on: function(b, c) {
                var f = d[b];
                f && a.addEventListener(f, c, !1)
            },
            off: function(b, c) {
                var f = d[b];
                f && a.removeEventListener(f, c, !1)
            },
            raw: b
        };
    b ? (Object.defineProperties(g, {
        isFullscreen: {
            get: function() {
                return !!a[b.fullscreenElement]
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return a[b.fullscreenElement]
            }
        },
        isEnabled: {
            enumerable: !0,
            get: function() {
                return !!a[b.fullscreenEnabled]
            }
        }
    }), c ? module.exports = g : window.screenfull = g) : c ? module.exports = {
        isEnabled: !1
    } : window.screenfull = {
        isEnabled: !1
    }
}();
(function() {
    function a(a) {
        a = String(a);
        return a.charAt(0).toUpperCase() + a.slice(1)
    }

    function c(a, b) {
        var c = -1,
            f = a ? a.length : 0;
        if ("number" == typeof f && -1 < f && f <= p)
            for (; ++c < f;) b(a[c], c, a);
        else d(a, b)
    }

    function b(b) {
        b = String(b).replace(/^ +| +$/g, "");
        return /^(?:webOS|i(?:OS|P))/.test(b) ? b : a(b)
    }

    function d(a, b) {
        for (var c in a) t.call(a, c) && b(a[c], c, a)
    }

    function g(b) {
        return null == b ? a(b) : v.call(b).slice(8, -1)
    }

    function e(a, b) {
        var c = null != a ? typeof a[b] : "number";
        return !/^(?:boolean|number|string|undefined)$/.test(c) &&
            ("object" == c ? !!a[b] : !0)
    }

    function f(a) {
        return String(a).replace(/([ -])(?!$)/g, "$1?")
    }

    function l(a, b) {
        var d = null;
        c(a, function(c, f) {
            d = b(d, c, f, a)
        });
        return d
    }

    function k(a) {
        function c(c) {
            return l(c, function(c, d) {
                var g = d.pattern || f(d);
                !c && (c = RegExp("\\b" + g + " *\\d+[.\\w_]*", "i").exec(a) || RegExp("\\b" + g + " *\\w+-[\\w]*", "i").exec(a) || RegExp("\\b" + g + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(a)) && ((c = String(d.label && !RegExp(g, "i").test(d.label) ? d.label : c).split("/"))[1] && !/[\d.]+/.test(c[0]) && (c[0] +=
                    " " + c[1]), d = d.label || d, c = b(c[0].replace(RegExp(g, "i"), d).replace(RegExp("; *(?:" + d + "[_-])?", "i"), " ").replace(RegExp("(" + d + ")[-_.]?(\\w)", "i"), "$1 $2")));
                return c
            })
        }

        function q(b) {
            return l(b, function(b, c) {
                return b || (RegExp(c + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(a) || 0)[1] || null
            })
        }
        var t = h,
            m = a && "object" == typeof a && "String" != g(a);
        m && (t = a, a = null);
        var n = t.navigator || {},
            p = n.userAgent || "";
        a || (a = p);
        var z = m ? !!n.likeChrome : /\bChrome\b/.test(a) && !/internal|\n/i.test(v.toString()),
            E = m ? "Object" : "ScriptBridgingProxyObject",
            I = m ? "Object" : "Environment",
            B = m && t.java ? "JavaPackage" : g(t.java),
            J = m ? "Object" : "RuntimeObject";
        I = (B = /\bJava/.test(B) && t.java) && g(t.environment) == I;
        var G = B ? "a" : "\u03b1",
            A = B ? "b" : "\u03b2",
            O = t.document || {},
            P = t.operamini || t.opera,
            T = w.test(T = m && P ? P["[[Class]]"] : g(P)) ? T : P = null,
            r, U = a;
        m = [];
        var V = null,
            Q = a == p;
        p = Q && P && "function" == typeof P.version && P.version();
        var C = function(b) {
                return l(b, function(b, c) {
                    return b || RegExp("\\b" + (c.pattern || f(c)) + "\\b", "i").exec(a) && (c.label ||
                        c)
                })
            }([{
                label: "EdgeHTML",
                pattern: "Edge"
            }, "Trident", {
                label: "WebKit",
                pattern: "AppleWebKit"
            }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"]),
            x = function(b) {
                return l(b, function(b, c) {
                    return b || RegExp("\\b" + (c.pattern || f(c)) + "\\b", "i").exec(a) && (c.label || c)
                })
            }(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
                    label: "Microsoft Edge",
                    pattern: "Edge"
                }, "Midori", "Nook Browser",
                "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", {
                    label: "Samsung Internet",
                    pattern: "SamsungBrowser"
                }, "SeaMonkey", {
                    label: "Silk",
                    pattern: "(?:Cloud9|Silk-Accelerated)"
                }, "Sleipnir", "SlimBrowser", {
                    label: "SRWare Iron",
                    pattern: "Iron"
                }, "Sunrise", "Swiftfox", "Waterfox", "WebPositive", "Opera Mini", {
                    label: "Opera Mini",
                    pattern: "OPiOS"
                }, "Opera", {
                    label: "Opera",
                    pattern: "OPR"
                }, "Chrome", {
                    label: "Chrome Mobile",
                    pattern: "(?:CriOS|CrMo)"
                }, {
                    label: "Firefox",
                    pattern: "(?:Firefox|Minefield)"
                }, {
                    label: "Firefox for iOS",
                    pattern: "FxiOS"
                },
                {
                    label: "IE",
                    pattern: "IEMobile"
                }, {
                    label: "IE",
                    pattern: "MSIE"
                }, "Safari"
            ]),
            D = c([{
                    label: "BlackBerry",
                    pattern: "BB10"
                }, "BlackBerry", {
                    label: "Galaxy S",
                    pattern: "GT-I9000"
                }, {
                    label: "Galaxy S2",
                    pattern: "GT-I9100"
                }, {
                    label: "Galaxy S3",
                    pattern: "GT-I9300"
                }, {
                    label: "Galaxy S4",
                    pattern: "GT-I9500"
                }, {
                    label: "Galaxy S5",
                    pattern: "SM-G900"
                }, {
                    label: "Galaxy S6",
                    pattern: "SM-G920"
                }, {
                    label: "Galaxy S6 Edge",
                    pattern: "SM-G925"
                }, {
                    label: "Galaxy S7",
                    pattern: "SM-G930"
                }, {
                    label: "Galaxy S7 Edge",
                    pattern: "SM-G935"
                }, "Google TV", "Lumia", "iPad",
                "iPod", "iPhone", "Kindle", {
                    label: "Kindle Fire",
                    pattern: "(?:Cloud9|Silk-Accelerated)"
                }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", {
                    label: "Wii U",
                    pattern: "WiiU"
                }, "Wii", "Xbox One", {
                    label: "Xbox 360",
                    pattern: "Xbox"
                }, "Xoom"
            ]),
            K = function(b) {
                return l(b, function(b, c, d) {
                    return b || (c[D] || c[/^[a-z]+(?: +[a-z]+\b)*/i.exec(D)] || RegExp("\\b" + f(d) + "(?:\\b|\\w*\\d)", "i").exec(a)) && d
                })
            }({
                Apple: {
                    iPad: 1,
                    iPhone: 1,
                    iPod: 1
                },
                Archos: {},
                Amazon: {
                    Kindle: 1,
                    "Kindle Fire": 1
                },
                Asus: {
                    Transformer: 1
                },
                "Barnes & Noble": {
                    Nook: 1
                },
                BlackBerry: {
                    PlayBook: 1
                },
                Google: {
                    "Google TV": 1,
                    Nexus: 1
                },
                HP: {
                    TouchPad: 1
                },
                HTC: {},
                LG: {},
                Microsoft: {
                    Xbox: 1,
                    "Xbox One": 1
                },
                Motorola: {
                    Xoom: 1
                },
                Nintendo: {
                    "Wii U": 1,
                    Wii: 1
                },
                Nokia: {
                    Lumia: 1
                },
                Samsung: {
                    "Galaxy S": 1,
                    "Galaxy S2": 1,
                    "Galaxy S3": 1,
                    "Galaxy S4": 1
                },
                Sony: {
                    PlayStation: 1,
                    "PlayStation Vita": 1
                }
            }),
            y = function(c) {
                return l(c, function(c, d) {
                    var g = d.pattern || f(d);
                    if (!c && (c = RegExp("\\b" + g + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(a))) {
                        var e = c,
                            h = d.label || d,
                            k = {
                                "10.0": "10",
                                "6.4": "10 Technical Preview",
                                "6.3": "8.1",
                                "6.2": "8",
                                "6.1": "Server 2008 R2 / 7",
                                "6.0": "Server 2008 / Vista",
                                "5.2": "Server 2003 / XP 64-bit",
                                "5.1": "XP",
                                "5.01": "2000 SP1",
                                "5.0": "2000",
                                "4.0": "NT",
                                "4.90": "ME"
                            };
                        g && h && /^Win/i.test(e) && !/^Windows Phone /i.test(e) && (k = k[/[\d.]+$/.exec(e)]) && (e = "Windows " + k);
                        e = String(e);
                        g && h && (e = e.replace(RegExp(g, "i"), h));
                        c = e = b(e.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/,
                            " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0])
                    }
                    return c
                })
            }(["Windows Phone", "Android", "CentOS", {
                    label: "Chrome OS",
                    pattern: "CrOS"
                }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac",
                "Windows 98;", "Windows "
            ]);
        C && (C = [C]);
        K && !D && (D = c([K]));
        if (r = /\bGoogle TV\b/.exec(D)) D = r[0];
        /\bSimulator\b/i.test(a) && (D = (D ? D + " " : "") + "Simulator");
        "Opera Mini" == x && /\bOPiOS\b/.test(a) && m.push("running in Turbo/Uncompressed mode");
        "IE" == x && /\blike iPhone OS\b/.test(a) ? (r = k(a.replace(/like iPhone OS/, "")), K = r.manufacturer, D = r.product) : /^iP/.test(D) ? (x || (x = "Safari"), y = "iOS" + ((r = / OS ([\d_]+)/i.exec(a)) ? " " + r[1].replace(/_/g, ".") : "")) : "Konqueror" != x || /buntu/i.test(y) ? K && "Google" != K && (/Chrome/.test(x) &&
            !/\bMobile Safari\b/i.test(a) || /\bVita\b/.test(D)) || /\bAndroid\b/.test(y) && /^Chrome/.test(x) && /\bVersion\//i.test(a) ? (x = "Android Browser", y = /\bAndroid\b/.test(y) ? y : "Android") : "Silk" == x ? (/\bMobi/i.test(a) || (y = "Android", m.unshift("desktop mode")), /Accelerated *= *true/i.test(a) && m.unshift("accelerated")) : "PaleMoon" == x && (r = /\bFirefox\/([\d.]+)\b/.exec(a)) ? m.push("identifying as Firefox " + r[1]) : "Firefox" == x && (r = /\b(Mobile|Tablet|TV)\b/i.exec(a)) ? (y || (y = "Firefox OS"), D || (D = r[1])) : !x || (r = !/\bMinefield\b/i.test(a) &&
            /\b(?:Firefox|Safari)\b/.exec(x)) ? (x && !D && /[\/,]|^[^(]+?\)/.test(a.slice(a.indexOf(r + "/") + 8)) && (x = null), (r = D || K || y) && (D || K || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(y)) && (x = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(y) ? y : r) + " Browser")) : "Electron" == x && (r = (/\bChrome\/([\d.]+)\b/.exec(a) || 0)[1]) && m.push("Chromium " + r) : y = "Kubuntu";
        p || (p = q(["(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))", "Version", f(x), "(?:Firefox|Minefield|NetFront)"]));
        if (r = "iCab" == C && 3 < parseFloat(p) && "WebKit" || /\bOpera\b/.test(x) && (/\bOPR\b/.test(a) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(a) && !/^(?:Trident|EdgeHTML)$/.test(C) && "WebKit" || !C && /\bMSIE\b/i.test(a) && ("Mac OS" == y ? "Tasman" : "Trident") || "WebKit" == C && /\bPlayStation\b(?! Vita\b)/i.test(x) && "NetFront") C = [r];
        "IE" == x && (r = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(a) || 0)[1]) ? (x += " Mobile", y = "Windows Phone " + (/\+$/.test(r) ? r : r + ".x"), m.unshift("desktop mode")) : /\bWPDesktop\b/i.test(a) ? (x = "IE Mobile", y = "Windows Phone 8.x",
            m.unshift("desktop mode"), p || (p = (/\brv:([\d.]+)/.exec(a) || 0)[1])) : "IE" != x && "Trident" == C && (r = /\brv:([\d.]+)/.exec(a)) && (x && m.push("identifying as " + x + (p ? " " + p : "")), x = "IE", p = r[1]);
        if (Q) {
            if (e(t, "global"))
                if (B && (r = B.lang.System, U = r.getProperty("os.arch"), y = y || r.getProperty("os.name") + " " + r.getProperty("os.version")), I) {
                    try {
                        p = t.require("ringo/engine").version.join("."), x = "RingoJS"
                    } catch (X) {
                        (r = t.system) && r.global.system == t.system && (x = "Narwhal", y || (y = r[0].os || null))
                    }
                    x || (x = "Rhino")
                } else "object" == typeof t.process &&
                    !t.process.browser && (r = t.process) && ("object" == typeof r.versions && ("string" == typeof r.versions.electron ? (m.push("Node " + r.versions.node), x = "Electron", p = r.versions.electron) : "string" == typeof r.versions.nw && (m.push("Chromium " + p, "Node " + r.versions.node), x = "NW.js", p = r.versions.nw)), x || (x = "Node.js", U = r.arch, y = r.platform, p = (p = /[\d.]+/.exec(r.version)) ? p[0] : null));
            else g(r = t.runtime) == E ? (x = "Adobe AIR", y = r.flash.system.Capabilities.os) : g(r = t.phantom) == J ? (x = "PhantomJS", p = (r = r.version || null) && r.major + "." + r.minor +
                "." + r.patch) : "number" == typeof O.documentMode && (r = /\bTrident\/(\d+)/i.exec(a)) ? (p = [p, O.documentMode], (r = +r[1] + 4) != p[1] && (m.push("IE " + p[1] + " mode"), C && (C[1] = ""), p[1] = r), p = "IE" == x ? String(p[1].toFixed(1)) : p[0]) : "number" == typeof O.documentMode && /^(?:Chrome|Firefox)\b/.test(x) && (m.push("masking as " + x + " " + p), x = "IE", p = "11.0", C = ["Trident"], y = "Windows");
            y = y && b(y)
        }
        p && (r = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(p) || /(?:alpha|beta)(?: ?\d)?/i.exec(a + ";" + (Q && n.appMinorVersion)) || /\bMinefield\b/i.test(a) &&
            "a") && (V = /b/i.test(r) ? "beta" : "alpha", p = p.replace(RegExp(r + "\\+?$"), "") + ("beta" == V ? A : G) + (/\d+\+?/.exec(r) || ""));
        if ("Fennec" == x || "Firefox" == x && /\b(?:Android|Firefox OS)\b/.test(y)) x = "Firefox Mobile";
        else if ("Maxthon" == x && p) p = p.replace(/\.[\d.]+/, ".x");
        else if (/\bXbox\b/i.test(D)) "Xbox 360" == D && (y = null), "Xbox 360" == D && /\bIEMobile\b/.test(a) && m.unshift("mobile mode");
        else if (!/^(?:Chrome|IE|Opera)$/.test(x) && (!x || D || /Browser|Mobi/.test(x)) || "Windows CE" != y && !/Mobi/i.test(a))
            if ("IE" == x && Q) try {
                null === t.external &&
                    m.unshift("platform preview")
            } catch (X) {
                m.unshift("embedded")
            } else(/\bBlackBerry\b/.test(D) || /\bBB10\b/.test(a)) && (r = (RegExp(D.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(a) || 0)[1] || p) ? (r = [r, /BB10/.test(a)], y = (r[1] ? (D = null, K = "BlackBerry") : "Device Software") + " " + r[0], p = null) : this != d && "Wii" != D && (Q && P || /Opera/.test(x) && /\b(?:MSIE|Firefox)\b/i.test(a) || "Firefox" == x && /\bOS X (?:\d+\.){2,}/.test(y) || "IE" == x && (y && !/^Win/.test(y) && 5.5 < p || /\bWindows XP\b/.test(y) && 8 < p || 8 == p && !/\bTrident\b/.test(a))) && !w.test(r =
                k.call(d, a.replace(w, "") + ";")) && r.name && (r = "ing as " + r.name + ((r = r.version) ? " " + r : ""), w.test(x) ? (/\bIE\b/.test(r) && "Mac OS" == y && (y = null), r = "identify" + r) : (r = "mask" + r, x = T ? b(T.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera", /\bIE\b/.test(r) && (y = null), Q || (p = null)), C = ["Presto"], m.push(r));
            else x += " Mobile";
        if (r = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(a) || 0)[1]) {
            r = [parseFloat(r.replace(/\.(\d)$/, ".0$1")), r];
            if ("Safari" == x && "+" == r[1].slice(-1)) x = "WebKit Nightly", V = "alpha", p = r[1].slice(0, -1);
            else if (p == r[1] || p == (r[2] =
                    (/\bSafari\/([\d.]+\+?)/i.exec(a) || 0)[1])) p = null;
            r[1] = (/\bChrome\/([\d.]+)/i.exec(a) || 0)[1];
            537.36 == r[0] && 537.36 == r[2] && 28 <= parseFloat(r[1]) && "WebKit" == C && (C = ["Blink"]);
            Q && (z || r[1]) ? (C && (C[1] = "like Chrome"), r = r[1] || (r = r[0], 530 > r ? 1 : 532 > r ? 2 : 532.05 > r ? 3 : 533 > r ? 4 : 534.03 > r ? 5 : 534.07 > r ? 6 : 534.1 > r ? 7 : 534.13 > r ? 8 : 534.16 > r ? 9 : 534.24 > r ? 10 : 534.3 > r ? 11 : 535.01 > r ? 12 : 535.02 > r ? "13+" : 535.07 > r ? 15 : 535.11 > r ? 16 : 535.19 > r ? 17 : 536.05 > r ? 18 : 536.1 > r ? 19 : 537.01 > r ? 20 : 537.11 > r ? "21+" : 537.13 > r ? 23 : 537.18 > r ? 24 : 537.24 > r ? 25 : 537.36 > r ? 26 : "Blink" !=
                C ? "27" : "28")) : (C && (C[1] = "like Safari"), r = (r = r[0], 400 > r ? 1 : 500 > r ? 2 : 526 > r ? 3 : 533 > r ? 4 : 534 > r ? "4+" : 535 > r ? 5 : 537 > r ? 6 : 538 > r ? 7 : 601 > r ? 8 : "8"));
            C && (C[1] += " " + (r += "number" == typeof r ? ".x" : /[.+]/.test(r) ? "" : "+"));
            "Safari" == x && (!p || 45 < parseInt(p)) && (p = r)
        }
        "Opera" == x && (r = /\bzbov|zvav$/.exec(y)) ? (x += " ", m.unshift("desktop mode"), "zvav" == r ? (x += "Mini", p = null) : x += "Mobile", y = y.replace(RegExp(" *" + r + "$"), "")) : "Safari" == x && /\bChrome\b/.exec(C && C[1]) && (m.unshift("desktop mode"), x = "Chrome Mobile", p = null, /\bOS X\b/.test(y) ? (K =
            "Apple", y = "iOS 4.3+") : y = null);
        p && 0 == p.indexOf(r = /[\d.]+$/.exec(y)) && -1 < a.indexOf("/" + r + "-") && (y = String(y.replace(r, "")).replace(/^ +| +$/g, ""));
        C && !/\b(?:Avant|Nook)\b/.test(x) && (/Browser|Lunascape|Maxthon/.test(x) || "Safari" != x && /^iOS/.test(y) && /\bSafari\b/.test(C[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(x) && C[1]) && (r = C[C.length - 1]) && m.push(r);
        m.length && (m = ["(" + m.join("; ") + ")"]);
        K && D && 0 > D.indexOf(K) && m.push("on " + K);
        D && m.push((/^on /.test(m[m.length -
            1]) ? "" : "on ") + D);
        if (y) {
            var W = (r = / ([\d.+]+)$/.exec(y)) && "/" == y.charAt(y.length - r[0].length - 1);
            y = {
                architecture: 32,
                family: r && !W ? y.replace(r[0], "") : y,
                version: r ? r[1] : null,
                toString: function() {
                    var a = this.version;
                    return this.family + (a && !W ? " " + a : "") + (64 == this.architecture ? " 64-bit" : "")
                }
            }
        }(r = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(U)) && !/\bi686\b/i.test(U) ? (y && (y.architecture = 64, y.family = y.family.replace(RegExp(" *" + r), "")), x && (/\bWOW64\b/i.test(a) || Q && /\w(?:86|32)$/.test(n.cpuClass || n.platform) && !/\bWin64; x64\b/i.test(a)) &&
            m.unshift("32-bit")) : y && /^OS X/.test(y.family) && "Chrome" == x && 39 <= parseFloat(p) && (y.architecture = 64);
        a || (a = null);
        t = {};
        t.description = a;
        t.layout = C && C[0];
        t.manufacturer = K;
        t.name = x;
        t.prerelease = V;
        t.product = D;
        t.ua = a;
        t.version = x && p;
        t.os = y || {
            architecture: null,
            family: null,
            version: null,
            toString: function() {
                return "null"
            }
        };
        t.parse = k;
        t.toString = function() {
            return this.description || ""
        };
        t.version && m.unshift(p);
        t.name && m.unshift(x);
        y && x && (y != String(y).split(" ")[0] || y != x.split(" ")[0] && !D) && m.push(D ? "(" + y + ")" : "on " +
            y);
        m.length && (t.description = m.join(" "));
        return t
    }
    var q = {
            "function": !0,
            object: !0
        },
        h = q[typeof window] && window || this,
        m = q[typeof exports] && exports;
    q = q[typeof module] && module && !module.nodeType && module;
    var n = m && q && "object" == typeof global && global;
    !n || n.global !== n && n.window !== n && n.self !== n || (h = n);
    var p = Math.pow(2, 53) - 1,
        w = /\bOpera/;
    n = Object.prototype;
    var t = n.hasOwnProperty,
        v = n.toString,
        z = k();
    "function" == typeof define && "object" == typeof define.amd && define.amd ? (h.platform = z, define(function() {
            return z
        })) : m &&
        q ? d(z, function(a, b) {
            m[b] = a
        }) : h.platform = z
}).call(this);

function buildIOSMeta() {
    for (var a = [{
            name: "viewport",
            content: "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        }, {
            name: "apple-mobile-web-app-capable",
            content: "yes"
        }, {
            name: "apple-mobile-web-app-status-bar-style",
            content: "black"
        }], c = 0; c < a.length; c++) {
        var b = document.createElement("meta");
        b.name = a[c].name;
        b.content = a[c].content;
        var d = window.document.head.querySelector('meta[name="' + b.name + '"]');
        d && d.parentNode.removeChild(d);
        window.document.head.appendChild(b)
    }
}

function hideIOSFullscreenPanel() {
    jQuery(".xxx-ios-fullscreen-message").css("display", "none");
    jQuery(".xxx-ios-fullscreen-scroll").css("display", "none");
    jQuery(".xxx-game-iframe-full").removeClass("xxx-game-iframe-iphone-se")
}

function buildIOSFullscreenPanel() {
    jQuery("body").append('<div class="xxx-ios-fullscreen-message"><div class="xxx-ios-fullscreen-swipe"></div></div><div class="xxx-ios-fullscreen-scroll"></div>')
}

function showIOSFullscreenPanel() {
    jQuery(".xxx-ios-fullscreen-message").css("display", "block");
    jQuery(".xxx-ios-fullscreen-scroll").css("display", "block")
}

function __iosResize() {
    window.scrollTo(0, 0);
    console.log(window.devicePixelRatio);
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    if ("iPhone" === platform.product) switch (window.devicePixelRatio) {
        case 2:
            switch (window.innerWidth) {
                case 568:
                    320 !== window.innerHeight && jQuery(".xxx-game-iframe-full").addClass("xxx-game-iframe-iphone-se");
                    break;
                case 667:
                    375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 808:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                default:
                    hideIOSFullscreenPanel()
            }
            break;
        case 3:
            switch (window.innerWidth) {
                case 736:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 724:
                    375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 808:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                default:
                    hideIOSFullscreenPanel()
            }
            break;
        default:
            hideIOSFullscreenPanel()
    }
}

function iosResize() {
    __iosResize();
    setTimeout(function() {
        __iosResize()
    }, 500)
}

function iosInIframe() {
    try {
        return window.self !== window.top
    } catch (a) {
        return !0
    }
}

function isIOSLessThen13() {
    var a = platform.os,
        c = a.family.toLowerCase();
    a = parseFloat(a.version);
    return "ios" === c && 13 > a ? !0 : !1
}
$(document).ready(function() {
    platform && "iPhone" === platform.product && "safari" === platform.name.toLowerCase() && isIOSLessThen13() && !iosInIframe() && (buildIOSFullscreenPanel(), buildIOSMeta())
});
jQuery(window).resize(function() {
    platform && "iPhone" === platform.product && "safari" === platform.name.toLowerCase() && isIOSLessThen13() && !iosInIframe() && iosResize()
});
var s_bLandscape = !0,
    s_iScaleFactor = 1,
    s_bIsIphone = !1,
    s_iOffsetX, s_iOffsetY;
(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,
        4))
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
    sizeHandler()
});

function trace(a) {
    console.log(a)
}

function isIpad() {
    var a = -1 !== navigator.userAgent.toLowerCase().indexOf("ipad");
    return !a && navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && 2 < navigator.maxTouchPoints ? !0 : a
}

function isMobile() {
    return isIpad() ? !0 : jQuery.browser.mobile
}

function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
}

function isIOS() {
    var a = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";");
    for (-1 !== navigator.userAgent.toLowerCase().indexOf("iphone") && (s_bIsIphone = !0); a.length;)
        if (navigator.platform === a.pop()) return !0;
    return s_bIsIphone = !1
}

function getSize(a) {
    var c = a.toLowerCase(),
        b = window.document,
        d = b.documentElement;
    if (void 0 === window["inner" + a]) a = d["client" + a];
    else if (window["inner" + a] != d["client" + a]) {
        var g = b.createElement("body");
        g.id = "vpw-test-b";
        g.style.cssText = "overflow:scroll";
        var e = b.createElement("div");
        e.id = "vpw-test-d";
        e.style.cssText = "position:absolute;top:-1000px";
        e.innerHTML = "<style>@media(" + c + ":" + d["client" + a] + "px){body#vpw-test-b div#vpw-test-d{" + c + ":7px!important}}</style>";
        g.appendChild(e);
        d.insertBefore(g, b.head);
        a = 7 == e["offset" + a] ? d["client" + a] : window["inner" + a];
        d.removeChild(g)
    } else a = window["inner" + a];
    return a
}
window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}

function getIOSWindowHeight() {
    return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}

function getHeightOfIOSToolbars() {
    var a = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
    return 1 < a ? a : 0
}

function sizeHandler() {
    window.scrollTo(0, 1);
    if ($("#canvas")) {
        var a = "safari" === platform.name.toLowerCase() ? getIOSWindowHeight() : getSize("Height");
        var c = getSize("Width"),
            b = Math.min(a / CANVAS_HEIGHT, c / CANVAS_WIDTH);
        c > a ? (EDGEBOARD_X = 0, EDGEBOARD_Y = 570, s_bLandscape = !0) : (EDGEBOARD_X = 470, EDGEBOARD_Y = 0, s_bLandscape = !1);
        var d = Math.round(CANVAS_WIDTH * b);
        b = Math.round(CANVAS_HEIGHT * b);
        if (b < a) {
            var g = a - b;
            b += g;
            d += CANVAS_WIDTH / CANVAS_HEIGHT * g
        } else d < c && (g = c - d, d += g, b += CANVAS_HEIGHT / CANVAS_WIDTH * g);
        g = a / 2 - b / 2;
        var e = c /
            2 - d / 2,
            f = CANVAS_WIDTH / d;
        if (e * f < -EDGEBOARD_X || g * f < -EDGEBOARD_Y) b = Math.min(a / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y), c / (CANVAS_WIDTH - 2 * EDGEBOARD_X)), d = Math.round(CANVAS_WIDTH * b), b = Math.round(CANVAS_HEIGHT * b), g = (a - b) / 2, e = (c - d) / 2, f = CANVAS_WIDTH / d;
        s_iOffsetX = -1 * e * f;
        s_iOffsetY = -1 * g * f;
        0 <= g && (s_iOffsetY = 0);
        0 <= e && (s_iOffsetX = 0);
        null !== s_oGame && s_oGame.refreshButtonPos();
        null !== s_oMenu && s_oMenu.refreshButtonPos();
        null !== s_oSelectPanel && s_oSelectPanel.refreshButtonPos();
        s_bIsIphone ? (canvas = document.getElementById("canvas"),
            s_oStage.canvas.width = 2 * d, s_oStage.canvas.height = 2 * b, canvas.style.width = d + "px", canvas.style.height = b + "px", s_iScaleFactor = 2 * Math.min(d / CANVAS_WIDTH, b / CANVAS_HEIGHT), s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor) : s_bMobile || isChrome() ? ($("#canvas").css("width", d + "px"), $("#canvas").css("height", b + "px")) : (s_oStage.canvas.width = d, s_oStage.canvas.height = b, s_iScaleFactor = Math.min(d / CANVAS_WIDTH, b / CANVAS_HEIGHT), s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor);
        0 > g || (g = (a - b) / 2);
        $("#canvas").css("top", g + "px");
        $("#canvas").css("left", e + "px");
        fullscreenHandler()
    }
}

function createBitmap(a, c, b) {
    var d = new createjs.Bitmap(a),
        g = new createjs.Shape;
    c && b ? g.graphics.beginFill("#fff").drawRect(0, 0, c, b) : g.graphics.beginFill("#ff0").drawRect(0, 0, a.width, a.height);
    d.hitArea = g;
    return d
}

function createSprite(a, c, b, d, g, e) {
    a = null !== c ? new createjs.Sprite(a, c) : new createjs.Sprite(a);
    c = new createjs.Shape;
    c.graphics.beginFill("#000000").drawRect(-b, -d, g, e);
    a.hitArea = c;
    return a
}

function randomFloatBetween(a, c, b) {
    "undefined" === typeof b && (b = 2);
    return parseFloat(Math.min(a + Math.random() * (c - a), c).toFixed(b))
}

function rotateVector2D(a, c) {
    var b = c.getX() * Math.cos(a) + c.getY() * Math.sin(a),
        d = c.getX() * -Math.sin(a) + c.getY() * Math.cos(a);
    c.set(b, d)
}

function tweenVectorsOnX(a, c, b) {
    return a + b * (c - a)
}
this.tweenVectors = function(a, c, b) {
    var d = new CVector2;
    d.set(a.getX() + b * (c.getX() - a.getX()), a.getY() + b * (c.getY() - a.getY()));
    return d
};

function shuffle(a) {
    for (var c = a.length, b, d; 0 !== c;) d = Math.floor(Math.random() * c), --c, b = a[c], a[c] = a[d], a[d] = b;
    return a
}

function bubbleSort(a) {
    do {
        var c = !1;
        for (var b = 0; b < a.length - 1; b++) a[b] > a[b + 1] && (c = a[b], a[b] = a[b + 1], a[b + 1] = c, c = !0)
    } while (c)
}

function compare(a, c) {
    return a.index > c.index ? -1 : a.index < c.index ? 1 : 0
}

function easeLinear(a, c, b, d) {
    return b * a / d + c
}

function easeInQuad(a, c, b, d) {
    return b * (a /= d) * a + c
}

function easeInSine(a, c, b, d) {
    return -b * Math.cos(a / d * (Math.PI / 2)) + b + c
}

function easeInCubic(a, c, b, d) {
    return b * (a /= d) * a * a + c
}

function getTrajectoryPoint(a, c) {
    var b = new createjs.Point,
        d = (1 - a) * (1 - a),
        g = a * a;
    b.x = d * c.start.x + 2 * (1 - a) * a * c.traj.x + g * c.end.x;
    b.y = d * c.start.y + 2 * (1 - a) * a * c.traj.y + g * c.end.y;
    return b
}

function formatTime(a) {
    a /= 1E3;
    var c = Math.floor(a / 60);
    a = Math.floor(a - 60 * c);
    var b = "";
    b = 10 > c ? b + ("0" + c + ":") : b + (c + ":");
    return 10 > a ? b + ("0" + a) : b + a
}

function degreesToRadians(a) {
    return a * Math.PI / 180
}

function checkRectCollision(a, c) {
    var b = getBounds(a, .9);
    var d = getBounds(c, .98);
    return calculateIntersection(b, d)
}

function distance(a, c) {
    return Math.sqrt((c.x - a.x) * (c.x - a.x) + (c.y - a.y) * (c.y - a.y))
}

function collisionWithCircle(a, c, b) {
    var d = a.getX() - c.getX();
    a = a.getY() - c.getY();
    return Math.sqrt(d * d + a * a) < PLAYER_RADIUS * b + CELL_SIZE * b ? !0 : !1
}

function calculateIntersection(a, c) {
    var b, d, g, e;
    var f = a.x + (b = a.width / 2);
    var l = a.y + (d = a.height / 2);
    var k = c.x + (g = c.width / 2);
    var q = c.y + (e = c.height / 2);
    f = Math.abs(f - k) - (b + g);
    l = Math.abs(l - q) - (d + e);
    return 0 > f && 0 > l ? (f = Math.min(Math.min(a.width, c.width), -f), l = Math.min(Math.min(a.height, c.height), -l), {
        x: Math.max(a.x, c.x),
        y: Math.max(a.y, c.y),
        width: f,
        height: l,
        rect1: a,
        rect2: c
    }) : null
}

function getBounds(a, c) {
    var b = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
    };
    if (a instanceof createjs.Container) {
        b.x2 = -Infinity;
        b.y2 = -Infinity;
        var d = a.children,
            g = d.length,
            e;
        for (e = 0; e < g; e++) {
            var f = getBounds(d[e], 1);
            f.x < b.x && (b.x = f.x);
            f.y < b.y && (b.y = f.y);
            f.x + f.width > b.x2 && (b.x2 = f.x + f.width);
            f.y + f.height > b.y2 && (b.y2 = f.y + f.height)
        }
        Infinity == b.x && (b.x = 0);
        Infinity == b.y && (b.y = 0);
        Infinity == b.x2 && (b.x2 = 0);
        Infinity == b.y2 && (b.y2 = 0);
        b.width = b.x2 - b.x;
        b.height = b.y2 - b.y;
        delete b.x2;
        delete b.y2
    } else {
        if (a instanceof createjs.Bitmap) {
            g =
                a.sourceRect || a.image;
            e = g.width * c;
            var l = g.height * c
        } else if (a instanceof createjs.Sprite)
            if (a.spriteSheet._frames && a.spriteSheet._frames[a.currentFrame] && a.spriteSheet._frames[a.currentFrame].image) {
                g = a.spriteSheet.getFrame(a.currentFrame);
                e = g.rect.width;
                l = g.rect.height;
                d = g.regX;
                var k = g.regY
            } else b.x = a.x || 0, b.y = a.y || 0;
        else b.x = a.x || 0, b.y = a.y || 0;
        d = d || 0;
        e = e || 0;
        k = k || 0;
        l = l || 0;
        b.regX = d;
        b.regY = k;
        g = a.localToGlobal(0 - d, 0 - k);
        f = a.localToGlobal(e - d, l - k);
        e = a.localToGlobal(e - d, 0 - k);
        d = a.localToGlobal(0 - d, l - k);
        b.x =
            Math.min(Math.min(Math.min(g.x, f.x), e.x), d.x);
        b.y = Math.min(Math.min(Math.min(g.y, f.y), e.y), d.y);
        b.width = Math.max(Math.max(Math.max(g.x, f.x), e.x), d.x) - b.x;
        b.height = Math.max(Math.max(Math.max(g.y, f.y), e.y), d.y) - b.y
    }
    return b
}

function NoClickDelay(a) {
    this.element = a;
    window.Touch && this.element.addEventListener("touchstart", this, !1)
}

function shuffle(a) {
    for (var c = a.length, b, d; 0 < c;) d = Math.floor(Math.random() * c), c--, b = a[c], a[c] = a[d], a[d] = b;
    return a
}
NoClickDelay.prototype = {
    handleEvent: function(a) {
        switch (a.type) {
            case "touchstart":
                this.onTouchStart(a);
                break;
            case "touchmove":
                this.onTouchMove(a);
                break;
            case "touchend":
                this.onTouchEnd(a)
        }
    },
    onTouchStart: function(a) {
        a.preventDefault();
        this.moved = !1;
        this.element.addEventListener("touchmove", this, !1);
        this.element.addEventListener("touchend", this, !1)
    },
    onTouchMove: function(a) {
        this.moved = !0
    },
    onTouchEnd: function(a) {
        this.element.removeEventListener("touchmove", this, !1);
        this.element.removeEventListener("touchend",
            this, !1);
        if (!this.moved) {
            a = document.elementFromPoint(a.changedTouches[0].clientX, a.changedTouches[0].clientY);
            3 == a.nodeType && (a = a.parentNode);
            var c = document.createEvent("MouseEvents");
            c.initEvent("click", !0, !0);
            a.dispatchEvent(c)
        }
    }
};
(function() {
    function a(a) {
        var b = {
            focus: "visible",
            focusin: "visible",
            pageshow: "visible",
            blur: "hidden",
            focusout: "hidden",
            pagehide: "hidden"
        };
        a = a || window.event;
        a.type in b ? document.body.className = b[a.type] : (document.body.className = this[c] ? "hidden" : "visible", "hidden" === document.body.className ? s_oMain.stopUpdate() : s_oMain.startUpdate())
    }
    var c = "hidden";
    c in document ? document.addEventListener("visibilitychange", a) : (c = "mozHidden") in document ? document.addEventListener("mozvisibilitychange", a) : (c = "webkitHidden") in
        document ? document.addEventListener("webkitvisibilitychange", a) : (c = "msHidden") in document ? document.addEventListener("msvisibilitychange", a) : "onfocusin" in document ? document.onfocusin = document.onfocusout = a : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = a
})();

function ctlArcadeResume() {
    null !== s_oMain && s_oMain.startUpdate()
}

function ctlArcadePause() {
    null !== s_oMain && s_oMain.stopUpdate()
}

function getParamValue(a) {
    for (var c = window.location.search.substring(1).split("&"), b = 0; b < c.length; b++) {
        var d = c[b].split("=");
        if (d[0] == a) return d[1]
    }
}

function playSound(a, c, b) {
    return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[a].play(), s_aSounds[a].volume(c), s_aSounds[a].loop(b), s_aSounds[a]) : null
}

function stopSound(a) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].stop()
}

function setVolume(a, c) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].volume(c)
}

function setMute(a, c) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].mute(c)
}

function fullscreenHandler() {
    ENABLE_FULLSCREEN && screenfull.isEnabled && (s_bFullscreen = screenfull.isFullscreen, null !== s_oInterface && s_oInterface.resetFullscreenBut(), null !== s_oMenu && s_oMenu.resetFullscreenBut(), null !== s_oSelectPanel && s_oSelectPanel.resetFullscreenBut())
}
if (screenfull.isEnabled) screenfull.on("change", function() {
    s_bFullscreen = screenfull.isFullscreen;
    null !== s_oInterface && s_oInterface.resetFullscreenBut();
    null !== s_oMenu && s_oMenu.resetFullscreenBut();
    null !== s_oSelectPanel && s_oSelectPanel.resetFullscreenBut()
});

function compareRank(a, c) {
    return a.rank < c.rank ? -1 : a.rank > c.rank ? 1 : 0
}

function printCards(a) {
    console.log("START PRINT");
    for (var c = 0; c < a.length; c++) console.log(c + "----\x3e" + a[c].getValue() + " suit " + a[c].getSuit());
    console.log("END PRINT")
}

function CSpriteLibrary() {
    var a = {},
        c, b, d, g, e, f;
    this.init = function(a, k, q) {
        c = {};
        d = b = 0;
        g = a;
        e = k;
        f = q
    };
    this.addSprite = function(d, f) {
        if (!a.hasOwnProperty(d)) {
            var g = new Image;
            a[d] = c[d] = {
                szPath: f,
                oSprite: g,
                bLoaded: !1
            };
            b++
        }
    };
    this.getSprite = function(b) {
        return a.hasOwnProperty(b) ? a[b].oSprite : null
    };
    this._onSpritesLoaded = function() {
        b = 0;
        e.call(f)
    };
    this._onSpriteLoaded = function() {
        g.call(f);
        ++d === b && this._onSpritesLoaded()
    };
    this.loadSprites = function() {
        for (var a in c) c[a].oSprite.oSpriteLibrary = this, c[a].oSprite.szKey =
            a, c[a].oSprite.onload = function() {
                this.oSpriteLibrary.setLoaded(this.szKey);
                this.oSpriteLibrary._onSpriteLoaded(this.szKey)
            }, c[a].oSprite.onerror = function(a) {
                var b = a.currentTarget;
                setTimeout(function() {
                    c[b.szKey].oSprite.src = c[b.szKey].szPath
                }, 500)
            }, c[a].oSprite.src = c[a].szPath
    };
    this.setLoaded = function(b) {
        a[b].bLoaded = !0
    };
    this.isLoaded = function(b) {
        return a[b].bLoaded
    };
    this.getNumSprites = function() {
        return b
    }
}
var CANVAS_WIDTH = 1920,
    CANVAS_HEIGHT = 1920,
    EDGEBOARD_X = 0,
    EDGEBOARD_Y = 0,
    FONT = "futura_t_otregular",
    ENABLE_FULLSCREEN, SOUNDTRACK_VOLUME_IN_GAME = .1,
    FPS = 30,
    DISABLE_SOUND_MOBILE = !1,
    STATE_LOADING = 0,
    STATE_MENU = 1,
    STATE_MODE = 2,
    STATE_GAME = 3,
    ON_MOUSE_DOWN = 0,
    ON_MOUSE_UP = 1,
    ON_MOUSE_OVER = 2,
    ON_MOUSE_OUT = 3,
    ON_BUT_YES_DOWN = 4,
    ON_BUT_NO_DOWN = 5,
    ON_BACK_MENU = 6,
    ON_RESTART = 7,
    ON_NEXT = 8,
    ON_CARD_ANIMATION_ENDING = 9,
    ON_CARD_MOVE_UP_END = 10,
    ON_CARD_MOVE_X_END = 11,
    ON_CARD_SHOWN = 12,
    ON_CARD_SWAP = 13,
    ON_CARD_DRAGGING = 14,
    ON_CARD_RELEASE =
    15,
    ON_CARD_END_SCALE = 16,
    ON_DECK_RELEASE = 17,
    ON_SELECT_COMBO = 18,
    CARD_STATE_DEALING = 0,
    CARD_DECK = 0,
    CARD_WASTE = 1,
    CARD_HAND = 2,
    CARD_TABLE = 3,
    CARD_WIDTH = 234,
    CARD_HEIGHT = 358,
    CARD_WIDTH_OFFSET_IN_HAND = 100,
    CARD_HEIGHT_OFFSET_IN_HAND = 100,
    TABLE_X = 150 + CARD_WIDTH / 2,
    TABLE_Y = 150 + CARD_HEIGHT / 2,
    TIME_CARD_DEALING = 200,
    TIME_CARD_MOVE_Y = 500,
    TIME_HELP_PLAYER = 3E4,
    MAX_TABLE_WIDTH = 1400,
    MAX_TABLE_HEIGHT = 1400,
    CARD_TO_DEAL = {},
    CARD_MOVE_UP_OFFSET = 160,
    CARD_CPU_MOVE_UP_OFFSET = 80,
    SCORE_TO_REACH = {},
    PLAYER_ID = 0,
    ACE_VALUE = 1,
    JOKER_VALUE =
    15,
    TIME_HAND_ANIM = 4E3,
    MIN_OPENING_VALUE, SCORE_ACE, SCORE_JOKER, JOKER_AVAILABLE, ACE_HIGH, GOING_RUMMY_RULE, MAX_NUM_SHUFFLE = 3,
    EVALUATE_POKER = 0,
    EVALUATE_TRIS = 1,
    EVALUATE_STRAIGHT = 2,
    EVALUATE_STRAIGHT_WITH_ACE_HIGH = 3,
    EVALUATE_UNDER_CONSTRUCTION = 4,
    EVALUATE_REPLACE_JOKER = 5,
    EVALUATE_NULL = 6,
    EVALUATE_CARD_NO_VALID_IN_COMBO = 7,
    STATE_AI_IDLE = 0,
    STATE_AI_READY_TO_START = 1,
    STATE_AI_CHECKED_WASTE = 2,
    STATE_AI_CARD_DEALING = 3,
    STATE_AI_CHECKED_COMBO = 4,
    STATE_AI_CHECKED_CARD_TABLE = 5,
    STATE_AI_DECIDE_CARD_WASTE = 6,
    SCOREBOARD_IDLE =
    "state_idle",
    SCOREBOARD_WIN_ROUND = "state_win_round",
    SCOREBOARD_WIN_GAME = "state_win_game",
    SCOREBOARD_LOSE_ROUND = "state_lose_round";

function CMain(a) {
    var c, b = 0,
        d = 0,
        g = STATE_LOADING,
        e, f;
    this.initContainer = function() {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage);
        s_oStage.preventSelection = !1;
        s_bMobile = isMobile();
        !1 === s_bMobile && s_oStage.enableMouseOver(20);
        s_iPrevTime = (new Date).getTime();
        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
        s_oSpriteLibrary = new CSpriteLibrary;
		e = new CPreloader;
        //seekAndDestroy() ? e = new CPreloader : window.location.href = "http://www.codethislab.com/contact-us.html"
    };
    this.preloaderReady = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
        this._loadImages();
        c = !0
    };
    this.soundLoaded = function() {
        b++;
        e.refreshLoader(Math.floor(b / d * 100))
    };
    this._initSounds = function() {
        Howler.mute(!s_bAudioActive);
        s_aSoundsInfo = [];
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "card_dealing",
            loop: !1,
            volume: 1,
            ingamename: "card_dealing"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "click",
            loop: !1,
            volume: 1,
            ingamename: "click"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "alert",
            loop: !1,
            volume: 1,
            ingamename: "alert"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "round_over",
            loop: !1,
            volume: 1,
            ingamename: "round_over"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "rummy",
            loop: !1,
            volume: 1,
            ingamename: "rummy"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "show_card",
            loop: !1,
            volume: 1,
            ingamename: "show_card"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "win",
            loop: !1,
            volume: 1,
            ingamename: "win"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "drop",
            loop: !1,
            volume: 1,
            ingamename: "drop"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "soundtrack",
            loop: !0,
            volume: 1,
            ingamename: "soundtrack"
        });
        d += s_aSoundsInfo.length;
        s_aSounds = [];
        for (var a = 0; a < s_aSoundsInfo.length; a++) this.tryToLoadSound(s_aSoundsInfo[a], !1)
    };
    this.tryToLoadSound = function(a, b) {
        setTimeout(function() {
            s_aSounds[a.ingamename] = new Howl({
                src: [a.path + a.filename + ".mp3"],
                autoplay: !1,
                preload: !0,
                loop: a.loop,
                volume: a.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(a, b) {
                    for (var c = 0; c < s_aSoundsInfo.length; c++)
                        if (a === s_aSounds[s_aSoundsInfo[c].ingamename]._sounds[0]._id) {
                            s_oMain.tryToLoadSound(s_aSoundsInfo[c], !0);
                            break
                        }
                },
                onplayerror: function(a) {
                    for (var b = 0; b < s_aSoundsInfo.length; b++)
                        if (a === s_aSounds[s_aSoundsInfo[b].ingamename]._sounds[0]._id) {
                            s_aSounds[s_aSoundsInfo[b].ingamename].once("unlock", function() {
                                s_aSounds[s_aSoundsInfo[b].ingamename].play();
                                "soundtrack" === s_aSoundsInfo[b].ingamename && null !== s_oGame &&
                                    setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME)
                            });
                            break
                        }
                }
            })
        }, b ? 200 : 0)
    };
    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_menu",
            "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no",
            "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_next", "./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("but_help", "./sprites/but_help.png");
        s_oSpriteLibrary.addSprite("but_settings", "./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("but_shuffle", "./sprites/but_shuffle.png");
        s_oSpriteLibrary.addSprite("waste_pile", "./sprites/waste_pile.png");
        s_oSpriteLibrary.addSprite("attach_card", "./sprites/attach_card.png");
        s_oSpriteLibrary.addSprite("hand_anim", "./sprites/hand_anim.png");
        s_oSpriteLibrary.addSprite("but_p2",
            "./sprites/but_p2.png");
        s_oSpriteLibrary.addSprite("but_p3", "./sprites/but_p3.png");
        s_oSpriteLibrary.addSprite("but_p4", "./sprites/but_p4.png");
        s_oSpriteLibrary.addSprite("bg_select", "./sprites/bg_select.jpg");
        s_oSpriteLibrary.addSprite("bg_nick", "./sprites/bg_nick.png");
        s_oSpriteLibrary.addSprite("row_scoreboard", "./sprites/row_scoreboard.png");
        s_oSpriteLibrary.addSprite("msg_box_wide", "./sprites/msg_box_wide.png");
        s_oSpriteLibrary.addSprite("header_scoreboard", "./sprites/header_scoreboard.png");
        s_oSpriteLibrary.addSprite("arrow_left", "./sprites/arrow_left.png");
        s_oSpriteLibrary.addSprite("arrow_right", "./sprites/arrow_right.png");
        s_oSpriteLibrary.addSprite("hand_swipe", "./sprites/hand_swipe.png");
        s_oSpriteLibrary.addSprite("card_shadow", "./sprites/cards/card_shadow.png");
        s_oSpriteLibrary.addSprite("double_icon", "./sprites/double_icon.png");
        s_oSpriteLibrary.addSprite("but_exit_credits", "./sprites/but_exit_credits.png");
        s_oSpriteLibrary.addSprite("msg_box_scoreboard", "./sprites/msg_box_scoreboard.png");
        for (var a = 0; 55 > a; a++) s_oSpriteLibrary.addSprite("card_" + a, "./sprites/cards/card_" + a + ".png");
        for (a = 1; 60 > a; a++) s_oSpriteLibrary.addSprite("rummy_anim_" + a, "./sprites/rummy_anim/rummy_anim_" + a + ".png");
        d += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites()
    };
    this._onImagesLoaded = function() {
        b++;
        e.refreshLoader(Math.floor(b / d * 100))
    };
    this._onRemovePreloader = function() {
        e.unload();
        s_oSoundTrack = playSound("soundtrack", 1, !0);
        this.gotoMenu()
    };
    this._onAllImagesLoaded = function() {};
    this.onAllPreloaderImagesLoaded =
        function() {
            this._loadImages()
        };
    this.gotoMenu = function() {
        new CMenu;
        g = STATE_MENU
    };
    this.gotoSelectPanel = function() {
        new CSelectNumPlayersPanel;
        g = STATE_MODE
    };
    this.gotoGame = function() {
        f = new CGame;
        g = STATE_GAME
    };
    this.stopUpdateNoBlock = function() {
        c = !1;
        createjs.Ticker.paused = !0
    };
    this.startUpdateNoBlock = function() {
        s_iPrevTime = (new Date).getTime();
        c = !0;
        createjs.Ticker.paused = !1
    };
    this.stopUpdate = function() {
        c = !1;
        createjs.Ticker.paused = !0;
        $("#block_game").css("display", "block");
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile ||
            Howler.mute(!0)
    };
    this.startUpdate = function() {
        s_iPrevTime = (new Date).getTime();
        c = !0;
        createjs.Ticker.paused = !1;
        $("#block_game").css("display", "none");
        (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) && s_bAudioActive && Howler.mute(!1)
    };
    this._update = function(a) {
        if (!1 !== c) {
            var b = (new Date).getTime();
            s_iTimeElaps = b - s_iPrevTime;
            s_iCntTime += s_iTimeElaps;
            s_iCntFps++;
            s_iPrevTime = b;
            1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps, s_iCntTime -= 1E3, s_iCntFps = 0);
            g === STATE_GAME && f.update();
            s_oStage.update(a)
        }
    };
    s_oMain = this;
    for (var l =
            2; 5 > l; l++) CARD_TO_DEAL["player_" + l] = a["num_cards_for_" + l + "_players"], 4 > CARD_TO_DEAL["player_" + l] ? CARD_TO_DEAL["player_" + l] = 4 : 13 < CARD_TO_DEAL["player_" + l] && (CARD_TO_DEAL["player_" + l] = 13);
    JOKER_AVAILABLE = a.joker_available;
    SCORE_TO_REACH.player_2 = a.score_to_reach_for_2_players;
    SCORE_TO_REACH.player_3 = a.score_to_reach_for_3_players;
    SCORE_TO_REACH.player_4 = a.score_to_reach_for_4_players;
    SCORE_ACE = a.score_ace;
    SCORE_JOKER = a.score_joker;
    ACE_HIGH = a.ace_high;
    GOING_RUMMY_RULE = a.going_rummy_rule;
    MIN_OPENING_VALUE =
        a.min_point_for_opening;
    ENABLE_FULLSCREEN = a.fullscreen;
    s_bAudioActive = a.audio_enable_on_startup;
    this.initContainer()
}
var s_bMobile, s_bAudioActive = !1,
    s_iCntTime = 0,
    s_iTimeElaps = 0,
    s_iPrevTime = 0,
    s_iCntFps = 0,
    s_iCurFps = 0,
    s_oStage, s_oMain, s_oSpriteLibrary, s_aSounds, s_aSoundsInfo, s_oSoundTrack = null,
    s_oCanvas, s_bFullscreen = !1,
    s_oGameSettings, s_iNumPlayers, s_aPlayerNames, TEXT_PLAYER = "PLAYER",
    TEXT_WINNER = "WINNER IS",
    TEXT_NICK = "NICKNAME",
    TEXT_SCORE = "SCORE",
    TEXT_WIN = "WIN",
    TEXT_POINTS = "POINTS",
    TEXT_CARDS = "CARDS",
    TEXT_GAME_OVER = "ROUND OVER",
    TEXT_SELECT_NUM = "SELECT NUMBER OF PLAYERS",
    TEXT_NO_WASTE = "YOU CAN'T DROP A CARD IN THE WASTE PILE BEFORE GETTING A CARD FROM THE DECK",
    TEXT_NO_DROP = "YOU CAN'T CREATE A COMBINATION BEFORE GETTING A CARD FROM THE DECK",
    TEXT_NOT_ENOUGH_POINTS = "NOT ENOUGH POINTS FOR OPENING",
    TEXT_INVALID_COMBO = "INVALID COMBINATION",
    TEXT_INVALID_CARD_IN_COMBO = "THIS CARD CAN'T BE USED FOR THIS COMBINATION!",
    TEXT_CANT_PLACE_CARDS_IF_NOT_OPENING = "CAN'T PLACE ANY CARD BEFORE OPENING. YOU NEED AT LEAST",
    TEXT_INCOMPLETE_COMBO = "ONE OF YOUR COMBINATION ON THE TABLE IS INCOMPLETE. DO YOU WANT TO REMOVE IT?",
    TEXT_REMOVE_COMBO = "DO YOU WANT TO REMOVE THIS COMBO?",
    TEXT_CANT_DISCARD_WASTE_CARD = "YOU CAN'T DISCARD A CARD YOU PICKED FROM THE WASTE PILE PREVIOUSLY",
    TEXT_PRELOADER_CONTINUE = "START",
    TEXT_DOUBLE = "DOUBLE SCORE",
    TEXT_ARE_YOU_SURE = "ARE YOU SURE?",
    TEXT_HELP_WASTE = "DISCARD A CARD IN THE WASTE PILE!",
    TEXT_HELP_TITLE = ["RULES", "STOCK PILE", "MELDS", "SCORING"],
    TEXT_TRIS = "TRIS",
    TEXT_POKER = "POKER",
    TEXT_STRAIGHT = "STRAIGHT",
    TEXT_HELP_0 = "RUMMY IS A CARD GAME WHERE THE AIM IS TO PUT ALL YOUR CARDS INTO COMBINATION BEFORE YOUR OPPONENTS. WHEN THE GAME STARTS, EACH PLAYER RECEIVES ",
    TEXT_HELP_1 = "ONCE ALL CARDS ARE DEALED TO ALL THE PLAYERS, THE REMAINING CARDS ARE PLACED FACE DOWN ON THE TABLE, FORMING THE STOCK.THE TOP CARD IS TURNED UPWARD IN THE WASTE PILE.",
    TEXT_HELP_2 = "EACH TURN, THE CURRENT PLAYER CAN CHOOSE TO PICK UP THE CARD FROM THE WASTE PILE OR FROM THE STOCK.",
    TEXT_HELP_3 = "THE PLAYER CHECKS IF HE CAN PLACE ON THE TABLE ONE OR MORE COMBINATIONS OR JUST DISCARD A CARD FROM HIS OWN HAND",
    TEXT_HELP_4 = "WHEN A PLAYER PLACES ALL THE CARDS, HE WINS THE ROUND. THE WINNING SCORE IS THE SUM OF THE CARD RANKS OF ALL THE OPPONENTS. FACE CARDS COUNT 10 EACH, ACES",
    TEXT_HELP_5 = "EACH, AND EVERY OTHER CARD THEIR VALUE.",
    TEXT_HELP_6 = "THE FIRST PLAYER THAT REACHES THE SCORE OF",
    TEXT_HELP_7 = "WINS THE GAME!",
    TEXT_HELP_8 = "YOU CAN START PLACING CARDS ONLY ONCE THE SUM OF THE CARD RANKS IS AT LEAST ",
    TEXT_HELP_9 = "IF THE WINNER PLACES ALL CARDS IN 1 TURN, HE DOUBLES THE POINTS!",
    TEXT_DEVELOPED = "DEVELOPED BY",
    TEXT_ERR_LS = "YOUR WEB BROWSER DOES NOT SUPPORT LOCAL STORAGE. IF YOU'RE USING SAFARI, IT MAY BE RELATED TO PRIVATE BROWSING. AS A RESULT, SOME INFO MAY NOT BE SAVED OR SOME FEATURES MAY NOT BE AVAILABLE.",
    TEXT_SHARE_IMAGE = "200x200.jpg",
    TEXT_SHARE_TITLE = "Congratulations!",
    TEXT_SHARE_MSG1 = "You collected <strong>",
    TEXT_SHARE_MSG2 = " points</strong>!<br><br>Share your score with your friends!",
    TEXT_SHARE_SHARE1 = "My score is ",
    TEXT_SHARE_SHARE2 = "points! Can you do better";

function CPreloader() {
    var a, c, b, d, g, e, f, l, k, q;
    this._init = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("200x200", "./sprites/200x200.jpg");
        s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
        s_oSpriteLibrary.loadSprites();
        q = new createjs.Container;
        s_oStage.addChild(q)
    };
    this.unload = function() {
        q.removeAllChildren();
        k.unload()
    };
    this._onImagesLoaded = function() {};
    this._onAllImagesLoaded = function() {
        this.attachSprites();
        s_oMain.preloaderReady()
    };
    this.attachSprites = function() {
        var h = new createjs.Shape;
        h.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        q.addChild(h);
        h = s_oSpriteLibrary.getSprite("200x200");
        f = createBitmap(h);
        f.regX = .5 * h.width;
        f.regY = .5 * h.height;
        f.x = CANVAS_WIDTH / 2;
        f.y = CANVAS_HEIGHT / 2 - 180;
        q.addChild(f);
        l = new createjs.Shape;
        l.graphics.beginFill("rgba(0,0,0,0.01)").drawRoundRect(f.x - 100, f.y - 100, 200, 200, 10);
        q.addChild(l);
        f.mask = l;
        h = s_oSpriteLibrary.getSprite("progress_bar");
        d = createBitmap(h);
        d.x = CANVAS_WIDTH / 2 - h.width / 2;
        d.y = CANVAS_HEIGHT / 2 + 50;
        q.addChild(d);
        a = h.width;
        c = h.height;
        g = new createjs.Shape;
        g.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(d.x, d.y, 1, c);
        q.addChild(g);
        d.mask = g;
        b = new createjs.Text("", "40px " + FONT, "#fff");
        b.x = CANVAS_WIDTH / 2;
        b.y = CANVAS_HEIGHT / 2 + 110;
        b.textBaseline = "alphabetic";
        b.textAlign = "center";
        q.addChild(b);
        h = s_oSpriteLibrary.getSprite("but_start");
        k = new CTextButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, h, TEXT_PRELOADER_CONTINUE,
            "Arial", "#000", "bold 50", q);
        k.addEventListener(ON_MOUSE_UP, this._onButStartRelease, this);
        k.setVisible(!1);
        e = new createjs.Shape;
        e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        q.addChild(e);
        createjs.Tween.get(e).to({
            alpha: 0
        }, 500).call(function() {
            createjs.Tween.removeTweens(e);
            q.removeChild(e)
        })
    };
    this._onButStartRelease = function() {
        s_oMain._onRemovePreloader()
    };
    this.refreshLoader = function(f) {
        b.text = f + "%";
        100 === f && (s_oMain._onRemovePreloader(), b.visible = !1, d.visible = !1);
        g.graphics.clear();
        f = Math.floor(f * a / 100);
        g.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(d.x, d.y, f, c)
    };
    this._init()
}

function CTextButton(a, c, b, d, g, e, f, l) {
    var k, q, h, m, n, p, w, t, v, z, B, F;
    this._init = function(a, b, c, d, f, g, e, l) {
        k = !1;
        m = [];
        n = [];
        F = createBitmap(c);
        q = c.width;
        h = c.height;
        var t = Math.ceil(e / 20);
        z = new createjs.Text(d, e + "px " + f, "#000000");
        var p = z.getBounds();
        z.textAlign = "center";
        z.lineWidth = .9 * q;
        z.textBaseline = "alphabetic";
        z.x = c.width / 2 + t;
        z.y = Math.floor(c.height / 2) + p.height / 3 + t;
        B = new createjs.Text(d, e + "px " + f, g);
        B.textAlign = "center";
        B.textBaseline = "alphabetic";
        B.lineWidth = .9 * q;
        B.x = c.width / 2;
        B.y = Math.floor(c.height /
            2) + p.height / 3;
        v = new createjs.Container;
        v.x = a;
        v.y = b;
        v.regX = c.width / 2;
        v.regY = c.height / 2;
        s_bMobile || (v.cursor = "pointer");
        v.addChild(F, z, B);
        !1 !== l && s_oStage.addChild(v);
        this._initListener()
    };
    this.unload = function() {
        v.off("mousedown", p);
        v.off("pressup", w);
        s_oStage.removeChild(v)
    };
    this.setVisible = function(a) {
        v.visible = a
    };
    this.setAlign = function(a) {
        B.textAlign = a;
        z.textAlign = a
    };
    this.enable = function() {
        k = !1;
        F.filters = [];
        F.cache(0, 0, q, h)
    };
    this.disable = function() {
        k = !0;
        var a = (new createjs.ColorMatrix).adjustSaturation(-100).adjustBrightness(40);
        F.filters = [new createjs.ColorMatrixFilter(a)];
        F.cache(0, 0, q, h)
    };
    this._initListener = function() {
        p = v.on("mousedown", this.buttonDown);
        w = v.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(a, b, c) {
        m[a] = b;
        n[a] = c
    };
    this.addEventListenerWithParams = function(a, b, c, d) {
        m[a] = b;
        n[a] = c;
        t = d
    };
    this.buttonRelease = function() {
        k || (playSound("click", 1, !1), v.scaleX = 1, v.scaleY = 1, m[ON_MOUSE_UP] && m[ON_MOUSE_UP].call(n[ON_MOUSE_UP], t))
    };
    this.buttonDown = function() {
        k || (v.scaleX = .9, v.scaleY = .9, m[ON_MOUSE_DOWN] && m[ON_MOUSE_DOWN].call(n[ON_MOUSE_DOWN]))
    };
    this.setPosition = function(a, b) {
        v.x = a;
        v.y = b
    };
    this.changeText = function(a) {
        B.text = a;
        z.text = a
    };
    this.setX = function(a) {
        v.x = a
    };
    this.setY = function(a) {
        v.y = a
    };
    this.getButtonImage = function() {
        return v
    };
    this.getX = function() {
        return v.x
    };
    this.getY = function() {
        return v.y
    };
    this.getSprite = function() {
        return v
    };
    this._init(a, c, b, d, g, e, f, l);
    return this
}

function CToggle(a, c, b, d, g) {
    var e, f, l, k = [],
        q, h, m;
    this._init = function(a, b, c, d) {
        f = [];
        l = [];
        var h = new createjs.SpriteSheet({
            images: [c],
            frames: {
                width: c.width / 2,
                height: c.height,
                regX: c.width / 2 / 2,
                regY: c.height / 2
            },
            animations: {
                state_true: 0,
                state_false: 1
            }
        });
        e = d;
        m = createSprite(h, "state_" + e, c.width / 2 / 2, c.height / 2, c.width / 2, c.height);
        m.mouseEnabled = !0;
        m.x = a;
        m.y = b;
        m.cursor = "pointer";
        g.addChild(m);
        this._initListener()
    };
    this.unload = function() {
        m.off("mousedown", q);
        m.off("pressup", h);
        m.mouseEnabled = !1;
        g.removeChild(m)
    };
    this._initListener = function() {
        q = m.on("mousedown", this.buttonDown);
        h = m.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(a, b, c) {
        f[a] = b;
        l[a] = c
    };
    this.addEventListenerWithParams = function(a, b, c, d) {
        f[a] = b;
        l[a] = c;
        k = d
    };
    this.setActive = function(a) {
        e = a;
        m.gotoAndStop("state_" + e)
    };
    this.buttonRelease = function() {
        m.scaleX = 1;
        m.scaleY = 1;
        playSound("click", 1, !1);
        e = !e;
        m.gotoAndStop("state_" + e);
        f[ON_MOUSE_UP] && f[ON_MOUSE_UP].call(l[ON_MOUSE_UP], k)
    };
    this.buttonDown = function() {
        m.scaleX = .9;
        m.scaleY = .9;
        f[ON_MOUSE_DOWN] &&
            f[ON_MOUSE_DOWN].call(l[ON_MOUSE_DOWN], k)
    };
    this.setPosition = function(a, b) {
        m.x = a;
        m.y = b
    };
    this.setVisible = function(a) {
        m.visible = a
    };
    this.setMask = function(a) {
        m.mask = a
    };
    this.getButtonImage = function() {
        return m
    };
    this._init(a, c, b, d)
}

function CGfxButton(a, c, b, d) {
    var g, e, f, l, k, q = [],
        h, m = this;
    this._init = function(a, b, c) {
        g = 1;
        l = [];
        k = [];
        h = createBitmap(c);
        h.x = a;
        h.y = b;
        h.regX = c.width / 2;
        h.regY = c.height / 2;
        h.cursor = "pointer";
        n.addChild(h);
        this._initListener()
    };
    this.unload = function() {
        h.off("mousedown", e);
        h.off("pressup", f);
        n.removeChild(h)
    };
    this.setVisible = function(a) {
        h.visible = a
    };
    this.setScale = function(a) {
        g = a;
        h.scaleX = h.scaleY = g
    };
    this._initListener = function() {
        e = h.on("mousedown", this.buttonDown);
        f = h.on("pressup", this.buttonRelease)
    };
    this.addEventListener =
        function(a, b, c) {
            l[a] = b;
            k[a] = c
        };
    this.addEventListenerWithParams = function(a, b, c, d) {
        l[a] = b;
        k[a] = c;
        q = d
    };
    this.buttonRelease = function() {
        h.scaleX = g;
        h.scaleY = g;
        l[ON_MOUSE_UP] && l[ON_MOUSE_UP].call(k[ON_MOUSE_UP], q)
    };
    this.buttonDown = function() {
        h.scaleX = .9 * g;
        h.scaleY = .9 * g;
        playSound("click", 1, !1);
        l[ON_MOUSE_DOWN] && l[ON_MOUSE_DOWN].call(k[ON_MOUSE_DOWN], q)
    };
    this.setScale = function(a) {
        g = a;
        h.scaleX = a;
        h.scaleY = a
    };
    this.setPosition = function(a, b) {
        h.x = a;
        h.y = b
    };
    this.pulseAnimation = function() {
        createjs.Tween.get(h).to({
            scaleX: 1.1 *
                g,
            scaleY: 1.1 * g
        }, 850, createjs.Ease.quadOut).to({
            scaleX: g,
            scaleY: g
        }, 650, createjs.Ease.quadIn).call(function() {
            m.pulseAnimation()
        })
    };
    this.setX = function(a) {
        h.x = a
    };
    this.setY = function(a) {
        h.y = a
    };
    this.setMask = function(a) {
        h.mask = a
    };
    this.getButtonImage = function() {
        return h
    };
    this.getX = function() {
        return h.x
    };
    this.getY = function() {
        return h.y
    };
    var n = d;
    this._init(a, c, b);
    return this
}

function CMenu() {
    var a, c, b, d, g, e, f, l, k = null,
        q = null,
        h, m, n;
    this._init = function() {
        h = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(h);
        (new CRummyAnim(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100, s_oStage)).show(!0);
        f = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 250, s_oSpriteLibrary.getSprite("but_play"), s_oStage);
        f.addEventListener(ON_MOUSE_UP, this._onStart, this, 0);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) {
            var p = s_oSpriteLibrary.getSprite("audio_icon");
            g = CANVAS_WIDTH - p.height / 2 - 10;
            e = p.height / 2 + 10;
            m = new CToggle(g, e, p, s_bAudioActive, s_oStage);
            m.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this)
        }
        p = s_oSpriteLibrary.getSprite("but_credits");
        b = p.width / 2 + 10;
        d = p.height / 2 + 10;
        l = new CGfxButton(b, d, p, s_oStage);
        l.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
        p = window.document;
        var w = p.documentElement;
        k = w.requestFullscreen || w.mozRequestFullScreen || w.webkitRequestFullScreen || w.msRequestFullscreen;
        q = p.exitFullscreen || p.mozCancelFullScreen || p.webkitExitFullscreen || p.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (k = !1);
        k && screenfull.isEnabled && (p = s_oSpriteLibrary.getSprite("but_fullscreen"), a = b + p.width / 2 + 10, c = p.height / 2 + 10, n = new CToggle(a, c, p, s_bFullscreen, s_oStage), n.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        var t = new createjs.Shape;
        t.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(t);
        createjs.Tween.get(t).to({
            alpha: 0
        }, 1E3).call(function() {
            t.visible = !1
        });
        setVolume("soundtrack", 1);
        this.refreshButtonPos()
    };
    this.unload = function() {
        f.unload();
        l.unload();
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) m.unload(), m = null;
        k && screenfull.isEnabled && n.unload();
        s_oMenu = null;
        s_oStage.removeAllChildren()
    };
    this.refreshButtonPos = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || m.setPosition(g - s_iOffsetX, s_iOffsetY + e);
        k && screenfull.isEnabled && n.setPosition(a + s_iOffsetX, c + s_iOffsetY);
        l.setPosition(b + s_iOffsetX, s_iOffsetY + d)
    };
    this._onStart = function() {
        $(s_oMain).trigger("start_session");
        s_oMenu.unload();
        s_oMain.gotoSelectPanel()
    };
    this._onAudioToggle =
        function() {
            Howler.mute(s_bAudioActive);
            s_bAudioActive = !s_bAudioActive
        };
    this._onCreditsBut = function() {
        new CCreditsPanel
    };
    this.resetFullscreenBut = function() {
        k && screenfull.isEnabled && n.setActive(s_bFullscreen)
    };
    this._onFullscreenRelease = function() {
        s_bFullscreen ? q.call(window.document) : k.call(window.document.documentElement);
        sizeHandler()
    };
    s_oMenu = this;
    this._init()
}
var s_oMenu = null;

function CGame() {
    var a, c, b, d, g, e = !0,
        f = 0,
        l, k, q, h, m, n, p, w, t, v, z, B, F, H, u, N, S, R, M;
    this._init = function() {
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        s_oGameSettings = new CDeckController;
        l = Math.floor(Math.random() * s_iNumPlayers);
        k = f;
        var b = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(b);
        s_oHandEvaluator = new CHandEvaluatorController;
        u = new CTableController;
        u.addEventListener(ON_DECK_RELEASE, this._onDeckRelease, this);
        R = new createjs.Container;
        s_oStage.addChild(R);
        this._initHandPlayers();
        M = _oBg = new createjs.Shape;
        M.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        w = M.on("click", function() {});
        s_oStage.addChild(M);
        this.reset();
        v = new CInterface;
        B = new CAlertText;
        H = new CChoosePanel;
        H.addEventListener(ON_BUT_YES_DOWN, this.removeComboIncomplete, this);
        F = new CAreYouSurePanel(s_oStage);
        F.addEventListener(ON_BUT_YES_DOWN, this.onConfirmExit, this);
        N = new CGameOverPanel;
        S = new CWinPanel;
        t = new CAiController;
        v.showHelp();
        z = new CRummyAnim(CANVAS_WIDTH / 2, CANVAS_HEIGHT /
            2, s_oStage);
        this.refreshButtonPos();
        a = !0
    };
    this.unload = function() {
        v.unload();
        u.unload();
        H.unload();
        M.off("click", w);
        N.unload();
        S.unload();
        F.unload();
        s_oGame = null;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren()
    };
    this.refreshButtonPos = function() {
        u.refreshButtonPos();
        this.refreshGridScale();
        v.refreshButtonPos();
        for (var a = 0; a < h.length; a++) h[a].refreshButtonPos(), m[a].refreshButtonPos()
    };
    this.refreshGridScale = function() {
        var a = CANVAS_WIDTH - 2 * s_iOffsetX;
        if (s_bLandscape) {
            var b = CANVAS_HEIGHT -
                2 * s_iOffsetY;
            CUR_GRID_SCALE = b / MAX_TABLE_HEIGHT
        } else b = CANVAS_HEIGHT - 2 * s_iOffsetY, CUR_GRID_SCALE = Math.min(b, a) / MAX_TABLE_WIDTH;
        1 >= CUR_GRID_SCALE && (CUR_GRID_SCALE = parseFloat(CUR_GRID_SCALE.toFixed(2)));
        u.refreshGridScale(a)
    };
    this.reset = function() {
        c = !0;
        e = d = b = g = !1;
        q = 0;
        n = [];
        p = null;
        u.reset();
        0 === k ? this.blockControls(!1) : this.blockControls(!0)
    };
    this.restart = function() {
        f++;
        f === s_iNumPlayers && (f = 0);
        k = l = f;
        u.restart();
        for (var b = 0; b < h.length; b++) h[b].restart(), m[b].refreshText(s_aPlayerNames[b] + ": " + h[b].getTotalScore());
        this.reset();
        this.dealCardToPlayer();
        a = !0
    };
    this.exitFromHelpPanel = function() {
        !1 === d ? this.dealCardToPlayer() : this.setUpdate(!0)
    };
    this._initHandPlayers = function() {
        if (2 === s_iNumPlayers) {
            var a = [{
                x: CANVAS_WIDTH / 2,
                y: CANVAS_HEIGHT - CARD_MOVE_UP_OFFSET
            }, {
                x: CANVAS_WIDTH / 2,
                y: CARD_MOVE_UP_OFFSET
            }];
            var b = [{
                dir_x: 0,
                dir_y: -1
            }, {
                dir_x: 0,
                dir_y: 1
            }];
            var c = [0, 180]
        } else a = [{
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - CARD_MOVE_UP_OFFSET
        }, {
            x: CARD_MOVE_UP_OFFSET,
            y: CANVAS_HEIGHT / 2
        }, {
            x: CANVAS_WIDTH / 2,
            y: CARD_MOVE_UP_OFFSET
        }, {
            x: CANVAS_WIDTH -
                CARD_MOVE_UP_OFFSET,
            y: CANVAS_HEIGHT / 2
        }], b = [{
            dir_x: 0,
            dir_y: -1
        }, {
            dir_x: 1,
            dir_y: 0
        }, {
            dir_x: 0,
            dir_y: 1
        }, {
            dir_x: -1,
            dir_y: 0
        }], c = [0, 90, 180, -90];
        h = [];
        m = [];
        for (var d = 0; d < s_iNumPlayers; d++) h[d] = new CCardHandDisplay(d, b[d], a[d], c[d], R), m[d] = new CNickLabel(a[d], b[d], c[d], s_aPlayerNames[d] + ": " + h[d].getTotalScore(), s_oStage)
    };
    this.dealCardToPlayer = function() {
        d = !0;
        var a = u.getNextCard(),
            b = h[l].getPos();
        b = u.getLocalPos(b);
        a.initMov(CARD_HAND, CARD_STATE_DEALING, TIME_CARD_DEALING, h[l].getRot(), b);
        n.push(a);
        return a
    };
    this.dealCardInWastePile = function() {
        var a = u.getNextCard();
        a.initMov(CARD_WASTE, CARD_STATE_DEALING, TIME_CARD_DEALING, Math.floor(7 * Math.random()) - 3, u.getWastePilePos(), !0);
        n.push(a)
    };
    this.dealCardFromWaste = function() {
        var a = u.removeLastCardInWastePile(),
            b = h[l].getPos();
        b = u.getLocalPos(b);
        a.addEventListener(ON_CARD_ANIMATION_ENDING, this._onCardAnimEnd);
        a.initMov(CARD_HAND, CARD_STATE_DEALING, TIME_CARD_DEALING, h[l].getRot(), b);
        n.push(a)
    };
    this.blockControls = function(a) {
        M.visible = a
    };
    this._checkIfComboIsValid =
        function(a) {
            if (2 > a.length) return !1
        };
    this._checkComboUnderConstruction = function(a, b) {
        var c = u.getComboOnTable(a),
            d = c.getCopyCards();
        if (2 <= d.length) {
            if (2 < d.length && b.getValue() !== JOKER_VALUE && s_oHandEvaluator.checkIfCanReplaceJoker(d, c.getType(), b)) return EVALUATE_REPLACE_JOKER;
            d.push(b);
            c = s_oHandEvaluator.evaluate(!0, d);
            return c.res === EVALUATE_NULL ? EVALUATE_CARD_NO_VALID_IN_COMBO : c.res
        }
        if (0 === d.length || b.getValue() === JOKER_VALUE || d[0].getValue() === JOKER_VALUE) return EVALUATE_UNDER_CONSTRUCTION;
        if (1 ===
            d.length) {
            c = d[0].getValue();
            var f = b.getValue();
            d = d[0].getSuit();
            var g = b.getSuit();
            if (c === f) {
                if (d !== g) return EVALUATE_UNDER_CONSTRUCTION
            } else if ((c === f + 1 || c === f - 1 || this._checkStraightWithAceHigh(c, f)) && d === g) return EVALUATE_UNDER_CONSTRUCTION
        }
        return EVALUATE_NULL
    };
    this._checkStraightWithAceHigh = function(a, b) {
        if (!ACE_HIGH) return !1;
        if (a === ACE_VALUE) {
            if (13 === b) return !0
        } else if (b === ACE_VALUE && 13 === a) return !0;
        return !1
    };
    this.removeCombo = function(a) {
        u.resetCombo(a)
    };
    this.resetTimeElaps = function() {
        q = 0
    };
    this._changeTurn =
        function() {
            g = !1;
            m[k].highlight(!1);
            k++;
            k === s_iNumPlayers && (k = 0);
            m[k].highlight(!0);
            h[k].setNumCardsAtTurnStart();
            l = k;
            p = null;
            u.endTurn();
            e = !1;
            k === PLAYER_ID ? (q = 0, this.blockControls(!1), u.showHandAnim(!0), u.setClickableDeck(!0)) : (this.blockControls(!0), t.startCheck(h[k].getCards()))
        };
    this._onCardAnimEnd = function(a, d) {
        switch (a) {
            case CARD_HAND:
                c ? (h[l].addCard(d), l++, l === s_iNumPlayers && (l = 0), h[l].getNumCards() === CARD_TO_DEAL["player_" + s_iNumPlayers] ? (h[PLAYER_ID].activateCardListener(), s_oGame.dealCardInWastePile(),
                    k === PLAYER_ID ? u.showHandAnim(!0) : t.startCheck(h[k].getCards()), l = k, b = !0) : s_oGame.dealCardToPlayer()) : (h[k].addCard(d), h[k].activateCardListener());
                break;
            case CARD_WASTE:
                d.setClickable(!0), d.addEventListener(ON_CARD_DRAGGING, s_oGame._checkCollisionBetweenCardAndHand, s_oGame), d.addEventListener(ON_CARD_RELEASE, s_oGame._releaseWasteCard, s_oGame), u.addFirstCardInWastePile(d), c = !1, u.setClickableDeck(!0), m[k].highlight(!0)
        }
    };
    this.addCardToWastePile = function(a, b) {
        u.addCardToWastePile(a);
        void 0 === b ? h[k].removeCardFromHand(a) :
            h[k].removeCardFromHandByIndex(b);
        this.compactCards();
        0 === h[k].getNumCards() ? this.gameOver(!1) : this._changeTurn()
    };
    this.addCardToAttachArea = function(a, b, c) {
        u.addCardToAttachArea(a, b, c)
    };
    this.addCardToLastAttachAreaByIndex = function(a, b, c) {
        var d = h[k].getCards();
        u.addCardToAttachArea(b, d[a], c)
    };
    this.removeCardFromHandByIndex = function(a) {
        h[k].removeCardFromHandByIndex(a)
    };
    this.compactCards = function() {
        h[k].compact()
    };
    this.checkIfCardFitInAnyCombo = function(a, b, c) {
        return u.checkIfCardFitInAnyCombo(a, b, c)
    };
    this.dealJokerToTheCurPlayer = function(a) {
        h[k].addCard(a);
        h[k].activateCardListener()
    };
    this.showAlertText = function(a) {
        B.show(a)
    };
    this.showChoosePanel = function(a) {
        H.show(a)
    };
    this._checkCollisionBetweenCardAndHand = function(a) {
        a = u.getLocalToGlobal(a);
        a = {
            x: a.x / s_iScaleFactor,
            y: a.y / s_iScaleFactor
        };
        var b = h[PLAYER_ID].getPos(),
            c = h[PLAYER_ID].getWidth();
        a.y > b.y && a.x > b.x - c / 2 && a.x < b.x + c / 2 ? h[PLAYER_ID].highlight(!0) : h[PLAYER_ID].highlight(!1)
    };
    this._checkCollisionBetweenCardAndWastePile = function(a) {
        a = h[PLAYER_ID].getLocalToGlobal(a);
        a = {
            x: a.x / s_iScaleFactor,
            y: a.y / s_iScaleFactor
        };
        var b = u.getGlobalWastePilePos();
        if (distance(a, b) < CARD_WIDTH * u.getScale()) return u.highlightWastePile(!0), u.highlightAllAttach(!1), !0;
        u.highlightWastePile(!1);
        return !1
    };
    this._checkCollisionBetweenCardAndAttachSprite = function(a) {
        a = h[PLAYER_ID].getRectInGlobalPos(a);
        for (var b = !1, c = 0; c < u.getComboListLen(); c++) {
            u.getNumCardsInCombo(c);
            b = u.getComboRectInGlobalPos(c);
            if (a.intersects(b)) return u.highlightAllAttach(!1), u.highlightAttach(c, !0), !0;
            u.highlightAttach(c,
                !1);
            b = !1
        }
        return b
    };
    this.checkIfComboIncomplete = function() {
        return u.checkIfComboIncomplete()
    };
    this.checkIfDroppingWasteCard = function(a) {
        return null === p || p.getFrame() !== a.getFrame() ? !1 : !0
    };
    this._releaseWasteCard = function(a) {
        h[PLAYER_ID].isHighlight() ? (h[PLAYER_ID].highlight(!1), a.unload(), u.removeLastCardInWastePile(), h[PLAYER_ID].addCard(a), h[PLAYER_ID].activateCardListener(), g = !0, u.setClickableDeck(!1), u.setWasteClickable(!1), p = a, u.showHandAnim(!1), e = !0) : a.resetPosition()
    };
    this.highlightAllAttach =
        function(a) {
            u.highlightAllAttach(a)
        };
    this.isCardCollidingWithWaste = function() {
        return u.isWasteHighlighted()
    };
    this.isCardCollidingWithAttach = function() {
        for (var a = 0; a < u.getComboListLen(); a++)
            if (u.isAttachHighlighted(a)) return a;
        return -1
    };
    this._onDeckRelease = function() {
        g = !0;
        u.setWasteClickable(!1);
        u.showHandAnim(!1);
        e = !0;
        this.dealCardToPlayer()
    };
    this.calculateOpeningScore = function() {
        return u.calculateOpeningScore(k)
    };
    this.removePlayerCombos = function() {
        for (var a = u.getPlayerCombos(k), b = 0; b < a.length; b++) {
            for (var c =
                    a[b].combo.getCards(), d = 0; d < c.length; d++) h[k].addCard(c[d]);
            0 === b && u.resetCombo(a[b].index)
        }
        h[k].activateCardListener()
    };
    this.removeComboIncomplete = function() {
        var a = u.getComboIncomplete();
        if (-1 !== a) {
            for (var b = u.getComboOnTable(a).getCards(), c = 0; c < b.length; c++) h[k].addCard(b[c]);
            this.removeCombo(a);
            h[k].activateCardListener();
            h[k].resetComboAttempt()
        }
    };
    this._calculateScore = function(a) {
        a = h[a].getCards();
        for (var b = 0, c = 0; c < a.length; c++) {
            var d = a[c].getValue();
            10 < d && 14 > d ? d = 10 : d === ACE_VALUE ? d = SCORE_ACE :
                d === JOKER_VALUE && (d = SCORE_JOKER);
            b += d
        }
        return b
    };
    this.gameOver = function(b) {
        a = !1;
        if (b)
            for (b = 0; b < h.length; b++) {
                var c = this._calculateScore(b);
                h[b].increaseScore(c)
            } else {
                for (b = c = 0; b < h.length; b++) b !== k && (c += this._calculateScore(b));
                var d = !1,
                    f = 0;
                GOING_RUMMY_RULE && h[k].checkRummy() && (c *= 2, z.show(), d = !0, f = 4500);
                h[k].increaseScore(c)
            }
        c = [];
        for (b = 0; b < h.length; b++) c[b] = h[b].getTotalScore();
        h[k].getTotalScore() >= SCORE_TO_REACH["player_" + s_iNumPlayers] ? S.show(k, c, d, f) : N.show(k, c, d, f)
    };
    this.hideHandSwipe = function() {
        this.resetTimeElaps();
        u.hideHandSwipe()
    };
    this.getLastWasteCard = function() {
        return u.getLastCardInWastePile()
    };
    this.onExit = function() {
        F.show(TEXT_ARE_YOU_SURE, 60)
    };
    this.onConfirmExit = function() {
        this.unload();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        s_oMain.gotoMenu()
    };
    this._cleanCardUpdateArray = function() {
        for (var a = 0; a < n.length;) !1 === n[a].isUpdating() ? n.splice(a, 1) : a++
    };
    this.onShuffle = function() {
        if (!1 !== b) {
            b = !1;
            var a = h[0].getCards();
            a = s_oHandEvaluator.sortCards(a);
            h[PLAYER_ID].sortCards(a)
        }
    };
    this.setCanShuffle = function(a) {
        b = a
    };
    this.setOpeningForCurPlayer = function() {
        h[k].setOpening(!0)
    };
    this.setUpdate = function(b) {
        a = b
    };
    this.getPlayerHandY = function(a) {
        return h[a].getY()
    };
    this.getWastePilePos = function() {
        return u.getGlobalWastePilePos()
    };
    this.getAttachPos = function(a) {
        return u.getGlobalAttachPos(a)
    };
    this.getTableScale = function() {
        return u.getScale()
    };
    this.getComboOnTable = function(a) {
        return u.getComboOnTable(a)
    };
    this.getCurTurn = function() {
        return k
    };
    this.getLastAvailableAttachIndex = function() {
        return u.getLastAvailableAttachIndex()
    };
    this.getNumCardsInCombo = function(a, b) {
        return u.getNumCardsInCombo(a, b)
    };
    this.checkIfOwner = function(a, b) {
        return u.checkIfOwner(a, b)
    };
    this.isReadyForChangeTurn = function() {
        return g
    };
    this.isOpeningScoreReached = function() {
        return h[k].isOpeningScoreReached()
    };
    this.isPlayerTurn = function() {
        return k === PLAYER_ID ? !0 : !1
    };
    this.update = function() {
        if (a) {
            for (var b = 0; b < n.length; b++) n[b].update();
            this._cleanCardUpdateArray();
            t.update();
            e && (q += s_iTimeElaps, q > TIME_HELP_PLAYER && (e = !1, b = {
                x: h[k].getX(),
                y: h[k].getY()
            }, u.showSwipeAnim(b, {
                x: 0,
                y: 0
            })))
        }
    };
    s_oGame = this;
    this._init()
}
var s_oGame = null,
    s_oHandEvaluator;

function CInterface() {
    var a, c, b, d, g, e, f, l, k = null,
        q = null,
        h, m, n, p, w, t, v;
    this._init = function() {
        var z = s_oSpriteLibrary.getSprite("but_exit");
        f = CANVAS_WIDTH - z.width / 2 - 10;
        l = z.height / 2 + 10;
        n = new CGfxButton(f, l, z, s_oStage);
        n.addEventListener(ON_MOUSE_UP, this._onExit, this);
        !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (b = f - z.width, d = l, z = s_oSpriteLibrary.getSprite("audio_icon"), h = new CToggle(b, d, z, s_bAudioActive, s_oStage), h.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this), a = b - z.width / 2, c = d) : (a = f - z.width, c =
            l);
        z = window.document;
        var B = z.documentElement;
        k = B.requestFullscreen || B.mozRequestFullScreen || B.webkitRequestFullScreen || B.msRequestFullscreen;
        q = z.exitFullscreen || z.mozCancelFullScreen || z.webkitExitFullscreen || z.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (k = !1);
        k && screenfull.isEnabled && (z = s_oSpriteLibrary.getSprite("but_fullscreen"), m = new CToggle(a, c, z, s_bFullscreen, s_oStage), m.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        p = new CGfxButton(f, l, s_oSpriteLibrary.getSprite("but_help"), s_oStage);
        p.addEventListener(ON_MOUSE_UP, this._onHelp, this);
        z = s_oSpriteLibrary.getSprite("but_settings");
        t = new CGUIExpandible(f, l, z, s_oStage);
        t.addButton(n);
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || t.addButton(h);
        k && screenfull.isEnabled && t.addButton(m);
        t.addButton(p);
        z = s_oSpriteLibrary.getSprite("but_shuffle");
        g = f;
        e = CANVAS_HEIGHT - z.height / 2 - 10;
        w = new CGfxButton(g, e, z, s_oStage);
        w.addEventListener(ON_MOUSE_UP, this._onShuffle, this);
        v = new CHelpPanel(s_oStage)
    };
    this.unload = function() {
        t.unload();
        w.unload();
        if (!1 ===
            DISABLE_SOUND_MOBILE || !1 === s_bMobile) h.unload(), h = null;
        k && screenfull.isEnabled && m.unload();
        n.unload();
        p.unload();
        s_oInterface = null
    };
    this.refreshButtonPos = function() {
        t.refreshPos();
        w.setPosition(g - s_iOffsetX, e - s_iOffsetY)
    };
    this.showHelp = function() {
        v.show()
    };
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this._onExit = function() {
        s_oGame.onExit()
    };
    this._onHelp = function() {
        s_oGame.setUpdate(!1);
        v.show()
    };
    this.resetFullscreenBut = function() {
        k && screenfull.isEnabled &&
            m.setActive(s_bFullscreen)
    };
    this._onFullscreenRelease = function() {
        s_bFullscreen ? q.call(window.document) : k.call(window.document.documentElement);
        sizeHandler()
    };
    this._onShuffle = function() {
        s_oGame.onShuffle()
    };
    s_oInterface = this;
    this._init();
    return this
}
var s_oInterface = null;

function CCreditsPanel() {
    var a, c, b, d, g, e, f, l;
    this._init = function() {
        l = new createjs.Container;
        s_oStage.addChild(l);
        b = new createjs.Shape;
        c = b.on("click", function() {});
        b.alpha = 0;
        b.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        l.addChild(b);
        d = new createjs.Container;
        d.visible = !1;
        l.addChild(d);
        var k = s_oSpriteLibrary.getSprite("msg_box");
        f = createBitmap(k);
        f.regX = k.width / 2;
        f.regY = k.height / 2;
        d.addChild(f);
        a = f.on("click", this._onLogoButRelease);
        d.x = CANVAS_WIDTH / 2;
        d.y = CANVAS_HEIGHT / 2;
        k =
            450;
        var q = 60;
        new CTLText(d, -(k / 2), -26 - q / 2, k, q, 40, "center", "#fff", FONT, 1, 2, 2, TEXT_DEVELOPED, !0, !0, !0, !1);
        k = 450;
        q = 50;
        new CTLText(d, -(k / 2), 120 - q / 2, k, q, 36, "center", "#fff", FONT, 1, 2, 2, "www.leoglobaltech.org", !0, !0, !0, !1);
        k = s_oSpriteLibrary.getSprite("ctl_logo");
        e = createBitmap(k);
        e.regX = k.width / 2;
        e.regY = k.height / 2;
        e.y = 50;
        d.addChild(e);
        k = s_oSpriteLibrary.getSprite("but_exit_credits");
        g = new CGfxButton(240, -160, k, d);
        g.addEventListener(ON_MOUSE_UP, this.unload, this);
        b.alpha = 0;
        createjs.Tween.get(b).to({
                alpha: .7
            },
            500).call(function() {
            d.alpha = 0;
            d.visible = !0;
            createjs.Tween.get(d).to({
                alpha: 1
            }, 300)
        })
    };
    this.unload = function() {
        createjs.Tween.get(l).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(l);
            g.unload()
        });
        b.off("click", c);
        f.off("click", a)
    };
    this._onLogoButRelease = function() {
        window.open("http://www.leoglobaltech.org")
    };
    this._init()
}

function CAreYouSurePanel(a) {
    var c, b, d, g, e, f, l, k, q, h, m, n = this;
    this._init = function() {
        b = [];
        d = [];
        q = new createjs.Container;
        q.visible = !1;
        p.addChild(q);
        h = new createjs.Shape;
        h.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        h.alpha = .5;
        g = h.on("click", function() {});
        q.addChild(h);
        m = new createjs.Container;
        q.addChild(m);
        var a = s_oSpriteLibrary.getSprite("msg_box");
        e = createBitmap(a);
        e.regX = .5 * a.width;
        e.regY = .5 * a.height;
        m.addChild(e);
        m.x = CANVAS_WIDTH / 2;
        m.y = c = -a.height / 2;
        a = a.width - 50;
        f = new CTLText(m,
            -(a / 2), -95, a, 150, 40, "center", "#fff", FONT, 1, 2, 2, "", !0, !0, !0, !1);
        l = new CGfxButton(190, 130, s_oSpriteLibrary.getSprite("but_yes"), m);
        l.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        k = new CGfxButton(-170, 130, s_oSpriteLibrary.getSprite("but_exit"), m);
        k.addEventListener(ON_MOUSE_UP, this._onButNo, this)
    };
    this.addEventListener = function(a, c, f) {
        b[a] = c;
        d[a] = f
    };
    this.show = function(a, b) {
        f.setFontSize(b);
        f.refreshText(a);
        m.y = c;
        q.visible = !0;
        createjs.Tween.get(m).to({
            y: CANVAS_HEIGHT / 2
        }, 1E3, createjs.Ease.cubicOut).call(function() {
            s_oMain.stopUpdateNoBlock()
        })
    };
    this.hide = function() {
        s_oMain.startUpdateNoBlock();
        q.visible = !1
    };
    this.unload = function() {
        k.unload();
        l.unload();
        h.off("click", g)
    };
    this._onButYes = function() {
        n.hide();
        b[ON_BUT_YES_DOWN] && b[ON_BUT_YES_DOWN].call(d[ON_BUT_YES_DOWN])
    };
    this._onButNo = function() {
        n.hide()
    };
    var p = a;
    this._init()
}

function CChoosePanel() {
    var a, c, b, d, g, e, f, l, k, q;
    this._init = function() {
        c = [];
        b = [];
        q = new createjs.Container;
        q.visible = !1;
        s_oStage.addChild(q);
        l = new createjs.Shape;
        l.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        l.alpha = .5;
        d = l.on("click", function() {});
        q.addChild(l);
        k = new createjs.Container;
        q.addChild(k);
        var h = s_oSpriteLibrary.getSprite("msg_box"),
            m = createBitmap(h);
        m.regX = .5 * h.width;
        m.regY = .5 * h.height;
        k.addChild(m);
        k.x = CANVAS_WIDTH / 2;
        k.y = a = -h.height / 2;
        h = h.width - 100;
        f = new CTLText(k,
            -(h / 2), -105, h, 150, 28, "center", "#fff", FONT, 1, 2, 2, "", !0, !0, !0, !1);
        e = new CGfxButton(-200, 130, s_oSpriteLibrary.getSprite("but_no"), k);
        e.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        g = new CGfxButton(200, 130, s_oSpriteLibrary.getSprite("but_yes"), k);
        g.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        createjs.Tween.get(k).to({
            y: CANVAS_HEIGHT / 2
        }, 1E3, createjs.Ease.cubicOut)
    };
    this.unload = function() {
        e.unload();
        g.unload();
        l.off("click", d)
    };
    this.addEventListener = function(a, d, f) {
        c[a] = d;
        b[a] = f
    };
    this.show = function(b) {
        f.refreshText(b);
        k.y = a;
        q.visible = !0;
        createjs.Tween.get(k).to({
            y: CANVAS_HEIGHT / 2
        }, 500, createjs.Ease.cubicOut)
    };
    this._onButNo = function() {
        q.visible = !1;
        c[ON_BUT_NO_DOWN] && c[ON_BUT_NO_DOWN].call(b[ON_BUT_NO_DOWN])
    };
    this._onButYes = function() {
        q.visible = !1;
        c[ON_BUT_YES_DOWN] && c[ON_BUT_YES_DOWN].call(b[ON_BUT_YES_DOWN])
    };
    this._init()
}

function CGUIExpandible(a, c, b, d) {
    var g, e, f, l, k, q, h, m, n;
    this._init = function(a, b, c, d) {
        l = [];
        h = new createjs.Container;
        h.x = a;
        h.y = b;
        d.addChild(h);
        m = new createjs.Container;
        h.addChild(m);
        n = new createjs.Container;
        h.addChild(n);
        f = !1;
        q = new CGfxButton(0, 0, c, n);
        q.addEventListener(ON_MOUSE_UP, this._onMenu, this);
        k = new createjs.Shape;
        k.graphics.beginFill("rgba(255,0,0,0.01)").drawRoundRectComplex(-c.width / 2, -c.height / 2, c.width, 5 * c.height, 30, 30, 0, 0);
        m.addChild(k);
        e = g = 113
    };
    this.unload = function() {
        q.unload();
        d.removeChild(h)
    };
    this.refreshPos = function() {
        h.x = a - s_iOffsetX;
        h.y = c + s_iOffsetY
    };
    this.addButton = function(a) {
        var b = a.getButtonImage();
        a.setMask(k);
        b.x = 0;
        b.y = 0;
        b.visible = 0;
        m.addChildAt(b, 0);
        l.push(b)
    };
    this._onMenu = function() {
        (f = !f) ? p._expand(): p._collapse()
    };
    this._expand = function() {
        for (var a = 0; a < l.length; a++) l[a].visible = !0, createjs.Tween.get(l[a], {
            override: !0
        }).wait(300 * a / 2).to({
            y: g + a * e
        }, 300, createjs.Ease.cubicOut)
    };
    this._collapse = function() {
        for (var a = 0; a < l.length; a++) {
            var b = l[l.length - 1 - a];
            createjs.Tween.get(b, {
                override: !0
            }).wait(300 *
                a / 2).to({
                y: 0
            }, 300, createjs.Ease.cubicOut).call(function(a) {
                a.visible = !1
            }, [b])
        }
    };
    var p = this;
    this._init(a, c, b, d)
}

function CDeckController() {
    var a, c;
    this._init = function() {
        a = [];
        for (var b = 2 === s_iNumPlayers ? 1 : 2, c = 0; c < b; c++)
            for (var g = 0, e = 0; 52 > e; e++) {
                var f = (e + 1) % 13;
                a.push({
                    frame: e,
                    rank: 0 === f ? 13 : f,
                    suit: g
                });
                0 === f && g++
            }
        JOKER_AVAILABLE && (a.push({
            frame: 52,
            rank: JOKER_VALUE,
            suit: 5
        }), a.push({
            frame: 53,
            rank: JOKER_VALUE,
            suit: 5
        }), 2 < s_iNumPlayers && (a.push({
            frame: 52,
            rank: JOKER_VALUE,
            suit: 5
        }), a.push({
            frame: 53,
            rank: JOKER_VALUE,
            suit: 5
        })))
    };
    this.getShuffledCardDeck = function() {
        c = [];
        for (var b = 0; b < a.length; b++) c[b] = a[b];
        return c = shuffle(c)
    };
    this.getCardValue = function(a) {
        return (void 0)[a]
    };
    this.getStartingDeckLength = function() {
        return a.length
    };
    this._init()
}

function CCard(a, c, b, d, g, e, f) {
    var l, k, q = -1,
        h, m, n, p, w, t, v, z, B, F, H, u, N, S, R, M, E, I, L = this,
        J, G, A;
    this._init = function(a, b, c, d, f, g) {
        l = a;
        m = b;
        p = 0;
        k = !1;
        A = new createjs.Container;
        A.x = c.getX();
        A.y = c.getY();
        O.addChild(A);
        b = s_oSpriteLibrary.getSprite("card_shadow");
        J = createBitmap(b);
        J.regX = b.width / 2;
        J.regY = b.height / 2;
        J.x = 8;
        J.y = 8;
        J.alpha = 0;
        A.addChild(J);
        b = [];
        for (var e = 0; 55 > e; e++) b.push(s_oSpriteLibrary.getSprite("card_" + e));
        b = new createjs.SpriteSheet({
            images: b,
            frames: {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                regX: CARD_WIDTH /
                    2,
                regY: CARD_HEIGHT / 2
            },
            animations: {
                card_0: 0,
                card_1: 1,
                card_2: 2,
                card_3: 3,
                card_4: 4,
                card_5: 5,
                card_6: 6,
                card_7: 7,
                card_8: 8,
                card_9: 9,
                card_10: 10,
                card_11: 11,
                card_12: 12,
                card_13: 13,
                card_14: 14,
                card_15: 15,
                card_16: 16,
                card_17: 17,
                card_18: 18,
                card_19: 19,
                card_20: 20,
                card_21: 21,
                card_22: 22,
                card_23: 23,
                card_24: 24,
                card_25: 25,
                card_26: 26,
                card_27: 27,
                card_28: 28,
                card_29: 29,
                card_30: 30,
                card_31: 31,
                card_32: 32,
                card_33: 33,
                card_34: 34,
                card_35: 35,
                card_36: 36,
                card_37: 37,
                card_38: 38,
                card_39: 39,
                card_40: 40,
                card_41: 41,
                card_42: 42,
                card_43: 43,
                card_44: 44,
                card_45: 45,
                card_46: 46,
                card_47: 47,
                card_48: 48,
                card_49: 49,
                card_50: 50,
                card_51: 51,
                joker: 52,
                joker2: 53,
                back: 54
            }
        });
        G = createSprite(b, a ? "back" : d, CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT);
        G.stop();
        A.addChild(G);
        S = G.on("mousedown", this._onPress);
        B = 0;
        t = d;
        v = f;
        z = g;
        F = c;
        E = [];
        I = []
    };
    this.unload = function() {
        G.off("mousedown", S);
        G.off("pressmove", R);
        G.off("pressup", M);
        H = F = null;
        O.removeChild(A)
    };
    this.addEventListener = function(a, b, c) {
        E[a] = b;
        I[a] = c
    };
    this.setClickable = function(a) {
        k = a
    };
    this.setRowInBoard = function(a) {
        n =
            a
    };
    this.moveOnXByOffset = function(a, b) {
        var c = A.x + a;
        createjs.Tween.get(A).to({
            x: c
        }, b, createjs.Ease.cubicOut)
    };
    this.moveOnX = function(a, b) {
        createjs.Tween.get(A).to({
            x: a
        }, b, createjs.Ease.cubicIn).call(function() {
            E[ON_CARD_MOVE_X_END] && E[ON_CARD_MOVE_X_END].call(I[ON_CARD_MOVE_X_END], L)
        })
    };
    this.moveOnYByOffset = function(a, b) {
        var c = A.y + a;
        createjs.Tween.get(A).to({
            y: c
        }, TIME_CARD_MOVE_Y, createjs.Ease.cubicOut).call(function() {
            E[ON_CARD_MOVE_UP_END] && b && E[ON_CARD_MOVE_UP_END].call(I[ON_CARD_MOVE_UP_END], L)
        })
    };
    this.initMov = function(a, b, c, d, f, g) {
        A.visible = !0;
        g && this.showCard();
        playSound("card_dealing", 1, !1);
        H = new CVector2(f.x, f.y);
        h = c;
        q = b;
        m = a;
        p = d;
        createjs.Tween.get(A).to({
            rotation: d
        }, h, createjs.Ease.cubicOut)
    };
    this.changeValue = function(a) {
        G.gotoAndStop(a)
    };
    this.setValue = function() {
        G.gotoAndStop(t);
        var a = this;
        createjs.Tween.get(G).to({
            scaleX: 1
        }, 100).call(function() {
            a.cardShown()
        })
    };
    this.setDepth = function(a) {
        O.setChildIndex(A, a)
    };
    this.setScale = function(a) {
        createjs.Tween.removeTweens(G);
        createjs.Tween.removeTweens(J);
        J.scaleX = J.scaleY = a;
        G.scaleX = G.scaleY = a
    };
    this.tweenScale = function(a) {
        createjs.Tween.hasActiveTweens(G) || (createjs.Tween.get(J).to({
            scaleX: a,
            scaleY: a
        }, 400, createjs.Ease.cubicOut), createjs.Tween.get(G).to({
            scaleX: a,
            scaleY: a
        }, 400, createjs.Ease.cubicOut).call(function() {
            E[ON_CARD_END_SCALE] && E[ON_CARD_END_SCALE].call(I[ON_CARD_END_SCALE], L, w)
        }))
    };
    this.setRotation = function(a) {
        A.rotation = a
    };
    this.changeType = function(a) {
        m = a
    };
    this.setComboIndex = function(a) {
        w = a
    };
    this.showCard = function() {
        l = !1;
        var a = this;
        createjs.Tween.get(G).to({
                scaleX: .1
            },
            100).call(function() {
            a.setValue()
        });
        playSound("show_card", 1, !1)
    };
    this.cardShown = function() {
        E[ON_CARD_SHOWN] && E[ON_CARD_SHOWN].call(I[ON_CARD_SHOWN])
    };
    this.tremble = function() {
        createjs.Tween.get(A).to({
            rotation: 10
        }, 40, createjs.Ease.cubicOut).to({
            rotation: -10
        }, 80).to({
            rotation: 10
        }, 80).to({
            rotation: -10
        }, 80).to({
            rotation: 0
        }, 40)
    };
    this._onPress = function(a) {
        k && (m === CARD_HAND ? (L.moveOnYByOffset(-CARD_HEIGHT_OFFSET_IN_HAND, !1), u = {
            x: s_oStage.mouseX,
            y: s_oStage.mouseY
        }) : m === CARD_WASTE && (A.rotation = 0, u = {
            x: s_oStage.mouseX,
            y: s_oGame.getPlayerHandY(0)
        }), R = G.on("pressmove", L._onPressMove), M = G.on("pressup", L._onRelease), J.alpha = 1)
    };
    this._onPressMove = function(a) {
        if (k && !createjs.Tween.hasActiveTweens(A)) {
            N = {
                x: s_oStage.mouseX,
                y: s_oStage.mouseY
            };
            var b = O.globalToLocal(a.stageX, a.stageY);
            A.x = b.x;
            A.y = b.y;
            m === CARD_HAND ? Math.abs(u.y - a.stageY) > CARD_HEIGHT / 4 ? E[ON_CARD_DRAGGING] && E[ON_CARD_DRAGGING].call(I[ON_CARD_DRAGGING], L) : N.x - u.x < -CARD_WIDTH_OFFSET_IN_HAND ? (u = N, E[ON_CARD_SWAP] && E[ON_CARD_SWAP].call(I[ON_CARD_SWAP], L, "left")) :
                N.x - u.x > CARD_WIDTH_OFFSET_IN_HAND && (u = N, E[ON_CARD_SWAP] && E[ON_CARD_SWAP].call(I[ON_CARD_SWAP], L, "right")) : E[ON_CARD_DRAGGING] && E[ON_CARD_DRAGGING].call(I[ON_CARD_DRAGGING], L)
        }
    };
    this._onRelease = function(a) {
        k && (G.off("pressmove", R), G.off("pressup", M), J.alpha = 0, createjs.Tween.removeTweens(A), E[ON_CARD_RELEASE] && E[ON_CARD_RELEASE].call(I[ON_CARD_RELEASE], L))
    };
    this.setPos = function(a) {
        A.x = a.x;
        A.y = a.y
    };
    this.resetPosition = function() {
        A.x = F.getX();
        A.y = F.getY();
        A.rotation = p
    };
    this.printCardInfo = function() {
        console.log("value---\x3e" +
            v + " suit----\x3e" + z)
    };
    this.setX = function(a) {
        A.x = a
    };
    this.setY = function(a) {
        A.y = a
    };
    this.getValue = function() {
        return v
    };
    this.getSuit = function() {
        return z
    };
    this.getFrame = function() {
        return t
    };
    this.isClickable = function() {
        return k
    };
    this.getX = function() {
        return A.x
    };
    this.getY = function() {
        return A.y
    };
    this.getScale = function() {
        return G.scaleX
    };
    this.getDepth = function() {
        return O.getChildIndex(A)
    };
    this.getContainer = function() {
        return A
    };
    this.getRow = function() {
        return n
    };
    this.getStartingPos = function() {
        return F
    };
    this.isFolded =
        function() {
            return l
        };
    this.getType = function() {
        return m
    };
    this.isUpdating = function() {
        return -1 === q ? !1 : !0
    };
    this._updateDealing = function() {
        B += s_iTimeElaps;
        if (B > h) q = -1, B = 0, A.x = H.getX(), A.y = H.getY(), F = new CVector2(A.x, A.y), E[ON_CARD_ANIMATION_ENDING] && E[ON_CARD_ANIMATION_ENDING].call(I[ON_CARD_ANIMATION_ENDING], m, L);
        else {
            this.visible = !0;
            var a = easeInOutCubic(B, 0, 1, h),
                b = new CVector2;
            b = tweenVectors(F, H, a, b);
            A.x = b.getX();
            A.y = b.getY()
        }
    };
    this.update = function() {
        switch (q) {
            case CARD_STATE_DEALING:
                this._updateDealing()
        }
    };
    var O = f;
    this._init(a, c, b, d, g, e)
}

function CVector2(a, c) {
    var b, d;
    this._init = function(a, c) {
        b = a;
        d = c
    };
    this.add = function(a, c) {
        b += a;
        d += c
    };
    this.addV = function(a) {
        b += a.getX();
        d += a.getY()
    };
    this.scalarDivision = function(a) {
        b /= a;
        d /= a
    };
    this.subV = function(a) {
        b -= a.getX();
        d -= a.getY()
    };
    this.scalarProduct = function(a) {
        b *= a;
        d *= a
    };
    this.invert = function() {
        b *= -1;
        d *= -1
    };
    this.dotProduct = function(a) {
        return b * a.getX() + d * a.getY()
    };
    this.set = function(a, c) {
        b = a;
        d = c
    };
    this.setV = function(a) {
        b = a.getX();
        d = a.getY()
    };
    this.length = function() {
        return Math.sqrt(b * b + d * d)
    };
    this.length2 =
        function() {
            return b * b + d * d
        };
    this.normalize = function() {
        var a = this.length();
        0 < a && (b /= a, d /= a)
    };
    this.getNormalize = function(a) {
        this.length();
        a.set(b, d);
        a.normalize()
    };
    this.rot90CCW = function() {
        var a = b;
        b = -d;
        d = a
    };
    this.rot90CW = function() {
        var a = b;
        b = d;
        d = -a
    };
    this.getRotCCW = function(a) {
        a.set(b, d);
        a.rot90CCW()
    };
    this.getRotCW = function(a) {
        a.set(b, d);
        a.rot90CW()
    };
    this.ceil = function() {
        b = Math.ceil(b);
        d = Math.ceil(d)
    };
    this.round = function() {
        b = Math.round(b);
        d = Math.round(d)
    };
    this.toString = function() {
        return "Vector2: " + b + ", " +
            d
    };
    this.print = function() {
        trace("Vector2: " + b + ", " + d)
    };
    this.getX = function() {
        return b
    };
    this.getY = function() {
        return d
    };
    this._init(a, c)
}

function CCardHandDisplay(a, c, b, d, g) {
    var e, f, l, k, q, h, m, n, p, w = this;
    this._init = function(a) {
        q = 0;
        this.reset();
        p = new createjs.Container;
        p.rotation = a;
        g.addChild(p);
        m = (CARD_TO_DEAL["player_" + s_iNumPlayers] + 1) * CARD_WIDTH_OFFSET_IN_HAND + 300;
        this.refreshButtonPos()
    };
    this.refreshButtonPos = function() {
        p.x = b.x + s_iOffsetX * c.dir_x;
        p.y = b.y + s_iOffsetY * c.dir_y;
        var a = 0 === c.dir_x ? CANVAS_WIDTH - 2 * s_iOffsetX : CANVAS_HEIGHT - 2 * s_iOffsetY;
        m > a && (a /= m, a = parseFloat(a.toFixed(2)), p.scaleX = p.scaleY = a)
    };
    this.unload = function() {
        for (var a =
                0; a < n.length; a++) n[a].unload();
        g.removeChild(p)
    };
    this.reset = function() {
        f = e = !1;
        k = CARD_TO_DEAL["player_" + s_iNumPlayers];
        l = 0 === MIN_OPENING_VALUE ? !0 : !1;
        n = []
    };
    this.restart = function() {
        for (var a = 0; a < n.length; a++) n[a].unload();
        this.reset()
    };
    this.centerContainer = function() {
        createjs.Tween.get(p).to({
            regX: p.getBounds().width / 2
        }, 500, createjs.Ease.cubicOut)
    };
    this._reassignArrayIndex = function() {
        n.sort(function(a, b) {
            return a.getX() == b.getX() ? a.getY() - b.getY() : a.getX() - b.getX() || a.getY() - b.getY()
        })
    };
    this.setOpening =
        function(a) {
            l = a
        };
    this.compact = function() {
        h = 0;
        for (var a = CARD_WIDTH / 2, b = 0; b < n.length; b++) n[b].moveOnX(a, 500), a += CARD_WIDTH_OFFSET_IN_HAND;
        this._sortCardDepth()
    };
    this.highlight = function(a) {
        e = a;
        p.shadow = a ? new createjs.Shadow("#fff", 0, 0, 20) : null
    };
    this.setNumCardsAtTurnStart = function() {
        k = n.length
    };
    this.addCard = function(b) {
        b.unload();
        b = new CCard(!0, CARD_HAND, new CVector2(CARD_WIDTH / 2 + n.length * CARD_WIDTH_OFFSET_IN_HAND, CARD_HEIGHT), b.getFrame(), b.getValue(), b.getSuit(), p);
        a === PLAYER_ID ? (b.moveOnYByOffset(-CARD_MOVE_UP_OFFSET,
            !0), b.showCard()) : b.moveOnYByOffset(-CARD_CPU_MOVE_UP_OFFSET, !0);
        b.setClickable(!1);
        b.addEventListener(ON_CARD_MOVE_UP_END, this._onCardMoveUpEnd, this);
        b.addEventListener(ON_CARD_ANIMATION_ENDING, this._onCardAnimationEnd, this);
        b.addEventListener(ON_CARD_SWAP, this._onSwapCards, this);
        b.addEventListener(ON_CARD_DRAGGING, this._onDragCard, this);
        b.addEventListener(ON_CARD_RELEASE, this._onCardRelease, this);
        b.addEventListener(ON_CARD_MOVE_X_END, this._onCardEndXMove, this);
        b.addEventListener(ON_CARD_END_SCALE,
            this._putCardOnTable, this);
        n.push(b)
    };
    this.activateCardListener = function() {
        if (a === PLAYER_ID)
            for (var b = 0; b < n.length; b++) n[b].setClickable(!0)
    };
    this.resetComboAttempt = function() {
        f = !1
    };
    this.moveCardOnXByOffset = function(a, b, c) {
        n[a].moveOnXByOffset(b, c)
    };
    this.increaseScore = function(a) {
        q += a
    };
    this._onCardMoveUpEnd = function(a) {
        w.centerContainer()
    };
    this._onCardAnimationEnd = function(a) {};
    this._onSwapCards = function(a, b) {
        for (var c = -1, d = 0; d < n.length; d++)
            if (n[d] === a) {
                c = d;
                break
            } if ("left" === b && 0 < c) d = c - 1, n[d].moveOnXByOffset(CARD_WIDTH_OFFSET_IN_HAND,
            0), n[c].moveOnXByOffset(-CARD_WIDTH_OFFSET_IN_HAND, 0);
        else if ("right" === b && c < n.length - 1) d = c + 1, n[d].moveOnXByOffset(-CARD_WIDTH_OFFSET_IN_HAND, 0), n[c].moveOnXByOffset(CARD_WIDTH_OFFSET_IN_HAND, 0);
        else {
            n[c]._onRelease();
            return
        } - 1 === d && ("right" === b ? (c = n.length - 1, d = c - 1) : (c = 0, d = c + 1));
        p.swapChildren(n[d].getContainer(), n[c].getContainer());
        var f = n[c];
        n[c] = n[d];
        n[d] = f
    };
    this._onDragCard = function(a) {
        !1 === s_oGame._checkCollisionBetweenCardAndWastePile(a) ? s_oGame._checkCollisionBetweenCardAndAttachSprite(a) ?
            a.tweenScale(s_oGame.getTableScale()) : a.tweenScale(1) : a.tweenScale(s_oGame.getTableScale())
    };
    this._onCardRelease = function(b) {
        s_oGame.hideHandSwipe();
        if (s_oGame.isCardCollidingWithWaste()) {
            if (!1 === s_oGame.isReadyForChangeTurn()) {
                s_oGame.showAlertText(TEXT_NO_WASTE);
                this.resetCardFromRelease(b);
                return
            }
            if (s_oGame.checkIfComboIncomplete()) {
                s_oGame.showChoosePanel(TEXT_INCOMPLETE_COMBO);
                this.resetCardFromRelease(b);
                return
            }
            if (s_oGame.checkIfDroppingWasteCard(b)) {
                s_oGame.showAlertText(TEXT_CANT_DISCARD_WASTE_CARD);
                this.resetCardFromRelease(b);
                return
            }
            if (f) {
                if (!l && s_oGame.calculateOpeningScore() < MIN_OPENING_VALUE) {
                    f = !1;
                    s_oGame.showAlertText(TEXT_NOT_ENOUGH_POINTS);
                    s_oGame.removePlayerCombos();
                    this.resetCardFromRelease(b);
                    return
                }
                l = !0
            }
            s_oGame.blockControls(!0);
            b.setClickable(!1);
            var c = s_oGame.getWastePilePos();
            b.setPos(p.globalToLocal(c.x, c.y));
            b.changeType(CARD_WASTE);
            s_oGame.addCardToWastePile(b)
        } else if (-1 < s_oGame.isCardCollidingWithAttach() && 1 < n.length) {
            var d = s_oGame.isCardCollidingWithAttach(),
                e = s_oGame._checkComboUnderConstruction(d,
                    b);
            if (!1 === s_oGame.checkIfOwner(d, a) && !l && s_oGame.calculateOpeningScore() < MIN_OPENING_VALUE) s_oGame.showAlertText(TEXT_CANT_PLACE_CARDS_IF_NOT_OPENING + " " + MIN_OPENING_VALUE + " " + TEXT_POINTS), this.resetCardFromRelease(b);
            else if (e === EVALUATE_CARD_NO_VALID_IN_COMBO) s_oGame.showAlertText(TEXT_INVALID_CARD_IN_COMBO), this.resetCardFromRelease(b);
            else if (4 > n.length + s_oGame.getNumCardsInCombo(d)) this.resetCardFromRelease(b);
            else if (e !== EVALUATE_NULL) b.setClickable(!1), c = s_oGame.getAttachPos(d), b.setPos(p.globalToLocal(c.x,
                c.y)), b.changeType(CARD_TABLE), b.setComboIndex(d), this._addCardToAttachArea(b, d, e), f = !0;
            else {
                this.resetCardFromRelease(b);
                b = s_oGame.getComboOnTable(d);
                if (!1 === b.isPlacedOnTable()) {
                    s_oGame.showAlertText(TEXT_INVALID_COMBO);
                    b = b.getCards();
                    for (c = 0; c < b.length; c++) this.addCard(b[c]);
                    s_oGame.removeCombo(d)
                }
                this.activateCardListener()
            }
        } else this.resetCardFromRelease(b);
        s_oGame.highlightAllAttach(!1)
    };
    this._onCardEndXMove = function() {
        h++;
        h === n.length && (this._sortCardDepth(), this.centerContainer(), this._reassignArrayIndex(),
            s_oGame.setCanShuffle(!0))
    };
    this.checkRummy = function() {
        return k === CARD_TO_DEAL["player_" + s_iNumPlayers] && 0 === n.length ? !0 : !1
    };
    this._putCardOnTable = function(a, b) {};
    this._addCardToAttachArea = function(a, b, c) {
        this.removeCardFromHand(a);
        s_oGame.addCardToAttachArea(b, a, c)
    };
    this.resetCardFromRelease = function(a) {
        for (var b = CARD_WIDTH / 2, c = 0; c < n.length; c++) n[c].setX(b), b += CARD_WIDTH_OFFSET_IN_HAND;
        a.setY(a.getStartingPos().getY() - CARD_MOVE_UP_OFFSET);
        this._sortCardDepth();
        a.setScale(1)
    };
    this.removeCardFromHand =
        function(a) {
            for (var b = 0; b < n.length; b++)
                if (n[b] === a) {
                    n[b].unload();
                    n.splice(b, 1);
                    break
                } this.compact()
        };
    this.removeCardFromHandByIndex = function(a) {
        0 > a || (n[a].unload(), n.splice(a, 1))
    };
    this._sortCardDepth = function() {
        p.sortChildren(function(a, b, c) {
            return a.x > b.x ? 1 : a.x < b.x ? -1 : 0
        })
    };
    this.sortCards = function(a) {
        h = 0;
        for (var b = CARD_WIDTH / 2, c = 0; c < a.length; c++) n[a[c]].moveOnX(b, 500), b += CARD_WIDTH_OFFSET_IN_HAND
    };
    this.getNumCards = function() {
        return n.length
    };
    this.getRot = function() {
        return p.rotation
    };
    this.getCards =
        function() {
            return n
        };
    this.geCardByIndex = function(a) {
        return n[a]
    };
    this.getCardIndex = function(a) {
        for (var b = 0; b < n.length; b++)
            if (a === n[b]) return b;
        return -1
    };
    this.getPos = function() {
        return {
            x: p.x,
            y: p.y
        }
    };
    this.getX = function() {
        return p.x
    };
    this.getY = function() {
        return p.y
    };
    this.getScale = function() {
        return p.scaleX
    };
    this.getWidth = function() {
        return p.getBounds().width
    };
    this.isHighlight = function() {
        return e
    };
    this.getLocalToGlobal = function(a) {
        return p.localToGlobal(a.getX(), a.getY())
    };
    this.getRectInGlobalPos = function(a) {
        var b =
            p.localToGlobal(a.getX(), a.getY());
        return new createjs.Rectangle(b.x / s_iScaleFactor, b.y / s_iScaleFactor, CARD_WIDTH * a.getScale(), CARD_HEIGHT * a.getScale())
    };
    this.isOpeningScoreReached = function() {
        return l
    };
    this.getTotalScore = function() {
        return q
    };
    this._init(d)
}
var TYPE_LINEAR = 0,
    TYPE_OUT_CUBIC = 1,
    TYPE_IN_CUBIC = 2,
    TYPE_OUT_BACK = 3,
    TYPE_IN_BACK = 4;

function ease(a, c, b, d, g, e) {
    switch (a) {
        case TYPE_LINEAR:
            var f = easeLinear(c, b, d, g, e);
            break;
        case TYPE_IN_CUBIC:
            f = easeInCubic(c, b, d, g, e);
            break;
        case TYPE_OUT_CUBIC:
            f = easeOutCubic(c, b, d, g, e);
            break;
        case TYPE_IN_BACK:
            f = easeInBack(c, b, d, g, e);
            break;
        case TYPE_OUT_BACK:
            f = easeInBack(c, b, d, g, e)
    }
    return f
}

function easeOutBounce(a, c, b, d) {
    return (a /= d) < 1 / 2.75 ? 7.5625 * b * a * a + c : a < 2 / 2.75 ? b * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + c : a < 2.5 / 2.75 ? b * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + c : b * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + c
}

function easeInBounce(a, c, b, d) {
    return b - easeOutBounce(d - a, 0, b, d) + c
}

function easeInOutBounce(a, c, b, d) {
    return a < d / 2 ? .5 * easeInBounce(2 * a, 0, b, d) + c : .5 * easeOutBounce(2 * a - d, 0, b, d) + .5 * b + c
}

function easeInCirc(a, c, b, d) {
    return -b * (Math.sqrt(1 - (a /= d) * a) - 1) + c
}

function easeOutCirc(a, c, b, d) {
    return b * Math.sqrt(1 - (a = a / d - 1) * a) + c
}

function easeInOutCirc(a, c, b, d) {
    return 1 > (a /= d / 2) ? -b / 2 * (Math.sqrt(1 - a * a) - 1) + c : b / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + c
}

function easeInCubic(a, c, b, d, g) {
    return b * (a /= d) * a * a + c
}

function easeOutCubic(a, c, b, d, g) {
    return b * ((a = a / d - 1) * a * a + 1) + c
}

function easeInOutCubic(a, c, b, d, g) {
    return 1 > (a /= d / 2) ? b / 2 * a * a * a + c : b / 2 * ((a -= 2) * a * a + 2) + c
}

function easeInElastic(a, c, b, d, g, e, f) {
    if (0 == a) return c;
    if (1 == (a /= d)) return c + b;
    f || (f = .3 * d);
    !e || e < Math.abs(b) ? (e = b, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(b / e);
    return -(e * Math.pow(2, 10 * --a) * Math.sin(2 * (a * d - g) * Math.PI / f)) + c
}

function easeOutElastic(a, c, b, d, g, e, f) {
    if (0 == a) return c;
    if (1 == (a /= d)) return c + b;
    f || (f = .3 * d);
    !e || e < Math.abs(b) ? (e = b, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(b / e);
    return e * Math.pow(2, -10 * a) * Math.sin(2 * (a * d - g) * Math.PI / f) + b + c
}

function easeInOutElastic(a, c, b, d, g, e, f) {
    if (0 == a) return c;
    if (1 == (a /= d)) return c + b;
    f || (f = .3 * d);
    !e || e < Math.abs(b) ? (e = b, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(b / e);
    return 1 > a ? -.5 * e * Math.pow(2, 10 * --a) * Math.sin(2 * (a * d - g) * Math.PI / f) + c : e * Math.pow(2, -10 * --a) * Math.sin(2 * (a * d - g) * Math.PI / f) * .5 + b + c
}

function easeInExpo(a, c, b, d) {
    return 0 == a ? c : b * Math.pow(2, 10 * (a / d - 1)) + c
}

function easeOutExpo(a, c, b, d) {
    return a == d ? c + b : b * (-Math.pow(2, -10 * a / d) + 1) + c
}

function easeInOutExpo(a, c, b, d) {
    return 0 == a ? c : a == d ? c + b : 1 > (a /= d / 2) ? b / 2 * Math.pow(2, 10 * (a - 1)) + c : b / 2 * (-Math.pow(2, -10 * --a) + 2) + c
}

function easeLinear(a, c, b, d) {
    return b * a / d + c
}

function easeInQuad(a, c, b, d) {
    return b * (a /= d) * a + c
}

function easeOutQuad(a, c, b, d) {
    return -b * (a /= d) * (a - 2) + c
}

function easeInOutQuad(a, c, b, d) {
    return 1 > (a /= d / 2) ? b / 2 * a * a + c : -b / 2 * (--a * (a - 2) - 1) + c
}

function easeInQuart(a, c, b, d) {
    return b * (a /= d) * a * a * a + c
}

function easeOutQuart(a, c, b, d) {
    return -b * ((a = a / d - 1) * a * a * a - 1) + c
}

function easeInOutQuart(a, c, b, d) {
    return 1 > (a /= d / 2) ? b / 2 * a * a * a * a + c : -b / 2 * ((a -= 2) * a * a * a - 2) + c
}

function easeInQuint(a, c, b, d) {
    return b * (a /= d) * a * a * a * a + c
}

function easeOutQuint(a, c, b, d) {
    return b * ((a = a / d - 1) * a * a * a * a + 1) + c
}

function easeInOutQuint(a, c, b, d) {
    return 1 > (a /= d / 2) ? b / 2 * a * a * a * a * a + c : b / 2 * ((a -= 2) * a * a * a * a + 2) + c
}

function easeInSine(a, c, b, d) {
    return -b * Math.cos(a / d * (Math.PI / 2)) + b + c
}

function easeOutSine(a, c, b, d) {
    return b * Math.sin(a / d * (Math.PI / 2)) + c
}

function easeInOutSine(a, c, b, d) {
    return -b / 2 * (Math.cos(Math.PI * a / d) - 1) + c
}

function easeInBack(a, c, b, d) {
    return b * (a /= d) * a * (2.70158 * a - 1.70158) + c
}

function easeOutBack(a, c, b, d) {
    return b * ((a = a / d - 1) * a * (2.70158 * a + 1.70158) + 1) + c
}

function CHandEvaluatorController() {
    var a, c = 0,
        b, d, g, e;
    this.sortCards = function(a) {
        for (var b = [], d = 0; d < a.length; d++) b[d] = {
            rank: a[d].getValue(),
            suit: a[d].getSuit(),
            orig_index: d
        };
        switch (c) {
            case 0:
                b.sort(this.compareSuitAndRank);
                break;
            case 1:
                b.sort(compareRank)
        }
        c++;
        1 < c && (c = 0);
        a = [];
        for (d = 0; d < b.length; d++) a[d] = b[d].orig_index;
        return a
    };
    this.evaluate = function(b, c) {
        a = b;
        d = [];
        g = [];
        for (var f = 0; f < c.length; f++) d[f] = {
            rank: c[f].getValue(),
            suit: c[f].getSuit(),
            orig_index: f
        }, g[f] = c[f];
        d.sort(compareRank);
        this._checkJokerNum();
        return this._rankHand()
    };
    this.compareSuitAndRank = function(a, b) {
        return a.suit < b.suit ? -1 : a.suit > b.suit ? 1 : compareRank(a, b)
    };
    this._compareSuits = function(a) {
        var b = {},
            c = [];
        a.forEach(function(a) {
            b[a] || (b[a] = 0);
            b[a] += 1
        });
        for (var d in b) 2 <= b[d] && c.push(d);
        return 0 < c.length ? !0 : !1
    };
    this._checkJokerNum = function() {
        b = 0;
        0 < d.length && d[d.length - 1].rank === JOKER_VALUE && b++;
        1 < d.length && d[d.length - 2].rank === JOKER_VALUE && b++
    };
    this._rankHand = function() {
        e = [];
        return 4 <= d.length && this._checkPoker() === EVALUATE_POKER ? {
            res: EVALUATE_POKER,
            combo: e
        } : ACE_HIGH && this._isStraightWithAceHigh() ? {
            res: EVALUATE_STRAIGHT_WITH_ACE_HIGH,
            combo: e
        } : this._isClassicStraight() ? {
            res: EVALUATE_STRAIGHT,
            combo: e
        } : 3 <= d.length && this._checkTris() === EVALUATE_TRIS ? {
            res: EVALUATE_TRIS,
            combo: e
        } : {
            res: EVALUATE_NULL,
            combo: null
        }
    };
    this._checkPoker = function() {
        if (a && 4 !== d.length) return EVALUATE_NULL;
        for (var c = 0; c < d.length - 3; c++)
            if (d[c].rank === d[c + 1].rank && d[c].suit !== d[c + 1].suit) {
                var g = c + 2,
                    k = [d[c].suit, d[c + 1].suit, d[g].suit, d[g + 1].suit];
                if (d[g].rank === d[c].rank && d[g].rank ===
                    d[g + 1].rank && !1 === this._compareSuits(k)) return e.push(d[c].orig_index), e.push(d[c + 1].orig_index), e.push(d[g].orig_index), e.push(d[g + 1].orig_index), EVALUATE_POKER;
                if (a && a && 2 === b && d[0].rank === d[1].rank && d[0].suit !== d[1].suit && 4 === d.length) return e.push(d[c].orig_index), e.push(d[c + 1].orig_index), e.push(d[d.length - 2].orig_index), e.push(d[d.length - 1].orig_index), b = 0, EVALUATE_POKER;
                if (1 === b && a && d[g].rank === d[c].rank && !1 === this._compareSuits([d[c].suit, d[c + 1].suit, d[g].suit])) return e.push(d[c].orig_index),
                    e.push(d[c + 1].orig_index), e.push(d[g].orig_index), e.push(d[d.length - 1].orig_index), b--, EVALUATE_POKER
            } return EVALUATE_NULL
    };
    this._checkTris = function() {
        e = [];
        if (a && 3 !== d.length) return EVALUATE_NULL;
        for (var c = 0; c < d.length - 2; c++)
            if (d[c].rank === d[c + 1].rank && d[c].suit !== d[c + 1].suit) {
                var g = [d[c].suit, d[c + 1].suit, d[c + 2].suit];
                if (d[c + 2].rank === d[c].rank && !1 === this._compareSuits(g)) return e.push(d[c].orig_index), e.push(d[c + 1].orig_index), e.push(d[c + 2].orig_index), EVALUATE_TRIS;
                if (0 < b) return e.push(d[c].orig_index),
                    e.push(d[c + 1].orig_index), e.push(d[d.length - 1].orig_index), b--, EVALUATE_TRIS
            } else if (a && 2 === b) return e.push(d[c].orig_index), e.push(d[d.length - 2].orig_index), e.push(d[d.length - 1].orig_index), EVALUATE_TRIS;
        return EVALUATE_NULL
    };
    this._isStraight = function() {
        if (13 === d[0].rank || 3 === d.length && 2 === b) return !1;
        for (var c = 0; c < d.length - 2; c++) {
            var l = d[c].rank,
                k = c + 1,
                q = 1 <= b ? !0 : !1;
            e = [];
            for (e.push(d[c].orig_index); k < d.length;)
                if (l + 1 === d[k].rank && d[c].suit === d[k].suit) e.push(d[k].orig_index), l++, k += 1;
                else if (a && d[k].rank !==
                JOKER_VALUE && 0 < b && d[k].rank - (l + 1) <= b) {
                var h = d[k].rank - (l + 1);
                if (0 >= h) k++;
                else {
                    for (q = 0; q < h; q++) e.push(d[d.length - (q + 1)].orig_index), l++, b--;
                    q = !1
                }
            } else(l + 2 === d[k].rank && d[c].suit === d[k].suit || !a && d[k].rank === JOKER_VALUE && 3 > e.length) && q ? (q = !1, d[k].rank !== JOKER_VALUE && e.push(d[k].orig_index), e.push(d[d.length - 1].orig_index), l += 2) : k += 1;
            if (a) {
                if (e.length === g.length - b) {
                    if (13 === d[d.length - 1 - b].rank && 0 < b && !ACE_HIGH) break;
                    else if (0 < b)
                        for (c = 0; c < b; c++) e.push(d[d.length - c - 1].orig_index);
                    return !0
                }
                break
            } else if (2 <
                e.length) return !0
        }
        return !1
    };
    this._isClassicStraight = function() {
        d = [];
        for (var a = 0; a < g.length; a++) d[a] = {
            rank: g[a].getValue() === ACE_VALUE ? 1 : g[a].getValue(),
            suit: g[a].getSuit(),
            orig_index: a
        };
        d.sort(compareRank);
        return this._isStraight()
    };
    this._isStraightWithAceHigh = function() {
        d = [];
        for (var a = 0; a < g.length; a++) d[a] = {
            rank: g[a].getValue() === ACE_VALUE ? 14 : g[a].getValue(),
            suit: g[a].getSuit(),
            orig_index: a
        };
        d.sort(compareRank);
        if (this._isStraight())
            for (a = 0; a < e.length; a++)
                if (g[e[a]].getValue() === ACE_VALUE || g[e[a]].getValue() ===
                    JOKER_VALUE && 0 < a && 13 === g[e[a - 1]].getValue()) return !0;
        this._checkJokerNum();
        return !1
    };
    this._checkIfAllSuitAreEqual = function(a) {
        for (var b = d[0].suit, c = 1; c < a; c++)
            if (b !== d[c].suit) return !1;
        return !0
    };
    this.checkIfCanReplaceJoker = function(a, b, c) {
        for (var d = [], f = 0, e = [], g = 0; g < a.length; g++) d[g] = {
            rank: a[g].getValue(),
            suit: a[g].getSuit()
        }, a[g].getValue() === JOKER_VALUE && (f++, e.push(g));
        if (0 === f) return !1;
        d.sort(compareRank);
        switch (b) {
            case EVALUATE_POKER:
            case EVALUATE_TRIS:
                e = [0, 1, 2, 3];
                b = -1;
                for (g = 0; g < a.length; g++) {
                    if (a[g].getValue() ===
                        JOKER_VALUE && c.getValue() === b && -1 < e.indexOf(c.getSuit())) return !0;
                    b = a[g].getValue();
                    d = e.indexOf(a[g].getSuit());
                    e.splice(d, 1)
                }
                break;
            case EVALUATE_STRAIGHT:
                for (g = 0; g < e.length; g++)
                    if (0 < e[g] ? (b = a[e[g] - 1].getValue() + 1, d = a[e[g] - 1].getSuit()) : (b = a[e[g] + 1].getValue() - 1, d = a[e[g] + 1].getSuit()), c.getValue() === b && c.getSuit() === d) return !0;
                break;
            case EVALUATE_STRAIGHT_WITH_ACE_HIGH:
                for (g = 0; g < e.length; g++)
                    if (0 < e[g]) {
                        if (b = a[e[g] - 1].getValue() + 1, d = a[e[g] - 1].getSuit(), (c.getValue() === b || 14 === b && c.getValue() === ACE_VALUE) &&
                            c.getSuit() === d) return !0
                    } else if (b = a[e[g] + 1].getValue() - 1, d = a[e[g] + 1].getSuit(), c.getValue() === b && c.getSuit() === d) return !0
        }
        return !1
    };
    this.getJokerValue = function(a, b, c) {
        for (var d = 0, e = 0; e < a.length; e++) a[e].getValue() === JOKER_VALUE && d++;
        if (0 === d) return 0;
        switch (c) {
            case EVALUATE_POKER:
            case EVALUATE_TRIS:
                for (b = 0; b < a.length; b++)
                    if (a[b].getValue() === JOKER_VALUE) return 0 < b ? a[b - 1].getValue() : a[b + 1].getValue();
                break;
            case EVALUATE_STRAIGHT:
                c = 0;
                d = b;
                if (0 === b)
                    for (; d < a.length && a[d].getValue() === JOKER_VALUE;) d++,
                        c--;
                else
                    for (; 0 <= d && a[d].getValue() === JOKER_VALUE;) d--, c++;
                return 9 < a[d].getValue() && 14 > a[d].getValue() ? 10 : a[d].getValue() === ACE_VALUE ? 2 : a[d].getValue() + c;
            case EVALUATE_STRAIGHT_WITH_ACE_HIGH:
                return 0 === b ? (d = b + 1, c = -1) : (c = 1, d = b - 1), a[d].getValue() === ACE_VALUE ? 11 : a[d].getValue() + c
        }
    };
    this.getScore = function(a, b) {
        for (var c = 0, d = 0; d < a.length; d++) {
            var e = a[d].getValue();
            10 < e && 14 > e ? e = 10 : e === ACE_VALUE || 14 === e ? e = b === EVALUATE_STRAIGHT_WITH_ACE_HIGH ? 11 : 1 : 15 === e && (e = s_oHandEvaluator.getJokerValue(a, d, b));
            c += e
        }
        return c
    }
}

function CTableController() {
    var a, c, b, d, g, e, f, l, k, q, h, m, n, p, w, t, v, z, B, F, H, u;
    this._init = function() {
        l = CANVAS_WIDTH;
        g = TABLE_X;
        e = TABLE_Y;
        w = {
            x: CARD_WIDTH + 20,
            y: 0
        };
        b = w.x + CARD_WIDTH + 50;
        d = w.y;
        a = b;
        c = d;
        h = [];
        n = [];
        p = [];
        u = new createjs.Container;
        u.scaleX = u.scaleY = .8;
        s_oStage.addChild(u);
        F = new createjs.Container;
        u.addChild(F);
        H = new createjs.Container;
        u.addChild(H);
        m = [];
        this._attachNewComboOnTable();
        var f = s_oSpriteLibrary.getSprite("waste_pile"),
            k = new createjs.SpriteSheet({
                images: [f],
                frames: {
                    width: f.width / 2,
                    height: f.height,
                    regX: f.width / 2 / 2,
                    regY: f.height / 2
                },
                animations: {
                    normal: 0,
                    highlight: 1
                }
            });
        z = createSprite(k, "normal", f.width / 2 / 2, f.height / 2, f.width / 2, f.height);
        z.x = w.x;
        z.y = w.y;
        z.stop();
        H.addChild(z);
        this._initDeck();
        B = new CCursorHandController(u);
        v = new createjs.Shape;
        v.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT);
        t = v.on("click", this._onDeckRelease);
        u.addChild(v)
    };
    this.unload = function() {
        for (var a = 0; a < h.length; a++) h[a].unload();
        for (a = 0; a < q.length; a++) q[a].unload();
        for (a = 0; a < m.length; a++) m[a].unload();
        v.off("click", t)
    };
    this.addEventListener = function(a, b, c) {
        n[a] = b;
        p[a] = c
    };
    this.refreshButtonPos = function() {
        u.x = s_iOffsetX + g;
        u.y = s_iOffsetY + e
    };
    this.reset = function() {
        k = 0;
        f = !1
    };
    this.restart = function() {
        b = w.x + CARD_WIDTH + 50;
        d = w.y;
        for (var a = 0; a < h.length; a++) h[a].unload();
        h = [];
        for (a = 0; a < q.length; a++) q[a].unload();
        q = [];
        this._initDeck();
        for (a = 0; a < m.length; a++) m[a].unload();
        m = [];
        this.reset();
        this._attachNewComboOnTable()
    };
    this.refreshGridScale = function(a) {
        u.scaleX = u.scaleY =
            .8 * CUR_GRID_SCALE;
        var b = TABLE_X;
        3 < s_iNumPlayers && (b *= 2);
        l = a - b;
        this.repositionCombos()
    };
    this.showHandAnim = function(a) {
        B.showHandAnim(a)
    };
    this.showSwipeAnim = function(a, b) {
        B.showHandSwipe(a, b)
    };
    this.hideHandSwipe = function() {
        B.hideHandSwipe()
    };
    this._initDeck = function() {
        var a = s_oGameSettings.getShuffledCardDeck();
        q = [];
        for (var b = 0; b < a.length; b++) {
            var c = new CVector2(-(.2 * b), -(.2 * b));
            c = new CCard(!0, CARD_DECK, c, a[b].frame, a[b].rank, a[b].suit, H);
            c.setClickable(!1);
            c.addEventListener(ON_CARD_ANIMATION_ENDING,
                s_oGame._onCardAnimEnd);
            q.push(c)
        }
    };
    this.setClickableDeck = function(a) {
        f = a
    };
    this.endTurn = function() {
        for (var a = 0; a < m.length; a++) 3 <= m[a].getNumCards() && m[a].setPlaced();
        if (0 === q.length)
            if (k++, k === MAX_NUM_SHUFFLE) s_oGame.gameOver(!0);
            else {
                var b = h.pop();
                h = shuffle(h);
                q = [];
                for (a = 0; a < h.length; a++) {
                    var c = new CVector2(-(.2 * a), -(.2 * a));
                    c = new CCard(!0, CARD_DECK, c, h[a].getFrame(), h[a].getValue(), h[a].getSuit(), H);
                    c.setClickable(!1);
                    c.addEventListener(ON_CARD_ANIMATION_ENDING, s_oGame._onCardAnimEnd);
                    q.push(c);
                    h[a].unload()
                }
                h = [b]
            }
    };
    this.addFirstCardInWastePile = function(a) {
        h.push(a)
    };
    this.setWasteClickable = function(a) {
        0 < h.length && h[h.length - 1].setClickable(a)
    };
    this.addCardToWastePile = function(a) {
        playSound("drop", 1, !1);
        a = new CCard(!1, CARD_WASTE, new CVector2(w.x, w.y), a.getFrame(), a.getValue(), a.getSuit(), H);
        s_oGame._onCardAnimEnd(CARD_WASTE, a)
    };
    this._attachNewComboOnTable = function() {
        var a = new CComboOnTable(b, d, F);
        a.addEventListener(ON_SELECT_COMBO, this._onSelectCombo, this);
        m.push(a);
        1 < m.length && m[m.length -
            2].setOwner(s_oGame.getCurTurn())
    };
    this.addCardToAttachArea = function(a, c, e) {
        m[a].addCard(c, e);
        3 === m[a].getNumCards() && e !== EVALUATE_REPLACE_JOKER && (a = m[m.length - 1].getPos(), b = a.x + m[m.length - 1].getNumCards() * CARD_WIDTH_OFFSET_IN_HAND + 2 * CARD_WIDTH_OFFSET_IN_HAND, d = a.y, this._attachNewComboOnTable());
        this.repositionCombos()
    };
    this.repositionCombos = function() {
        for (var b = a, d = c, e = 0; e < m.length; e++) {
            var g = m[e];
            (b + g.getNumCards() * CARD_WIDTH_OFFSET_IN_HAND) * u.scaleX > l && (b = 0, d += CARD_HEIGHT + 50);
            g.setPos(b, d);
            b = m[e].getPos().x +
                (g.getNumCards() * CARD_WIDTH_OFFSET_IN_HAND + 2 * CARD_WIDTH_OFFSET_IN_HAND)
        }
    };
    this.highlightWastePile = function(a) {
        a ? z.gotoAndStop("highlight") : z.gotoAndStop("normal")
    };
    this.highlightAttach = function(a, b) {
        b ? m[a].highlight() : m[a].unlight()
    };
    this.highlightAllAttach = function(a) {
        for (var b = 0; b < m.length; b++) a ? m[b].highlight() : m[b].unlight()
    };
    this.checkIfComboIncomplete = function() {
        for (var a = 0; a < m.length; a++)
            if (m[a].isIncomplete()) return !0;
        return !1
    };
    this.resetCombo = function(a) {
        m[a].reset();
        for (var b = a + 1; b < m.length; b++) m[b].unload();
        m.splice(a + 1, m.length - 1 - a)
    };
    this.removeCombo = function(a) {
        m[a].unload();
        m.splice(a, 1)
    };
    this.calculateOpeningScore = function(a) {
        for (var b = 0, c = 0; c < m.length; c++) m[c].getOwner() === a && (b += m[c].getScore());
        return b
    };
    this.checkIfCardFitInAnyCombo = function(a, b, c) {
        for (var d = 0; d < m.length - 1; d++) {
            var e = this.getComboOnTable(d),
                g = e.getCards();
            e = e.getType();
            var f = !1;
            if (JOKER_AVAILABLE && s_oHandEvaluator.checkIfCanReplaceJoker(g, e, a)) f = !0, e = EVALUATE_REPLACE_JOKER;
            else {
                if (a.getValue() === JOKER_VALUE && 3 < c) break;
                g.push(a);
                var h = s_oHandEvaluator.evaluate(!0, g);
                g.splice(g.length - 1, 1);
                h.res !== EVALUATE_NULL && (f = !0, e = h.res)
            }
            if (f) return -1 !== b && (c = s_oGame.getAttachPos(d), a.setPos(u.globalToLocal(c.x, c.y)), a.changeType(CARD_TABLE), s_oGame.removeCardFromHandByIndex(b), this.addCardToAttachArea(d, a, e)), !0
        }
        return !1
    };
    this._onDeckRelease = function() {
        f && (f = !1, n[ON_DECK_RELEASE] && n[ON_DECK_RELEASE].call(p[ON_DECK_RELEASE]))
    };
    this._onSelectCombo = function(a) {
        s_oGame.showChoosePanel(TEXT_REMOVE_COMBO)
    };
    this.getComboIncomplete = function() {
        for (var a =
                0; a < m.length; a++)
            if (m[a].isIncomplete()) return a;
        return -1
    };
    this.getNextCard = function() {
        return q.pop()
    };
    this.removeLastCardInWastePile = function() {
        return h.pop()
    };
    this.getLastCardInWastePile = function() {
        return h[h.length - 1]
    };
    this.getComboListLen = function() {
        return m.length
    };
    this.getPlayerCombos = function(a) {
        for (var b = [], c = 0; c < m.length; c++) m[c].getOwner() === a && b.push({
            combo: m[c],
            index: c
        });
        return b
    };
    this.getLocalPos = function(a) {
        return u.globalToLocal(a.x, a.y)
    };
    this.getLocalToGlobal = function(a) {
        return u.localToGlobal(a.getX(),
            a.getY())
    };
    this.getWastePilePos = function() {
        return w
    };
    this.getScale = function() {
        return u.scaleX
    };
    this.getGlobalWastePilePos = function() {
        return {
            x: u.x + w.x * u.scaleX,
            y: u.y + w.y * u.scaleX
        }
    };
    this.getGlobalAttachPos = function(a) {
        return {
            x: u.x + m[a].getX() * u.scaleX,
            y: u.y + m[a].getY() * u.scaleY
        }
    };
    this.getComboOnTable = function(a) {
        return m[a]
    };
    this.getLastAvailableAttachIndex = function() {
        return m.length - 1
    };
    this.getNumCardsInCombo = function(a) {
        return m[a].getNumCards()
    };
    this.checkIfOwner = function(a, b) {
        return m[a].getOwner() ===
            b || null === m[a].getOwner() ? !0 : !1
    };
    this.getScale = function() {
        return u.scaleX
    };
    this.getComboRectInGlobalPos = function(a) {
        return new createjs.Rectangle(u.x + m[a].getX() * u.scaleX, u.y + m[a].getY() * u.scaleY, m[a].getWidth() * u.scaleX, m[a].getHeight() * u.scaleY)
    };
    this.isWasteHighlighted = function() {
        return "highlight" === z.currentAnimation ? (this.highlightWastePile(!1), !0) : !1
    };
    this.isAttachHighlighted = function(a) {
        return m[a].isHighlighted()
    };
    this._init()
}

function CAlertText() {
    var a, c, b;
    this._init = function() {
        b = new createjs.Container;
        b.x = CANVAS_WIDTH / 2;
        b.y = CANVAS_HEIGHT / 2;
        b.visible = !1;
        s_oStage.addChild(b);
        c = new createjs.Shape;
        c.graphics.beginFill("rgba(0,0,0,0.7)").drawRoundRect(-300, 0, 600, 200, 10);
        b.addChild(c);
        a = new createjs.Text("", " 40px " + FONT, "#fff");
        a.y = 30;
        a.lineWidth = 500;
        a.textAlign = "center";
        a.textBaseline = "middle";
        b.addChild(a)
    };
    this.hide = function() {
        b.visible = !1
    };
    this.show = function(d) {
        createjs.Tween.hasActiveTweens(b) || (a.text = d, d = a.getBounds().height +
            20, c.graphics.clear(), c.graphics.beginFill("rgba(0,0,0,0.7)").drawRoundRect(-300, 0, 600, d, 10), b.visible = !0, b.scaleX = b.scaleY = .1, playSound("alert", 1, !1), (new createjs.Tween.get(b)).to({
                scaleX: 1,
                scaleY: 1
            }, 600, createjs.Ease.cubicOut).wait(1500).to({
                scaleX: .1,
                scaleY: .1
            }, 500, createjs.Ease.cubicIn).call(function() {
                b.visible = !1
            }))
    };
    this._init()
}

function CComboOnTable(a, c, b) {
    var d, g, e, f = null,
        l, k, q, h, m, n;
    this._init = function(a, c) {
        g = d = !1;
        l = [];
        k = [];
        q = [];
        n = new createjs.Container;
        n.x = a;
        n.y = c;
        b.addChild(n);
        var e = s_oSpriteLibrary.getSprite("attach_card"),
            f = new createjs.SpriteSheet({
                images: [e],
                frames: {
                    width: e.width / 2,
                    height: e.height,
                    regX: e.width / 2 / 2,
                    regY: e.height / 2
                },
                animations: {
                    normal: 0,
                    highlight: 1
                }
            });
        m = createSprite(f, "normal", e.width / 2 / 2, e.height / 2, e.width / 2, e.height);
        n.addChild(m);
        h = n.on("mousedown", this._onSelectCombo, this)
    };
    this.unload = function() {
        for (var a =
                0; a < l.length; a++) l[a].unload();
        b.removeChild(n);
        n.off("mousedown", h)
    };
    this.addEventListener = function(a, b, c) {
        k[a] = b;
        q[a] = c
    };
    this.reset = function() {
        for (var a = 0; a < l.length; a++) l[a].unload();
        l = [];
        this.setOwner(null);
        m.visible = !0;
        this.unlight()
    };
    this.highlight = function() {
        m.visible ? m.gotoAndStop("highlight") : n.shadow = new createjs.Shadow("#fff", 0, 0, 20);
        d = !0
    };
    this.unlight = function() {
        m.visible ? m.gotoAndStop("normal") : n.shadow = null;
        d = !1
    };
    this.addCard = function(a, b) {
        m.visible = !1;
        if (b === EVALUATE_REPLACE_JOKER) {
            for (var c =
                    0, d = 0; d < l.length; d++)
                if (l[d].getValue() === JOKER_VALUE) {
                    c = d;
                    break
                } s_oGame.dealJokerToTheCurPlayer(l[c]);
            l.splice(c, 1)
        } else e = b;
        c = a.getValue();
        if (b === EVALUATE_STRAIGHT_WITH_ACE_HIGH && a.getValue() === ACE_VALUE || a.getValue() === ACE_VALUE && 0 < l.length && 13 === l[l.length - 1].getValue()) c = 14;
        c = new CCard(!1, CARD_TABLE, new CVector2(0, 0), a.getFrame(), c, a.getSuit(), n);
        l.push(c);
        3 <= l.length && b === EVALUATE_REPLACE_JOKER || !1 === s_oGame.isPlayerTurn() || s_oGame.isPlayerTurn() && (b === EVALUATE_STRAIGHT || b === EVALUATE_STRAIGHT_WITH_ACE_HIGH) ?
            this.sortCombo() : c.moveOnX((l.length - 1) * CARD_WIDTH_OFFSET_IN_HAND, 500);
        this.unlight();
        playSound("drop", 1, !1)
    };
    this.setOwner = function(a) {
        f = a
    };
    this._sortCardDepth = function() {
        n.sortChildren(function(a, b, c) {
            return a.x > b.x ? 1 : a.x < b.x ? -1 : 0
        })
    };
    this.sortCombo = function() {
        var a = l[0].getValue() === JOKER_VALUE ? !0 : !1,
            b = [];
        l.sort(this.compareRank);
        for (var c = l.length - 1, d = 0; l[c].getValue() === JOKER_VALUE;) {
            for (var e = -1; d < c - 1; d++) {
                var g = l[d + 1].getValue() - l[d].getValue();
                if (1 < g && g <= l.length - 1) {
                    e = d + 1;
                    break
                }
            }
            if (-1 !== e) b.push(e),
                d = e + 1;
            else {
                a && (a = l.pop(), l.unshift(a));
                break
            }
            c--
        }
        for (c = 0; c < b.length; c++) a = l.pop(), l.splice(b[c], 0, a);
        for (d = b = 0; d < l.length; d++) l[d].moveOnX(b, 500), b += CARD_WIDTH_OFFSET_IN_HAND;
        var f = this;
        setTimeout(function() {
            f._sortCardDepth()
        }, 600)
    };
    this.compareRank = function(a, b) {
        return a.getValue() < b.getValue() ? -1 : a.getValue() > b.getValue() ? 1 : 0
    };
    this.setPos = function(a, b) {
        n.x = a;
        n.y = b
    };
    this.setPlaced = function() {
        g = !0
    };
    this._onSelectCombo = function() {
        !1 === g && this.isIncomplete() && k[ON_SELECT_COMBO] && k[ON_SELECT_COMBO].call(q[ON_SELECT_COMBO],
            this)
    };
    this.isHighlighted = function() {
        return d
    };
    this.getX = function() {
        return n.x
    };
    this.getY = function() {
        return n.y
    };
    this.getCards = function() {
        return l
    };
    this.getCopyCards = function() {
        for (var a = [], b = 0; b < l.length; b++) a[b] = l[b];
        return a
    };
    this.getNumCards = function() {
        return l.length
    };
    this.isIncomplete = function() {
        return 0 < l.length && 3 > l.length ? !0 : !1
    };
    this.getType = function() {
        return e
    };
    this.getSuits = function() {
        for (var a = [], b = 0; b < l.length; b++) a.push(l[b].getSuit());
        return a
    };
    this.getPos = function() {
        return {
            x: n.x,
            y: n.y
        }
    };
    this.getWidth = function() {
        return n.getBounds().width
    };
    this.getHeight = function() {
        return n.getBounds().height
    };
    this.getScore = function() {
        return s_oHandEvaluator.getScore(l, e)
    };
    this.getOwner = function() {
        return f
    };
    this.isPlacedOnTable = function() {
        return g
    };
    this.getRect = function() {
        return new createjs.Rectangle(n.x, n.y, n.getBounds().width, n.getBounds().height)
    };
    this._init(a, c)
}

function CAiController() {
    var a = !1,
        c, b = STATE_AI_IDLE,
        d, g, e, f, l, k;
    this.startCheck = function(d) {
        b = STATE_AI_IDLE;
        k = [];
        f = [];
        l = [];
        for (var e = 0; e < d.length; e++) f[e] = d[e], l[e] = d[e];
        c = 0;
        if (2 < f.length) b = STATE_AI_READY_TO_START;
        else {
            var g = this;
            d = s_oGame.getLastWasteCard();
            f.push(d);
            s_oGame.checkIfCardFitInAnyCombo(d, -1, f.length) ? setTimeout(function() {
                s_oGame.dealCardFromWaste();
                b = STATE_AI_CHECKED_COMBO
            }, 1500) : (f.pop(), setTimeout(function() {
                g.getCardFromTheDeck();
                b = STATE_AI_CHECKED_COMBO
            }, 1500))
        }
        a = !0
    };
    this.restoreCards =
        function() {
            f = [];
            for (var a = 0; a < l.length; a++) f[a] = l[a];
            k = []
        };
    this._checkWastePile = function() {
        var a = s_oGame.getLastWasteCard();
        f.push(a);
        l.push(a);
        this._checkForCombos(!0, a);
        b = STATE_AI_CHECKED_WASTE
    };
    this._checkForCombos = function(a, c) {
        var h = -1;
        a && (h = f.length - 1);
        var q = !1;
        do {
            var p = s_oHandEvaluator.evaluate(!1, f),
                w = p.combo;
            if (null !== w) {
                var t = this.sortCombo(w);
                if (f.length === t.length) f.sort(compareRank), f.pop();
                else {
                    for (var v = t.length - 1; 0 <= v; v--) f.splice(t[v], 1);
                    k.push({
                        combo: w,
                        res: p.res
                    });
                    a && -1 !== w.indexOf(h) ?
                        (h = -1, q = !0) : h = f.length - 1
                }
            }
        } while (p.res !== EVALUATE_NULL && 3 < f.length);
        0 < k.length && this._checkOpeningScore() || a && c.getValue() === JOKER_VALUE ? a && q ? (s_oGame.dealCardFromWaste(), b = STATE_AI_CARD_DEALING) : !1 === a ? (g = d = 0, e = s_oGame.getLastAvailableAttachIndex(), b = STATE_AI_CARD_DEALING) : (l.pop(), this.restoreCards(), this.getCardFromTheDeck()) : (k = [], a ? (l.pop(), this.restoreCards(), this.getCardFromTheDeck()) : b = s_oGame.isOpeningScoreReached() ? STATE_AI_CHECKED_COMBO : STATE_AI_CHECKED_CARD_TABLE)
    };
    this.getCardFromTheDeck =
        function() {
            var a = s_oGame.dealCardToPlayer();
            f.push(a);
            l.push(a)
        };
    this._checkOpeningScore = function() {
        for (var a = 0, b = 0; b < k.length; b++) {
            for (var c = [], d = k[b].combo, e = 0; e < d.length; e++) c.push(l[d[e]]);
            a += s_oHandEvaluator.getScore(c, k[b].res)
        }
        if (!1 === s_oGame.isOpeningScoreReached() && a < MIN_OPENING_VALUE) return !1;
        s_oGame.setOpeningForCurPlayer();
        return !0
    };
    this.sortCombo = function(a) {
        for (var b = [], c = 0; c < a.length; c++) b[c] = a[c];
        return b.sort(function(a, b) {
            return a - b
        })
    };
    this._checkCardOnTable = function() {
        for (var a = !0; a && 1 < f.length;) {
            a = !1;
            for (var c = 0; c < f.length; c++)
                if (s_oGame.checkIfCardFitInAnyCombo(f[c], c, f.length)) {
                    f.splice(c, 1);
                    a = !0;
                    break
                }
        }
        b = STATE_AI_CHECKED_CARD_TABLE
    };
    this._decideCardToWaste = function() {
        a = !1;
        var b = [];
        if (1 === f.length) b.push({
            rank: f[0].getValue(),
            suit: f[0].getSuit(),
            orig_index: 0,
            card: f[0]
        });
        else
            for (var c = 0; c < f.length; c++) f[c] !== JOKER_VALUE && (!1 === this._evaluateSingleCardPotentiality(f[c], c) || 4 > f.length) && b.push({
                rank: f[c].getValue(),
                suit: f[c].getSuit(),
                orig_index: c,
                card: f[c]
            });
        if (0 < b.length) {
            b.sort(compareRank);
            for (c = b.length - 1; f[c].getValue() === JOKER_VALUE && 0 < c;) c--;
            s_oGame.addCardToWastePile(b[c].card, b[c].orig_index)
        } else {
            do b = Math.floor(Math.random() * f.length); while (f[b].getValue() === JOKER_VALUE);
            s_oGame.addCardToWastePile(f[b], b)
        }
    };
    this._evaluateSingleCardPotentiality = function(a, b) {
        for (var c = 0; c < f.length; c++) {
            var d = f[c];
            if (b !== c && a.getSuit() === d.getSuit() && a.getValue() === d.getValue()) return !1
        }
        for (c = 0; c < f.length; c++)
            if (d = f[c], b !== c && (a.getValue() === JOKER_VALUE || a.getSuit() !== d.getSuit() && a.getValue() ===
                    d.getValue() || a.getSuit() === d.getSuit() && (a.getValue() === d.getValue() + 1 || a.getValue() === d.getValue() - 1) || a.getSuit() === d.getSuit() && (a.getValue() === d.getValue() + 2 || a.getValue() === d.getValue() - 2))) return !0;
        return !1
    };
    this.placeComboOnTable = function() {
        var a = k[d].combo;
        s_oGame.addCardToLastAttachAreaByIndex(a[g], e, k[d].res);
        g++;
        if (g === a.length) {
            g = 0;
            a = this.sortCombo(a);
            a = a.reverse();
            for (var c = 0; c < a.length; c++) s_oGame.removeCardFromHandByIndex(a[c]);
            s_oGame.compactCards();
            d++;
            e = s_oGame.getLastAvailableAttachIndex();
            d === k.length && (b = s_oGame.isOpeningScoreReached() ? STATE_AI_CHECKED_COMBO : STATE_AI_CHECKED_CARD_TABLE)
        }
    };
    this.update = function() {
        if (a) switch (c += s_iTimeElaps, b) {
            case STATE_AI_READY_TO_START:
                2E3 < c && (b = -1, c = 0, this._checkWastePile());
                break;
            case STATE_AI_CHECKED_WASTE:
                2E3 < c && (b = -1, c = 0, this._checkForCombos(!1));
                break;
            case STATE_AI_CARD_DEALING:
                1E3 < c && (c = 0, this.placeComboOnTable());
                break;
            case STATE_AI_CHECKED_COMBO:
                2E3 < c && (b = -1, c = 0, this._checkCardOnTable());
                break;
            case STATE_AI_CHECKED_CARD_TABLE:
                1E3 < c && (b = -1, c = 0, this._decideCardToWaste())
        }
    }
}

function CGameOverPanel() {
    var a, c, b, d, g, e, f, l = this;
    this._init = function() {
        e = new createjs.Container;
        e.visible = !1;
        s_oStage.addChild(e);
        c = new createjs.Shape;
        a = c.on("click", function() {});
        c.alpha = 0;
        c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        e.addChild(c);
        f = new createjs.Container;
        f.visible = !1;
        e.addChild(f);
        var k = s_oSpriteLibrary.getSprite("msg_box_scoreboard"),
            l = createBitmap(k);
        l.x = CANVAS_WIDTH / 2;
        l.y = CANVAS_HEIGHT / 2;
        l.regX = k.width / 2;
        l.regY = k.height / 2;
        f.addChild(l);
        k = k.width - 50;
        new CTLText(f, CANVAS_WIDTH / 2 - k / 2, CANVAS_HEIGHT / 2 - 270 - 50, k, 100, 80, "center", "#fff", FONT, 1, 2, 2, TEXT_GAME_OVER, !0, !0, !0, !1);
        g = new CScoreBoard(l.x, l.y - 30, f);
        b = new CGfxButton(CANVAS_WIDTH / 2 - 250, CANVAS_HEIGHT / 2 + 250, s_oSpriteLibrary.getSprite("but_home"), f);
        b.addEventListener(ON_MOUSE_UP, this._onHome, this);
        d = new CGfxButton(CANVAS_WIDTH / 2 + 250, CANVAS_HEIGHT / 2 + 250, s_oSpriteLibrary.getSprite("but_next"), f);
        d.addEventListener(ON_MOUSE_UP, this._onNext, this)
    };
    this.unload = function() {
        b.unload();
        d.unload();
        c.off("click",
            a)
    };
    this.show = function(a, b, d, l) {
        for (var h = [], k = 0; k < s_iNumPlayers; k++) h[k] = a === k ? SCOREBOARD_WIN_ROUND : SCOREBOARD_LOSE_ROUND;
        playSound("round_over", 1, !1);
        e.visible = !0;
        f.alpha = 0;
        c.alpha = 0;
        createjs.Tween.get(c).wait(l).to({
            alpha: .7
        }, 500).call(function() {
            g.show(b, h, d);
            f.alpha = 0;
            f.visible = !0;
            createjs.Tween.get(f).to({
                alpha: 1
            }, 300)
        })
    };
    this.hide = function() {
        e.visible = !1
    };
    this._onHome = function() {
        l.unload();
        s_oMain.gotoMenu()
    };
    this._onNext = function() {
        l.hide();
        s_oGame.restart()
    };
    this._init()
}

function CSelectNumPlayersPanel() {
    var a, c, b, d, g, e, f = null,
        l = null,
        k, q, h, m, n, p, w;
    this._init = function() {
        w = new createjs.Container;
        s_oStage.addChild(w);
        var t = createBitmap(s_oSpriteLibrary.getSprite("bg_select"));
        w.addChild(t);
        new CTLText(w, CANVAS_WIDTH / 2 - 480, CANVAS_HEIGHT / 2 - 250 - 100, 960, 200, 80, "center", "#fff", FONT, 1, 2, 2, TEXT_SELECT_NUM, !0, !0, !0, !1);
        q = new CGfxButton(CANVAS_WIDTH / 2 - 300, CANVAS_HEIGHT / 2 + 100, s_oSpriteLibrary.getSprite("but_p2"), w);
        q.addEventListener(ON_MOUSE_UP, this._onPlayer2, this);
        h = new CGfxButton(CANVAS_WIDTH /
            2, CANVAS_HEIGHT / 2 + 100, s_oSpriteLibrary.getSprite("but_p3"), w);
        h.addEventListener(ON_MOUSE_UP, this._onPlayer3, this);
        m = new CGfxButton(CANVAS_WIDTH / 2 + 300, CANVAS_HEIGHT / 2 + 100, s_oSpriteLibrary.getSprite("but_p4"), w);
        m.addEventListener(ON_MOUSE_UP, this._onPlayer4, this);
        t = s_oSpriteLibrary.getSprite("but_exit");
        a = CANVAS_WIDTH - t.width / 2 - 10;
        c = t.height / 2 + 10;
        k = new CGfxButton(a, c, t, s_oStage);
        k.addEventListener(ON_MOUSE_UP, this._onExit, this);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) t = s_oSpriteLibrary.getSprite("audio_icon"),
            g = a - t.height - 10, e = t.height / 2 + 10, n = new CToggle(g, e, t, s_bAudioActive, s_oStage), n.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        t = window.document;
        var v = t.documentElement;
        f = v.requestFullscreen || v.mozRequestFullScreen || v.webkitRequestFullScreen || v.msRequestFullscreen;
        l = t.exitFullscreen || t.mozCancelFullScreen || t.webkitExitFullscreen || t.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (f = !1);
        f && screenfull.isEnabled && (t = s_oSpriteLibrary.getSprite("but_fullscreen"), b = t.width / 4 + 10, d = t.height / 2 + 10, p = new CToggle(b,
            d, t, s_bFullscreen, s_oStage), p.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        var z = new createjs.Shape;
        z.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        w.addChild(z);
        createjs.Tween.get(z).to({
            alpha: 0
        }, 1E3).call(function() {
            z.visible = !1
        });
        this.refreshButtonPos()
    };
    this.unload = function() {
        q.unload();
        h.unload();
        m.unload();
        k.unload();
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) n.unload(), n = null;
        f && screenfull.isEnabled && p.unload();
        s_oStage.removeAllChildren();
        s_oSelectPanel =
            null
    };
    this.refreshButtonPos = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || n.setPosition(g - s_iOffsetX, s_iOffsetY + e);
        f && screenfull.isEnabled && p.setPosition(b + s_iOffsetX, d + s_iOffsetY);
        k.setPosition(a - s_iOffsetX, c + s_iOffsetY)
    };
    this._onPlayer2 = function() {
        s_iNumPlayers = 2;
        s_aPlayerNames = [TEXT_PLAYER + " 1", TEXT_PLAYER + " 2"];
        s_oSelectPanel.unload();
        s_oMain.gotoGame()
    };
    this._onPlayer3 = function() {
        s_iNumPlayers = 3;
        s_aPlayerNames = [TEXT_PLAYER + " 1", TEXT_PLAYER + " 2", TEXT_PLAYER + " 3"];
        s_oSelectPanel.unload();
        s_oMain.gotoGame()
    };
    this._onPlayer4 = function() {
        s_iNumPlayers = 4;
        s_aPlayerNames = [TEXT_PLAYER + " 1", TEXT_PLAYER + " 2", TEXT_PLAYER + " 3", TEXT_PLAYER + " 4"];
        s_oSelectPanel.unload();
        s_oMain.gotoGame()
    };
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this.resetFullscreenBut = function() {
        f && screenfull.isEnabled && p.setActive(s_bFullscreen)
    };
    this._onFullscreenRelease = function() {
        s_bFullscreen ? l.call(window.document) : f.call(window.document.documentElement);
        sizeHandler()
    };
    this._onExit = function() {
        s_oSelectPanel.unload();
        s_oMain.gotoMenu()
    };
    s_oSelectPanel = this;
    this._init()
}
var s_oSelectPanel = null;

function CNickLabel(a, c, b, d, g) {
    var e = a,
        f, l, k;
    this._init = function(a, b, c) {
        k = new createjs.Container;
        k.x = a.x;
        k.y = a.y;
        k.rotation = b;
        g.addChild(k);
        var d = s_oSpriteLibrary.getSprite("bg_nick");
        a = new createjs.SpriteSheet({
            images: [d],
            frames: {
                width: d.width,
                height: d.height / 2
            },
            animations: {
                state_off: 0,
                state_on: 1
            }
        });
        var h = d.width;
        d = d.height / 2;
        l = createSprite(a, "state_off", 0, 0, h, d);
        k.addChild(l);
        f = new createjs.Text(c, "40px " + FONT, "#fff");
        f.x = h / 2;
        f.y = 38;
        f.textAlign = "center";
        f.textBaseline = "alphabetic";
        k.addChild(f);
        this._resizeFont(40, h);
        k.regX = h / 2;
        k.regY = d;
        switch (b) {
            case 0:
                e = {
                    x: e.x,
                    y: e.y + CARD_MOVE_UP_OFFSET
                };
                break;
            case 90:
                e = {
                    x: e.x - CARD_MOVE_UP_OFFSET,
                    y: e.y
                };
                break;
            case 180:
                e = {
                    x: e.x,
                    y: e.y - CARD_MOVE_UP_OFFSET
                };
                break;
            case -90:
                e = {
                    x: e.x + CARD_MOVE_UP_OFFSET,
                    y: e.y
                }
        }
    };
    this.unload = function() {
        g.removeChild(k)
    };
    this.refreshButtonPos = function() {
        k.x = e.x + s_iOffsetX * c.dir_x;
        k.y = e.y + s_iOffsetY * c.dir_y
    };
    this._resizeFont = function(a, b) {
        for (; f.getBounds().width > b;) a -= 2, f.font = a + "px " + FONT
    };
    this.refreshText = function(a) {
        f.text = a
    };
    this.highlight = function(a) {
        a ? l.gotoAndStop("state_on") : l.gotoAndStop("state_off")
    };
    this._init(a, b, d)
}

function CScoreBoard(a, c, b) {
    var d, g, e, f;
    this._init = function(a, c) {
        e = new createjs.Container;
        e.visible = !1;
        e.x = a;
        e.y = c;
        b.addChild(e);
        this._initRows();
        e.regX = e.getBounds().width / 2;
        e.regY = e.getBounds().height / 2
    };
    this._initRows = function() {
        var a = s_oSpriteLibrary.getSprite("header_scoreboard"),
            b = createBitmap(a);
        e.addChild(b);
        var c = 300,
            h = 36,
            m = 28;
        b = new CTLText(e, 180 - c / 2, m - h / 2, c, h, 26, "center", "#fff", FONT, 1, 2, 2, TEXT_NICK, !0, !0, !0, !1);
        c = 150;
        var n = new CTLText(e, 450 - c / 2, m - h / 2, c, h, 26, "center", "#fff", FONT, 1, 2, 2, TEXT_SCORE,
            !0, !0, !0, !1);
        c = 80;
        new CTLText(e, 590 - c / 2, m - h / 2, c, h, 26, "center", "#fff", FONT, 1, 2, 2, TEXT_WIN, !0, !0, !0, !1);
        var p = s_oSpriteLibrary.getSprite("row_scoreboard"),
            w = new createjs.SpriteSheet({
                images: [p],
                frames: {
                    width: p.width,
                    height: p.height / 4
                },
                animations: {
                    state_idle: 0,
                    state_win_round: 1,
                    state_win_game: 2,
                    state_lose_round: 3
                }
            });
        d = [];
        g = [];
        a = a.height;
        for (var t = 0; t < s_iNumPlayers; t++) {
            var v = createSprite(w, "state_idle", 0, 0, p.width, p.height / 4);
            v.y = a;
            e.addChild(v);
            c = 300;
            h = 50;
            m = a + 32;
            m = new CTLText(e, b.getX(), m - h / 2, c, h, 40,
                "center", "#fff", FONT, 1, 2, 2, s_aPlayerNames[t], !0, !0, !0, !1);
            c = 150;
            h = 50;
            var z = "0/" + SCORE_TO_REACH["player_" + s_iNumPlayers];
            c = new CTLText(e, n.getX(), m.getY(), c, h, 40, "center", "#fff", FONT, 1, 2, 2, z, !0, !0, !0, !1);
            a += p.height / 4;
            d[t] = v;
            g[t] = c
        }
        f = createBitmap(s_oSpriteLibrary.getSprite("double_icon"));
        f.x = 554;
        e.addChild(f)
    };
    this.show = function(a, b, c) {
        f.visible = c ? !0 : !1;
        this.refreshBoard(a, b, c);
        e.visible = !0
    };
    this.refreshBoard = function(a, b, c) {
        for (var e = 0; e < s_iNumPlayers; e++) d[e].gotoAndStop(b[e]), g[e].refreshText(a[e] +
            "/" + SCORE_TO_REACH["player_" + s_iNumPlayers]), c && b[e] === SCOREBOARD_WIN_ROUND && (f.y = g[e].getY())
    };
    this._init(a, c)
}

function CWinPanel() {
    var a, c, b, d, g, e, f, l, k = this;
    this._init = function() {
        f = new createjs.Container;
        f.visible = !1;
        s_oStage.addChild(f);
        c = new createjs.Shape;
        a = c.on("click", function() {});
        c.alpha = 0;
        c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        f.addChild(c);
        l = new createjs.Container;
        l.visible = !1;
        f.addChild(l);
        var k = s_oSpriteLibrary.getSprite("msg_box_scoreboard"),
            h = createBitmap(k);
        h.x = CANVAS_WIDTH / 2;
        h.y = CANVAS_HEIGHT / 2;
        h.regX = k.width / 2;
        h.regY = k.height / 2;
        l.addChild(h);
        k = k.width - 50;
        b =
            new CTLText(l, CANVAS_WIDTH / 2 - k / 2, CANVAS_HEIGHT / 2 - 270 - 50, k, 100, 80, "center", "#fff", FONT, 1, 2, 2, TEXT_GAME_OVER, !0, !0, !0, !1);
        e = new CScoreBoard(h.x, h.y - 30, l);
        d = new CGfxButton(CANVAS_WIDTH / 2 - 250, CANVAS_HEIGHT / 2 + 250, s_oSpriteLibrary.getSprite("but_home"), l);
        d.addEventListener(ON_MOUSE_UP, this._onHome, this);
        g = new CGfxButton(CANVAS_WIDTH / 2 + 250, CANVAS_HEIGHT / 2 + 250, s_oSpriteLibrary.getSprite("but_restart"), l);
        g.addEventListener(ON_MOUSE_UP, this._onRestart, this)
    };
    this.unload = function() {
        g.unload();
        d.unload();
        c.off("click",
            a)
    };
    this.show = function(a, d, g, k) {
        b.refreshText(TEXT_WINNER + " " + s_aPlayerNames[a]);
        for (var h = [], m = 0; m < s_iNumPlayers; m++) h[m] = a === m ? SCOREBOARD_WIN_GAME : SCOREBOARD_LOSE_ROUND;
        playSound("win", 1, !1);
        f.visible = !0;
        l.alpha = 0;
        c.alpha = 0;
        createjs.Tween.get(c).wait(k).to({
            alpha: .7
        }, 500).call(function() {
            e.show(d, h, g);
            l.alpha = 0;
            l.visible = !0;
            createjs.Tween.get(l).to({
                alpha: 1
            }, 300)
        })
    };
    this.hide = function() {
        f.visible = !1
    };
    this._onHome = function() {
        k.unload();
        s_oMain.gotoMenu()
    };
    this._onRestart = function() {
        s_oGame.unload();
        s_oMain.gotoGame()
    };
    this._init()
}

function CHelpPanel(a) {
    var c, b, d, g, e, f, l, k, q, h, m, n, p, w = this;
    this._init = function() {
        c = 0;
        p = new createjs.Container;
        p.visible = !1;
        a.addChild(p);
        m = new createjs.Shape;
        m.alpha = 0;
        m.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        e = m.on("click", function() {});
        p.addChild(m);
        n = new createjs.Container;
        n.visible = !1;
        p.addChild(n);
        var b = s_oSpriteLibrary.getSprite("msg_box_wide"),
            d = createBitmap(b);
        d.x = CANVAS_WIDTH / 2;
        d.y = CANVAS_HEIGHT / 2;
        d.regX = b.width / 2;
        d.regY = b.height / 2;
        n.addChild(d);
        this._createPages();
        b = 70;
        d = CANVAS_WIDTH / 2 + 370;
        var g = CANVAS_HEIGHT / 2 - 300;
        f = new CTLText(n, d - 120, g - b / 2, 120, b, 60, "right", "#fff", FONT, 1, 2, 2, "1/4", !0, !0, !0, !1);
        b = 70;
        d = CANVAS_WIDTH / 2 - 370;
        g = CANVAS_HEIGHT / 2 - 300;
        l = new CTLText(n, d, g - b / 2, 500, b, 60, "left", "#fff", FONT, 1, 2, 2, TEXT_HELP_TITLE[0], !0, !0, !0, !1);
        h = new CGfxButton(CANVAS_WIDTH / 2 + 290, CANVAS_HEIGHT / 2 + 250, s_oSpriteLibrary.getSprite("but_play"), n);
        h.addEventListener(ON_MOUSE_UP, this._onPlay, this);
        k = new CGfxButton(CANVAS_WIDTH / 2 - 450, CANVAS_HEIGHT / 2, s_oSpriteLibrary.getSprite("arrow_left"),
            n);
        k.addEventListener(ON_MOUSE_UP, this._onLeft, this);
        q = new CGfxButton(CANVAS_WIDTH / 2 + 450, CANVAS_HEIGHT / 2, s_oSpriteLibrary.getSprite("arrow_right"), n);
        q.addEventListener(ON_MOUSE_UP, this._onRight, this)
    };
    this.unload = function() {
        h.unload();
        k.unload();
        q.unload();
        m.off("click", e)
    };
    this.show = function() {
        p.visible = !0;
        m.alpha = 0;
        n.alpha = 0;
        n.visible = !0;
        createjs.Tween.get(m).to({
            alpha: .7
        }, 500).call(function() {
            createjs.Tween.get(n).to({
                alpha: 1
            }, 300)
        })
    };
    this.hide = function() {
        p.visible = !1
    };
    this._createPages = function() {
        b =
            CANVAS_WIDTH / 2;
        d = -CANVAS_WIDTH / 2;
        var a = new createjs.Shape;
        a.graphics.beginFill("rgba(255,255,0,0.01)").drawRect(CANVAS_WIDTH / 2 - 400, CANVAS_HEIGHT / 2 - 350, 800, 700);
        n.addChild(a);
        g = [];
        for (var c = 0; 4 > c; c++) {
            var e = new createjs.Container;
            e.visible = !1;
            e.mask = a;
            n.addChild(e);
            g[c] = e
        }
        var f = 750,
            k = 120,
            h = CANVAS_WIDTH / 2,
            l = CANVAS_HEIGHT / 2 - 180;
        new CTLText(g[0], h - f / 2, l - k / 2, f, k, 28, "center", "#fff", FONT, 1, 2, 2, TEXT_HELP_0 + CARD_TO_DEAL["player_" + s_iNumPlayers] + " " + TEXT_CARDS + ".", !0, !0, !0, !1);
        a = s_oGameSettings.getShuffledCardDeck();
        h = CANVAS_WIDTH / 2 - 310;
        for (c = 0; 10 > c; c++) e = createBitmap(s_oSpriteLibrary.getSprite("card_" + a[c].frame)), e.scaleX = e.scaleY = .55, e.x = h, e.y = CANVAS_HEIGHT / 2 - 100, g[0].addChild(e), h += CARD_WIDTH_OFFSET_IN_HAND * e.scaleX;
        f = 750;
        k = 100;
        h = CANVAS_WIDTH / 2;
        l = CANVAS_HEIGHT / 2 - 200;
        new CTLText(g[1], h - f / 2, l - k / 2, f, k, 22, "center", "#fff", FONT, 1, 2, 2, TEXT_HELP_1, !0, !0, !0, !1);
        for (h = 0; h < s_oGameSettings.getStartingDeckLength(); h++) {
            var m = new CVector2(-(.2 * h), -(.2 * h));
            e = createBitmap(s_oSpriteLibrary.getSprite("card_54"));
            e.x = CANVAS_WIDTH /
                2 - 150 + m.getX();
            e.y = CANVAS_HEIGHT / 2 - 140 + m.getY();
            e.scaleX = e.scaleY = .6;
            g[1].addChild(e)
        }
        e = createBitmap(s_oSpriteLibrary.getSprite("card_" + Math.floor(50 * Math.random())));
        e.x = CANVAS_WIDTH / 2 + 20 + m.getX();
        e.y = CANVAS_HEIGHT / 2 - 140;
        e.scaleX = e.scaleY = .6;
        g[1].addChild(e);
        f = 750;
        k = 50;
        h = CANVAS_WIDTH / 2;
        l = CANVAS_HEIGHT / 2 + 107;
        new CTLText(g[1], h - f / 2, l - k / 2, f, k, 22, "center", "#fff", FONT, 1, 2, 2, TEXT_HELP_2, !0, !0, !0, !1);
        f = 750;
        k = 100;
        h = CANVAS_WIDTH / 2;
        l = CANVAS_HEIGHT / 2 - 198;
        new CTLText(g[2], h - f / 2, l - k / 2, f, k, 28, "center", "#fff",
            FONT, 1, 2, 2, TEXT_HELP_3, !0, !0, !0, !1);
        h = CANVAS_WIDTH / 2 - 350;
        f = 200;
        k = 40;
        l = CANVAS_HEIGHT / 2 + 30;
        new CTLText(g[2], h + 90 - f / 2, l - k / 2, f, k, 26, "center", "#fff", FONT, 1, 2, 2, TEXT_TRIS, !0, !0, !0, !1);
        c = ["card_12", "card_25", "card_51"];
        for (f = 0; 3 > f; f++) e = createBitmap(s_oSpriteLibrary.getSprite(c[f])), e.x = h, e.y = CANVAS_HEIGHT / 2 - 140, e.scaleX = e.scaleY = .4, g[2].addChild(e), h += CARD_WIDTH_OFFSET_IN_HAND * e.scaleX;
        h = CANVAS_WIDTH / 2 - 120;
        f = 200;
        k = 40;
        l = CANVAS_HEIGHT / 2 + 30;
        new CTLText(g[2], h + 110 - f / 2, l - k / 2, f, k, 26, "center", "#fff", FONT, 1, 2,
            2, TEXT_POKER, !0, !0, !0, !1);
        c = ["card_0", "card_13", "card_26", "card_39"];
        for (f = 0; 4 > f; f++) e = createBitmap(s_oSpriteLibrary.getSprite(c[f])), e.x = h, e.y = CANVAS_HEIGHT / 2 - 140, e.scaleX = e.scaleY = .4, g[2].addChild(e), h += CARD_WIDTH_OFFSET_IN_HAND * e.scaleX;
        h = CANVAS_WIDTH / 2 + 160;
        f = 200;
        k = 40;
        l = CANVAS_HEIGHT / 2 + 30;
        new CTLText(g[2], h + 90 - f / 2, l - k / 2, f, k, 26, "center", "#fff", FONT, 1, 2, 2, TEXT_STRAIGHT, !0, !0, !0, !1);
        c = ["card_10", "card_11", "card_12"];
        for (f = 0; 3 > f; f++) e = createBitmap(s_oSpriteLibrary.getSprite(c[f])), e.x = h, e.y = CANVAS_HEIGHT /
            2 - 140, e.scaleX = e.scaleY = .4, g[2].addChild(e), h += CARD_WIDTH_OFFSET_IN_HAND * e.scaleX;
        0 < MIN_OPENING_VALUE && (f = 750, k = 50, h = CANVAS_WIDTH / 2, l = CANVAS_HEIGHT / 2 + 107, new CTLText(g[2], h - f / 2, l - k / 2, f, k, 24, "center", "#fff", FONT, 1, 2, 2, TEXT_HELP_8 + " " + MIN_OPENING_VALUE + " " + TEXT_POINTS, !0, !0, !0, !1));
        c = GOING_RUMMY_RULE ? TEXT_HELP_9 : "";
        f = 750;
        k = 120;
        h = CANVAS_WIDTH / 2;
        l = CANVAS_HEIGHT / 2 - 190;
        new CTLText(g[3], h - f / 2, l - k / 2, f, k, 22, "center", "#fff", FONT, 1, 2, 2, TEXT_HELP_4 + " " + SCORE_ACE + " " + TEXT_HELP_5 + " " + c, !0, !0, !0, !1);
        h = CANVAS_WIDTH /
            2 - 140;
        var p = 0;
        for (c = 0; 5 > c; c++) {
            e = createBitmap(s_oSpriteLibrary.getSprite("card_" + a[c].frame));
            e.scaleX = e.scaleY = .45;
            e.x = h;
            e.y = CANVAS_HEIGHT / 2 - 120;
            g[3].addChild(e);
            var q = a[c].rank;
            q === ACE_VALUE ? q = SCORE_ACE : q === JOKER_VALUE ? q = SCORE_JOKER : 10 < q && (q = 10);
            f = 32;
            k = 30;
            m = h + 40;
            l = e.y + 180;
            new CTLText(g[3], m - f / 2, l - k / 2, f, k, 22, "center", "#fff", FONT, 1, 2, 2, q, !0, !0, !0, !1);
            p += q;
            h += CARD_WIDTH_OFFSET_IN_HAND * e.scaleX
        }
        k = 30;
        l = e.y + 180;
        new CTLText(g[3], h + 40, l - k / 2, 150, k, 22, "left", "#fff", FONT, 1, 2, 2, ":   " + p + " " + TEXT_POINTS, !0,
            !0, !0, !1);
        f = 750;
        k = 30;
        h = CANVAS_WIDTH / 2;
        l = CANVAS_HEIGHT / 2 + 100;
        new CTLText(g[3], h - f / 2, l - k / 2, f, k, 24, "center", "#fff", FONT, 1, 2, 2, TEXT_HELP_6 + " " + SCORE_TO_REACH["player_" + s_iNumPlayers] + " " + TEXT_HELP_7, !0, !0, !0, !1);
        g[0].visible = !0
    };
    this._onLeft = function() {
        var a = c;
        c--;
        0 > c && (c = 3);
        g[c].x = d;
        g[c].visible = !0;
        createjs.Tween.get(g[a]).to({
            x: b
        }, 500, createjs.Ease.cubicOut).call(function() {
            g[a].visible = !1
        });
        createjs.Tween.get(g[c]).to({
            x: 0
        }, 500, createjs.Ease.cubicOut).call(function() {
            l.refreshText(TEXT_HELP_TITLE[c]);
            f.refreshText(c + 1 + "/4")
        })
    };
    this._onRight = function() {
        var a = c;
        c++;
        4 === c && (c = 0);
        g[c].x = b;
        g[c].visible = !0;
        createjs.Tween.get(g[a]).to({
            x: d
        }, 500, createjs.Ease.cubicOut).call(function() {
            g[a].visible = !1
        });
        createjs.Tween.get(g[c]).to({
            x: 0
        }, 500, createjs.Ease.cubicOut).call(function() {
            l.refreshText(TEXT_HELP_TITLE[c]);
            f.refreshText(c + 1 + "/4")
        })
    };
    this._onPlay = function() {
        w.hide();
        s_oGame.exitFromHelpPanel()
    };
    this._init()
}

function CCursorHandController(a) {
    var c, b, d, g;
    this._init = function() {
        g = new createjs.Container;
        a.addChild(g);
        var e = {
            images: [s_oSpriteLibrary.getSprite("hand_anim")],
            framerate: 30,
            frames: {
                width: 156,
                height: 284,
                regX: 78,
                regY: 142
            },
            animations: {
                start: 0,
                anim: [0, 19]
            }
        };
        e = new createjs.SpriteSheet(e);
        c = createSprite(e, "start", 156, 284, 78, 142);
        c.visible = !1;
        c.x = 0;
        c.y = CARD_HEIGHT / 2;
        g.addChild(c);
        b = new createjs.Container;
        b.visible = !1;
        g.addChild(b);
        d = createBitmap(s_oSpriteLibrary.getSprite("hand_swipe"));
        b.addChild(d);
        e = new createjs.Shape;
        e.graphics.beginFill("rgba(0,0,0,0.7)").drawRoundRect(CARD_WIDTH - 100, CARD_HEIGHT / 2 + 10, 240, 120, 10);
        b.addChild(e);
        e = CARD_WIDTH;
        new CTLText(b, CARD_WIDTH + 20 - e / 2, CARD_HEIGHT / 2 + 70 - 55, e, 110, 34, "center", "#fff", FONT, 1, 2, 2, TEXT_HELP_WASTE, !0, !0, !0, !1)
    };
    this.showHandAnim = function(a) {
        a ? c.gotoAndPlay("anim") : c.gotoAndPlay("start");
        c.visible = a
    };
    this.showHandSwipe = function(a, c) {
        b.visible = !0;
        d.x = a.x;
        d.y = a.y;
        createjs.Tween.get(d, {
            loop: -1
        }).to({
            x: c.x,
            y: c.y
        }, 1E3, createjs.Ease.cubicOut).call(function() {
            d.x =
                a.x;
            d.y = a.y
        })
    };
    this.hideHandSwipe = function() {
        b.visible = !1;
        createjs.Tween.removeTweens(d)
    };
    this._init()
}

function CRummyAnim(a, c, b) {
    var d, g, e;
    this._init = function(a, c) {
        e = new createjs.Container;
        e.x = a;
        e.y = c;
        e.visible = !1;
        b.addChild(e);
        for (var f = [], l = 1; 60 > l; l++) f.push(s_oSpriteLibrary.getSprite("rummy_anim_" + l));
        l = new createjs.SpriteSheet({
            images: f,
            frames: {
                width: f[0].width,
                height: f[0].height
            },
            animations: {
                start: 0,
                anim: [0, 58, "stop_anim"],
                stop_anim: 58
            }
        });
        d = createSprite(l, "start", 0, 0, f[0].width, f[0].height);
        e.addChild(d);
        g = new createjs.Text("", "74px " + FONT, "#fff");
        g.x = f[0].width / 2;
        g.y = f[0].height + 50;
        g.textAlign =
            "center";
        g.textBaseline = "alphabetic";
        e.addChild(g);
        e.regX = f[0].width / 2;
        e.regY = f[0].height / 2
    };
    this.show = function(a) {
        playSound("rummy", 1, !1);
        a ? g.text = "" : (g.alpha = 0, g.text = TEXT_DOUBLE, createjs.Tween.get(g).wait(500).to({
            alpha: 1
        }, 1E3, createjs.Ease.cubicOut), createjs.Tween.get(e).wait(3E3).to({
            scaleX: .1,
            scaleY: .1,
            alpha: 0
        }, 500, createjs.Ease.cubicIn).call(function() {
            e.visible = !1
        }));
        e.visible = !0;
        d.gotoAndPlay("anim")
    };
    this._init(a, c)
}
CTLText.prototype = {
    constructor: CTLText,
    __autofit: function() {
        if (this._bFitText) {
            for (var a = this._iFontSize;
                (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV || this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) && !(a--, this._oText.font = a + "px " + this._szFont, this._oText.lineHeight = Math.round(a * this._fLineHeightFactor), this.__updateY(), this.__verticalAlign(), 8 > a););
            this._iFontSize = a
        }
    },
    __verticalAlign: function() {
        if (this._bVerticalAlign) {
            var a = this._oText.getBounds().height;
            this._oText.y -=
                (a - this._iHeight) / 2 + this._iPaddingV
        }
    },
    __updateY: function() {
        this._oText.y = this._y + this._iPaddingV;
        switch (this._oText.textBaseline) {
            case "middle":
                this._oText.y += this._oText.lineHeight / 2 + (this._iFontSize * this._fLineHeightFactor - this._iFontSize)
        }
    },
    __createText: function(a) {
        this._bDebug && (this._oDebugShape = new createjs.Shape, this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(this._x, this._y, this._iWidth, this._iHeight), this._oContainer.addChild(this._oDebugShape));
        this._oText = new createjs.Text(a,
            this._iFontSize + "px " + this._szFont, this._szColor);
        this._oText.textBaseline = "middle";
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this._oText.textAlign = this._szAlign;
        this._oText.lineWidth = this._bMultiline ? this._iWidth - 2 * this._iPaddingH : null;
        switch (this._szAlign) {
            case "center":
                this._oText.x = this._x + this._iWidth / 2;
                break;
            case "left":
                this._oText.x = this._x + this._iPaddingH;
                break;
            case "right":
                this._oText.x = this._x + this._iWidth - this._iPaddingH
        }
        this._oContainer.addChild(this._oText);
        this.refreshText(a)
    },
    setVerticalAlign: function(a) {
        this._bVerticalAlign = a
    },
    setOutline: function(a) {
        null !== this._oText && (this._oText.outline = a)
    },
    setShadow: function(a, c, b, d) {
        null !== this._oText && (this._oText.shadow = new createjs.Shadow(a, c, b, d))
    },
    setColor: function(a) {
        this._oText.color = a
    },
    setAlpha: function(a) {
        this._oText.alpha = a
    },
    setY: function(a) {
        this._y = this._oText.y = a
    },
    setFontSize: function(a) {
        this._iFontSize = a
    },
    removeTweens: function() {
        createjs.Tween.removeTweens(this._oText)
    },
    getText: function() {
        return this._oText
    },
    getX: function() {
        return this._x
    },
    getY: function() {
        return this._y
    },
    getFontSize: function() {
        return this._iFontSize
    },
    refreshText: function(a) {
        "" === a && (a = " ");
        null === this._oText && this.__createText(a);
        this._oText.text = a;
        this._oText.font = this._iFontSize + "px " + this._szFont;
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this.__autofit();
        this.__updateY();
        this.__verticalAlign()
    }
};

function CTLText(a, c, b, d, g, e, f, l, k, q, h, m, n, p, w, t, v) {
    this._oContainer = a;
    this._x = c;
    this._y = b;
    this._iWidth = d;
    this._iHeight = g;
    this._bMultiline = t;
    this._iFontSize = e;
    this._szAlign = f;
    this._szColor = l;
    this._szFont = k;
    this._iPaddingH = h;
    this._iPaddingV = m;
    this._bVerticalAlign = w;
    this._bFitText = p;
    this._bDebug = v;
    this._oDebugShape = null;
    this._fLineHeightFactor = q;
    this._oText = null;
    n && this.__createText(n)
}

function extractHostname(a) {
    a = -1 < a.indexOf("://") ? a.split("/")[2] : a.split("/")[0];
    a = a.split(":")[0];
    return a = a.split("?")[0]
}

function extractRootDomain(a) {
    a = extractHostname(a);
    var c = a.split("."),
        b = c.length;
    2 < b && (a = c[b - 2] + "." + c[b - 1]);
    return a
}
var getClosestTop = function() {
        var a = window,
            c = !1;
        try {
            for (; a.parent.document !== a.document;)
                if (a.parent.document) a = a.parent;
                else {
                    c = !0;
                    break
                }
        } catch (b) {
            c = !0
        }
        return {
            topFrame: a,
            err: c
        }
    },
    getBestPageUrl = function(a) {
        var c = a.topFrame,
            b = "";
        if (a.err) try {
            try {
                b = window.top.location.href
            } catch (g) {
                var d = window.location.ancestorOrigins;
                b = d[d.length - 1]
            }
        } catch (g) {
            b = c.document.referrer
        } else b = c.location.href;
        return b
    },
    TOPFRAMEOBJ = getClosestTop(),
    PAGE_URL = getBestPageUrl(TOPFRAMEOBJ);

function seekAndDestroy() {
    for (var a = extractRootDomain(PAGE_URL), c = [String.fromCharCode(99, 111, 100, 101, 116, 104, 105, 115, 108, 97, 98, 46, 99, 111, 109), String.fromCharCode(101, 110, 118, 97, 116, 111, 46, 99, 111, 109), String.fromCharCode(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 99, 111, 109), String.fromCharCode(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 110, 101, 116)], b = 0; b < c.length; b++)
        if (c[b] === a) return !0;
    return !1
};