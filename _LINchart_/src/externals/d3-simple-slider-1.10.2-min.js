// https://github.com/johnwalley/d3-simple-slider v1.10.2 Copyright 2020 John Walley
!function (t, e) {
    'object' == typeof exports && 'undefined' != typeof module ? e(exports, require('d3-transition'), require('d3-axis'), require('d3-array'), require('d3-scale'), require('d3-selection'), require('d3-dispatch'), require('d3-drag'), require('d3-ease')) : 'function' == typeof define && define.amd ? define(['exports',
    'd3-transition',
    'd3-axis',
    'd3-array',
    'd3-scale',
    'd3-selection',
    'd3-dispatch',
    'd3-drag',
    'd3-ease'], e) : e((t = 'undefined' != typeof globalThis ? globalThis : t || self).d3 = t.d3 || {
    }, t.d3, t.d3, t.d3, t.d3, t.d3, t.d3, t.d3, t.d3)
  }(this, (function (t, e, n, a, r, l, i, u, c) {
    'use strict';
    function o(t) {
      if (t && t.__esModule) return t;
      var e = Object.create(null);
      return t && Object.keys(t).forEach((function (n) {
        if ('default' !== n) {
          var a = Object.getOwnPropertyDescriptor(t, n);
          Object.defineProperty(e, n, a.get ? a : {
            enumerable: !0,
            get: function () {
              return t[n]
            }
          })
        }
      })),
      e.default = t,
      Object.freeze(e)
    }
    var s = o(l);
    function d(t) {
      const e = !('event' in Object.getOwnPropertyNames(s));
      return function (n, a) {
        e ? t.call(this, n, a) : t.call(this, l.event, n)
      }
    }
    function f(t) {
      return 'translate(' + t + ',0)'
    }
    function h(t) {
      return 'translate(0,' + t + ')'
    }
    function m(t, e) {
      e = void 0 !== e ? e.copy() : null;
      var o = [
        0
      ],
      s = [
        0
      ],
      m = [
        0,
        10
      ],
      g = 100,
      p = 100,
      v = !0,
      x = 'M-5.5,-5.5v10l6,5.5l6,-5.5v-10z',
      k = null,
      y = null,
      b = 3,
      w = null,
      A = null,
      M = null,
      D = null,
      O = null,
      j = i.dispatch('onchange', 'start', 'end', 'drag'),
      q = null,
      P = null,
      z = null,
      F = 1 === t || 4 === t ? - 1 : 1,
      L = 4 === t || 2 === t ? - 1 : 1,
      T = 4 === t || 2 === t ? 'y' : 'x',
      V = 4 === t || 2 === t ? 'x' : 'y',
      E = 1 === t || 3 === t ? f : h,
      R = 1 === t || 3 === t ? h : f,
      _ = null;
      switch (t) {
        case 1:
          _ = n.axisTop;
          break;
        case 2:
          _ = n.axisRight;
          break;
        case 3:
          _ = n.axisBottom;
          break;
        case 4:
          _ = n.axisLeft
      }
      var B = null,
      H = null;
      function Q(n) {
        q = n.selection ? n.selection() : n,
        e || (e = (e = m[0] instanceof Date ? r.scaleTime() : r.scaleLinear()).domain(m).range(1 === t || 3 === t ? [
          0,
          g
        ] : [
          p,
          0
        ]).clamp(!0)),
        P = r.scaleLinear().range(e.range()).domain(e.range()).clamp(!0),
        o = o.map((function (t) {
          return r.scaleLinear().range(m).domain(m).clamp(!0) (t)
        })),
        A = A || e.tickFormat(),
        D = D || A || e.tickFormat(),
        q.selectAll('.axis').data([null]).enter().append('g').attr('transform', R(7 * F)).attr('class', 'axis');
        var i = q.selectAll('.slider').data([null]),
        c = i.enter().append('g').attr('class', 'slider').attr('cursor', 1 === t || 3 === t ? 'ew-resize' : 'ns-resize').call(u.drag().on('start', d((function (n) {
          l.select(this).classed('active', !0);
          var r = P(3 === t || 1 === t ? n.x : n.y);
          z = o[0] === m[0] && o[1] === m[0] ? 1 : o[0] === m[1] && o[1] === m[1] ? 0 : a.scan(o.map((function (t) {
            return Math.abs(t - C(e.invert(r)))
          })));
          var u = o.map((function (t, n) {
            return n === z ? C(e.invert(r)) : t
          }));
          G(u),
          j.call('start', i, 1 === u.length ? u[0] : u),
          N(u, !0)
        }))).on('drag', d((function (e) {
          var n = f(P(3 === t || 1 === t ? e.x : e.y));
          G(n),
          j.call('drag', i, 1 === n.length ? n[0] : n),
          N(n, !0)
        }))).on('end', d((function (e) {
          l.select(this).classed('active', !1);
          var n = f(P(3 === t || 1 === t ? e.x : e.y));
          G(n),
          j.call('end', i, 1 === n.length ? n[0] : n),
          N(n, !0),
          z = null
        }))));
        c.append('line').attr('class', 'track').attr(T + '1', e.range() [0] - 8 * L).attr('stroke', '#bbb').attr('stroke-width', 6).attr('stroke-linecap', 'round'),
        c.append('line').attr('class', 'track-inset').attr(T + '1', e.range() [0] - 8 * L).attr('stroke', '#eee').attr('stroke-width', 4).attr('stroke-linecap', 'round'),
        O && c.append('line').attr('class', 'track-fill').attr(T + '1', 1 === o.length ? e.range() [0] - 8 * L : e(o[0])).attr('stroke', O).attr('stroke-width', 4).attr('stroke-linecap', 'round'),
        c.append('line').attr('class', 'track-overlay').attr(T + '1', e.range() [0] - 8 * L).attr('stroke', 'transparent').attr('stroke-width', 40).attr('stroke-linecap', 'round').merge(i.select('.track-overlay'));
        var s = c.selectAll('.parameter-value').data(o.map((function (t, e) {
          return {
            value: t,
            index: e
          }
        }))).enter().append('g').attr('class', 'parameter-value').attr('transform', (function (t) {
          return E(e(t.value))
        })).attr('font-family', 'sans-serif').attr('text-anchor', 2 === t ? 'start' : 4 === t ? 'end' : 'middle');
        function f(t) {
          var n = C(e.invert(t));
          return o.map((function (t, e) {
            return 2 === o.length ? e === z ? 0 === z ? Math.min(n, C(o[1])) : Math.max(n, C(o[0])) : t : e === z ? n : t
          }))
        }
        s.append('path').attr('transform', 'rotate(' + 90 * (t + 1) + ')').attr('d', x).attr('class', 'handle').attr('aria-label', 'handle').attr('aria-valuemax', m[1]).attr('aria-valuemin', m[0]).attr('aria-valuenow', (function (t) {
          return t.value
        })).attr('aria-orientation', 4 === t || 2 === t ? 'vertical' : 'horizontal').attr('focusable', 'true').attr('tabindex', 0).attr('fill', 'white').attr('stroke', '#777').on('keydown', d((function (t, e) {
          var n = k || (m[1] - m[0]) / 100,
          r = w ? a.scan(w.map((function (t) {
            return Math.abs(o[e.index] - t)
          }))) : null;
          function l(t) {
            return o.map((function (n, a) {
              return 2 === o.length ? a === e.index ? 0 === e.index ? Math.min(t, C(o[1])) : Math.max(t, C(o[0])) : n : a === e.index ? t : n
            }))
          }
          switch (t.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
              w ? Q.value(l(w[Math.max(0, r - 1)])) : Q.value(l( + o[e.index] - n)),
              t.preventDefault();
              break;
            case 'PageDown':
              w ? Q.value(l(w[Math.max(0, r - 2)])) : Q.value(l( + o[e.index] - 2 * n)),
              t.preventDefault();
              break;
            case 'ArrowRight':
            case 'ArrowUp':
              w ? Q.value(l(w[Math.min(w.length - 1, r + 1)])) : Q.value(l( + o[e.index] + n)),
              t.preventDefault();
              break;
            case 'PageUp':
              w ? Q.value(l(w[Math.min(w.length - 1, r + 2)])) : Q.value(l( + o[e.index] + 2 * n)),
              t.preventDefault();
              break;
            case 'Home':
              Q.value(l(m[0])),
              t.preventDefault();
              break;
            case 'End':
              Q.value(l(m[1])),
              t.preventDefault()
          }
        }))),
        v && s.append('text').attr('font-size', 10).attr(V, F * (24 + b)).attr('dy', 1 === t ? '0em' : 3 === t ? '.71em' : '.32em').attr('transform', o.length > 1 ? 'translate(0,0)' : null).text((function (t, e) {
          return A(o[e])
        })),
        n.select('.track').attr(T + '2', e.range() [1] + 8 * L),
        n.select('.track-inset').attr(T + '2', e.range() [1] + 8 * L),
        O && n.select('.track-fill').attr(T + '2', 1 === o.length ? e(o[0]) : e(o[1])),
        n.select('.track-overlay').attr(T + '2', e.range() [1] + 8 * L),
        n.select('.axis').call(_(e).tickFormat(A).ticks(M).tickValues(y).tickPadding(b)),
        q.select('.axis').select('.domain').remove(),
        n.select('.axis').attr('transform', R(7 * F)),
        n.selectAll('.axis text').attr('fill', '#aaa').attr(V, F * (17 + b)).attr('dy', 1 === t ? '0em' : 3 === t ? '.71em' : '.32em').attr('text-anchor', 2 === t ? 'start' : 4 === t ? 'end' : 'middle'),
        n.selectAll('.axis line').attr('stroke', '#aaa'),
        n.selectAll('.parameter-value').attr('transform', (function (t) {
          return E(e(t.value))
        })),
        U(),
        H = q.selectAll('.parameter-value text'),
        B = q.select('.track-fill')
      }
      function U() {
        if (q && v) {
          var t = [
          ];
          if (o.forEach((function (e) {
            var n = [
            ];
            q.selectAll('.axis .tick').each((function (t) {
              n.push(Math.abs(t - e))
            })),
            t.push(a.scan(n))
          })), q.selectAll('.axis .tick text').attr('opacity', (function (e, n) {
            return ~t.indexOf(n) ? 0 : 1
          })), H && o.length > 1) {
            var e,
            n,
            r = [
            ],
            l = [
            ];
            H.nodes().forEach((function (t, a) {
              e = t.getBoundingClientRect(),
              n = t.getAttribute('transform').split(/[()]/) [1].split(',') ['x' === T ? 0 : 1],
              r[a] = e[T] - parseFloat(n),
              l[a] = e['x' === T ? 'width' : 'height']
            })),
            'x' === T ? (n = Math.max(0, (r[0] + l[0] - r[1]) / 2), H.attr('transform', (function (t, e) {
              return 'translate(' + (1 === e ? n : - n) + ',0)'
            }))) : (n = Math.max(0, (r[1] + l[1] - r[0]) / 2), H.attr('transform', (function (t, e) {
              return 'translate(0,' + (1 === e ? - n : n) + ')'
            })))
          }
        }
      }
      function C(t) {
        if (w) {
          var e = a.scan(w.map((function (e) {
            return Math.abs(t - e)
          })));
          return w[e]
        }
        if (k) {
          var n = (t - m[0]) % k,
          r = t - n;
          return 2 * n > k && (r += k),
          t instanceof Date ? new Date(r) : r
        }
        return t
      }
      function N(t, e) {
        (o[0] !== t[0] || o.length > 1 && o[1] !== t[1]) && (o = t, e && j.call('onchange', Q, 1 === t.length ? t[0] : t), U())
      }
      function G(t, n) {
        q && ((n = void 0 !== n && n) ? (q.selectAll('.parameter-value').data(t.map((function (t, e) {
          return {
            value: t,
            index: e
          }
        }))).transition().ease(c.easeQuadOut).duration(200).attr('transform', (function (t) {
          return E(e(t.value))
        })).select('.handle').attr('aria-valuenow', (function (t) {
          return t.value
        })), O && B.transition().ease(c.easeQuadOut).duration(200).attr(T + '1', 1 === o.length ? e.range() [0] - 8 * F : e(t[0])).attr(T + '2', 1 === o.length ? e(t[0]) : e(t[1]))) : (q.selectAll('.parameter-value').data(t.map((function (t, e) {
          return {
            value: t,
            index: e
          }
        }))).attr('transform', (function (t) {
          return E(e(t.value))
        })).select('.handle').attr('aria-valuenow', (function (t) {
          return t.value
        })), O && B.attr(T + '1', 1 === o.length ? e.range() [0] - 8 * F : e(t[0])).attr(T + '2', 1 === o.length ? e(t[0]) : e(t[1]))), v && H.text((function (e, n) {
          return D(t[n])
        })))
      }
      return e && (m = [
        a.min(e.domain()),
        a.max(e.domain())
      ], 1 === t || 3 === t ? g = a.max(e.range()) - a.min(e.range()) : p = a.max(e.range()) - a.min(e.range()), e = e.clamp(!0)),
      Q.min = function (t) {
        return arguments.length ? (m[0] = t, e && e.domain(m), Q) : m[0]
      },
      Q.max = function (t) {
        return arguments.length ? (m[1] = t, e && e.domain(m), Q) : m[1]
      },
      Q.domain = function (t) {
        return arguments.length ? (m = t, e && e.domain(m), Q) : m
      },
      Q.width = function (t) {
        return arguments.length ? (g = t, e && e.range([e.range() [0],
        e.range() [0] + g]), Q) : g
      },
      Q.height = function (t) {
        return arguments.length ? (p = t, e && e.range([e.range() [0],
        e.range() [0] + p]), Q) : p
      },
      Q.tickFormat = function (t) {
        return arguments.length ? (A = t, Q) : A
      },
      Q.displayFormat = function (t) {
        return arguments.length ? (D = t, Q) : D
      },
      Q.ticks = function (t) {
        return arguments.length ? (M = t, Q) : M
      },
      Q.value = function (t) {
        if (!arguments.length) return 1 === o.length ? o[0] : o;
        var n = Array.isArray(t) ? t : [
          t
        ];
        if (n.sort((function (t, e) {
          return t - e
        })), e) {
          var a = n.map(e).map(P),
          r = a.map(e.invert).map(C);
          G(r, !0),
          N(r, !0)
        } else o = n;
        return Q
      },
      Q.silentValue = function (t) {
        if (!arguments.length) return 1 === o.length ? o[0] : o;
        var n = Array.isArray(t) ? t : [
          t
        ];
        if (n.sort((function (t, e) {
          return t - e
        })), e) {
          var a = n.map(e).map(P),
          r = a.map(e.invert).map(C);
          G(r, !1),
          N(r, !1)
        } else o = n;
        return Q
      },
      Q.default = function (t) {
        if (!arguments.length) return 1 === s.length ? s[0] : s;
        var e = Array.isArray(t) ? t : [
          t
        ];
        return e.sort((function (t, e) {
          return t - e
        })),
        s = e,
        o = e,
        Q
      },
      Q.step = function (t) {
        return arguments.length ? (k = t, Q) : k
      },
      Q.tickValues = function (t) {
        return arguments.length ? (y = t, Q) : y
      },
      Q.tickPadding = function (t) {
        return arguments.length ? (b = t, Q) : b
      },
      Q.marks = function (t) {
        return arguments.length ? (w = t, Q) : w
      },
      Q.handle = function (t) {
        return arguments.length ? (x = t, Q) : x
      },
      Q.displayValue = function (t) {
        return arguments.length ? (v = t, Q) : v
      },
      Q.fill = function (t) {
        return arguments.length ? (O = t, Q) : O
      },
      Q.on = function () {
        var t = j.on.apply(j, arguments);
        return t === j ? Q : t
      },
      Q
    }
    t.sliderBottom = function (t) {
      return m(3, t)
    },
    t.sliderHorizontal = function (t) {
      return m(3, t)
    },
    t.sliderLeft = function (t) {
      return m(4, t)
    },
    t.sliderRight = function (t) {
      return m(2, t)
    },
    t.sliderTop = function (t) {
      return m(1, t)
    },
    t.sliderVertical = function (t) {
      return m(4, t)
    },
    Object.defineProperty(t, '__esModule', {
      value: !0
    })
  }));
  