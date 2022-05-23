(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tamv6", [], factory);
	else if(typeof exports === 'object')
		exports["tamv6"] = factory();
	else
		root["tamv6"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/TAHrenderer.js":
/*!*******************************!*\
  !*** ./src/js/TAHrenderer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TAHRenderer": () => (/* binding */ TAHRenderer)
/* harmony export */ });
/* harmony import */ var _export_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./export.js */ "./src/js/export.js");
/* harmony import */ var _TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TAMrenderer.js */ "./src/js/TAMrenderer.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/js/utils.js");
/* harmony import */ var _interaction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interaction.js */ "./src/js/interaction.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
/* harmony import */ var _scalarfield_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scalarfield.js */ "./src/js/scalarfield.js");
/* harmony import */ var _dbman_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dbman.js */ "./src/js/dbman.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } Object.defineProperty(subClass, "prototype", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// H-Tree Renderer
//
///////////////////////////////////////////////////////////////////////////////

 // import { default as i18n } from "./i18n.js";






 // Parameters for Family Graph appearance

var PARM_RANGE_UNIT_LEN = 3;
var PARM_NODE_BORDER_COLOR_FIXED = "#741B47";
var PARM_FAMILY_NODE_BORDER_COLOR = "#f88";
var PARM_FAMILY_NODE_BORDER_WIDTH = 10;
var PARM_FAMILY_FONT_SIZE = 16;
var PARM_FAMILY_NODE_OPACITY = 0.7; /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var TAHRenderer = /*#__PURE__*/function (_TAMRenderer) {
  _inherits(TAHRenderer, _TAMRenderer);

  var _super = _createSuper(TAHRenderer);

  function TAHRenderer() {
    var _this;

    _classCallCheck(this, TAHRenderer);

    _this = _super.call(this);
    _this.PNODES = [];
    _this.FNODES = [];
    _this.LINKNODES = [];
    _this.FAMILYLINKS = [];
    _this.SVG_FAMILY_CIRCLES = null;
    _this.SVG_FAMILY_LABELS = null;

    var _parms = _parms_js__WEBPACK_IMPORTED_MODULE_4__.GETall();

    _this.instance = _assertThisInitialized(_this);
    _this.RENDERtype = 2;
    _this.svgKENN = 'TAM';
    _this.isInitialized = false;
    _this.GRAPH_DATA = null; // this.COLORMAP = d3.scaleSequential(d3.interpolateRainbow);

    _this.NODES_COLORMAP = null;
    return _this;
  }

  _createClass(TAHRenderer, [{
    key: "createPersonForceGraph",
    value: function createPersonForceGraph(dataset) {
      var _this2 = this;

      var objRef = this;
      var _colordim = _parms_js__WEBPACK_IMPORTED_MODULE_4__.H_gen; // list persons
      //----------------------------------

      var _rangeMin = 1e8;

      var _rangeMax = -1e8; // list nodes
      //--------------------------------------------------------------------


      var nodeMap = new Map();
      Object.values(dataset.nodes).forEach(function (node) {
        console.log(node);

        if (node.fixed) {
          // restore fixed state
          node.fx = node.x;
          node.fy = node.y;
        }

        var _i_color = node.gen;

        if (_i_color > _colordim) {
          _i_color = _colordim;
        }

        node.icol = _i_color;
        nodeMap.set(node.id, node);

        _this2.NODES.push(node);
      });
      (0,_TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__.setRange)(objRef.NODES, objRef.CurrentYear); // link persons depending on ancestral graph appearance
      //-------------------------------------------------------------

      Object.values(dataset.links).forEach(function (link) {
        var source = nodeMap.get(link.source);
        var target = nodeMap.get(link.target);
        if (source == undefined) // ("Source " + link.source + " is undefined!");
          console.log(i18n("LS_i_u", {
            pls: link.source
          }));
        if (target == undefined) // ("Target " + link.target + " is undefined!");
          console.log(i18n("LT_i_u", {
            plt: link.target
          }));

        if (source && target) {
          var _link = {
            "source": source,
            "target": target,
            "directed": link.directed,
            "distance": _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("LINK_DISTANCE")
          };

          _this2.LINKS.push(_link);
        }
      }); // ("Created Graph with " + this.NODES.length + " nodes and " + this.LINKS.length + " links.");

      console.log(i18n("C_Gw_Xn_Xl", {
        pNl: this.NODES.length,
        pLl: this.LINKS.length
      })); /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Set tick-frequency depending on NODES.length

      objRef.set_tickCounter(objRef, this.NODES); // FORCE SIMULATION OF FORCE-DIRECTED GRAPH

      objRef.REPULSION_FORCE = d3.forceManyBody().strength(-_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("REPULSION_STRENGTH"));
      objRef.LINK_FORCE = d3.forceLink(objRef.LINKS).distance(function (d) {
        return d.distance;
      }).strength(_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("LINK_STRENGTH"));
      objRef.FORCE_SIMULATION = d3.forceSimulation(objRef.NODES).force("charge", objRef.REPULSION_FORCE).force("x", d3.forceX(0).strength(_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("GRAVITY_X"))).force("y", d3.forceY(0).strength(_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("GRAVITY_Y"))).force("link", objRef.LINK_FORCE).force("similarity", function (alpha) {
        objRef.similarityForce(objRef.NODES, alpha);
      }).force("collision", d3.forceCollide().radius(function (d) {
        return 3 * d.r;
      })).velocityDecay(_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("FRICTION")) // friction since d3.v4
      .alpha(0).alphaDecay(0).on("tick", function tick() {
        objRef.tick(objRef);
      }).on("end", function update() {
        objRef.updateScalarField(objRef);
      });
      if (!_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("ENERGIZE")) // this parameter may be loaded from an exported save file
        objRef.FORCE_SIMULATION.alpha(0); // stop simulation
      // ("Force Graph Initialized.");

      console.log(i18n("F_G_I")); /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///  CREATE SVG ELEMENTS

      _get(_getPrototypeOf(TAHRenderer.prototype), "initSVGLayers", this).call(this, objRef);

      _get(_getPrototypeOf(TAHRenderer.prototype), "setColorMap", this).call(this, objRef);

      this.setNodeColors(objRef);
      objRef.SVG_LINKS = objRef.GRAPH_LAYER.selectAll(".link").data(objRef.LINKS).enter().append("line").attr("stroke", _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("LINK_COLOR")).attr("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("LINK_WIDTH") + "px").attr("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("SHOW_LINKS") ? _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("LINK_OPACITY") : 0).attr("marker-end", function (link) {
        return link.directed ? "url(#arrowTAM)" : "none";
      });

      var _nr = _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("NODE_RADIUS") / 4;

      objRef.SVG_NODE_CIRCLES = objRef.GRAPH_LAYER.selectAll(".nodes").data(objRef.NODES).enter().append("rect") // .attr("class", "person")
      .style("fill", function (node) {
        return objRef.NODES_COLORMAP(node.icol);
      }).style("stroke", function (node) {
        return objRef.NODES_COLORMAP(node.icol);
      }).attr("stroke-width", _nr + "px").attr("width", function (f) {
        return 2 * f.r;
      }).attr("height", function (f) {
        return 2 * f.r;
      }).attr("rx", function (f) {
        return f.cr;
      }).attr("ry", function (f) {
        return f.cr;
      }).attr("x", function (f) {
        return f.x;
      }).attr("y", function (f) {
        return f.y;
      }) //.attr("filter", "url(#dropshadowTAM)")
      ;
      if (_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("SHOW_NAMES")) objRef.showNames(); // ("SVG Elements Initialized.");

      console.log(i18n("SVG_E_i"));
      objRef.SVG_DRAGABLE_ELEMENTS = objRef.SVG_NODE_CIRCLES;

      if (!objRef.isInitialized) {
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_3__.initInteractions)(objRef);
        objRef.isInitialized = true;
      }

      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_3__.setTAMDragactions)(objRef);
      this.adjustCanvas(objRef); // ("Interactions Initialized.");

      console.log(i18n("Int_i"));
    }
  }, {
    key: "initSVGLayers",
    value: function initSVGLayers(objRef) {
      var the_canvas = d3.selectAll("#sTAM");
      var the_svg_g = the_canvas.select("g");

      var _has_g = the_svg_g.node();

      if (_has_g) {
        objRef.CANVAS = the_svg_g;
      } else {
        objRef.CANVAS = d3.select("#sTAM").append("g");
      }

      objRef.TOPO_LAYER = objRef.CANVAS.append("g").attr("id", "topolayer");
      objRef.SHADING_LAYER = objRef.CANVAS.append("g").attr("id", "shadinglayer");
      objRef.GRAPH_LAYER = objRef.CANVAS.append("g").attr("id", "graphlayer"); // objRef.BULLS_EYE = objRef.CANVAS.select("#bullseye").append("g");
    }
  }, {
    key: "setNodeColors",
    value: function setNodeColors(objRef) {
      objRef.NODES_COLORMAP = d3.scaleSequential().interpolator(d3.interpolateHslLong("orange", "purple")).domain([0, _parms_js__WEBPACK_IMPORTED_MODULE_4__.H_gen]);
    }
  }, {
    key: "similarityForce",
    value: function similarityForce(nodes, alpha) {
      _get(_getPrototypeOf(TAHRenderer.prototype), "similarityForce", this).call(this, nodes, alpha);
    } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "tick",
    value: function tick(objRef) {
      // only update visualization each N iterations for performance
      if (this.tickCounter++ % this.tickCounterControlValue == 0) {
        if (this.tickCounterLevel != 'min') {
          if (this.tickCounter > this.tickCounterThreshold) {
            // check threshold
            var _tLevel = _parms_js__WEBPACK_IMPORTED_MODULE_4__.TClevel_down(this.tickCounterLevel); // get next level


            var _tCount = _parms_js__WEBPACK_IMPORTED_MODULE_4__.getTickCount(_tLevel);

            this.tickCounterControlValue = _tCount.check; // set new value for modulo-ops

            this.tickCounterLevel = _tLevel; // set new level

            this.tickCounterCycles = _tCount.cyc; // set new multiplyer

            this.tickCounterThreshold = _tCount.val * this.tickCounterCycles; // set new threshold

            _parms_js__WEBPACK_IMPORTED_MODULE_4__.SET("RENDERER_UPDATE_LEVEL", _tLevel);
            _parms_js__WEBPACK_IMPORTED_MODULE_4__.SET("RENDER_UPDATE_INTERVAL", _parms_js__WEBPACK_IMPORTED_MODULE_4__.getTickCount(_tCount.check));
            this.tickCounterTotal += this.tickCounter;
            this.tickCounter = 0;
            (0,_interaction_js__WEBPACK_IMPORTED_MODULE_3__.makeTickCountInfo)(this.instance, true);
          }
        } else {
          this.tickCounterTotal += this.tickCounter;
          this.tickCounter = 0;
          (0,_interaction_js__WEBPACK_IMPORTED_MODULE_3__.makeTickCountInfo)(this.instance);
        }
      } else {
        if (this.tickCounter == 5) {
          this.adjustCanvas(objRef);
        }

        return;
      } // move node circles to defined position (d.x,d.y)


      this.SVG_NODE_CIRCLES.style("stroke", function (p) {
        var _pcol = objRef.NODES_COLORMAP(p.icol);

        return p.fx == null ? "#222" : _pcol;
      }).attr("r", function (p) {
        return p.fx == null ? p.r : p.r * 1.5;
      }).attr("x", function (d) {
        return d.x - d.r;
      }).attr("y", function (d) {
        return d.y - d.r;
      }); // set links

      var _arrowDfactor = _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("ARROW_DISTANCE_FACTOR");

      var _arrowRadius = _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("ARROW_RADIUS");

      this.SVG_LINKS.attr("x1", function (d) {
        //return d.source.x; 
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.distance)(d.source, d.target),
            t = (l - d.source.r - _arrowDfactor * _arrowRadius) / l;
        var x = d.source.x * t + d.target.x * (1 - t);
        return isNaN(x) ? d.source.x : x;
      }).attr("y1", function (d) {
        //return d.source.y; 
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.distance)(d.source, d.target),
            t = (l - d.source.r - _arrowDfactor * _arrowRadius) / l;
        var y = d.source.y * t + d.target.y * (1 - t);
        return isNaN(y) ? d.source.y : y;
      }).attr("x2", function (d) {
        //return d.target.x;
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.distance)(d.source, d.target),
            t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;
        var x = d.source.x * (1 - t) + d.target.x * t;
        return isNaN(x) ? d.target.x : x;
      }).attr("y2", function (d) {
        //return d.target.y;
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.distance)(d.source, d.target),
            t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;
        var y = d.source.y * (1 - t) + d.target.y * t;
        return isNaN(y) ? d.target.y : y;
      }); // set labels

      if (_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("SHOW_NAMES")) {
        this.SVG_NODE_LABELS.attr("transform", this.placeLabel);
      }
    } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "hideNames",
    value: function hideNames() {
      this.SVG_NODE_LABELS.remove();
    }
  }, {
    key: "showNames",
    value: function showNames() {
      // person labels - 2 lines:  1. givenname   2. surname and other stuff
      //-----------------------------------------------------------------
      this.SVG_NODE_LABELS = this.GRAPH_LAYER.selectAll(".personlabels").data(this.NODES).enter().append("text").style("text-anchor", "middle").style("fill", _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("LABEL_COLOR")).style("stroke", "white").style("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("FONT_SIZE") / 5).style("paint-order", "stroke").style("font-family", "Calibri").style("font-size", _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("FONT_SIZE")).style("pointer-events", "none") // to prevent mouseover/drag capture
      .style("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("PERSON_LABEL_OPACITY"));
      this.SVG_NODE_LABELS.each(function () {
        d3.select(this).append("tspan").attr("x", 0).attr("dy", 0).text(function (node) {
          return node.gname;
        });
        d3.select(this).append("tspan").attr("x", 0).attr("dy", "1.0em").text(function (node) {
          var _text = '/' + node.sname + '/ ' + node.id + ' (K-' + node.kek + ')';

          return _text;
        });
      }); // compute label lengths and store them

      this.SVG_NODE_LABELS.each(function (d) {
        d.labelwidth = this.getComputedTextLength();
      }); // now adjust label position based on label lengths

      this.SVG_NODE_LABELS.attr("transform", this.placeLabel);
    }
  }, {
    key: "placeLabel",
    value: function placeLabel(node) {
      if (_parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("PERSON_LABELS_BELOW_NODE")) {
        // below the node
        var x = node.x;
        var y = node.y + node.r + 1.0 * _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("FONT_SIZE");
        return "translate(" + x + ", " + y + ")";
      } else {
        // right beside the node
        var _x = node.x + 1.5 * node.r;

        var _y = node.y + _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("FONT_SIZE") / 4;

        return "translate(" + _x + ", " + _y + ")";
      }
    } // Update function for scalar field and associated contour map

  }, {
    key: "updateScalarField",
    value: function updateScalarField(objRef) {
      _get(_getPrototypeOf(TAHRenderer.prototype), "updateScalarField", this).call(this, objRef);
    } // Returns a string representation of the node to be used in tooltips

  }, {
    key: "getNodeAttributesAsString",
    value: function getNodeAttributesAsString(node) {
      var _unknown = i18n("unknown");

      var age = node.bdate && node.ddate ? Math.floor((node.ddate - node.bdate) / 31536000000) // 1000ms * 60s * 60min * 24h * 365d
      : _unknown; // const mother = node.getMother();
      // const father = node.getFather();

      return node.name + (node.id ? " (" + node.id + ")" : "") + "\n\n" + i18n("gen") + node.gen + "\n" + i18n("birth") + (node.bdate ? node.bdate.toLocaleDateString() : _unknown) + "\n" + i18n("death") + (node.ddate ? node.ddate.toLocaleDateString() : _unknown) + "\n" + i18n("age") + age // + "\n" + i18n("mother") + (mother ? mother.getFullName() + " (" +  mother.id + ")" : _unknown)
      // + "\n" + i18n("father") + (father ? father.getFullName() + " (" +  father.id + ")" : _unknown)
      ;
    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "saveDataF",
    value: function saveDataF() {
      // store person/family node positions with their id
      var nodePositions = {};
      this.PNODES.forEach(function (p) {
        nodePositions[p.id] = {
          "x": p.x,
          "y": p.y,
          "fixed": p.fx != null
        };
      });
      this.FNODES.forEach(function (f) {
        nodePositions[f.id] = {
          "x": f.x,
          "y": f.y,
          "fixed": f.fx != null
        };
      });
      var content = [JSON.stringify({
        "metadata": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getMetadata)(),
        "parameters": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getParameters)(),
        "nodePositions": nodePositions,
        "nodeData": this.GRAPH_DATA
      }, null, 2)]; // no replacement function, human readable indentation

      var blob = new Blob(content, {
        type: "text/json"
      });

      var _fileName = _parms_js__WEBPACK_IMPORTED_MODULE_4__.GET("FILENAME");

      var filenameWithoutSuffix = _fileName.slice(0, _fileName.lastIndexOf('.'));

      (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.createDownloadFromBlob)(blob, filenameWithoutSuffix + ".tfm");
    }
  }, {
    key: "saveData",
    value: function saveData() {
      var _primName = d.givenname + '/' + d.surname + '/';

      var idb_key = _primName + "-" + _primID;
      var dataset = {
        "TFMdata": [{
          "storeID": idb_key,
          "primID": _primID,
          "timestamp": (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.timestamp)(),
          "metadata": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getMetadata)(' - TFM'),
          "parameters": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getParameters)(),
          "nodePositions": nodePositions,
          "nodeData": this.GRAPH_DATA
        }]
      };
      (0,_dbman_js__WEBPACK_IMPORTED_MODULE_6__.putDB)("wtTAM", "TFMdata", dataset.H_tree);
    }
  }]);

  return TAHRenderer;
}(_TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__.TAMRenderer);

/***/ }),

/***/ "./src/js/TAMrenderer.js":
/*!*******************************!*\
  !*** ./src/js/TAMrenderer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setRange": () => (/* binding */ setRange),
/* harmony export */   "TAMRenderer": () => (/* binding */ TAMRenderer)
/* harmony export */ });
/* harmony import */ var _export_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./export.js */ "./src/js/export.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/js/utils.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interfaces.js */ "./src/js/interfaces.js");
/* harmony import */ var _interaction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interaction.js */ "./src/js/interaction.js");
/* harmony import */ var _scalarfield_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scalarfield.js */ "./src/js/scalarfield.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Basic Renderer
//
///////////////////////////////////////////////////////////////////////////////
 // import { default as i18n } from "./i18n.js";





 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var PARM_NODE_BORDER_COLOR_FIXED = "#ad0de2";
function setRange(nodes, CurrentYear) {
  var _rangeMin = 1e8;

  var _rangeMax = -1e8;

  nodes.forEach(function (node) {
    // automatically adjust TAM height range to min and max values
    if (node.value) {
      var _nvalue = node.value;

      if (_nvalue < 1500) {
        _nvalue = 1500;
      } else {
        if (_nvalue > CurrentYear) {
          _nvalue = CurrentYear;
        }
      }

      _rangeMin = Math.min(_rangeMin, _nvalue);
      _rangeMax = Math.max(_rangeMax, _nvalue);

      if (node.valueD) {
        _nvalue = node.valueD;

        if (_nvalue < 1500) {
          _nvalue = 1500;
        } else {
          if (_nvalue > CurrentYear) {
            _nvalue = CurrentYear;
          }
        }

        _rangeMax = Math.max(_rangeMax, _nvalue);
      }
    }
  }); // Range-Hack: avoid too dark shades of blue

  var range = _rangeMax - _rangeMin;
  _rangeMin = Math.floor(_rangeMin - range / 7);
  _rangeMin -= _rangeMin % 10;
  _rangeMax -= _rangeMax % 10;
  _rangeMax += 10;
  _parms_js__WEBPACK_IMPORTED_MODULE_2__.SET("RANGE_MAX", _rangeMax);
  _parms_js__WEBPACK_IMPORTED_MODULE_2__.SET("RANGE_MIN", _rangeMin);
  d3.select("#settings_range_min").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("RANGE_MIN"));
  d3.select("#settings_range_max").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("RANGE_MAX"));
}
var TAMRenderer = /*#__PURE__*/function () {
  function TAMRenderer() {
    _classCallCheck(this, TAMRenderer);

    // Graphic Layers
    this.CANVAS = null;
    this.TOPO_LAYER = null;
    this.SHADING_LAYER = null;
    this.GRAPH_LAYER = null;
    this.BULLS_EYE = null; // SVG Elements

    this.SVG_NODE_CIRCLES = null;
    this.SVG_LINKS = null;
    this.SVG_NODE_LABELS = null;
    this.SVG_CONTOURS = null;
    this.SVG_SHADING_CONTOURS = null;
    this.SVG_INDICATOR_LABELS = null;
    this.SVG_LINKS_STREETS = null;
    this.SVG_LINKS_TUNNELS = null;
    this.SVG_TUNNEL_ENTRIES_1 = null;
    this.SVG_TUNNEL_ENTRIES_2 = null;
    this.SVG_DRAGABLE_ELEMENTS = null;
    this.SVG_COLORMAP = null;
    this.NODES_COLORMAP = null; // Data and Variables

    this.NODES = [];
    this.LINKS = [];
    this.tickCounter = 0;
    this.tickCounterTotal = 0;
    this.tickCounterLevel = 'min';
    this.tickCounterLevelV = 0;
    this.tickCounterCycles = 0;
    this.tickCounterControlValue = 0;
    this.tickCounterThreshold = 0;
    this.FORCE_SIMULATION = null;
    this.REPULSION_FORCE = null;
    this.LINK_FORCE = null;
    this.CurrentYear = new Date().getFullYear();
    this.instance = this;
    this.RENDERtype = 0;
    this.zoomO = null;
    this.svgKENN = 'TAM';
    this.isInitialized = false;
  }

  _createClass(TAMRenderer, [{
    key: "reset",
    value: function reset() {
      this.SVG_NODE_CIRCLES = null;
      this.SVG_LINKS = null;
      this.SVG_NODE_LABELS = null;
      this.SVG_CONTOURS = null;
      this.SVG_SHADING_CONTOURS = null;
      this.SVG_INDICATOR_LABELS = null;
      this.SVG_LINKS_STREETS = null;
      this.SVG_LINKS_TUNNELS = null;
      this.SVG_TUNNEL_ENTRIES_1 = null;
      this.SVG_TUNNEL_ENTRIES_2 = null;
      this.SVG_DRAGABLE_ELEMENTS = null;
      this.SVG_COLORMAP = null;
      this.NODES_COLORMAP = null;
    }
  }, {
    key: "get_sKENN",
    value: function get_sKENN() {
      return this.svgKENN;
    }
  }, {
    key: "set_tickCounter",
    value: function set_tickCounter(objRef, NODES) {
      var tickParms = _parms_js__WEBPACK_IMPORTED_MODULE_2__.testTickLevel(NODES.length);
      objRef.tickCounterLevel = tickParms.tLevelP; // startlevel -> 'XXL','XL' ...

      objRef.tickCounterLevelV = tickParms.tLevelV; // dazu Wert

      objRef.tickCounterControlValue = tickParms.tCount; // corresponding value for modulo-ops

      objRef.tickCounterCycles = tickParms.tCycles; // multiplyer for calculating threshold value

      var _tCT = tickParms.tCycles * tickParms.tLevelV;

      objRef.tickCounterThreshold = _tCT; // "Tci_Xn_tCp": "TickCounter initialized: %{pNl} nodes  -> Level:%{pLl}, ControlValue:%{pCnt}, Cycles:%{pCyc}, Threshold:%{pTh}.",

      console.log(i18n("Tci_Xn_tCp", {
        pNl: NODES.length,
        pLl: tickParms.tLevelP,
        pCnt: tickParms.tCount,
        pCyc: tickParms.tCycles,
        pTh: _tCT
      }));
      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.makeTickCountInfo)(objRef, true, objRef.tickCounterLevel, NODES.length);
    }
  }, {
    key: "createForceGraphJSON",
    value: function createForceGraphJSON(json) {
      var _this = this;

      var _rangeMin = 1e8;

      var _rangeMax = -1e8; // list nodes
      //--------------------------------------------------------------------


      var nodeMap = new Map();
      Object.values(json.nodes).forEach(function (node) {
        console.log(node);
        node.r = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("NODE_RADIUS");
        if (node.value == 0) node.value = 0.001;

        if (node.fixed) {
          // restore fixed state
          node.fx = node.x;
          node.fy = node.y;
        }

        nodeMap.set(node.id, node);

        _this.NODES.push(node);
      });
      setRange(this.NODES, this.CurrentYear); // list dependencies
      //--------------------------------------------------------------------

      Object.values(json.links).forEach(function (link) {
        var source = nodeMap.get(link.source);
        var target = nodeMap.get(link.target);
        if (source == undefined) // ("Source " + link.source + " is undefined!");
          console.log(i18n("LS_i_u", {
            pls: link.source
          }));
        if (target == undefined) // ("Target " + link.target + " is undefined!");
          console.log(i18n("LT_i_u", {
            plt: link.target
          }));

        if (source && target) {
          var _link = {
            "source": source,
            "target": target,
            "directed": link.directed,
            "distance": _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_DISTANCE")
          };

          _this.LINKS.push(_link);
        }
      }); // ("Created Graph with " + this.NODES.length + " nodes and " + this.LINKS.length + " links.");

      console.log(i18n("C_Gw_Xn_Xl", {
        pNl: this.NODES.length,
        pLl: this.LINKS.length
      })); /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      var objRef = this; // Set tick-frequency depending on NODES.length

      objRef.set_tickCounter(objRef, this.NODES); // FORCE SIMULATION OF FORCE-DIRECTED GRAPH

      objRef.REPULSION_FORCE = d3.forceManyBody().strength(-_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("REPULSION_STRENGTH"));
      objRef.LINK_FORCE = d3.forceLink(objRef.LINKS).distance(function (d) {
        return d.distance;
      }).strength(_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_STRENGTH"));
      objRef.FORCE_SIMULATION = d3.forceSimulation(objRef.NODES).force("charge", objRef.REPULSION_FORCE).force("x", d3.forceX(0).strength(_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("GRAVITY_X"))).force("y", d3.forceY(0).strength(_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("GRAVITY_Y"))).force("link", objRef.LINK_FORCE).force("similarity", function (alpha) {
        objRef.similarityForce(objRef.NODES, alpha);
      }).force("collision", d3.forceCollide().radius(function (d) {
        return 3 * d.r;
      })).velocityDecay(_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("FRICTION")) // friction since d3.v4
      .alpha(_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("ALPHA")).alphaDecay(0).on("tick", function tick() {
        objRef.tick(objRef);
      }).on("end", function update() {
        objRef.updateScalarField(objRef);
      });
      if (!_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("ENERGIZE")) // this parameter may be loaded from an exported save file
        objRef.FORCE_SIMULATION.alpha(0); // stop simulation
      // ("Force Graph Initialized.");

      console.log(i18n("F_G_I")); /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///  CREATE SVG ELEMENTS

      objRef.initSVGLayers(objRef);
      objRef.setColorMap(objRef);
      objRef.setNodeColors(objRef);
      objRef.SVG_LINKS = objRef.GRAPH_LAYER.selectAll(".link").data(objRef.LINKS).enter().append("line").attr("stroke", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_COLOR")).attr("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_WIDTH") + "px").attr("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_LINKS") ? _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_OPACITY") : 0).attr("marker-end", function (link) {
        return link.directed ? "url(#arrowTAM)" : "none";
      });
      objRef.SVG_NODE_CIRCLES = objRef.GRAPH_LAYER.selectAll(".nodes").data(objRef.NODES).enter().append("circle").style("fill", function (node) {
        return typeof node.value == "number" ? objRef.SVG_COLORMAP(node.value) : "red";
      }).style("stroke", "#222").attr("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("NODE_RADIUS") / 4 + "px").attr("r", function (node) {
        return node.r;
      }) //.attr("filter", "url(#dropshadowTAM)")
      ;
      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_NAMES")) objRef.showNames(); // ("SVG Elements Initialized.");

      console.log(i18n("SVG_E_i"));
      objRef.SVG_DRAGABLE_ELEMENTS = objRef.SVG_NODE_CIRCLES;

      if (!objRef.isInitialized) {
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.initInteractions)(objRef);
        objRef.isInitialized = true;
      }

      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.setTAMDragactions)(objRef);
      this.adjustCanvas(objRef); // ("Interactions Initialized.");

      console.log(i18n("Int_i"));
    }
  }, {
    key: "initSVGLayers",
    value: function initSVGLayers(objRef) {
      var sKenn = objRef.svgKENN;
      var cKenn = "#s" + sKenn;
      var the_canvas = d3.selectAll(cKenn);
      var the_svg_g = the_canvas.select("g");

      var _has_g = the_svg_g.node();

      if (_has_g) {
        objRef.CANVAS = the_svg_g;
        (0,_interfaces_js__WEBPACK_IMPORTED_MODULE_3__.resetSVGLayers)(objRef);
      } else {
        objRef.CANVAS = d3.select("#s" + sKenn).append("g");
      }

      objRef.TOPO_LAYER = objRef.CANVAS.append("g").attr("id", "topolayer" + sKenn);
      objRef.SHADING_LAYER = objRef.CANVAS.append("g").attr("id", "shadinglayer" + sKenn);
      objRef.GRAPH_LAYER = objRef.CANVAS.append("g").attr("id", "graphlayer" + sKenn);
    }
  }, {
    key: "similarityForce",
    value: function similarityForce(nodes, alpha) {
      var _sfStrength = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SF_STRENGTH");

      if (_sfStrength == 0) return;
      var target_slope = 20; // a value difference of 1 should map to a unit distance of 10

      var VIRTUAL_LINK_STRENGTH = _sfStrength / Math.max(nodes.length, 1);

      for (var i = 0, n = nodes.length; i < n; i++) {
        var p = nodes[i];
        if (p.value == null) continue;

        for (var j = i + 1; j < n; j++) {
          var q = nodes[j];
          if (q.value == null) continue;
          var v = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(q.x + q.vx - p.x - p.vx, q.y + q.vy - p.y - p.vy);
          var len = v.norm();
          var dv = Math.abs(q.value - p.value);
          var target_len = dv * target_slope;
          var targetvec = v.mul((len - target_len) / len);
          var F = targetvec.mul(VIRTUAL_LINK_STRENGTH * alpha);
          p.vx += F.x;
          p.vy += F.y;
          q.vx -= F.x;
          q.vy -= F.y;
        }
      }
    }
  }, {
    key: "adjustCanvas",
    value: function adjustCanvas(objRef) {
      // let the_canvas = objRef.CANVAS;
      // let w = the_canvas._groups[0][0].lastChild.clientWidth;
      // let t = d3.zoomIdentity
      //         .translate(-2500, -1750)
      //         .scale(2, 2);
      // the_canvas            
      //     .transition()
      //     .call(objRef.zoomO.transform, t);
      // d3.zoomIdentity = t;
      return;
    } // }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "tick",
    value: function tick(objRef) {
      // only update visualization each N iterations for performance
      if (this.tickCounter++ % this.tickCounterControlValue == 0) {
        if (this.tickCounterLevel != 'min') {
          if (this.tickCounter > this.tickCounterThreshold) {
            // check threshold
            var _tLevel = _parms_js__WEBPACK_IMPORTED_MODULE_2__.TClevel_down(this.tickCounterLevel); // get next level


            var _tCount = _parms_js__WEBPACK_IMPORTED_MODULE_2__.getTickCount(_tLevel);

            this.tickCounterControlValue = _tCount.check; // set new value for modulo-ops

            this.tickCounterLevel = _tLevel; // set new level

            this.tickCounterCycles = _tCount.cyc; // set new multiplyer

            this.tickCounterThreshold = _tCount.val * this.tickCounterCycles; // set new threshold

            _parms_js__WEBPACK_IMPORTED_MODULE_2__.SET("RENDERER_UPDATE_LEVEL", _tLevel);
            _parms_js__WEBPACK_IMPORTED_MODULE_2__.SET("RENDER_UPDATE_INTERVAL", _parms_js__WEBPACK_IMPORTED_MODULE_2__.getTickCount(_tCount.check));
            this.tickCounterTotal += this.tickCounter;
            this.tickCounter = 0;
            (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.makeTickCountInfo)(objRef, true);
          }
        } else {
          this.tickCounterTotal += this.tickCounter;
          this.tickCounter = 0;
          (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.makeTickCountInfo)(objRef);
        }
      } else {
        if (this.tickCounter == 5) {// this.adjustCanvas(objRef);
        }

        return;
      } // move node circles to defined position (d.x,d.y)


      this.SVG_NODE_CIRCLES.style("stroke", function (p) {
        return p.fx == null ? "#222" : PARM_NODE_BORDER_COLOR_FIXED;
      }).attr("r", function (p) {
        return p.fx == null ? p.r : p.r * 1.5;
      }).attr("cx", function (d) {
        return d.x;
      }).attr("cy", function (d) {
        return d.y;
      }); // set links

      var _arrowDfactor = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("ARROW_DISTANCE_FACTOR");

      var _arrowRadius = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("ARROW_RADIUS");

      this.SVG_LINKS.attr("x1", function (d) {
        //return d.source.x; 
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.distance)(d.source, d.target),
            t = (l - d.source.r - _arrowDfactor * _arrowRadius) / l;
        var x = d.source.x * t + d.target.x * (1 - t);
        return isNaN(x) ? d.source.x : x;
      }).attr("y1", function (d) {
        //return d.source.y; 
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.distance)(d.source, d.target),
            t = (l - d.source.r - _arrowDfactor * _arrowRadius) / l;
        var y = d.source.y * t + d.target.y * (1 - t);
        return isNaN(y) ? d.source.y : y;
      }).attr("x2", function (d) {
        //return d.target.x;
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.distance)(d.source, d.target),
            t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;
        var x = d.source.x * (1 - t) + d.target.x * t;
        return isNaN(x) ? d.target.x : x;
      }).attr("y2", function (d) {
        //return d.target.y;
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.distance)(d.source, d.target),
            t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;
        var y = d.source.y * (1 - t) + d.target.y * t;
        return isNaN(y) ? d.target.y : y;
      }); // set labels

      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_NAMES")) this.SVG_NODE_LABELS.attr("transform", this.placeLabel);
    } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "showNames",
    value: function showNames() {
      this.SVG_NODE_LABELS = this.GRAPH_LAYER.selectAll(".labels").data(this.NODES).enter().append("text").text(function (node) {
        return node.name;
      }).style("fill", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LABEL_COLOR")).style("stroke", "white").style("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("FONT_SIZE") / 5).style("paint-order", "stroke").style("font-family", "Calibri").style("font-size", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("FONT_SIZE")).style("pointer-events", "none") // to prevent mouseover/drag capture
      .style("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("PERSON_LABEL_OPACITY")); // compute label lengths and store them

      this.SVG_NODE_LABELS.each(function (node) {
        node.labelwidth = this.getComputedTextLength();
      }); // now adjust label position based on label lengths

      this.SVG_NODE_LABELS.attr("transform", this.placeLabel);
    }
  }, {
    key: "hideNames",
    value: function hideNames() {
      if (this.SVG_NODE_LABELS) this.SVG_NODE_LABELS.remove();
    }
  }, {
    key: "placeLabel",
    value: function placeLabel(node) {
      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("PERSON_LABELS_BELOW_NODE")) {
        // below the node
        var x = node.x - node.labelwidth * 0.5;
        var y = node.y + node.r + 1.0 * _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("FONT_SIZE");
        return "translate(" + x + ", " + y + ")";
      } else {
        // right beside the node
        var _x = node.x + 1.5 * node.r;

        var _y = node.y + _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("FONT_SIZE") / 4;

        return "translate(" + _x + ", " + _y + ")";
      }
    }
  }, {
    key: "setContourColor",
    value: function setContourColor(path) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.darken)(this.SVG_COLORMAP(path.value));
    }
  }, {
    key: "setContourWidth",
    value: function setContourWidth(path) {
      return path.value % _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("CONTOUR_BIG_STEP") ? 1 * _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("CONTOUR_WIDTH") : 4 * _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("CONTOUR_WIDTH");
    }
  }, {
    key: "resetScalarField",
    value: function resetScalarField(objRef) {
      // remove old paths        
      if (objRef.SVG_CONTOURS) objRef.SVG_CONTOURS.remove();
      if (objRef.SVG_SHADING_CONTOURS) objRef.SVG_SHADING_CONTOURS.remove();
      if (objRef.SVG_LINKS_STREETS) objRef.SVG_LINKS_STREETS.remove();
      if (objRef.SVG_LINKS_TUNNELS) objRef.SVG_LINKS_TUNNELS.remove();
      if (objRef.SVG_TUNNEL_ENTRIES_1) objRef.SVG_TUNNEL_ENTRIES_1.remove();
      if (objRef.SVG_TUNNEL_ENTRIES_2) objRef.SVG_TUNNEL_ENTRIES_2.remove();
      if (objRef.SVG_INDICATOR_LABELS) objRef.SVG_INDICATOR_LABELS.remove(); // make the original simple links visible again

      if (this.SVG_LINKS && _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_LINKS")) this.SVG_LINKS.attr("opacity", 1);
    } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "resetColormap",
    value: function resetColormap() {
      var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_2__.oGET("RENDERER");
      this.TOPO_LAYER.selectAll(".contours").attr("fill", function (d) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.brighten)(renderer.SVG_COLORMAP(d.value), 0.05);
      }).attr("stroke", function (path) {
        return renderer.setContourColor(path);
      }).attr("stroke-width", function (path) {
        return renderer.setContourWidth(path);
      });
    }
  }, {
    key: "setColorMap",
    value: function setColorMap(objRef) {
      var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_2__.oGET("RENDERER");

      var _rangeMax = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("RANGE_MAX");

      var _rangeMin = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("RANGE_MIN"); // var thresholds = d3.range(_rangeMin, _rangeMax, parms.GET("CONTOUR_STEP")); 


      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("REVERSE_COLORMAP")) {
        objRef.SVG_COLORMAP = d3.scaleDiverging(_parms_js__WEBPACK_IMPORTED_MODULE_2__.oGET("COLORMAP")).domain([_rangeMin, (_rangeMax + _rangeMin) * 0.5, _rangeMax]);
      } else {
        objRef.SVG_COLORMAP = d3.scaleDiverging(_parms_js__WEBPACK_IMPORTED_MODULE_2__.oGET("COLORMAP")).domain([_rangeMax, (_rangeMax + _rangeMin) * 0.5, _rangeMin]);
      }
    }
  }, {
    key: "setNodeColors",
    value: function setNodeColors(objRef) {
      if (objRef.SVG_NODE_CIRCLES) {
        objRef.SVG_NODE_CIRCLES.style("fill", function (node) {
          return typeof node.value == "number" ? objRef.SVG_COLORMAP(node.value) : "red";
        });
      }
    }
  }, {
    key: "updateRange",
    value: function updateRange(objRef) {
      // in case color ramp range changes
      if (objRef.SVG_NODE_CIRCLES) objRef.SVG_NODE_CIRCLES.style("fill", function (node) {
        return typeof node.value == "number" ? objRef.SVG_COLORMAP(node.value) : "red";
      });
    }
  }, {
    key: "updateScalarField",
    value: function updateScalarField(objRef) {
      // remove old paths        
      objRef.resetScalarField(objRef); //--- 1. List height field constraints

      var topopoints = []; // add constraints at person positions

      objRef.NODES.forEach(function (p) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(p.value)) topopoints.push(p);
      }); // Create Topopoints for links

      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("EMBED_LINKS")) {
        this.LINKS.forEach(function (link) {
          if (link.source.value && link.target.value) {
            var pv0 = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(link.source.x, link.source.y, link.source.value);
            var pv1 = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(link.target.x, link.target.y, link.target.value);
            var v = pv1.sub(pv0);
            var nsteps = v.norm() / _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_SAMPLE_STEPSIZE");

            if (nsteps > 0) {
              v = v.div(nsteps);

              for (var i = 0, pv = pv0; i < nsteps; i++, pv = pv.add(v)) {
                topopoints.push({
                  'x': pv.x,
                  'y': pv.y,
                  'value': pv.z
                });
              }
            }
          }
        });
      } //--- 2. Create scalar field
      // (topopoints.length, " Topopoints");


      console.log(i18n("Top_l", {
        ptpl: topopoints.length
      }));
      var SCALARFIELD = new _scalarfield_js__WEBPACK_IMPORTED_MODULE_5__.TopoMap(topopoints, _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SF_INTERPOLATION_TYPE"), _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SCALARFIELD_RESOLUTION"), _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SCALARFIELD_DILATION_ITERS")); //--- 3. Create tunnels and overlays

      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_TUNNELS")) {
        // ("Creating Tunnels");
        console.log(i18n("Cre_T"));
        objRef.SVG_LINKS.attr("opacity", 0); // make the other links invisible

        var SEGMENTS = [];
        objRef.LINKS.forEach(function (link) {
          if (link.source.value && link.target.value) {
            // determine 2D start and endpoint on map, respecting some offsets
            var pv0 = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(link.source.x, link.source.y, link.source.value);
            var pv1 = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(link.target.x, link.target.y, link.target.value);
            SEGMENTS.push({
              'pv0': pv0,
              'pv1': pv1,
              'directed': link.directed,
              'r1': link.target.r
            });
          }
        }); // create tunnels

        objRef.createTunnels(SCALARFIELD, SEGMENTS, objRef);
        if (objRef.SVG_NODE_CIRCLES) objRef.SVG_NODE_CIRCLES.raise();
        if (objRef.SVG_NODE_LABELS) objRef.SVG_NODE_LABELS.raise();
      } else {
        objRef.SVG_LINKS_STREETS.attr("opacity", 0);
        objRef.SVG_LINKS_TUNNELS.attr("opacity", 0);
        objRef.SVG_TUNNEL_ENTRIES_1.attr("opacity", 0);
        objRef.SVG_TUNNEL_ENTRIES_2.attr("opacity", 0);
        objRef.SVG_LINKS.attr("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_LINKS") ? _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_OPACITY") : 0).attr("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_WIDTH") + "px");
      }

      objRef.addHeightfieldOverlays(SCALARFIELD, objRef); // ("+++ Done Updating ScalarField");

      console.log(i18n("Done_uSF"));
    }
  }, {
    key: "createTunnels",
    value: function createTunnels(SCALARFIELD, SEGMENTS) {
      var _this2 = this;

      // let renderer = parms.oGET("RENDERER");
      var INTERVALS = {
        'streets': [],
        'tunnels': []
      }; //--- 1. List all Tunnel and Street intervals -------------------

      SEGMENTS.forEach(function (segment) {
        //--- determine 2D start and endpoint on map, respecting some offsets
        var pv0 = segment.pv0;
        var pv1 = segment.pv1;
        var v = pv1.sub(pv0);

        if (v.x == 0 && v.y == 0) {
          v.x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.jiggle)();
          v.y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.jiggle)();
        }

        var d = Math.sqrt(v.x * v.x + v.y * v.y);
        var offset = Math.min(d / 2, segment.r1 + _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("ARROW_DISTANCE_FACTOR") * _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("ARROW_RADIUS"));
        v = v.mul(offset / d); //pv0 = pv0.add(v);    // only offset target where arrow is (directional)

        pv1 = pv1.sub(v); //--- now sample tunnel/street line intervals

        v = pv1.sub(pv0);

        if (!v.zero()) {
          var nsteps = v.norm() / _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_SAMPLE_STEPSIZE");
          if (nsteps == 0) return;
          v = v.div(nsteps);

          var _underground_Threshold = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("UNDERGROUND_THRESHOLD");

          var wasUnderground = SCALARFIELD.sampleBilinear(pv0.x, pv0.y) - pv0.z > _underground_Threshold;

          var currentInterval = [pv0, pv0, false];
          if (wasUnderground) INTERVALS.tunnels.push(currentInterval);else INTERVALS.streets.push(currentInterval);

          for (var i = 0, pv = pv0; i < nsteps; i++, pv = pv.add(v)) {
            var sfValue = SCALARFIELD.sampleBilinear(pv.x, pv.y);
            var isUnderground = sfValue - pv.z > _underground_Threshold;

            if (isUnderground && !wasUnderground) {
              var pvOffset = pv; //.sub(v.mul(2));

              INTERVALS.streets[INTERVALS.streets.length - 1][1] = pvOffset;
              INTERVALS.tunnels.push(currentInterval = [pvOffset, pv, false]);
            } else if (!isUnderground && wasUnderground) {
              var _pvOffset = pv; //.add(v.mul(2));

              INTERVALS.tunnels[INTERVALS.tunnels.length - 1][1] = _pvOffset;
              INTERVALS.streets.push(currentInterval = [_pvOffset, pv, false]);
            } else currentInterval[1] = pv;

            wasUnderground = isUnderground;
          } // if the link is directed, mark the last interval to be and "end"-interval


          var last = wasUnderground ? INTERVALS.tunnels[INTERVALS.tunnels.length - 1] : INTERVALS.streets[INTERVALS.streets.length - 1];
          last[2] = segment.directed;
        }
      }); //--- 2. Create SVG Elements ---------------------------------------------------------

      var _linkColor = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_COLOR");

      var _linkOpacity = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_OPACITY");

      var _linkWidth = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_WIDTH");

      var _showLinks = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_LINKS");

      this.SVG_LINKS_STREETS = this.GRAPH_LAYER.selectAll(".link_street").data(INTERVALS.streets).enter().append("line").attr("stroke", _linkColor).attr("stroke-width", _linkWidth + "px").attr("opacity", _showLinks ? _linkOpacity : 0).attr("marker-end", function (interval) {
        return interval[2] ? "url(#arrowTAM)" : "none";
      }).attr("x1", function (interval) {
        return interval[0].x;
      }).attr("y1", function (interval) {
        return interval[0].y;
      }).attr("x2", function (interval) {
        return interval[1].x;
      }).attr("y2", function (interval) {
        return interval[1].y;
      });
      this.SVG_LINKS_TUNNELS = this.GRAPH_LAYER.selectAll(".link_tunnel").data(INTERVALS.tunnels).enter().append("line").attr("stroke", _linkColor).attr("stroke-width", _linkWidth + "px").attr("opacity", _showLinks ? _linkOpacity : 0).attr("stroke-dasharray", "0 5 5 0").attr("marker-end", function (interval) {
        return interval[2] ? "url(#arrowTAM)" : "none";
      }).attr("x1", function (interval) {
        return interval[0].x;
      }).attr("y1", function (interval) {
        return interval[0].y;
      }).attr("x2", function (interval) {
        return interval[1].x;
      }).attr("y2", function (interval) {
        return interval[1].y;
      });
      this.SVG_TUNNEL_ENTRIES_1 = this.GRAPH_LAYER.selectAll(".tunnel_entries1").data(INTERVALS.tunnels).enter().append("polyline").attr("fill", "none").attr("stroke", _linkColor).attr("stroke-width", _linkWidth + "px").attr("opacity", function (tunnel) {
        return _showLinks && !tunnel[2] ? _linkOpacity : 0;
      }) // dont show entry at end where the marker is
      .attr("points", function (tunnel) {
        return _this2.placeTunnelEntry(tunnel, false);
      });
      this.SVG_TUNNEL_ENTRIES_2 = this.GRAPH_LAYER.selectAll(".tunnel_entries2").data(INTERVALS.tunnels).enter().append("polyline").attr("fill", "none").attr("stroke", _linkColor).attr("stroke-width", _linkWidth + "px").attr("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_LINKS") ? _linkOpacity : 0).attr("points", function (tunnel) {
        return _this2.placeTunnelEntry(tunnel, true);
      });
    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "addHeightfieldOverlays",
    value: function addHeightfieldOverlays(SCALARFIELD, objRef) {
      var _rangeMax = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("RANGE_MAX");

      var _rangeMin = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("RANGE_MIN");

      var thresholds = d3.range(_rangeMin, _rangeMax, _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("CONTOUR_STEP")); // ("Extracting Contours");

      console.log(i18n("Ext_C"));
      var paths = SCALARFIELD.getContourPaths(thresholds);
      var scalarFieldTransformProjection = d3.geoPath().projection(d3.geoTransform({
        point: function point(x, y) {
          this.stream.point(x * SCALARFIELD.cellSize + SCALARFIELD.origin.x, y * SCALARFIELD.cellSize + SCALARFIELD.origin.y);
        }
      })); // add new paths
      // ("Adding Contours");

      console.log(i18n("Add_C"));
      objRef.SVG_CONTOURS = objRef.TOPO_LAYER.selectAll(".contours").data(paths).enter().append("path").attr("class", "contours").attr("stroke", function (path) {
        return objRef.setContourColor(path);
      }).attr("stroke-width", function (path) {
        return objRef.setContourWidth(path);
      }).attr("fill", function (d) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.brighten)(objRef.SVG_COLORMAP(d.value), 0.08);
      }).attr("d", scalarFieldTransformProjection); // add heightfield indicators
      // ("Adding Height Indicators");

      console.log(i18n("Add_HI"));
      objRef.computeHeightFieldIndicators(SCALARFIELD, paths, objRef.SVG_COLORMAP, objRef); // add shading

      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHADING")) {
        // ("Computing Normal Field");
        console.log(i18n("Comp_NF"));
        var normalField = new _scalarfield_js__WEBPACK_IMPORTED_MODULE_5__.NormalField(SCALARFIELD, 100 * _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("HEIGHT_SCALE") / (_rangeMax - _rangeMin)); // ("Extracting Shading Contour Paths");

        console.log(i18n("Ext_SCP"));
        var shadingPaths = normalField.getShadingContourPaths(new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(-0.5, -0.5, 1).normalize()); // ("Adding Shading Layer");

        console.log(i18n("Add_SL"));
        objRef.SVG_SHADING_CONTOURS = objRef.SHADING_LAYER.selectAll(".shadingContours").data(shadingPaths).enter().append("path").attr("class", "shadingContours").attr("d", scalarFieldTransformProjection).attr("fill", "rgb(253,253,254)").style("mix-blend-mode", "multiply").style("pointer-events", "none");
      }
    }
  }, {
    key: "sampleIndicators",
    value: function sampleIndicators(scalarfield, gradientField, p, dir, indicators) {
      var stepSize = 1;
      var minDist = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("INDICATOR_FONTSIZE");
      var last_indicator = null;
      var gradient = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(1, 0);

      for (var i = 0; i < 5000; i++) {
        var value = scalarfield.sampleBilinear(p.x, p.y);
        if (isNaN(value)) continue; // inter-heightfield value (fractional part within a contour line)

        var _contourStep = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("CONTOUR_STEP");

        var closest_contour_value = Math.floor(value / _contourStep) * _contourStep;

        var frac = value - closest_contour_value;
        if (frac >= _contourStep / 2) closest_contour_value += _contourStep;
        var contour_dist = Math.abs(value - closest_contour_value);

        if (contour_dist < _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("INDICATOR_EPSILON") && gradient && (!last_indicator || last_indicator.value != closest_contour_value && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.distance)(p, last_indicator) > minDist)) {
          last_indicator = {
            'x': p.x,
            'y': p.y,
            'value': closest_contour_value,
            'gradient': gradient
          };
          indicators.push(last_indicator);
        } // continue sampling along the gradient


        var cell = scalarfield.map(p.x, p.y);
        gradient = gradientField.sampleBilinear(cell.x, cell.y);
        if (!gradient) continue;
        if (gradient.norm() < stepSize * 0.001) return;
        p = p.add(gradient.normalize().mul(dir * stepSize));
      }
    }
  }, {
    key: "computeHeightFieldIndicators",
    value: function computeHeightFieldIndicators(scalarfield, paths, colormap, objRef) {
      var _this3 = this;

      var uvSeeds;

      if (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("MANY_SEEDS")) {
        uvSeeds = [new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.2, 0.1), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.9, 0.2), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.8, 0.9), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.1, 0.8), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.5, 0.5), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.5, 0.1), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.1, 0.5), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.9, 0.5), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.5, 0.9)];
      } else {
        //uvSeeds = [new vec(0.3, 0.2), new vec(0.8, 0.6), new vec(0.4, 0.8)];
        uvSeeds = [new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.3, 0.2), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.2, 0.8), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.8, 0.2), new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(0.8, 0.8)];
      }

      var indicators = [];
      var gradientField = new _scalarfield_js__WEBPACK_IMPORTED_MODULE_5__.GradientField(scalarfield); // starting point

      uvSeeds.forEach(function (seed) {
        var anchor = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(scalarfield.origin.x + seed.x * scalarfield.width * scalarfield.cellSize, scalarfield.origin.y + seed.y * scalarfield.height * scalarfield.cellSize);

        _this3.sampleIndicators(scalarfield, gradientField, anchor, 1, indicators);

        _this3.sampleIndicators(scalarfield, gradientField, anchor, -1, indicators);
      }); // create SVG labels
      //----------------------------------------------------

      if (this.SVG_INDICATOR_LABELS) this.SVG_INDICATOR_LABELS.remove();
      this.SVG_INDICATOR_LABELS = objRef.TOPO_LAYER.selectAll(".indicator_labels").data(indicators).enter().append("text").text(function (d) {
        return d.value.toFixed(1) / 1;
      }).style("fill", function (d) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.darken)(colormap(d.value));
      }).style("font-family", "Arial").style("font-size", _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("INDICATOR_FONTSIZE")).style("pointer-events", "none") // to prevent mouseover/drag capture
      .attr("transform", this.placeIndicator);
    }
  }, {
    key: "placeIndicator",
    value: function placeIndicator(indicator) {
      var _labelHeight = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("INDICATOR_FONTSIZE");

      var _labelWidth = _labelHeight * 4.5;

      var pos = _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec.copy(indicator);
      pos.y += _labelHeight * 0.0;
      var transform = "translate(" + pos.x + ", " + pos.y + ") ";
      var v = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(indicator.gradient.y, -indicator.gradient.x).normalize();

      if (!isNaN(v.x) && !isNaN(v.y)) {
        //if (v.x < 0) v = v.negate();
        //pos = pos.add(v.mul(-labelwidth / 2));
        //transform += "scale(1,-1) "
        var angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
        transform = "translate(" + pos.x + ", " + pos.y + ")  rotate(" + angle + ")";
        if (v.x < 0) transform += "scale(-1,-1)  translate(" + -_labelWidth / 2 + ", " + +_labelHeight / 2 + ")";
      }

      return transform;
    }
  }, {
    key: "placeTunnelEntry",
    value: function placeTunnelEntry(tunnel, invert) {
      var len = 6;
      var pv0 = tunnel[invert ? 0 : 1];
      var pv1 = tunnel[invert ? 1 : 0];
      var v = pv1.sub(pv0);
      v.z = 0;
      v = v.normalize();
      var w = v.mul(-len * 0.5);
      var n = new _utils_js__WEBPACK_IMPORTED_MODULE_1__.vec(v.y, -v.x).mul(len);
      var p0 = pv0.add(n);
      var p1 = p0.add(w).add(n);
      var q0 = pv0.sub(n);
      var q1 = q0.add(w).sub(n);
      return [[p1.x, p1.y], [p0.x, p0.y], [q0.x, q0.y], [q1.x, q1.y]];
    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "toggleLinks",
    value: function toggleLinks(showLinks) {
      var _showTunnels = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("SHOW_TUNNELS");

      var _linkOpacity = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("LINK_OPACITY");

      var tunnelLinkOpacity = showLinks && _showTunnels ? _linkOpacity : 0;
      if (this.SVG_LINKS_STREETS) this.SVG_LINKS_STREETS.attr("opacity", tunnelLinkOpacity);
      if (this.SVG_LINKS_TUNNELS) this.SVG_LINKS_TUNNELS.attr("opacity", tunnelLinkOpacity);
      if (this.SVG_TUNNEL_ENTRIES_1) this.SVG_TUNNEL_ENTRIES_1.attr("opacity", tunnelLinkOpacity);
      if (this.SVG_TUNNEL_ENTRIES_2) this.SVG_TUNNEL_ENTRIES_2.attr("opacity", tunnelLinkOpacity);
      if (this.SVG_LINKS) this.SVG_LINKS.attr("opacity", showLinks && (_parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("ENERGIZE") || !_showTunnels) ? _linkOpacity : 0);
    } // Returns a string representation of the node to be used in tooltips

  }, {
    key: "getNodeAttributesAsString",
    value: function getNodeAttributesAsString(node) {
      return node.name + (node.id ? " (" + node.id + ")" : "") + "\nValue: " + node.value;
    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "saveDataF",
    value: function saveDataF() {
      var nodePositions = [];
      this.NODES.forEach(function (node) {
        nodePositions.push({
          "id": node.id,
          "name": node.name,
          "value": node.value,
          "x": node.x,
          "y": node.y,
          "fixed": node.fx != null
        });
      });
      var content = [JSON.stringify({
        "metadata": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getMetadata)(),
        "parameters": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getParameters)(),
        "nodes": nodePositions,
        "links": this.LINKS
      }, _export_js__WEBPACK_IMPORTED_MODULE_0__.removeInternalValuesFromJSON, 2)];
      var blob = new Blob(content, {
        type: "text/json"
      });

      var _fileName = _parms_js__WEBPACK_IMPORTED_MODULE_2__.GET("FILENAME");

      var filenameWithoutSuffix = _fileName.slice(0, _fileName.lastIndexOf('.'));

      (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.createDownloadFromBlob)(blob, filenameWithoutSuffix + ".tam");
    }
  }, {
    key: "saveData",
    value: function saveData() {
      return;
    }
  }]);

  return TAMRenderer;
}();

/***/ }),

/***/ "./src/js/TFMrenderer.js":
/*!*******************************!*\
  !*** ./src/js/TFMrenderer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TFMRenderer": () => (/* binding */ TFMRenderer)
/* harmony export */ });
/* harmony import */ var _export_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./export.js */ "./src/js/export.js");
/* harmony import */ var _TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TAMrenderer.js */ "./src/js/TAMrenderer.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/js/utils.js");
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interfaces.js */ "./src/js/interfaces.js");
/* harmony import */ var _interaction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interaction.js */ "./src/js/interaction.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
/* harmony import */ var _scalarfield_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./scalarfield.js */ "./src/js/scalarfield.js");
/* harmony import */ var _dbman_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dbman.js */ "./src/js/dbman.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } Object.defineProperty(subClass, "prototype", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Gedcom Renderer
//
///////////////////////////////////////////////////////////////////////////////

 // import { default as i18n } from "./i18n.js";







 // Parameters for Family Graph appearance

var PARM_RANGE_UNIT_LEN = 3;
var PARM_NODE_BORDER_COLOR_FIXED = "#ad0de2";
var PARM_FAMILY_NODE_BORDER_COLOR = "#f88";
var PARM_FAMILY_NODE_BORDER_WIDTH = 10;
var PARM_FAMILY_FONT_SIZE = 16;
var PARM_FAMILY_NODE_OPACITY = 0.7; /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var TFMRenderer = /*#__PURE__*/function (_TAMRenderer) {
  _inherits(TFMRenderer, _TAMRenderer);

  var _super = _createSuper(TFMRenderer);

  function TFMRenderer() {
    var _this;

    _classCallCheck(this, TFMRenderer);

    _this = _super.call(this);
    _this.PNODES = [];
    _this.FNODES = [];
    _this.LINKNODES = [];
    _this.FAMILYLINKS = [];
    _this.SVG_FAMILY_CIRCLES = null;
    _this.SVG_FAMILY_LABELS = null;
    _this.instance = _assertThisInitialized(_this);
    _this.RENDERtype = 1;
    _this.svgKENN = 'TFM';
    _this.isInitialized = false;
    _this.GRAPH_DATA = null;
    return _this;
  }

  _createClass(TFMRenderer, [{
    key: "reset",
    value: function reset() {
      this.PNODES = [];
      this.FNODES = [];
      this.LINKNODES = [];
      this.FAMILYLINKS = [];
      this.SVG_FAMILY_CIRCLES = null;
      this.SVG_FAMILY_LABELS = null;
    }
  }, {
    key: "load_GRAPH_DATA",
    value: function load_GRAPH_DATA(text) {
      this.GRAPH_DATA = text;
    }
  }, {
    key: "createFamilyForceGraph",
    value: function createFamilyForceGraph(graph) {
      var _this2 = this;

      var nodePositions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var objRef = this; // list persons
      //----------------------------------

      graph.persons.forEach(function (p) {
        // set person data
        p.type = "PERSON";
        p.r = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("NODE_RADIUS");
        p.cr = p.sex == _parms_js__WEBPACK_IMPORTED_MODULE_5__.Sex.FEMALE ? _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("NODE_RADIUS") : 0;
        p.value = p.bdate ? p.bdate.getFullYear() : null;

        if (p.value && p.value > _this2.CurrentYear) {
          p.value = _this2.CurrentYear;
        }

        p.valueD = p.ddate ? p.ddate.getFullYear() : null; // set node positions (if available)

        if (nodePositions && nodePositions[p.id]) {
          p.x = nodePositions[p.id].x;
          p.y = nodePositions[p.id].y;
          p.vis = {
            'x': p.x,
            'y': p.y
          };

          if (nodePositions[p.id].fixed) {
            // restore fixed state
            p.fx = p.x;
            p.fy = p.y;
          }
        } else p.vis = {
          'x': 0,
          'y': 0
        };

        objRef.PNODES.push(p);
      });
      (0,_TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__.setRange)(objRef.PNODES, objRef.CurrentYear); // list families
      //----------------------------------

      graph.families.forEach(function (f, key) {
        // add family
        f.id = key;
        f.type = "FAMILY"; // set node positions (if available)

        if (nodePositions && nodePositions[key]) {
          f.x = nodePositions[key].x;
          f.y = nodePositions[key].y;
          f.vis = {
            'x': f.x,
            'y': f.y
          };

          if (nodePositions[key].fixed) {
            // restore fixed state
            f.fx = f.x;
            f.fy = f.y;
          }
        } else f.vis = {
          'x': 0,
          'y': 0
        };

        f.familyname = (f.husband && f.husband.surname ? f.husband.surname : f.wife && f.wife.surname ? f.wife.surname : "").toUpperCase(); // Show correct surnames in single-child families (Suggestion Walter Hess)
        //{
        //    f.familyname = "";
        //    if (f.husband && f.husband.surname) f.familyname = f.husband.surname.toUpperCase();
        //    else if (f.children.length == 1)    f.familyname = f.children[0].surname.toUpperCase();
        //}
        // compute value of this node

        if (f.children.length == 0) {
          f.value = null;
          if (f.husband && f.husband.bdate) f.value = f.husband.bdate.getFullYear();
          if (f.wife && f.wife.bdate && f.wife.bdate.getFullYear() > f.value) f.value = f.wife.bdate.getFullYear();
        } else {
          f.value = 1e20;
          f.children.forEach(function (c) {
            if (c.bdate && c.bdate.getFullYear() < f.value) f.value = c.bdate.getFullYear();
          });
        }

        if (!f.value || f.value === 1e20) {
          f.value = 0;
        }

        objRef.FNODES.push(f);
      }); // link persons depending on ancestral graph appearance
      //-------------------------------------------------------------

      var LINKS = [];
      objRef.linkPersonsByFamilyNode(graph, LINKS, objRef); // Concat node links participating in force simulation in painter's order

      var NODES = objRef.FNODES.slice(0);
      objRef.LINKNODES.forEach(function (n) {
        return NODES.push(n);
      });
      objRef.PNODES.forEach(function (n) {
        return NODES.push(n);
      }); // let _PNODES = [];
      // this.PNODES.forEach(n => _PNODES.push(n));
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // FORCE SIMULATION OF FORCE-DIRECTED GRAPH

      objRef.REPULSION_FORCE = d3.forceManyBody().strength(-_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("REPULSION_STRENGTH"));
      objRef.LINK_FORCE = d3.forceLink(LINKS).distance(function (d) {
        return d.distance;
      }).strength(_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_STRENGTH")); // Set tick-frequency depending on NODES.length

      _get(_getPrototypeOf(TFMRenderer.prototype), "set_tickCounter", this).call(this, objRef, NODES); // Initialize force field at the end


      objRef.FORCE_SIMULATION = d3.forceSimulation(NODES).force("charge", objRef.REPULSION_FORCE).force("x", d3.forceX(0).strength(_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("GRAVITY_X"))).force("y", d3.forceY(0).strength(_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("GRAVITY_Y"))).force("similarity", function (alpha) {
        objRef.similarityForce(objRef.PNODES, alpha);
      }).force("collision", d3.forceCollide().radius(function (d) {
        return d.r;
      })).force("link", objRef.LINK_FORCE).velocityDecay(_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("FRICTION")) // friction since d3.v4
      .alpha(_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("ALPHA")).alphaDecay(0).on("tick", function tick() {
        objRef.tick(objRef);
      }).on("end", function update() {
        objRef.updateScalarField(objRef);
      });
      if (!_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("ENERGIZE")) // this parameter may be loaded from an exported save file
        objRef.FORCE_SIMULATION.alpha(0); // stop simulation
      // ("Force Graph Initialized.");

      console.log(i18n("F_G_I")); /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///  CREATE SVG ELEMENTS

      _get(_getPrototypeOf(TFMRenderer.prototype), "initSVGLayers", this).call(this, objRef);

      _get(_getPrototypeOf(TFMRenderer.prototype), "setColorMap", this).call(this, objRef);

      _get(_getPrototypeOf(TFMRenderer.prototype), "setNodeColors", this).call(this, objRef); // bottom layer


      objRef.SVG_FAMILY_CIRCLES = objRef.GRAPH_LAYER.selectAll(".family").data(objRef.FNODES).enter().append("circle").attr("class", "family").style("fill", "fnodeColor").style("stroke", PARM_FAMILY_NODE_BORDER_COLOR).style("stroke-width", PARM_FAMILY_NODE_BORDER_WIDTH).attr("fill-opacity", 0).attr("stroke-opacity", PARM_FAMILY_NODE_OPACITY).attr("r", function (f) {
        return f.r;
      });
      objRef.SVG_LINKS = objRef.GRAPH_LAYER.selectAll(".link").data(objRef.FAMILYLINKS).enter().append("line").attr("stroke", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_COLOR")).attr("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_WIDTH") + "px").attr("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SHOW_LINKS") ? _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_OPACITY") : 0).attr("marker-end", "url(#arrow)");

      var _nr = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("NODE_RADIUS") / 4;

      objRef.SVG_NODE_CIRCLES = objRef.GRAPH_LAYER.selectAll(".person").data(objRef.PNODES).enter().append("rect").attr("class", "person").style("fill", function (node) {
        return typeof node.value == "number" ? objRef.SVG_COLORMAP(node.value) : "red";
      }).style("stroke", "#222").attr("stroke-width", _nr + "px").attr("width", function (f) {
        return 2 * f.r;
      }).attr("height", function (f) {
        return 2 * f.r;
      }).attr("rx", function (f) {
        return f.cr;
      }).attr("ry", function (f) {
        return f.cr;
      });
      if (_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SHOW_NAMES")) objRef.showNames(); // ("SVG Elements Initialized.");

      console.log(i18n("SVG_E_i"));
      console.log("GRAPH_LAVER", objRef.GRAPH_LAYER); // Setup interactions

      objRef.SVG_DRAGABLE_ELEMENTS = objRef.GRAPH_LAYER.selectAll(".family,.person");
      console.log("SVG_DRAGABLE_ELEMENTS", objRef.SVG_DRAGABLE_ELEMENTS);

      if (!objRef.isInitialized) {
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.initInteractions)(objRef);
        objRef.isInitialized = true;
      }

      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.setTAMDragactions)(objRef);
      this.adjustCanvas(objRef); // ("Interactions Initialized.");

      console.log(i18n("Int_i"));
    }
  }, {
    key: "initSVGLayers",
    value: function initSVGLayers(objRef) {
      var sKenn = objRef.svgKENN;
      var the_canvas = d3.selectAll("#s" + sKenn);
      var the_svg_g = the_canvas.select("g");

      var _has_g = the_svg_g.node();

      if (_has_g) {
        objRef.CANVAS = the_svg_g;
        (0,_interfaces_js__WEBPACK_IMPORTED_MODULE_3__.resetSVGLayers)(objRef);
      } else {
        objRef.CANVAS = d3.select("#s" + sKenn).append("g");
      }

      objRef.TOPO_LAYER = objRef.CANVAS.append("g").attr("id", "topolayer" + sKenn);
      objRef.SHADING_LAYER = objRef.CANVAS.append("g").attr("id", "shadinglayer" + sKenn);
      objRef.GRAPH_LAYER = objRef.CANVAS.append("g").attr("id", "graphlayer" + sKenn); // objRef.BULLS_EYE = objRef.CANVAS.select("#bullseye").append("g");
    }
  }, {
    key: "similarityForce",
    value: function similarityForce(nodes, alpha) {
      _get(_getPrototypeOf(TFMRenderer.prototype), "similarityForce", this).call(this, nodes, alpha);
    }
  }, {
    key: "linkPersonsByFamilyNode",
    value: function linkPersonsByFamilyNode(graph, LINKS, objRef) {
      //-- link family nodes with children and compute family node radius
      var _nodeRadius = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("NODE_RADIUS");

      var _linkDistance = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_DISTANCE");

      graph.families.forEach(function (f) {
        var familyDefaultRadius = Math.max(2.5 * _nodeRadius, Math.sqrt(f.children.length * 9 * _nodeRadius * _nodeRadius));
        f.r = familyDefaultRadius;
        f.children.forEach(function (c) {
          // determine distance of child from family center for visualization of age differences
          c.fnodedist = familyDefaultRadius * 0.5;
          if (c.bdate) c.fnodedist += (c.bdate.getFullYear() - f.value) * PARM_RANGE_UNIT_LEN; // family circle radius has to encompass all childs

          f.r = Math.max(f.r, c.fnodedist);
          var link = {
            "source": f,
            "target": c,
            "distance": _linkDistance / 2
          }; // division by 2 since there are two segments between family nodes

          LINKS.push(link);
          c.parentFamily = f;
        });
      }); //-- link family node with parents

      graph.families.forEach(function (f) {
        var sources = [];
        if (f.husband) sources.push(f.husband);
        if (f.wife) sources.push(f.wife);
        sources.forEach(function (source) {
          var link = {
            "source": source,
            "target": f,
            "distance": _linkDistance * 0.8 + f.r
          };
          LINKS.push(link);
          objRef.FAMILYLINKS.push(link);
        });
      });
    } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "tick",
    value: function tick(objRef) {
      // only update visualization each N iterations for performance
      if (this.tickCounter++ % this.tickCounterControlValue == 0) {
        if (this.tickCounterLevel != 'min') {
          if (this.tickCounter > this.tickCounterThreshold) {
            // check threshold
            var _tLevel = _parms_js__WEBPACK_IMPORTED_MODULE_5__.TClevel_down(this.tickCounterLevel); // get next level


            var _tCount = _parms_js__WEBPACK_IMPORTED_MODULE_5__.getTickCount(_tLevel);

            this.tickCounterControlValue = _tCount.check; // set new value for modulo-ops

            this.tickCounterLevel = _tLevel; // set new level

            this.tickCounterCycles = _tCount.cyc; // set new multiplyer

            this.tickCounterThreshold = _tCount.val * this.tickCounterCycles; // set new threshold

            _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("RENDERER_UPDATE_LEVEL", _tLevel);
            _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("RENDER_UPDATE_INTERVAL", _parms_js__WEBPACK_IMPORTED_MODULE_5__.getTickCount(_tCount.check));
            this.tickCounterTotal += this.tickCounter;
            this.tickCounter = 0;
            (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.makeTickCountInfo)(this.instance, true);
          }
        } else {
          this.tickCounterTotal += this.tickCounter;
          this.tickCounter = 0;
          (0,_interaction_js__WEBPACK_IMPORTED_MODULE_4__.makeTickCountInfo)(this.instance);
        }
      } else {
        if (this.tickCounter == 5) {
          this.adjustCanvas(objRef);
        }

        return;
      } // set visualization positions of persons by pushing them back into their parent family circle


      this.SVG_NODE_CIRCLES.each(function (p) {
        // set visualization position to simulation position by default
        p.vis.x = p.x;
        p.vis.y = p.y;

        if (p.parentFamily) {
          if (p.parentFamily.children.length == 1) {
            p.vis.x = p.parentFamily.x;
            p.vis.y = p.parentFamily.y;
          } else {
            var dist = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.distance)(p.vis, p.parentFamily); // actual distance between node vis positions

            if (dist > p.fnodedist) {
              var fac = (dist - p.fnodedist) / dist;
              p.vis.x += (p.parentFamily.x - p.vis.x) * fac;
              p.vis.y += (p.parentFamily.y - p.vis.y) * fac;
            }
          }
        }
      });
      this.SVG_FAMILY_CIRCLES.each(function (f) {
        f.vis.x = f.x;
        f.vis.y = f.y;
      }); // move family and persons circles to defined position (d.x,d.y)

      this.SVG_NODE_CIRCLES.style("stroke", function (p) {
        return p.fx == null ? "#222" : PARM_NODE_BORDER_COLOR_FIXED;
      }).attr("x", function (p) {
        return p.vis.x - p.r;
      }).attr("y", function (p) {
        return p.vis.y - p.r;
      });
      this.SVG_FAMILY_CIRCLES.style("stroke", function (f) {
        return f.fx == null ? PARM_FAMILY_NODE_BORDER_COLOR : PARM_NODE_BORDER_COLOR_FIXED;
      }).attr("cx", function (f) {
        return f.vis.x;
      }).attr("cy", function (f) {
        return f.vis.y;
      }).attr("r", function (f) {
        return f.r;
      }); // set links

      var _arrowDfactor = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("ARROW_DICSTANCE_FACTOR");

      var _arrowRadius = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("ARROW_RADIUS");

      this.SVG_LINKS.attr("x1", function (d) {
        return d.source.vis.x;
      }).attr("y1", function (d) {
        return d.source.vis.y;
      }).attr("x2", function (d) {
        //if (d.target.type != "FAMILY") return d.targete.x;
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.distance)(d.source.vis, d.target.vis),
            t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;
        var x = d.source.vis.x * (1 - t) + d.target.vis.x * t;
        return isNaN(x) ? d.target.vis.x : x;
      }).attr("y2", function (d) {
        //if (d.target.type != "FAMILY") return d.target.y;
        var l = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.distance)(d.source.vis, d.target.vis),
            t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;
        var y = d.source.vis.y * (1 - t) + d.target.vis.y * t;
        return isNaN(y) ? d.target.vis.y : y;
      }); // set labels

      if (_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SHOW_NAMES")) {
        this.SVG_NODE_LABELS.attr("transform", this.placeLabel);
        this.SVG_FAMILY_LABELS.attr("transform", this.placeLabel);
      }
    } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "hideNames",
    value: function hideNames() {
      this.SVG_FAMILY_LABELS.remove();
      this.SVG_NODE_LABELS.remove();
    }
  }, {
    key: "showNames",
    value: function showNames() {
      // person labels
      //-----------------------------------------------------------------
      this.SVG_NODE_LABELS = this.GRAPH_LAYER.selectAll(".personlabels").data(this.PNODES).enter().append("text").text(function (node) {
        return node.givenname;
      }).style("fill", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LABEL_COLOR")).style("stroke", "white").style("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("FONT_SIZE") / 5).style("paint-order", "stroke").style("font-family", "Calibri").style("font-size", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("FONT_SIZE")).style("pointer-events", "none") // to prevent mouseover/drag capture
      .style("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("PERSON_LABEL_OPACITY")); // compute label lengths and store them

      this.SVG_NODE_LABELS.each(function (d) {
        d.labelwidth = this.getComputedTextLength();
      }); // now adjust label position based on label lengths

      this.SVG_NODE_LABELS.attr("transform", this.placeLabel); // family labels
      //-----------------------------------------------------------------

      this.SVG_FAMILY_LABELS = this.GRAPH_LAYER.selectAll(".familylabels").data(this.FNODES).enter().append("text").text(function (d) {
        return d.familyname;
      }).style("fill", "black").style("stroke", "white").style("stroke-width", PARM_FAMILY_FONT_SIZE / 5).style("paint-order", "stroke").style("opacity", PARM_FAMILY_NODE_OPACITY).style("font-family", "Calibri").style("font-size", PARM_FAMILY_FONT_SIZE).style("pointer-events", "none") // to prevent mouseover/drag capture
      ; // compute label lengths and store them

      this.SVG_FAMILY_LABELS.each(function (d) {
        d.labelwidth = this.getComputedTextLength();
      }); // now adjust label position based on label lengths

      this.SVG_FAMILY_LABELS.attr("transform", this.placeLabel);
    }
  }, {
    key: "placeLabel",
    value: function placeLabel(node) {
      if (_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("PERSON_LABELS_BELOW_NODE")) {
        // below the node
        var x = node.vis.x - node.labelwidth * 0.5;
        var y = node.vis.y + node.r + 1.0 * _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("FONT_SIZE");
        return "translate(" + x + ", " + y + ")";
      } else {
        // right beside the node
        var _x = node.vis.x + 1.5 * node.r;

        var _y = node.vis.y + _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("FONT_SIZE") / 4;

        return "translate(" + _x + ", " + _y + ")";
      }
    } // Update function for scalar field and associated contour map

  }, {
    key: "updateScalarField",
    value: function updateScalarField(objRef) {
      // remove old paths        
      objRef.resetScalarField(objRef); //--- 1. List height field constraints

      var topopoints = []; // add constraints at person positions

      this.PNODES.forEach(function (p) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isNumber)(p.value)) topopoints.push({
          'x': p.vis.x,
          'y': p.vis.y,
          'value': p.value
        });
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isNumber)(p.valueD)) topopoints.push({
          'x': p.vis.x,
          'y': p.vis.y,
          'value': p.valueD
        });
      }); // Create Topopoints for Family Links

      if (_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("EMBED_LINKS")) {
        objRef.FAMILYLINKS.forEach(function (link) {
          if (link.source.value && link.target.value) {
            var pv0 = new _utils_js__WEBPACK_IMPORTED_MODULE_2__.vec(link.source.vis.x, link.source.vis.y, link.source.value);
            var pv1 = new _utils_js__WEBPACK_IMPORTED_MODULE_2__.vec(link.target.vis.x, link.target.vis.y, link.target.value);
            var v = pv1.sub(pv0);
            var nsteps = v.norm() / _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_SAMPLE_STEPSIZE");

            if (nsteps > 0) {
              v = v.div(nsteps);

              for (var i = 0, pv = pv0; i < nsteps; i++, pv = pv.add(v)) {
                topopoints.push({
                  'x': pv.x,
                  'y': pv.y,
                  'value': pv.z
                });
              }
            }
          }
        });
      } //--- 2. Create scalar field
      // (topopoints.length, " Topopoints");


      console.log(i18n("Top_l", {
        ptpl: topopoints.length
      }));
      var SCALARFIELD = new _scalarfield_js__WEBPACK_IMPORTED_MODULE_6__.TopoMap(topopoints, _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SF_INTERPOLATION_TYPE"), _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SCALARFIELD_RESOLUTION"), _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SCALARFIELD_DILATION_ITERS")); //--- 3. Create tunnels and overlays

      if (_parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SHOW_TUNNELS")) {
        // ("Creating Tunnels");
        console.log(i18n("Cre_T"));
        objRef.SVG_LINKS.attr("opacity", 0); // make the other links invisible

        var SEGMENTS = [];
        objRef.FAMILYLINKS.forEach(function (link) {
          if (link.source.value && link.target.value) {
            // determine 2D start and endpoint on map, respecting some offsets
            var pv0 = new _utils_js__WEBPACK_IMPORTED_MODULE_2__.vec(link.source.vis.x, link.source.vis.y, link.source.value);
            var pv1 = new _utils_js__WEBPACK_IMPORTED_MODULE_2__.vec(link.target.vis.x, link.target.vis.y, link.target.value);
            SEGMENTS.push({
              'pv0': pv0,
              'pv1': pv1,
              'directed': true,
              'r1': link.target.r
            });
          }
        }); // create tunnels

        objRef.createTunnels(SCALARFIELD, SEGMENTS);
        if (objRef.SVG_NODE_CIRCLES) objRef.SVG_NODE_CIRCLES.raise(); //if (this.SVG_FAMILY_CIRCLES) this.SVG_FAMILY_CIRCLES.raise();    // needs to stay below links

        if (objRef.SVG_NODE_LABELS) objRef.SVG_NODE_LABELS.raise();
        if (objRef.SVG_FAMILY_LABELS) objRef.SVG_FAMILY_LABELS.raise();
      } else {
        objRef.SVG_LINKS_STREETS.attr("opacity", 0);
        objRef.SVG_LINKS_TUNNELS.attr("opacity", 0);
        objRef.SVG_TUNNEL_ENTRIES_1.attr("opacity", 0);
        objRef.SVG_TUNNEL_ENTRIES_2.attr("opacity", 0);
        objRef.SVG_LINKS.attr("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SHOW_LINKS") ? _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_OPACITY") : 0).attr("stroke-width", _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("LINK_WIDTH") + "px");
      }

      objRef.addHeightfieldOverlays(SCALARFIELD, objRef); // ("+++ Done Updating ScalarField");

      console.log(i18n("Done_uSF"));
    } // Returns a string representation of the node to be used in tooltips

  }, {
    key: "getNodeAttributesAsString",
    value: function getNodeAttributesAsString(node) {
      var _unknown = i18n("unknown");

      if (node.type == "PERSON") {
        var age = node.bdate && node.ddate ? Math.floor((node.ddate - node.bdate) / 31536000000) // 1000ms * 60s * 60min * 24h * 365d
        : _unknown;
        var mother = node.getMother();
        var father = node.getFather();
        return node.getFullName() + (node.id ? " (" + node.id + ")" : "") + "\n\n" + i18n("birth") + (node.bdate ? node.bdate.toLocaleDateString() : _unknown) + "\n" + i18n("death") + (node.ddate ? node.ddate.toLocaleDateString() : _unknown) + "\n" + i18n("age") + age + "\n" + i18n("mother") + (mother ? mother.getFullName() + " (" + mother.id + ")" : _unknown) + "\n" + i18n("father") + (father ? father.getFullName() + " (" + father.id + ")" : _unknown);
      } else if (node.type == "FAMILY") {
        var wife = node.wife;
        var husband = node.husband;
        var mdate = node.mdate;
        return node.familyname + (node.id ? " (" + node.id + ")" : "") + "\n\n" + i18n("wife") + (wife ? wife.getFullName() + " (" + wife.id + ")" : _unknown) + "\n" + i18n("husband") + (husband ? husband.getFullName() + " (" + husband.id + ")" : _unknown) + "\n" + i18n("marriage") + (mdate ? node.mdate.toLocaleDateString() : _unknown) + "\n" + i18n("children") + (node.children ? node.children.length : _unknown) + "\n" + i18n("Fchild") + (node.value ? node.value : _unknown);
      } else {
        return _unknown;
      }
    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "makeNodePositions",
    value: function makeNodePositions() {
      // store person/family node positions with their id
      var nodePositions = {};
      this.PNODES.forEach(function (p) {
        nodePositions[p.id] = {
          "x": p.x,
          "y": p.y,
          "fixed": p.fx != null
        };
      });
      this.FNODES.forEach(function (f) {
        nodePositions[f.id] = {
          "x": f.x,
          "y": f.y,
          "fixed": f.fx != null
        };
      });
      return nodePositions;
    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "saveDataF",
    value: function saveDataF() {
      // store person/family node positions with their id
      var nodePositions = this.makeNodePositions();
      var content = [JSON.stringify({
        "metadata": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getMetadata)(),
        "parameters": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getParameters)(),
        "nodePositions": nodePositions,
        "nodeData": this.GRAPH_DATA
      }, null, 2)]; // no replacement function, human readable indentation

      var blob = new Blob(content, {
        type: "text/json"
      });

      var _fileName = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("FILENAME");

      var _tfilename = document.getElementById("filename");

      if (_tfilename) {
        _fileName = _tfilename.value;
      }

      var filenameWithoutSuffix = _fileName;
      if (_fileName.indexOf('.') >= 0) filenameWithoutSuffix = _fileName.slice(0, _fileName.lastIndexOf('.'));
      (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.createDownloadFromBlob)(blob, filenameWithoutSuffix + ".tfm");
    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "saveData",
    value: function saveData() {
      var nodePositions = this.makeNodePositions();
      var _d = this.PNODES[0];
      var _primID = _d.id;

      var _primName = _d.givenname + '/' + _d.surname + '/';

      var idb_key = _primName + "-" + _primID;
      var dataset = {
        "TFMdata": [{
          "storeID": idb_key,
          "primID": _primID,
          "timestamp": (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.timestamp)(),
          "metadata": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getMetadata)(' - TFM'),
          "parameters": (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.getParameters)(),
          "nodePositions": nodePositions,
          "nodeData": this.GRAPH_DATA
        }]
      };
      (0,_dbman_js__WEBPACK_IMPORTED_MODULE_7__.putDB)("wtTAM", "TFMdata", dataset.TFMdata);
    }
  }]);

  return TFMRenderer;
}(_TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__.TAMRenderer);

/***/ }),

/***/ "./src/js/dbman.js":
/*!*************************!*\
  !*** ./src/js/dbman.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "putDB": () => (/* binding */ putDB),
/* harmony export */   "getDB": () => (/* binding */ getDB),
/* harmony export */   "showDBholds": () => (/* binding */ showDBholds),
/* harmony export */   "displayIDB": () => (/* binding */ displayIDB),
/* harmony export */   "readFromDB": () => (/* binding */ readFromDB),
/* harmony export */   "testDBstore": () => (/* binding */ testDBstore)
/* harmony export */ });
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2021 Reinhold Preiner
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// indexedDB functionality added by huhwt
//
// IndexedDB Management
//
///////////////////////////////////////////////////////////////////////////////

function putDB(dbName, storeName, data) {
  var idb = writeToDB(dbName, storeName, data);
  return idb;
}
function getDB(dbName, storeName, key) {
  var dbaction = readFromDB(dbName, storeName, key);
  dbaction.then(function (value) {
    return value;
  })["catch"](function (err) {
    console.log(err);
  });
}
function showDBholds(dbName) {
  var DBOpenRequest = indexedDB.open(dbName);

  DBOpenRequest.onerror = function (event) {
    console.log(event);
  };

  DBOpenRequest.onsuccess = function (event) {
    var db = DBOpenRequest.result;
    return db.objectStoreNames;
  };
}

function writeToDB(dname, sname, arr) {
  // let DBOpenRequest = parms.oGET("db_wtTAM");
  return new Promise(function (resolve) {
    var DBOpenRequest = window.indexedDB.open(dname);
    var db;

    DBOpenRequest.onupgradeneeded = function () {
      var db = DBOpenRequest.result;

      db.onerror = function (ee) {
        alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
      };

      var store = db.createObjectStore(sname, {
        keyPath: "storeID"
      }); // store.createIndex("primID", "primID", { unique: false} );
      // store.createIndex("timestamp", "timestamp", { unique: false} );
    };

    DBOpenRequest.onsuccess = function () {
      var db = DBOpenRequest.result;
      var tactn = db.transaction(sname, "readwrite");
      var store = tactn.objectStore(sname);

      var _iterator = _createForOfIteratorHelper(arr),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var obj = _step.value;
          store.put(obj);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      resolve(db);
    };

    DBOpenRequest.onerror = function (ee) {
      alert("Enable to access IndexedDB, " + ee.target.errorCode);
    };
  });
}

function displayIDB(dname, sname) {
  return new Promise(function (resolve) {
    var DBOpenRequest = window.indexedDB.open(dname);
    var db;

    DBOpenRequest.onsuccess = function (e) {
      var _keyList = [];
      var idb = DBOpenRequest.result;
      var tactn = idb.transaction(sname, "readonly");
      var osc = tactn.objectStore(sname).openCursor();

      osc.onsuccess = function (e) {
        var cursor = e.target.result;

        if (cursor) {
          _keyList.push(cursor.primaryKey);

          cursor["continue"]();
        }

        resolve(_keyList);
      };

      tactn.oncomplete = function () {
        idb.close();
      };
    };
  });
}
function readFromDB(dname, sname, key) {
  return new Promise(function (resolve) {
    var DBOpenRequest = indexedDB.open(dname);

    DBOpenRequest.onsuccess = function (e) {
      var idb = DBOpenRequest.result;
      var tactn = idb.transaction(sname, "readonly");
      var store = tactn.objectStore(sname);
      var data = store.get(key);

      data.onsuccess = function () {
        resolve(data.result);
      };

      tactn.oncomplete = function () {
        idb.close();
      };
    };
  });
}
function testDBstore(DBname, snames) {
  var doShow = showSnames(DBname, snames[0]);
  var db;
  doShow.then(function (value) {
    var _version = value.version;
    var _osnames = value.osnames;

    if (_version == 3) {
      return true;
    }

    if (!_osnames.contains(snames[0])) {
      var _sname1 = snames[0];
      var DBreq1 = window.indexedDB.open(DBname, 1);

      DBreq1.onupgradeneeded = function () {
        db = DBreq1.result;

        db.onerror = function (ee) {
          alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
        };

        db.createObjectStore(_sname1, {
          keyPath: "storeID"
        });
      };

      DBreq1.onsuccess = function () {
        db = DBreq1.result;
        db.close();
      };

      _version++;
    }

    if (!_osnames.contains(snames[1])) {
      var _sname2 = snames[1];
      var DBreq2 = window.indexedDB.open(DBname, 2);

      DBreq2.onupgradeneeded = function () {
        db = DBreq2.result;

        db.onerror = function (ee) {
          alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
        };

        db.createObjectStore(_sname2, {
          keyPath: "storeID"
        });
      };

      DBreq2.onsuccess = function () {
        db = DBreq2.result;
        db.close();
      };

      _version++;
    }

    if (!_osnames.contains(snames[2])) {
      var _sname3 = snames[2];
      var DBreq3 = window.indexedDB.open(DBname, 3);

      DBreq3.onupgradeneeded = function () {
        db = DBreq3.result;

        db.onerror = function (ee) {
          alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
        };

        db.createObjectStore(_sname3, {
          keyPath: "storeID"
        });
      };

      DBreq3.onsuccess = function () {
        db = DBreq3.result;
        db.close();
      };

      _version++;
    }
  });
}

function showSnames(DBname, sname) {
  return new Promise(function (resolve) {
    var req = indexedDB.open(DBname);
    var db;

    req.onupgradeneeded = function () {
      db = req.result;

      db.onerror = function (ee) {
        alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
      };

      db.createObjectStore(sname, {
        keyPath: "storeID"
      });
    };

    req.onsuccess = function (e) {
      var db = e.target.result;
      var version = parseInt(db.version);
      var osnames = db.objectStoreNames;
      db.close();
      resolve({
        "version": version,
        "osnames": osnames
      });
    };
  });
}

/***/ }),

/***/ "./src/js/export.js":
/*!**************************!*\
  !*** ./src/js/export.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDownloadSVG": () => (/* binding */ createDownloadSVG),
/* harmony export */   "createDownloadFromBlob": () => (/* binding */ createDownloadFromBlob),
/* harmony export */   "removeInternalValuesFromJSON": () => (/* binding */ removeInternalValuesFromJSON),
/* harmony export */   "getParameters": () => (/* binding */ getParameters),
/* harmony export */   "dumpGRAPH": () => (/* binding */ dumpGRAPH),
/* harmony export */   "setParameters": () => (/* binding */ setParameters),
/* harmony export */   "getMetadata": () => (/* binding */ getMetadata),
/* harmony export */   "dump_Htree": () => (/* binding */ dump_Htree)
/* harmony export */ });
/* harmony import */ var _interaction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interaction.js */ "./src/js/interaction.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/js/utils.js");
/* harmony import */ var _dbman_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dbman.js */ "./src/js/dbman.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2021 Reinhold Preiner
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Interface Management - Exports
//
///////////////////////////////////////////////////////////////////////////////
// import { TFMRenderer } from "./TFMrenderer.js";
// import { TAMRenderer } from "./TAMrenderer.js";
 // import { default as i18n } from "./i18n.js";




var TAM_DESCRIPTION = "Topographic Attribute Maps Demo";
var downloadableFile = null;
function createDownloadSVG(svgText, filename) {
  var data = new Blob([svgText], {
    type: 'image/svg+xml'
  });
  var a = document.createElement('a'); // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.

  if (downloadableFile !== null) window.URL.revokeObjectURL(downloadableFile);
  downloadableFile = URL.createObjectURL(data);
  a.href = downloadableFile;
  a.download = filename;
  a.click();
} ///////////////////////////////////////////////////////////////////////////////

function createDownloadFromBlob(blob, filename) {
  var a = document.createElement('a');
  a.download = filename;
  a.href = URL.createObjectURL(blob); // revoke URL after 60s to free memory

  setTimeout(function () {
    return URL.revokeObjectURL(a.href);
  }, 60000);
  setTimeout(function () {
    return a.click();
  }, 0);
} // Remove unnecessary values from data before export.
// This is "replacing function" for JSON.stringify().

function removeInternalValuesFromJSON(key, value) {
  switch (key) {
    case "source":
    case "target":
      return value.id;
    // don't include the whole node object, only the id

    case "index":
    case "distance":
    case "r":
    case "vx":
    case "vy":
    case "fx":
    case "fy":
    case "labelwidth":
      return undefined;
    // ignore

    default:
      return value;
  }
}
function getParameters() {
  var _mapParms = _parms_js__WEBPACK_IMPORTED_MODULE_1__.GETall(); // get all parms as Map
  // because of this won't be imbedded in output:


  var _objParms = Object.fromEntries(_mapParms); // ... change it to an object


  var _retParms = {};
  _retParms = Object.assign(_retParms, _objParms); // ... imbed the object's properties 

  return _retParms; // this kind of presentation will work in output
}
function dumpGRAPH(_GRAPH) {
  var _mapP = _GRAPH.persons;
  var _mapF = _GRAPH.families;

  var _objP = Object.fromEntries(_mapP);

  var _retP = {};
  _retP = Object.assign(_retP, _objP);

  var _objF = Object.fromEntries(_mapF);

  var _retF = {};
  _retF = Object.assign(_retF, _objF);
  return [_retP, _retF];
} // Input: object with key/value pairs, e.g.
// { "PARAM_1" : true, "Param_2" : 42, ...}

function setParameters(params) {
  for (var _i = 0, _Object$entries = Object.entries(params); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    var _key = key;

    if (_key.startsWith('PARAM_', 0)) {
      _key = _key.slice(5);
    }

    if (_parms_js__WEBPACK_IMPORTED_MODULE_1__.TEST(_key)) {
      switch (_key) {
        case "USE_MOUSEOVER":
          _parms_js__WEBPACK_IMPORTED_MODULE_1__.SET("USE_MOUSEOVER", false); // deactivate interactive features by default

          break;

        case "SHOW_YEARVALUES":
          _parms_js__WEBPACK_IMPORTED_MODULE_1__.SET("SHOW_YEARVALUES", false); // deactivate interactive features by default

          break;

        case "SHOW_GRAPH":
          _parms_js__WEBPACK_IMPORTED_MODULE_1__.SET("SHOW_GRAPH", true); // always show graph on default

          break;

        default:
          _parms_js__WEBPACK_IMPORTED_MODULE_1__.SET(_key, value);
      }
    } else {
      // ("Unknown parameter", key, ":", value);
      console.log(i18n("U_parm", {
        pk: key,
        pv: value
      }));
    }
  }

  (0,_interaction_js__WEBPACK_IMPORTED_MODULE_0__.initMenubar)(); // update visuals based on parameter values
} // Let's earmark the data

function getMetadata() {
  var _ext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var metadata = {
    "exportedBy": TAM_DESCRIPTION + _ext,
    "version": d3.select("#version").text()
  };
  return metadata;
}
function dump_Htree(d) {
  var _nodes = [];
  var _links = [];

  var _stop = new Map();

  var _gen = 0;
  var _lfd = 0;
  var _kek = 1;
  var _h_faktor = _parms_js__WEBPACK_IMPORTED_MODULE_1__.H_faktor;
  var _h_gen = _parms_js__WEBPACK_IMPORTED_MODULE_1__.H_gen;
  loop_d(d, _nodes, _links, 'r', _gen, _kek);

  function loop_d(d, _nodes, _links, _tag, _gen, _kek) {
    if (_stop.has(d.id)) {
      return;
    }

    _stop.set(d.id, d.id);

    var _dx = d.x;
    var _dy = d.y;
    var _dfixed = false;

    if (_gen <= _h_gen) {
      var _fix_d = fix_d(_kek);

      var _fix_d2 = _slicedToArray(_fix_d, 3);

      _dx = _fix_d2[0];
      _dy = _fix_d2[1];
      _dfixed = _fix_d2[2];
    }

    _nodes.push({
      "id": d.id,
      "name": d.givenname + '/' + d.surname + '/ K-' + _kek,
      "gname": d.givenname,
      "sname": d.surname,
      "value": d.value,
      "sex": d.sex,
      "valued": d.valued,
      "x": _dx,
      "y": _dy,
      "fixed": _dfixed,
      "cr": d.cr,
      "r": d.r,
      "bdate": d.bdate,
      "ddate": d.ddate,
      "gen": _gen,
      "tag": _tag,
      "lfd": _lfd,
      "kek": _kek
    });

    _lfd += 1;

    var _kekp = 2 * _kek;

    var _dparentFam = d.parentFamily;

    if (_dparentFam) {
      var _dfather = _dparentFam.husband;
      var _dmother = _dparentFam.wife;

      if (_dfather) {
        _links.push({
          "source": _dfather.id,
          "target": d.id,
          "directed": true
        });

        _gen += 1;

        if (_gen <= _h_gen) {
          loop_d(_dfather, _nodes, _links, 'f', _gen, _kekp);
        }

        _gen -= 1;
      }

      if (_dmother) {
        _links.push({
          "source": _dmother.id,
          "target": d.id,
          "directed": true
        });

        _gen += 1;

        if (_gen <= _h_gen) {
          loop_d(_dmother, _nodes, _links, 'm', _gen, _kekp + 1);
        }

        _gen -= 1;
      }
    }
  }

  function fix_d(_kek) {
    var _dx = 0;
    var _dy = 0;
    var _dfixed = true;

    if (_kek > 1) {
      var _dxy = _parms_js__WEBPACK_IMPORTED_MODULE_1__.H_shift[_kek];
      _dx = _dxy[0] * _h_faktor;
      _dy = _dxy[1] * _h_faktor;
    }

    return [_dx, _dy, _dfixed];
  }

  var content = [JSON.stringify({
    "metadata": getMetadata(' - H-Tree'),
    "parameters": getParameters(),
    "nodes": _nodes,
    "links": _links
  }, null, 2)];
  var blob = new Blob(content, {
    type: "text/json"
  });

  var _fileName = _parms_js__WEBPACK_IMPORTED_MODULE_1__.GET("FILENAME");

  var filenameWithoutSuffix = _fileName.slice(0, _fileName.lastIndexOf('.'));

  var _primID = d.id;
  createDownloadFromBlob(blob, filenameWithoutSuffix + "_H-" + _primID + ".tam");

  var _primName = d.givenname + '/' + d.surname + '/';

  var idb_key = _primName + "-" + _primID;
  var dataset = {
    "H_tree": [{
      "storeID": idb_key,
      "primID": _primID,
      "timestamp": (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.timestamp)(),
      "metadata": getMetadata(' - H-Tree'),
      "parameters": getParameters(),
      "nodes": _nodes,
      "links": _links
    }]
  };
  var idb = (0,_dbman_js__WEBPACK_IMPORTED_MODULE_3__.putDB)("wtTAM", "H-Tree", dataset.H_tree);
  localStorage.setItem("actH_tree", idb_key);
}

/***/ }),

/***/ "./src/js/gedcom.js":
/*!**************************!*\
  !*** ./src/js/gedcom.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadTFM": () => (/* binding */ loadTFM),
/* harmony export */   "loadGedcom": () => (/* binding */ loadGedcom),
/* harmony export */   "processGedcom": () => (/* binding */ processGedcom),
/* harmony export */   "estimateMissingDates": () => (/* binding */ estimateMissingDates)
/* harmony export */ });
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Gedcom Interpreter
//
///////////////////////////////////////////////////////////////////////////////
// import { default as i18n } from "./i18n.js";


var Person = /*#__PURE__*/function () {
  function Person(id, givenname, surname, bdate, motherId, fatherId) {
    _classCallCheck(this, Person);

    this.id = id;
    this.sex = _parms_js__WEBPACK_IMPORTED_MODULE_0__.Sex.FEMALE;
    this.givenname = givenname;
    this.surname = surname;
    this.bdate = bdate;
    this.bplace = null;
    this.ddate = null;
    this.families = []; // list of families this person belongs to
  }

  _createClass(Person, [{
    key: "getFullName",
    value: function getFullName() {
      if (this.givenname || this.surname) return this.givenname + " " + this.surname;
      return null;
    }
  }, {
    key: "getMother",
    value: function getMother() {
      var _iterator = _createForOfIteratorHelper(this.families),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var f = _step.value;
          if (f.children.includes(this)) return f.wife;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return null;
    }
  }, {
    key: "getFather",
    value: function getFather() {
      var _iterator2 = _createForOfIteratorHelper(this.families),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var f = _step2.value;
          if (f.children.includes(this)) return f.husband;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return null;
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      var ch = [];

      var _iterator3 = _createForOfIteratorHelper(this.families),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var f = _step3.value;
          if (this == f.husband || this == f.wife) ch = ch.concat(f.children);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return ch;
    }
  }, {
    key: "getSpouses",
    value: function getSpouses() {
      var sp = [];

      var _iterator4 = _createForOfIteratorHelper(this.families),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var f = _step4.value;
          if (this == f.husband && f.wife) sp = sp.concat(f.wife);else if (this == f.wife && f.husband) sp = sp.concat(f.husband);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return sp;
    }
  }]);

  return Person;
}();

function loadTFM(TFM_data, callback) {
  var gedcom = {
    "persons": new Map(),
    "families": new Map()
  };
  var lines = TFM_data.split("\n");
  gedcom = build_gedcam(lines); // ("Loaded " + gedcom.persons.size + " persons in " + gedcom.families.size + " families");

  console.log(i18n("L_Xp_Xf", {
    nP: gedcom.persons.size,
    nF: gedcom.families.size
  }));
  callback(gedcom, text);
}
function loadGedcom(url, callback) {
  d3.text(url).then(function (text) {
    console.log(url, 'geladen');
    processGedcom(text, callback);
  });
}
function processGedcom(text, callback) {
  var gedcom = {
    "persons": new Map(),
    "families": new Map()
  };
  var lines = text.split("\n");
  gedcom = build_gedcam(lines); // ("Loaded " + gedcom.persons.size + " persons in " + gedcom.families.size + " families");

  console.log(i18n("L_Xp_Xf", {
    nP: gedcom.persons.size,
    nF: gedcom.families.size
  }));
  callback(gedcom, text);
}

function build_gedcam(lines) {
  var gedcom = {
    "persons": new Map(),
    "families": new Map()
  };
  var current_pers = null;
  var current_fam = null;
  var current_parentType = null;
  var nodeType = "";

  for (var i = 0; i < lines.length; i++) {
    var tokens = lines[i].split(" ");

    if (tokens[0] == "0" && tokens.length > 2) {
      nodeType = tokens[2].trim();

      if (nodeType == "INDI") {
        var id = tokens[1].toString();
        current_pers = new Person(id, null, null, null, 0, 0);
        gedcom.persons.set(id, current_pers);
      } else if (nodeType == "FAM") {
        var _id = tokens[1];
        current_fam = {
          husband: null,
          wife: null,
          mdate: null,
          children: []
        };
        gedcom.families.set(_id, current_fam);
      } else {
        current_pers = null;
        current_fam = null;
      }
    } //-------------------------------------------------------------
    else if (tokens[0] == 1) {
      nodeType = tokens[1].trim();
      current_parentType = nodeType; //-------------------------- encounterd while parsing PERSONS

      if (current_parentType == "NAME" && current_pers && current_pers.getFullName() == null) {
        for (var j = 2; j < tokens.length; j++) {
          if (current_pers.surname == null && tokens[j].startsWith("/")) // extract surname
            current_pers.surname = tokens[j].replace(/\//g, " ").trim();else if (current_pers.givenname == null) // given name
            current_pers.givenname = tokens[j].trim();
        }
      } else if (nodeType == "SEX" && current_pers) {
        var sex = tokens[2].trim();
        current_pers.sex = sex == "M" ? _parms_js__WEBPACK_IMPORTED_MODULE_0__.Sex.MALE : _parms_js__WEBPACK_IMPORTED_MODULE_0__.Sex.FEMALE;
      } //-------------------------- encounterd while parsing FAMILIES
      else if (nodeType == "HUSB") {
        // important to trim trailing \r from id token!!
        var person = gedcom.persons.get(tokens[2].trim());

        if (person) {
          // create bidirectional link between family and person
          person.families.push(current_fam);
          current_fam.husband = person;
        }
      } else if (nodeType == "WIFE") {
        var _person = gedcom.persons.get(tokens[2].trim());

        if (_person) {
          // create bidirectional link between family and person
          _person.families.push(current_fam);

          current_fam.wife = _person;
        }
      } else if (nodeType == "CHIL") {
        var _id2 = tokens[2].trim();

        if (!gedcom.persons.get(_id2)) gedcom.persons.set(_id2, new Person(_id2, null, null, null, 0, 0));

        var _person2 = gedcom.persons.get(_id2); // create bidirectional link between family and person


        _person2.families.push(current_fam);

        current_fam.children.push(_person2);
      }
    } //-------------------------------------------------------------
    else if (tokens[0] == 2) {
      if (tokens[1] == "DATE" && tokens.length > 2) {
        var date = null;
        var datestr = tokens.slice(2).join(" ");
        var cleanstr = datestr.toLowerCase() // unwanted characters and words
        .replace(/\./g, ' ').replace("?", " ").replace(",", " ").replace("abt", " ").replace("before").replace("bef", " ").replace("undefined ", " ").replace("undef ", " ").replace("um ", " ") // common german wording replacements
        .replace("jänner", "jan").replace("januar ", "jan ").replace("feber", "feb").replace("februar ", "feb ").replace("märz", "mar").replace("mai", "may").replace("juni", "jun").replace("juli", "jul").replace("okt", "oct").replace("dez", "dec").replace("ä", "a").trim(); // add day number in case only month and year is given

        if (cleanstr.split(" ").filter(function (v, i, a) {
          return v != "";
        }).length == 2 && /^[jfmasond]/.test(cleanstr)) cleanstr = "1 " + cleanstr; // convert to timestap in ms

        var datems = Date.parse(cleanstr);

        if (!isFinite(datems)) {
          // parsing error -> parse ourselves
          var a = cleanstr.split(" ").filter(function (v, i, a) {
            return v != "";
          });

          if (a.length > 2) {
            var customstr = a[2].trim() + "-" + a[1].trim() + "-" + a[0].trim();
            datems = Date.parse(customstr);
            if (isFinite(datems)) date = new Date(datems);else console.log("Can't parse custom date string '" + customstr + "' (" + cleanstr + ")(" + datestr + ")");
          } else {
            console.log("Can't parse date string '" + datestr + "' (" + cleanstr + ")");
            date = null; // unknown date
          }
        } else date = new Date(datems); // set date to event


        if (current_parentType == "BIRT") current_pers.bdate = date;else if (current_parentType == "DEAT") current_pers.ddate = date;else if (current_parentType == "MARR") current_fam.mdate = date;
      }
    }
  }

  return gedcom;
}

function estimateMissingDates(gedcom, procreationAge) {
  var updated = true;

  while (updated) {
    // continue estimation until nothing was updated anymore
    updated = false;
    /*jshint -W083 */

    gedcom.persons.forEach(function (p) {
      if (p.bdate == null) // missing date of birth
        {
          var mother = p.getMother();
          var father = p.getFather(); // birthday of youngest parent

          var pbdate = null;
          var mbdate = mother ? mother.bdate : null;
          var fbdate = father ? father.bdate : null;
          if (mbdate != null && fbdate == null) pbdate = mbdate;else if (mbdate == null && fbdate != null) pbdate = fbdate;else if (mbdate && fbdate) pbdate = mbdate > fbdate ? mbdate : fbdate; // birthday of oldest child

          var cbdate = null;
          var children = p.getChildren();

          var _iterator5 = _createForOfIteratorHelper(children),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var c = _step5.value;
              if (cbdate == null) cbdate = c.bdate;else if (c.bdate && c.bdate < cbdate) cbdate = c.bdate;
            } // birthday of oldest spouse

          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          var spbdate = null;
          var spouses = p.getSpouses();

          var _iterator6 = _createForOfIteratorHelper(spouses),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var sp = _step6.value;
              if (spbdate == null) spbdate = sp.bdate;else if (sp.bdate && sp.bdate < spbdate) spbdate = sp.bdate;
            } // estimate based on parent or child birthdates

          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          if (pbdate != null || cbdate != null) {
            if (pbdate != null && cbdate == null) {
              p.bdate = new Date(pbdate.getTime());
              p.bdate.setFullYear(p.bdate.getFullYear() + procreationAge);
            } else if (pbdate == null && cbdate != null) {
              p.bdate = new Date(cbdate.getTime());
              p.bdate.setFullYear(p.bdate.getFullYear() - procreationAge);
            } else if (pbdate != null && cbdate != null) {
              p.bdate = new Date((pbdate.getTime() + cbdate.getTime()) / 2);
            } // ("Missing birth date of " + p.getFullName() + " was estimated " + p.bdate);


            console.log(i18n("M_bdo_we", {
              pFN: p.getFullName(),
              pbd: p.bdate
            }));
            updated = true;
          } // neither parents nor childs are known - estimate based on spouse's bdate
          else if (spbdate != null) {
            p.bdate = new Date(spbdate.getTime()); // assume person is of the same age as his oldest spouse

            updated = true;
          }
        }
    });
  } // check who's left


  gedcom.persons.forEach(function (p) {
    if (p.bdate == null) // missing date of birth
      {
        // ("Still missing birth date of " + p.getFullName());
        console.log(i18n("S_mbd_o", {
          pFN: p.getFullName()
        }));
      }
  });
}

/***/ }),

/***/ "./src/js/guiparts.js":
/*!****************************!*\
  !*** ./src/js/guiparts.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MENUBAR_html": () => (/* binding */ MENUBAR_html),
/* harmony export */   "FILE_MODAL": () => (/* binding */ FILE_MODAL),
/* harmony export */   "IDB_INDEX": () => (/* binding */ IDB_INDEX)
/* harmony export */ });
///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Context and Language dependant GUI assembling
//
///////////////////////////////////////////////////////////////////////////////
function MENUBAR_html() {
  var html_os = "\n\t<fieldset>\n\t\t<legend><label class=\"toggler\" for=\"toggle_os\">".concat(i18n("mb_OpSt"), "</label></legend>\n\t\t<input class=\"menu_toggler\" type=\"checkbox\" id=\"toggle_os\" hidden=\"\" />\n        <div class=\"mcontainer menu\">\n\t\t<legend><label >").concat(i18n("mb_Open"), "</label></legend>\n            <div>\n                <input class=\"mbutton\" type=\"button\" style=\"border:1px solid gray\" value=\"").concat(i18n("mb_lIDB"), "\" id=\"btnLoad\" />\n                <input type=\"file\" id=\"browse\" name=\"fileupload\" style=\"display: none\" accept=\".json, .ged, .tam, .tfm\" />\n                <input class=\"mbutton\" type=\"button\" style=\"border:1px solid gray\" value=\"").concat(i18n("mb_lF"), "\" id=\"fakeBrowse\" />\n            </div>\n            <p>\n                <input class=\"filelabel\" type=\"text\" id=\"filename\" contentEditable />\n            </p>\n            <legend><label >").concat(i18n("mb_Store"), "</label></legend>\n            <div>\n                <input class=\"mbutton\" type=\"button\" style=\"border:1px solid gray\" value=\"").concat(i18n("mb_sIDB"), "\" id=\"btnSave\" />\n                <input class=\"mbutton\" type=\"button\" style=\"border:1px solid gray\" value=\"").concat(i18n("mb_sF"), "\" id=\"btnSaveF\" />\n                <input class=\"mbutton\" type=\"button\" style=\"border:1px solid gray\" value=\"").concat(i18n("mb_sSVG"), "\" id=\"btnSvgExport\" />\n            </div>\n        </div>\n    </fieldset>\n    <!-------------------------------------------------------------------------------------->");
  var html_mb = html_os + "\n\t<!-------------------------------------------------------------------------------------->\n\t<div class=\"title\">\n\t\tTopographic Attribute Maps\n\t\t<span id=\"version\" class=\"version\">1.19</span>\n\t</div>\n\t<fieldset>\n\t\t<legend><label class=\"toggler\" for=\"toggle_ia\">".concat(i18n("mb_ntrct"), "</label></legend>\n\t\t<input class=\"menu_toggler\" type=\"checkbox\" id=\"toggle_ia\" hidden=\"\" />\n\t\t<table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_Frz"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_freeze\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_HghlC"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_select_time\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_sYV"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_yearvalues\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_sNI"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_tooltips\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_sTC"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_tickcount\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t</table>\n\t</fieldset>\n\t<!-------------------------------------------------------------------------------------->\n\t<fieldset>\n\t\t<legend><label class=\"toggler\" for=\"toggle_layout\">Force Layout</label></legend>\n\t\t<input class=\"menu_toggler\" type=\"checkbox\" id=\"toggle_layout\" hidden=\"\" />\n\t\t<table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n\t\t\t<tbody>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">Gravity X:</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_gravity_x\" min=\"0\" step=\"0.01\" value=\"0.1\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">Gravity Y:</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_gravity_y\" min=\"0\" step=\"0.01\" value=\"0.1\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">Repulsion Strength:</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_repulsion_strength\" min=\"0\" step=\"20\" value=\"2000\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">Link Strength:</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_link_strength\" min=\"0\" step=\"0.1\" value=\"2\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">Similarity Strength:</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_simforce_strength\" min=\"0\" step=\"0.1\" value=\"1\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">Friction:</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_friction\" min=\"0.0\" max=\"1.0\" step=\"0.1\" value=\"0.0\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n\t</fieldset>\n\t<!-------------------------------------------------------------------------------------->\n\t<fieldset>\n\t\t<legend><label class=\"toggler\" for=\"toggle_ga\">").concat(i18n("mb_GA"), "</label></legend>\n\t\t<input class=\"menu_toggler\" type=\"checkbox\" id=\"toggle_ga\" hidden=\"\" />\n\t\t<table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n\t\t\t<tbody>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_SG"), "</td>\n\t\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_graph\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_SL"), "</td>\n\t\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_links\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_SN"), "</td>\n\t\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_names\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_LW"), "</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_linkwidth\" min=\"1\" max=\"20\" step=\"1\" value=\"6\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_NR"), "</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_noderadius\" min=\"1\" max=\"100\" step=\"1\" value=\"15\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_NLO"), "</td>\n\t\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_pnodeopacity\" min=\"0.0\" max=\"1.0\" step=\"0.1\" value=\"1.0\" class=\"paramspinbox\"></td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n\t</fieldset>\n\t<!-------------------------------------------------------------------------------------->\n\t<fieldset>\n\t\t<legend><label class=\"toggler\" for=\"toggle_ma\">").concat(i18n("mb_MA"), "</label></legend>\n\t\t<input class=\"menu_toggler\" type=\"checkbox\" id=\"toggle_ma\" hidden=\"\" />\n\t\t<table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_SM"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_contours\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_RC"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_reversecolor\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_INN"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_interpolation_type\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_EL"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_embed_links\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_ST"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_show_tunnels\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_ES"), "</td>\n\t\t\t\t<td class=\"param\"><label class=\"switch\"><input id=\"settings_shading\" type=\"checkbox\"><span class=\"slider\"></span></label></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_DD"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_dilation_degree\" min=\"0\" max=\"100\" step=\"1\" value=\"1\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_MinRV"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_range_min\" value=\"1750\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_MaxRV"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_range_max\" value=\"2020\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_CS"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_contour_step\" min=\"0\" step=\"1\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_CSb"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_contour_big_step\" min=\"0\" step=\"10\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_IS"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_indicator_size\" min=\"0\" step=\"1\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_HScl"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_height_scale\" min=\"0\" max=\"100\" value=\"80\" step=\"1\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_Res"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_resolution\" min=\"10\" max=\"5000\" value=\"500\" step=\"1\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_LSS"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_link_sample_step\" min=\"1\" step=\"1\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">").concat(i18n("mb_UT"), "</td>\n\t\t\t\t<td class=\"param\"><input type=\"number\" id=\"settings_underground_threshold\" min=\"0\" step=\"5\" class=\"paramspinbox\"></td>\n\t\t\t</tr>\n\t\t</table>\n\t</fieldset>\n\t<!-------------------------------------------------------------------------------------->\n\t<fieldset>\n\t\t<legend><label>").concat(i18n("language"), "</label></legend>\n\t\t<table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">\n\t\t\t\t\t<input class=\"button\" type=\"button\" style=\"border:1px solid gray\" value=\"de\" id=\"btn_l_de\" />\n\t\t\t\t\t<input class=\"button\" type=\"button\" style=\"border:1px solid gray\" value=\"en\" id=\"btn_l_en\" />\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\t</fieldset>");
  return html_mb;
}
function FILE_MODAL() {
  var html_fm = "\n    <div id=\"overlaybg\" onclick=\"closeModal()\"></div>\n    <div class=\"modal\">\n        <button type=\"button\" class=\"close\" onclick=\"closeModal()\" alt=\"close\">\xD7</button>\n        <h1>Cannot find GEDCOM file</h1>\n        <p><i><span id=\"missing-ged-file-name\">unknown</span></i></p>\n        <p>Please select it from your computer, or <br />make sure it is placed within the subfolder <i>data</i>.</p>\n        <form name=\"data-source\">\n            <label for=\"modal-file-upload\" class=\"custom-button\">Open file</label>\n            <input type=\"file\" id=\"modal-file-upload\" onchange=\"processModalFileUpload()\" accept=\".ged\" class=\"input-file\">\n        </form>\n    </div>";
  return html_fm;
}
function IDB_INDEX() {
  var html_idbi = "\n    <div id=\"overlaybg\"></div>\n    <div class=\"modal\">\n        <button type=\"button\" class=\"close\" title=\"close\">\xD7</button>\n        <h1>Current state IndexedDB</h1>\n        <ul id=\"idbstores\">\n        </ul>\n    </div>";
  return html_idbi;
}

/***/ }),

/***/ "./src/js/interaction.js":
/*!*******************************!*\
  !*** ./src/js/interaction.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initInteractions": () => (/* binding */ initInteractions),
/* harmony export */   "initTickCountInfo": () => (/* binding */ initTickCountInfo),
/* harmony export */   "toggleSVG": () => (/* binding */ toggleSVG),
/* harmony export */   "setTAMDragactions": () => (/* binding */ setTAMDragactions),
/* harmony export */   "setDefaultParameters": () => (/* binding */ setDefaultParameters),
/* harmony export */   "Wswitch_locale": () => (/* binding */ Wswitch_locale),
/* harmony export */   "initMenubar": () => (/* binding */ initMenubar),
/* harmony export */   "makeTickCountInfo": () => (/* binding */ makeTickCountInfo),
/* harmony export */   "putTickCountInfo": () => (/* binding */ putTickCountInfo),
/* harmony export */   "closeModalIDB": () => (/* binding */ closeModalIDB),
/* harmony export */   "showIDBstate": () => (/* binding */ showIDBstate),
/* harmony export */   "showIDBkeys": () => (/* binding */ showIDBkeys)
/* harmony export */ });
/* harmony import */ var _guiparts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./guiparts.js */ "./src/js/guiparts.js");
/* harmony import */ var _tickcounter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tickcounter.js */ "./src/js/tickcounter.js");
/* harmony import */ var _translations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./translations.js */ "./src/js/translations.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
/* harmony import */ var _dbman_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dbman.js */ "./src/js/dbman.js");
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./interfaces.js */ "./src/js/interfaces.js");
/* harmony import */ var _export_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./export.js */ "./src/js/export.js");
/* harmony import */ var _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TFMrenderer.js */ "./src/js/TFMrenderer.js");
///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Interaction Management
//
///////////////////////////////////////////////////////////////////////////////

 // import { default as i18n } from "./i18n.js";







function initInteractions(objRef) {
  // Add pattern for single heightfield selection and highlighting
  // let renderer = parms.oGET("RENDERER");
  var sSuff = objRef.get_sKENN();
  var sKENN = "#s" + sSuff;
  var the_SVG = d3.select(sKENN);
  var the_def = the_SVG.select("defs");
  var the_defs = the_def._groups[0][0];
  var makePattern = the_defs.childElementCount == 2 ? true : false;

  if (makePattern) {
    var pKENN = "pattern" + sSuff;
    the_def.append("pattern").attr("id", pKENN).attr("width", 40).attr("height", 40).attr("patternUnits", "userSpaceOnUse").append("path").attr("fill", "none").attr("stroke", "#111").attr("stroke-width", "2") //.attr("d","M-1,1 l2,-2 M0,20 l20,-20 M19,21 l2,-2");
    .attr("d", "M0,40 l40,-40 M0,0 l40,40");
  } // initialize Menubar


  if (makePattern) {
    initMenubar();
  } // initialize zoom and pan capabilities


  if (makePattern) {
    var the_CANVAS = objRef.CANVAS;
    var the_zoom = d3.zoom().scaleExtent([0.01, 100]).on("zoom", function (_ref) {
      var transform = _ref.transform;
      the_CANVAS.attr("transform", transform);
    });
    objRef.zoomO = the_zoom;
    the_SVG.call(the_zoom).on('dblclick.zoom', null);
  } // initialize tooltips for hovering over nodes


  initTooltip(objRef); // initialize tooltips for hovering over contours

  inittooltipYV(objRef); // define interaction possibilities for graph svg

  setTAMInteractions(objRef); // define interaction possibilities for menu bar

  setMenubarInteractions(objRef); // reset tickCounterInfo

  initTickCountInfo();
}
function initTickCountInfo() {
  putTickCountInfo("#tcinfo_cnts", "_");
  putTickCountInfo("#tClevel", "_");
  putTickCountInfo("#tcinfo_ncount", "_");
  putTickCountInfo("#tcinfo_level", "_");
  putTickCountInfo("#tcinfo_check", "_");
  putTickCountInfo("#tcinfo_cycles", "_");
  putTickCountInfo("#tcinfo_modvalue", "_");
}
function toggleSVG(renderer) {
  var sSuff = renderer.get_sKENN();
  var sKENN = "#s" + sSuff;

  var _svg = d3.select(sKENN);

  var _isVisible = _svg.style("display");

  switch (_isVisible) {
    case "none":
      _svg.style("display", "inline");

      break;

    default:
      _svg.style("display", "none");

  }
} /////////////////////////////////////////////////////////////////////////////
///  SVG INTERACTIONS

function setTAMInteractions() {
  // events
  d3.select("body").on("keydown", function (event) {
    if (event.srcElement.className != "filelabel") {
      if (event.key == "S".charCodeAt(0)) {
        toggleShading();
        d3.select("#settings_shading").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHADING"));
      } else if (event.keyCode == "R".charCodeAt(0)) {
        toggleReverseColormap();
        d3.select("#settings_reversecolor").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("REVERSE_COLORMAP"));
      } else if (event.keyCode == "H".charCodeAt(0)) {
        toggleSelectTime();
        d3.select("#settings_select_time").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("USE_MOUSEOVER"));
      } else if (event.keyCode == i18n("kc_Y").charCodeAt(0)) {
        toggleShowYearValues();
        d3.select("#settings_show_yearvalues").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_YEARVALUES"));
      } else if (event.keyCode == "I".charCodeAt(0)) {
        toggleShowTooltips();
        d3.select("#settings_show_tooltips").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TOOLTIPS"));
      } else if (event.keyCode == "C".charCodeAt(0)) {
        toggleShowTickcount();
        d3.select("#settings_show_tickcount").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TICKCOUNT"));
      } else if (event.keyCode == "F".charCodeAt(0)) {
        toggleEnergizeSimulation();
        d3.select("#settings_freeze").property('checked', !_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE"));
      } else if (event.keyCode == "N".charCodeAt(0)) {
        toggleNames();
        d3.select("#settings_show_names").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_NAMES"));
      } else if (event.keyCode == "G".charCodeAt(0)) {
        toggleShowGraph();
        d3.select("#settings_show_graph").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_GRAPH"));
      } else if (event.keyCode == i18n("kc_M").charCodeAt(0)) {
        toggleShowContours();
        d3.select("#settings_show_contours").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_CONTOURS"));
      } else if (event.keyCode == "L".charCodeAt(0)) {
        toggleLinks();
        d3.select("#settings_show_links").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_LINKS"));
      } else if (event.keyCode == "T".charCodeAt(0)) {
        toggleShowTunnels();
        d3.select("#settings_show_tunnels").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TUNNELS"));
      } else if (event.keyCode == "E".charCodeAt(0)) {
        document.getElementById("btnSvgExport").click();
      }
    }
  });
}

function setTAMDragactions(objRef) {
  // make nodes draggable
  objRef.SVG_DRAGABLE_ELEMENTS.call(d3.drag().on("start", dragStartNode).on("drag", dragNode).on("end", dragEndNode));
  objRef.SVG_DRAGABLE_ELEMENTS.on("click", onMouseClick).on("dblclick", onDblClick);
} //---------------------------------------------------------------------------

function onMouseClick(event, d) {
  d.fx = d.fy = null;
} //---------------------------------------------------------------------------


function onDblClick(event, d) {
  if (d.type == "FAMILY") {
    d.fx = d.x;
    d.fy = d.y;
  } else if (d.type == "PERSON") {
    (0,_export_js__WEBPACK_IMPORTED_MODULE_6__.dump_Htree)(d);
    (0,_interfaces_js__WEBPACK_IMPORTED_MODULE_5__.openNewTab)("indexHT");
  }
} //---------------------------------------------------------------------------


function mouseoverContour(event, c) {
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");

  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("USE_MOUSEOVER")) {
    renderer.SVG_CONTOURS.attr("fill", function (d) {
      // Currently selected one will be always at 0.5
      if (c.value === d.value) {
        return "url(#myPattern) #000"; //chromadepth(0.5);
      }

      return renderer.SVG_COLORMAP(d.value);
    });
  }
} //---------------------------------------------------------------------------


function dragStartNode(event, d) {
  event.sourceEvent.stopPropagation();
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");

  if (!event.active) {
    renderer.resetScalarField(renderer.instance);
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.FORCE_SIMULATION.velocityDecay(1); // don't move anything than the selected node!

    renderer.FORCE_SIMULATION.alpha(_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ALPHA")).restart();
  }

  d.fx = d.x;
  d.fy = d.y;
  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TOOLTIPS")) d3.select("#tooltip").style("opacity", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("TOOLTIP_DRAG_OPACITY"));
} //---------------------------------------------------------------------------


function dragNode(event, d) {
  d.fx = event.x;
  d.fy = event.y;
  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TOOLTIPS")) d3.select("#tooltip").style("top", event.sourceEvent.pageY - 10 + "px").style("left", event.sourceEvent.pageX + 15 + "px");
} //---------------------------------------------------------------------------


function dragEndNode(event, d) {
  if (!event.active && !_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER").FORCE_SIMULATION.velocityDecay(_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("FRICTION")).alpha(0); // reset friction
  //d.fx = d.fy = null;

  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TOOLTIPS")) d3.select("#tooltip").style("opacity", 1.0);
} //---------------------------------------------------------------------------


function toggleEnergizeSimulation() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("ENERGIZE");
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");

  var _go = _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE");

  if (_go) {
    renderer.resetScalarField(renderer.instance);
    renderer.FORCE_SIMULATION.alpha(_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ALPHA")).restart();
  } else renderer.FORCE_SIMULATION.alpha(0);
} //---------------------------------------------------------------------------


function toggleShading() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHADING");
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");
  renderer.SHADING_LAYER.attr("visibility", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_CONTOURS") && _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHADING") ? "visible" : "hidden");
} //---------------------------------------------------------------------------


function toggleLinks() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_LINKS");
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER").toggleLinks(_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_LINKS"));
} //---------------------------------------------------------------------------


function toggleShowGraph() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_GRAPH");
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER").GRAPH_LAYER.attr("visibility", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_GRAPH") ? "visible" : "hidden");
} //---------------------------------------------------------------------------


function toggleShowContours() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_CONTOURS");
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");

  var _showContours = _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_CONTOURS");

  renderer.TOPO_LAYER.attr("visibility", _showContours || _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_YEARVALUES") ? "visible" : "hidden");
  renderer.SHADING_LAYER.attr("visibility", _showContours && _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHADING") ? "visible" : "hidden");
} //---------------------------------------------------------------------------


function toggleShowYearValues() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_YEARVALUES");
  registertooltipYVeventhandler();
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER").TOPO_LAYER.attr("visibility", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_CONTOURS") || _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_YEARVALUES") ? "visible" : "hidden");
} //---------------------------------------------------------------------------


function toggleNames() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_NAMES");
  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_NAMES")) _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER").showNames();else _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER").hideNames();
} //---------------------------------------------------------------------------


function toggleShowTunnels() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_TUNNELS");

  if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) {
    var _renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");

    _renderer.updateScalarField(_renderer.instance);
  }
} //---------------------------------------------------------------------------


function toggleReverseColormap() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("REVERSE_COLORMAP");

  if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) {
    var _renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");

    _renderer.setColorMap(_renderer.instance);

    _renderer.updateScalarField(_renderer.instance);
  }
} //---------------------------------------------------------------------------


function toggleSelectTime() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("USE_MOUSEOVER");
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER");

  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("USE_MOUSEOVER") || _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_YEARVALUES")) {
    renderer.TOPO_LAYER.selectAll("path.contours").on("mouseover", mouseoverContour);
  } else {
    renderer.resetColormap();
    renderer.TOPO_LAYER.selectAll("path.contours").on("mouseover", null);
  }
} //---------------------------------------------------------------------------


function toggleShowTooltips() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_TOOLTIPS");
  registerTooltipEventhandler();
} //---------------------------------------------------------------------------


function toggleShowTickcount() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("SHOW_TICKCOUNT");

  var _shTC = _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TICKCOUNT");

  var _tcelem = d3.select("#tickcountInfo");

  if (_shTC) {
    _tcelem.style("display", "inline");
  } else {
    _tcelem.style("display", "none");
  }
} /////////////////////////////////////////////////////////////////////////////
// This does *not* trigger any updates of the TAM,
// only the parameter menu is updated.


function setDefaultParameters() {
  var isTFMRenderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER") instanceof _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_7__.TFMRenderer; // ("Loading default parameters for",

  console.log(i18n("L_dpf", {
    pTr: isTFMRenderer ? "TFMRenderer" : "TAMRenderer"
  })); // Menu "Interaction"

  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("ENERGIZE", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("USE_MOUSEOVER", false);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_YEARVALUES", false);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_TOOLTIPS", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_TICKCOUNT", false); // Menu "Force Layout"

  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("GRAVITY_X", isTFMRenderer ? 0.07 : 0.06);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("GRAVITY_Y", isTFMRenderer ? 0.07 : 0.06);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("REPULSION_STRENGTH", 400);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("LINK_STRENGTH", isTFMRenderer ? 1.8 : 0.8);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SF_STRENGTH", 0);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("FRICTION", isTFMRenderer ? 0.2 : 0.4); // Menu "Graph Appearance"

  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_GRAPH", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_LINKS", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_NAMES", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("LINK_WIDTH", 2);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("NODE_RADIUS", 10);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("PERSON_LABEL_OPACITY", 0.7); // Menu "Map Appearance"

  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_CONTOURS", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("REVERSE_COLORMAP", false);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("INTERPOLATE_NN", false);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("EMBED_LINKS", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHOW_TUNNELS", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SHADING", true);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SCALARFIELD_DILATION_ITERS", 2);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("RANGE_MIN", 0);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("RANGE_MAX", 10);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("CONTOUR_STEP", 10);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("CONTOUR_BIG_STEP", 50);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("INDICATOR_FONTSIZE", 15);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("HEIGHT_SCALE", 50);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SCALARFIELD_RESOLUTION", 400);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("LINK_SAMPLE_STEPSIZE", 2);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("UNDERGROUND_THRESHOLD", 10); // Without menu entry

  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("ARROW_RADIUS", isTFMRenderer ? 10 : 14);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("ACTIVE_LOCALE", "de");
  initMenubar(); // update visuals based on parameter values
} ///  MENUBAR INTERACTIONS

function Wswitch_locale(_locale) {
  var active_language = i18n("ZZZZ");

  if (active_language != _locale) {
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("ACTIVE_LOCALE", _locale);
    initMenubar();
    setMenubarInteractions();
  }
}
function initMenubar() {
  var active_language = i18n("ZZZZ");

  if (active_language != _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ACTIVE_LOCALE")) {
    (0,_translations_js__WEBPACK_IMPORTED_MODULE_2__.switch_locale)(_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ACTIVE_LOCALE"));
    var mbHTML = _guiparts_js__WEBPACK_IMPORTED_MODULE_0__.MENUBAR_html();
    var MBelmnt = document.getElementById("menubar");
    MBelmnt.innerHTML = mbHTML;
    var ovHTML = _guiparts_js__WEBPACK_IMPORTED_MODULE_0__.FILE_MODAL();
    var OVelmnt = document.getElementById("overlay");
    OVelmnt.innerHTML = ovHTML;
    var tcHTML = (0,_tickcounter_js__WEBPACK_IMPORTED_MODULE_1__.TICKCOUNTER_html)();
    var TCelmnt = document.getElementById("tickcountInfo");
    TCelmnt.innerHTML = tcHTML;
  }

  d3.select("#settings_dataset").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("FILENAME")); // Load File
  // Save
  // Interaction

  d3.select("#settings_freeze").property('checked', !_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE"));
  d3.select("#settings_select_time").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("USE_MOUSEOVER"));
  d3.select("#settings_show_yearvalues").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_YEARVALUES"));
  d3.select("#settings_show_tooltips").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TOOLTIPS"));
  d3.select("#settings_show_tickcount").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TICKCOUNT")); // Force Simulation

  d3.select("#settings_gravity_x").property('value', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("GRAVITY_X"));
  d3.select("#settings_gravity_y").property('value', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("GRAVITY_Y"));
  d3.select("#settings_repulsion_strength").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("REPULSION_STRENGTH"));
  d3.select("#settings_link_strength").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("LINK_STRENGTH"));
  d3.select("#settings_simforce_strength").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SF_STRENGTH"));
  d3.select("#settings_friction").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("FRICTION")); // Graph Appearance

  d3.select("#settings_show_graph").property("checked", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_GRAPH"));
  d3.select("#settings_show_links").property("checked", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_LINKS"));
  d3.select("#settings_show_names").property("checked", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_NAMES"));
  d3.select("#settings_linkwidth").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("LINK_WIDTH"));
  d3.select("#settings_noderadius").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("NODE_RADIUS"));
  d3.select("#settings_pnodeopacity").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("PERSON_LABEL_OPACITY")); // Map Appearance

  d3.select("#settings_show_contours").property("checked", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_CONTOURS"));
  d3.select("#settings_reversecolor").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("REVERSE_COLORMAP"));
  d3.select("#settings_interpolation_type").property("checked", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("INTERPOLATE_NN"));
  d3.select("#settings_embed_links").property("checked", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("EMBED_LINKS"));
  d3.select("#settings_show_tunnels").property("checked", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TUNNELS"));
  d3.select("#settings_shading").property('checked', _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHADING"));
  d3.select("#settings_dilation_degree").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SCALARFIELD_DILATION_ITERS"));
  d3.select("#settings_range_min").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("RANGE_MIN"));
  d3.select("#settings_range_max").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("RANGE_MAX"));
  d3.select("#settings_contour_step").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("CONTOUR_STEP"));
  d3.select("#settings_contour_big_step").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("CONTOUR_BIG_STEP"));
  d3.select("#settings_indicator_size").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("INDICATOR_FONTSIZE"));
  d3.select("#settings_height_scale").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("HEIGHT_SCALE"));
  d3.select("#settings_resolution").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SCALARFIELD_RESOLUTION"));
  d3.select("#settings_link_sample_step").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("LINK_SAMPLE_STEPSIZE"));
  d3.select("#settings_underground_threshold").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("UNDERGROUND_THRESHOLD"));
} //---------------------------------------------------------------------------

function setMenubarInteractions() {
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_3__.oGET("RENDERER"); //  Load From IDB

  d3.select("#btnLoad").on("click", function (event) {
    showIDBstate(event);
  }); //  Load File

  d3.select("#browse").on("change", function (event) {
    (0,_interfaces_js__WEBPACK_IMPORTED_MODULE_5__.onChangeFile)(event);
  });
  d3.select("#fakeBrowse").on("click", function (event) {
    document.getElementById('browse').click();
  }); //  Save

  d3.select("#btnSave").on("click", function (e) {
    renderer.saveData();
  });
  d3.select("#btnSaveF").on("click", function (e) {
    renderer.saveDataF();
  });
  d3.select("#btnSvgExport").on("click", function (e) {
    var _rkenn = renderer.svgKENN;

    var _elem = 's' + _rkenn;

    var _fnSVG = _rkenn + '.svg';

    (0,_export_js__WEBPACK_IMPORTED_MODULE_6__.createDownloadSVG)(document.getElementById(_elem).outerHTML, _fnSVG);
  }); //  Interaction

  d3.select("#settings_freeze").on("click", function (e) {
    toggleEnergizeSimulation();
  });
  d3.select("#settings_select_time").on("click", function (e) {
    toggleSelectTime();
  });
  d3.select("#settings_show_yearvalues").on("click", function (e) {
    toggleShowYearValues();
  });
  d3.select("#settings_show_tooltips").on("click", function (e) {
    toggleShowTooltips();
  });
  d3.select("#settings_show_tickcount").on("click", function (e) {
    toggleShowTickcount();
  }); //  Force Simulation

  d3.select("#settings_gravity_x").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("GRAVITY_X", _tv);
    renderer.FORCE_SIMULATION.force("x", d3.forceX(0).strength(_tv));
  });
  d3.select("#settings_gravity_y").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("GRAVITY_Y", _tv);
    renderer.FORCE_SIMULATION.force("y", d3.forceY(0).strength(_tv));
  });
  d3.select("#settings_repulsion_strength").on("input", function () {
    var _tv = this.value;
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("REPULSION_STRENGTH", _tv);
    renderer.REPULSION_FORCE.strength(-_tv);
  });
  d3.select("#settings_link_strength").on("input", function () {
    var _tv = this.value;
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("LINK_STRENGTH", _tv);
    renderer.LINK_FORCE.strength(_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("LINK_STRENGTH"));
  });
  d3.select("#settings_simforce_strength").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SF_STRENGTH", _tv);
  });
  d3.select("#settings_friction").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("FRICTION", _tv);
    renderer.FORCE_SIMULATION.velocityDecay(_tv);
  }); //  Graph Appearance

  d3.select("#settings_show_graph").on("input", function () {
    toggleShowGraph();
  });
  d3.select("#settings_show_links").on("input", function () {
    toggleLinks();
  });
  d3.select("#settings_show_names").on("input", function () {
    toggleNames();
  });
  d3.select("#settings_linkwidth").on("input", function () {
    var _tv = parseInt(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("LINK_WIDTH", _tv);
    if (renderer.SVG_LINKS) renderer.SVG_LINKS.attr("stroke-width", _tv + "px");
    if (renderer.SVG_LINKS_STREETS) renderer.SVG_LINKS_STREETS.attr("stroke-width", _tv + "px");
    if (renderer.SVG_LINKS_TUNNELS) renderer.SVG_LINKS_TUNNELS.attr("stroke-width", _tv + "px");
    if (renderer.SVG_TUNNEL_ENTRIES_1) renderer.SVG_TUNNEL_ENTRIES_1.attr("stroke-width", _tv + "px");
    if (renderer.SVG_TUNNEL_ENTRIES_2) renderer.SVG_TUNNEL_ENTRIES_2.attr("stroke-width", _tv + "px");
  });
  d3.select("#settings_noderadius").on("input", function () {
    var _tv = parseInt(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("NODE_RADIUS", _tv);
    if (renderer.SVG_NODE_CIRCLES) renderer.SVG_NODE_CIRCLES.attr("r", _tv);
  });
  d3.select("#settings_pnodeopacity").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("PERSON_LABEL_OPACITY", _tv);
    if (renderer.SVG_NODE_LABELS) renderer.SVG_NODE_LABELS.style("opacity", _tv);
  }); //  Map Appearance

  d3.select("#settings_show_contours").on("input", function () {
    toggleShowContours();
  });
  d3.select("#settings_reversecolor").on("click", function (e) {
    toggleReverseColormap();
  });
  d3.select("#settings_interpolation_type").on("input", function () {
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("INTERPOLATE_NN", this.checked);
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
  });
  d3.select("#settings_embed_links").on("input", function () {
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.TOGGLE("EMBED_LINKS");

    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) {
      renderer.updateScalarField(renderer.instance);
    }
  });
  d3.select("#settings_show_tunnels").on("input", function () {
    toggleShowTunnels();
  });
  d3.select("#settings_shading").on("click", function (e) {
    toggleShading();
  });
  d3.select("#settings_dilation_degree").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SCALARFIELD_DILATION_ITERS", _tv);

    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) {
      renderer.updateScalarField(renderer.instance);
    }
  });
  d3.select("#settings_range_min").on("input", function () {
    var _tv = parseFloat(this.value);

    setRANGE(renderer, "RANGE_MIN", _tv);
  });
  d3.select("#settings_range_max").on("input", function () {
    var _tv = parseFloat(this.value);

    setRANGE(renderer, "RANGE_MAX", _tv);
  });
  d3.select("#settings_contour_step").property("value", _parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("CONTOUR_STEP")).on("input", function () {
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("CONTOUR_STEP", parseFloat(this.value));
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
  });
  d3.select("#settings_contour_big_step").on("input", function () {
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("CONTOUR_BIG_STEP", parseFloat(this.value));
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
  });
  d3.select("#settings_indicator_size").on("input", function () {
    var _tv = this.value;
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("INDICATOR_FONTSIZE", _tv);
    if (renderer.SVG_INDICATOR_LABELS) renderer.SVG_INDICATOR_LABELS.style("font-size", _tv);
  });
  d3.select("#settings_height_scale").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("HEIGHT_SCALE", _tv);
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
  });
  d3.select("#settings_resolution").on("input", function () {
    var _tv = parseInt(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SCALARFIELD_RESOLUTION", _tv);
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
  });
  d3.select("#settings_link_sample_step").on("input", function () {
    var _tv = parseInt(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("LINK_SAMPLE_STEPSIZE", _tv);
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
  });
  d3.select("#settings_underground_threshold").on("input", function () {
    var _tv = parseFloat(this.value);

    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("UNDERGROUND_THRESHOLD", _tv);
    if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
  }); // Language

  d3.select("#btn_l_de").on("click", function (e) {
    Wswitch_locale('de');
  });
  d3.select("#btn_l_en").on("click", function (e) {
    Wswitch_locale('en');
  });
  d3.select("#settings_linkdist").on("input", function () {
    _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("LINK_DISTANCE", parseInt(this.value));
  }); // tickcount-Info

  d3.select("#btn_tcIreset").on("click", function (e) {
    setTickCountInfo(renderer.instance, 'min');
  });
}

function setRANGE(renderer, _RANGE, _tv) {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET(_RANGE, _tv);
  renderer.setColorMap(renderer.instance);
  renderer.updateRange(renderer.instance);
  if (!_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("ENERGIZE")) renderer.updateScalarField(renderer.instance);
} //---------------------------------------------------------------------------


function makeTickCountInfo(objRef) {
  var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var tciLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var _nLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  putTickCountInfo("#tcinfo_cnts", objRef.tickCounterTotal);

  if (tciLevel) {
    putTickCountInfo("#tClevel", tciLevel);
  }

  if (_nLength) {
    putTickCountInfo("#tcinfo_ncount", _nLength);
  }

  if (update) {
    putTickCountInfo("#tcinfo_level", objRef.tickCounterLevel);
    putTickCountInfo("#tcinfo_check", objRef.tickCounterLevelV);
    putTickCountInfo("#tcinfo_cycles", objRef.tickCounterCycles);
    putTickCountInfo("#tcinfo_modvalue", objRef.tickCounterControlValue);
  }

  var _theCanvas = objRef.CANVAS;

  if (_theCanvas) {
    _theCanvas = _theCanvas._groups[0][0];
    var _theTransform = _theCanvas.viewportElement.__zoom;
    var _k = 1.0;

    if (_theTransform) {
      putTickCountInfo("#trfinfo_x", _theTransform.x);
      putTickCountInfo("#trfinfo_y", _theTransform.y);
      _k = _theTransform.k;
      putTickCountInfo("#trfinfo_scale", _k);
    }

    var _tcBox = _theCanvas.getBBox();

    putTickCountInfo("#trfinfo_cw", _tcBox.width * _k);
    putTickCountInfo("#trfinfo_ch", _tcBox.height * _k);
  }
}
function putTickCountInfo(_id, value) {
  var _theElem = d3.select(_id)._groups[0][0];

  _theElem.innerHTML = value;
}

function setTickCountInfo(objRef, _tLevel) {
  var _tCount = _parms_js__WEBPACK_IMPORTED_MODULE_3__.getTickCount(_tLevel);

  objRef.tickCounterControlValue = _tCount.check; // set new value for modulo-ops

  objRef.tickCounterLevel = _tLevel; // set new level

  objRef.tickCounterCycles = _tCount.cyc; // set new multiplyer

  objRef.tickCounterThreshold = _tCount.val * objRef.tickCounterCycles; // set new threshold

  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("RENDERER_UPDATE_LEVEL", _tLevel);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("RENDER_UPDATE_INTERVAL", _parms_js__WEBPACK_IMPORTED_MODULE_3__.getTickCount(_tCount.check));
} //---------------------------------------------------------------------------


function initTooltip(objRef) {
  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TOOLTIPS")) {
    if (!objRef.SVG_DRAGABLE_ELEMENTS) {
      return;
    }

    objRef.SVG_DRAGABLE_ELEMENTS.on("mouseover", null).on("mouseenter", null).on("mousemove", null).on("mouseout", null);
  }

  d3.select("#tooltip").remove(); // remove any previous elements

  d3.select("body").append("div").attr("id", "tooltip");
  registerTooltipEventhandler(objRef);
}

function registerTooltipEventhandler(objRef) {
  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_TOOLTIPS")) {
    var tooltip = d3.select("#tooltip");
    objRef.SVG_DRAGABLE_ELEMENTS.on("mouseover", function (node) {
      return tooltip.style("visibility", "visible");
    }).on("mouseenter", function (event, node) {
      // insert tooltip content
      var tooltipString = objRef.getNodeAttributesAsString(node);
      return tooltip.text(tooltipString);
    }).on("mousemove", function (event) {
      // adjust tooltip position
      return tooltip.style("top", event.pageY - 10 + "px").style("left", event.pageX + 15 + "px");
    }).on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
  } else {
    objRef.SVG_DRAGABLE_ELEMENTS.on("mouseover", null).on("mouseenter", null).on("mousemove", null).on("mouseout", null);
    d3.select("#tooltip").style("visibility", "hidden");
  }
}

function inittooltipYV(objRef) {
  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_YEARVALUES")) {
    if (objRef.SVG_CONTOURS) {
      objRef.SVG_CONTOURS.on("mouseover", null).on("mouseenter", null).on("mousemove", null).on("mouseout", null);
    }
  }

  d3.select("#tooltipYV").remove(); // remove any previous elements

  d3.select("body").append("div").attr("id", "tooltipYV");
  registertooltipYVeventhandler(objRef);
}

function registertooltipYVeventhandler(objRef) {
  if (_parms_js__WEBPACK_IMPORTED_MODULE_3__.GET("SHOW_YEARVALUES")) {
    var tooltip = d3.select("#tooltipYV");
    tooltip.style("visibility", "visible");

    if (objRef.SVG_CONTOURS) {
      objRef.SVG_CONTOURS.on("mouseover", function (c) {// return tooltip.style("visibility", "visible");
      }).on("mouseenter", function (event, c) {
        // insert tooltip content
        var tooltipString = c.value;
        return tooltip.text(tooltipString);
      }).on("mousemove", function (event) {
        // adjust tooltip position
        return tooltip.style("top", event.pageY - 10 + "px").style("left", event.pageX + 15 + "px");
      }).on("mouseout", function () {// return tooltip.style("visibility", "hidden");
      });
    }
  } else {
    if (objRef.SVG_CONTOURS) {
      objRef.SVG_CONTOURS.on("mouseover", null).on("mouseenter", null).on("mousemove", null).on("mouseout", null);
    }

    d3.select("#tooltipYV").style("visibility", "hidden");
  }
}

function closeModalIDB() {
  document.querySelector("#overlay").style.display = "none";
  var ovHTML = _guiparts_js__WEBPACK_IMPORTED_MODULE_0__.FILE_MODAL();
  var OVelmnt = document.getElementById("overlay");
  OVelmnt.innerHTML = ovHTML;
}
function showIDBstate() {
  var ovHTML = _guiparts_js__WEBPACK_IMPORTED_MODULE_0__.IDB_INDEX();
  var OVelmnt = document.getElementById("overlay");
  OVelmnt.innerHTML = ovHTML;
  d3.select("#overlay").on("click", function (event) {
    closeModalIDB(event);
  });

  var _liHead = document.getElementById("idbstores");

  _liHead.innerHTML = "";
  var db;
  var mkeyList = new Map();
  var DB = new Promise(function (resolve, reject) {
    var request = indexedDB.open("wtTAM");

    request.onsuccess = function () {
      return resolve(request.result);
    };
  });
  var idbSlist = new Promise(function (resolve, reject) {
    DB.then(function (idb) {
      db = idb;
      var dbos = idb.objectStoreNames;

      var _dbos = Array.from(dbos);

      resolve(_dbos);
    });
  });
  idbSlist.then(function (snames) {
    var _snames = snames;
    snames.forEach(function (sname) {
      var liItem = document.createElement("li");
      liItem.classList = 'ulli';

      _liHead.appendChild(liItem);

      var param = document.createElement("p");
      param.innerHTML = sname;
      liItem.appendChild(param);
      var showButton = document.createElement('button');
      liItem.appendChild(showButton);
      showButton.innerHTML = '>';
      showButton.title = 'Click to Show Items'; // here we are setting a data attribute on our show button to say what task we want shown if it is clicked!

      showButton.setAttribute('key-task', sname);

      showButton.onclick = function (event) {
        showIDBkeys(event);
      }; // liItem itself will do nothing


      liItem.onclick = function (event) {
        event.stopPropagation();
      };
    });
    document.querySelector("#overlay").style.display = "inline";
  });
}

function showFromIDB(event) {
  var actNodeE = event.target;
  var dstring = event.target.getAttribute("show-task");
  event.stopPropagation();
  closeModalIDB();
  var dstrings = dstring.split("|");
  var dbName = "wtTAM";
  var dbStore = dstrings[0];
  var dbKey = dstrings[1];
  (0,_interfaces_js__WEBPACK_IMPORTED_MODULE_5__.loadDataFromIDB)(dbName, dbStore, dbKey);
}

function showIDBkeys(event) {
  var actNodeE = event.target;
  var actNode = actNodeE.parentNode;
  var sname = event.target.getAttribute("key-task");
  event.stopPropagation();
  var db;
  var DB = new Promise(function (resolve, reject) {
    var request = indexedDB.open("wtTAM");

    request.onsuccess = function () {
      db = request.result;
      showIDBkeysL(actNode, db, sname, actNodeE);
      resolve(db);
    };
  });
}

function showIDBkeysL(actNode, db, sname, actNodeE) {
  var DBtactn = new Promise(function (res, rej) {
    var taction = db.transaction(sname, "readonly");
    var ostore = taction.objectStore(sname);
    var req = ostore.openCursor();
    var _keyList = [];

    req.onsuccess = function (e) {
      var curs = e.target.result;

      if (curs) {
        var _key = curs.primaryKey;

        _keyList.push(_key);

        curs["continue"]();
      } else {
        showIDBkeysLdo(actNode, sname, _keyList, actNodeE);
      }
    };

    req.oncomplete = function (ev) {
      res(_keyList);
    };

    req.onerror = function (ev) {
      rej(ev);
    };
  });
}

function showIDBkeysLdo(actNode, sname, keyList, actNodeE) {
  var oliHead = document.createElement("ol");

  if (keyList.length > 0) {
    keyList.forEach(function (idbKey) {
      var oliItem = document.createElement("li"); // oliItem.innerHTML = ':';

      oliItem.classList = 'olli';
      oliHead.appendChild(oliItem);
      oliItem.title = 'Load from Store';
      var param = document.createElement("p");
      param.innerHTML = idbKey;
      oliItem.appendChild(param); // here we are setting a data attribute on our param to say what task we want done if it is clicked!

      param.setAttribute('show-task', sname + '|' + idbKey);

      param.onclick = function (event) {
        showFromIDB(event);
      };

      var delButton = document.createElement('button');
      oliItem.appendChild(delButton);
      delButton.innerHTML = 'E';
      delButton.title = 'Erase from Store'; // here we are setting a data attribute on our del button to say what task we want done if it is clicked!

      delButton.setAttribute('del-task', sname + '|' + idbKey);

      delButton.onclick = function (event) {
        delIDBkey(event);
      };
    });
  } else {
    var param = document.createElement("p"); // oliItem.innerHTML = ':';

    oliHead.appendChild(param);
    param.innerHTML = 'Number of entries in this Store: 0';
  }

  actNode.appendChild(oliHead);
  actNodeE.innerHTML = ''; // show button will be set inactiv

  actNodeE.onclick = function (event) {
    event.stopPropagation();
  };
}

/***/ }),

/***/ "./src/js/interfaces.js":
/*!******************************!*\
  !*** ./src/js/interfaces.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resetSVGLayers": () => (/* binding */ resetSVGLayers),
/* harmony export */   "onChangeFile": () => (/* binding */ onChangeFile),
/* harmony export */   "loadFileFromDisk": () => (/* binding */ loadFileFromDisk),
/* harmony export */   "loadDataFromIDB": () => (/* binding */ loadDataFromIDB),
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "processModalFileUpload": () => (/* binding */ processModalFileUpload),
/* harmony export */   "openNewTab": () => (/* binding */ openNewTab)
/* harmony export */ });
/* harmony import */ var _export_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./export.js */ "./src/js/export.js");
/* harmony import */ var _TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TAMrenderer.js */ "./src/js/TAMrenderer.js");
/* harmony import */ var _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TFMrenderer.js */ "./src/js/TFMrenderer.js");
/* harmony import */ var _TAHrenderer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TAHrenderer.js */ "./src/js/TAHrenderer.js");
/* harmony import */ var _gedcom_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gedcom.js */ "./src/js/gedcom.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
/* harmony import */ var _interaction_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./interaction.js */ "./src/js/interaction.js");
/* harmony import */ var _dbman_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dbman.js */ "./src/js/dbman.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils.js */ "./src/js/utils.js");
///////////////////////////////////////////////////////////////////////////////
//
// File open functionality added by Idefix2020
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Interface Management - Imports
//
///////////////////////////////////////////////////////////////////////////////




 // import { default as i18n } from "./i18n.js";





var tfmNodePositions = null;
var RENDERtype = {
  "TAMrenderer": 0,
  "TFMrenderer": 1,
  "TAHrenderer": 2
};
function resetSVGLayers(renderer) {
  var sSuff = renderer.get_sKENN();
  var sKENN = "#s" + sSuff;
  d3.select("#topolayer" + sSuff).remove();
  d3.select("#shadinglayer" + sSuff).remove();
  d3.select("#graphlayer" + sSuff).remove();

  try {
    d3.select("#bullseye").remove();
  } catch (error) {}
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) return;
  var act_parms = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GETall();
  var reader = new FileReader();
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER");
  var _rendertype = renderer.RENDERtype;
  var isTFMRenderer = _rendertype !== RENDERtype.TAMRenderer;
  var renderer_new = false;

  if (renderer) {
    var objRef = renderer.instance;
    objRef.SVG_DRAGABLE_ELEMENTS.on("mouseover", null).on("mouseenter", null).on("mousemove", null).on("mouseout", null);
  }

  var folder = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SOURCE_FOLDER");

  reader.onload = function (e, reader) {
    var url = e.target.result;
    _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("FILENAME", file.name);
    _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("FILE_FOLDER", folder);

    if (renderer) {
      renderer.FORCE_SIMULATION.stop();
      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
      resetSVGLayers(renderer);
    }

    if (file.name.endsWith(".json") || file.name.endsWith(".tam")) {
      if (_rendertype !== RENDERtype.TAMrenderer) {
        renderer = new _TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__.TAMRenderer();
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
        renderer_new = true;
        _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);
      } else {
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
        renderer.NODES = [];
        renderer.LINKS = [];
      }

      d3.json(url).then(function (json) {
        processJSON(json, file.name);
      });
      renderer.tickCounterTotal = 0;
      renderer.tickCounterCycles = 5;
    } else if (file.name.endsWith(".ged")) {
      if (_rendertype !== RENDERtype.TFMrenderer) {
        renderer = new _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer();
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
        renderer_new = true;
        _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);
      } else {
        var _objRef = renderer.instance;
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
        resetTFM(_objRef);
      }

      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.setDefaultParameters)();
      _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("SOURCE_FILE", file.name);
      (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.loadGedcom)(folder + "/" + file.name, function (gedcom, text) {
        (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.estimateMissingDates)(gedcom, _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("PROCREATION_AGE"));
        renderer.load_GRAPH_DATA(text);
        renderer.createFamilyForceGraph(gedcom);
        renderer.tickCounterTotal = 0;
        renderer.tickCounterCycles = 5;
      });
    } else if (file.name.endsWith(".tfm")) {
      if (_rendertype !== RENDERtype.TFMrenderer) {
        renderer = new _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer();
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
        renderer_new = true;
        _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);
      } else {
        var _objRef2 = renderer.instance;
        (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
        resetTFM(renderer);
      }

      d3.json(folder + "/" + file.name).then(function (json) {
        processTFM(json, folder);
      });
      renderer.tickCounterTotal = 0;
      renderer.tickCounterCycles = 5;
    } else console.error(i18n("U_f_t")); // "Unrecognized file type"

  };

  reader.readAsDataURL(file);
} // Reset TFMrenderer


function resetTFM(objRef) {
  objRef.resetScalarField(objRef);
  if (objRef.SVG_NODE_CIRCLES) objRef.SVG_NODE_CIRCLES.remove();
  if (objRef.SVG_LINKS) objRef.SVG_LINKS.remove();
  if (objRef.SVG_NODE_LABELS) objRef.SVG_NODE_LABELS.remove();
  if (objRef.SVG_DRAGABLE_ELEMENTS) objRef.SVG_DRAGABLE_ELEMENTS.remove();
  objRef.NODES = [];
  objRef.LINKS = [];
  objRef.PNODES = [];
  objRef.FNODES = [];
  objRef.LINKNODES = [];
  objRef.FAMILYLINKS = [];
} ///////////////////////////////////////////////////////////////////////////////
// Wrapper by rp


function onChangeFile(event) {
  var fileinput = document.getElementById("browse");
  var textinput = document.getElementById("filename");
  textinput.value = fileinput.files[0].name;
  readSingleFile(event);
} ///////////////////////////////////////////////////////////////////////////////
// load data, choose renderer based on the filetype and create force graph

function loadFileFromDisk(folder) {
  _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("SOURCE_FOLDER", folder);

  var _fileName = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("FILENAME");

  _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("SOURCE_FILE", _fileName);
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER");

  if (renderer) {
    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
    var objRef = renderer.instance;
    objRef.SVG_DRAGABLE_ELEMENTS.on("mouseover", null).on("mouseenter", null).on("mousemove", null).on("mouseout", null);
  } else {
    renderer = new _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer();
  }

  var _rendertype = renderer.RENDERtype;
  var isTFMRenderer = renderer instanceof _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer;
  var renderer_new = false;

  var _state = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("STATE");

  if (_fileName.endsWith(".json") || _fileName.endsWith(".tam")) {
    if (_rendertype !== RENDERtype.TAMrenderer) {
      renderer = new _TAMrenderer_js__WEBPACK_IMPORTED_MODULE_1__.TAMRenderer();
      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
      renderer_new = true;
      _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);
    }

    d3.json(folder + "/" + _fileName).then(function (json) {
      processJSON(json, _fileName);
      renderer.tickCounterTotal = 0;
      renderer.tickCounterCycles = 5;
    });
  } else if (_fileName.endsWith(".ged")) {
    if (_rendertype !== RENDERtype.TFMrenderer) {
      renderer = new _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer();
      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
      renderer_new = true;
      _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);
    }

    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.setDefaultParameters)();
    (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.loadGedcom)(folder + "/" + _fileName, function (gedcom, text) {
      var _states = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GETall();

      (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.estimateMissingDates)(gedcom, _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("PROCREATION_AGE"));
      renderer.load_GRAPH_DATA(text);
      renderer.createFamilyForceGraph(gedcom);
      renderer.tickCounterTotal = 0;
      renderer.tickCounterCycles = 5;
    });
  } else if (_fileName.endsWith(".tfm")) {
    if (_rendertype !== RENDERtype.TFMrenderer) {
      renderer = new _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer();
      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
      renderer_new = true;
      _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);
    }

    d3.json(folder + "/" + _fileName).then(function (json) {
      processTFM(json, folder);
    });
  } else {
    console.error(i18n("U_f_t")); // Unrecognized file type
  }
} // load data from indexedDB, choose renderer based on store-name and create force graph

function loadDataFromIDB(dbName, storeName, key) {
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER");

  if (renderer) {
    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
    var objRef = renderer.instance;
    objRef.SVG_DRAGABLE_ELEMENTS.on("mouseover", null).on("mouseenter", null).on("mousemove", null).on("mouseout", null);
  } else {
    renderer = new _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer();
  }

  var _rendertype = renderer.RENDERtype;
  var renderer_new = false;

  if (storeName == "H-Tree") {
    if (_rendertype !== RENDERtype.TAHrenderer) {
      renderer = new _TAHrenderer_js__WEBPACK_IMPORTED_MODULE_3__.TAHRenderer();
      (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
      renderer_new = true;
      _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);
    }

    var dbaction = (0,_dbman_js__WEBPACK_IMPORTED_MODULE_7__.readFromDB)(dbName, storeName, key);
    dbaction.then(function (value) {
      console.log(value);
      var content = [JSON.stringify({
        "metadata": value.metadata,
        "parameters": value.parameters,
        "nodes": value.nodes,
        "links": value.links
      }, null, 2)];
      processIDBH(value);
      renderer.tickCounterTotal = 0;
      renderer.tickCounterCycles = 5;
    })["catch"](function (err) {
      console.log(err);
    });
    return;
  }

  if (storeName == "TFMdata") {
    if (_rendertype == RENDERtype.TFMrenderer) {
      renderer = null;
    }

    renderer = new _TFMrenderer_js__WEBPACK_IMPORTED_MODULE_2__.TFMRenderer();
    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.toggleSVG)(renderer);
    renderer_new = true;
    _parms_js__WEBPACK_IMPORTED_MODULE_5__.oSET("RENDERER", renderer);

    var _dbaction = (0,_dbman_js__WEBPACK_IMPORTED_MODULE_7__.readFromDB)(dbName, storeName, key);

    _dbaction.then(function (value) {
      console.log(value);
      var content = [JSON.stringify({
        "metadata": value.metadata,
        "parameters": value.parameters,
        "nodePositions": value.nodePositions,
        "nodeData": value.nodeData
      }, null, 2)];
      processIDBtfm(value);
      renderer.tickCounterTotal = 0;
      renderer.tickCounterCycles = 5;
    })["catch"](function (err) {
      console.log(err);
    });

    return;
  }
} // Process JSON loaded from a .json or .tam,
// then create graph.

function processJSON(json, filename) {
  if ("parameters" in json) {
    console.log(i18n("L_pf_f")); // Loading parameters from file.

    (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.setParameters)(json.parameters);
  } else {
    console.log(i18n("F_dnc_p")); // File does not contain parameters

    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.setDefaultParameters)();
  }

  _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("SOURCE_FILE", filename);
  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER");
  renderer.createForceGraphJSON(json);
}

function processIDBH(dataset) {
  if ("parameters" in dataset) {
    console.log(i18n("L_pf_f")); // Loading parameters from file.

    (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.setParameters)(dataset.parameters);
  } else {
    console.log(i18n("F_dnc_p")); // File does not contain parameters

    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.setDefaultParameters)();
  }

  var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER");
  renderer.createPersonForceGraph(dataset);
}

function processIDBtfm(dataset) {
  if ("parameters" in dataset) {
    console.log(i18n("L_pf_f")); // Loading parameters from file.

    (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.setParameters)(dataset.parameters);
  } else {
    console.log(i18n("F_dnc_p")); // File does not contain parameters

    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.setDefaultParameters)();
  }

  var gedcom = dataset.nodeData;
  (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.processGedcom)(gedcom, function (gedcom, text) {
    (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.estimateMissingDates)(gedcom, _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("PROCREATION_AGE"));
    var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER");
    var objRef = renderer.instance;
    renderer.reset();
    renderer.load_GRAPH_DATA(text);
    renderer.initSVGLayers(objRef);
    renderer.createFamilyForceGraph(gedcom, dataset.nodePositions);
  });
} // Process JSON loaded from a .tfm, load linked .ged or
// ask user to upload .ged, then create graph.


function processTFM(json, folder) {
  // first try to load parameters from .tfm
  if ("parameters" in json) {
    console.log(i18n("L_pf_f")); // Loading parameters from file.

    (0,_export_js__WEBPACK_IMPORTED_MODULE_0__.setParameters)(json.parameters);
  } else {
    console.log(i18n("F_dnc_p")); // File does not contain parameters

    (0,_interaction_js__WEBPACK_IMPORTED_MODULE_6__.setDefaultParameters)();
  }

  var _sourceFile = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("SOURCE_FILE"); // parms.SOURCE_FILE is set by setParameters()


  var _sourcePath = folder + "/" + _sourceFile; // parms.SOURCE_FILE is set by setParameters()
  // then load the data file .ged


  (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.loadGedcom)(_sourcePath, function (gedcom, text) {
    (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.estimateMissingDates)(gedcom, _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("PROCREATION_AGE"));
    var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER"); // use node positions from .tfm (if available)

    renderer.load_GRAPH_DATA(text);

    if ("nodePositions" in json) {
      renderer.createFamilyForceGraph(gedcom, json.nodePositions);
    } else {
      renderer.createFamilyForceGraph(gedcom);
    }

    renderer.tickCounterTotal = 0;
    renderer.tickCounterCycles = 5;
  });
}

function checkFileExistence(url) {
  try {
    console.log(i18n("Ttl"), url); // Trying to load

    var req = new XMLHttpRequest();
    req.open("HEAD", url, false);
    req.send();
    return req.status != 404;
  } catch (error) {
    return false;
  }
}

function closeModal() {
  document.querySelector("#overlay").style.display = "none";
}

function showModal(missingFileName) {
  if (missingFileName) document.querySelector("#missing-ged-file-name").textContent = missingFileName;else document.querySelector("#missing-ged-file-name").textContent = i18n("unknown");
  document.querySelector("#overlay").style.display = "";
} // Loads the GEDCOM file and creates the graph


function processModalFileUpload() {
  var file = document.querySelector('#modal-file-upload').files[0];

  if (file) {
    closeModal();
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.loadGedcom)(reader.result, function (gedcom, text) {
        (0,_gedcom_js__WEBPACK_IMPORTED_MODULE_4__.estimateMissingDates)(gedcom, _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("PROCREATION_AGE"));
        _parms_js__WEBPACK_IMPORTED_MODULE_5__.SET("SOURCE_FILE", file.name);
        var renderer = _parms_js__WEBPACK_IMPORTED_MODULE_5__.oGET("RENDERER");
        renderer.load_GRAPH_DATA(text); // use previously stored node positions (if available)

        if (tfmNodePositions) renderer.createFamilyForceGraph(gedcom, tfmNodePositions);else renderer.createFamilyForceGraph(gedcom);
      });
    };
  }
} // Open special view - 

function openNewTab(pageName) {
  var _baseUrl = (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.getBaseURL)();

  var _isDev = _parms_js__WEBPACK_IMPORTED_MODULE_5__.GET("DEVMODE");

  var _pName = pageName;

  if (_isDev) {
    _pName += '-Dev';
  }

  _pName += ".html";

  var _Url = _baseUrl + "/" + _pName;

  window.open(_Url, "_blank");
}

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "main": () => (/* binding */ main),
/* harmony export */   "mainDB": () => (/* binding */ mainDB)
/* harmony export */ });
/* harmony import */ var _guiparts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./guiparts.js */ "./src/js/guiparts.js");
/* harmony import */ var _tickcounter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tickcounter.js */ "./src/js/tickcounter.js");
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interfaces.js */ "./src/js/interfaces.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
/* harmony import */ var _dbman_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dbman.js */ "./src/js/dbman.js");
///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2021 Reinhold Preiner
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Main script
//
///////////////////////////////////////////////////////////////////////////////





function main(folder, filename) {
  // For to be sure that all IDB-stores are ready for action ...
  (0,_dbman_js__WEBPACK_IMPORTED_MODULE_4__.testDBstore)("wtTAM", ["H-Tree", "TFMdata", "Gedcom"]);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("FILENAME", filename);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("SOURCE_FILE", filename); // original data source (e.g. ".ged" file), which will be referenced in ".tfm" files

  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("FOLDER", folder);
  prep_action(); // Load data and create force graph (see interfaces.js).
  // Uses folder and parms.FILENAME from above.

  (0,_interfaces_js__WEBPACK_IMPORTED_MODULE_2__.loadFileFromDisk)(folder);
}
function mainDB(stName) {
  prep_action();

  switch (stName) {
    case "H-Tree":
      var idbKey = localStorage.getItem("actH_tree");
      localStorage.removeItem("actH_tree");
      (0,_interfaces_js__WEBPACK_IMPORTED_MODULE_2__.loadDataFromIDB)("wtTAM", "H-Tree", idbKey);
  }
}

function prep_action() {
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("PROCREATION_AGE", 20);
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.SET("STATE", "INIT");
  _parms_js__WEBPACK_IMPORTED_MODULE_3__.oSET("RENDERER", null);
  var mbHTML = _guiparts_js__WEBPACK_IMPORTED_MODULE_0__.MENUBAR_html();
  var MBelmnt = document.getElementById("menubar");
  MBelmnt.innerHTML = mbHTML;
  var fmHTML = _guiparts_js__WEBPACK_IMPORTED_MODULE_0__.FILE_MODAL();
  var FMelmnt = document.getElementById("overlay");
  FMelmnt.innerHTML = fmHTML;
  var tcHTML = (0,_tickcounter_js__WEBPACK_IMPORTED_MODULE_1__.TICKCOUNTER_html)();
  var TCelmnt = document.getElementById("tickcountInfo");
  TCelmnt.innerHTML = tcHTML;
}

/***/ }),

/***/ "./src/js/parms.js":
/*!*************************!*\
  !*** ./src/js/parms.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InterpolationType": () => (/* binding */ InterpolationType),
/* harmony export */   "Sex": () => (/* binding */ Sex),
/* harmony export */   "H_shift": () => (/* binding */ H_shift),
/* harmony export */   "H_faktor": () => (/* binding */ H_faktor),
/* harmony export */   "H_gen": () => (/* binding */ H_gen),
/* harmony export */   "GET": () => (/* binding */ GET),
/* harmony export */   "TEST": () => (/* binding */ TEST),
/* harmony export */   "SET": () => (/* binding */ SET),
/* harmony export */   "oGET": () => (/* binding */ oGET),
/* harmony export */   "oSET": () => (/* binding */ oSET),
/* harmony export */   "TOGGLE": () => (/* binding */ TOGGLE),
/* harmony export */   "GETall": () => (/* binding */ GETall),
/* harmony export */   "tickLengthCheck": () => (/* binding */ tickLengthCheck),
/* harmony export */   "tickCounterCheck": () => (/* binding */ tickCounterCheck),
/* harmony export */   "tickCountCycles": () => (/* binding */ tickCountCycles),
/* harmony export */   "testTickLevel": () => (/* binding */ testTickLevel),
/* harmony export */   "getTickCount": () => (/* binding */ getTickCount),
/* harmony export */   "TClevel_down": () => (/* binding */ TClevel_down)
/* harmony export */ });
///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2021 Reinhold Preiner
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Parameters Management
//
///////////////////////////////////////////////////////////////////////////////
var InterpolationType = {
  'MIN': 1,
  'AVG': 2,
  'MAX': 3
};
var Sex = {
  'MALE': 1,
  'FEMALE': 2
};
var NODE_RADIUS = 10;
var PARMSarr = [// Load File
["FILENAME", ""], ["SOURCE_FILE", ""], // Save
// Interaction
["ENERGIZE", true], ["USE_MOUSEOVER", false], ["SHOW_YEARVALUES", false], ["SHOW_TOOLTIPS", true], ["TOOLTIP_DRAG_OPACITY", 0.5], // Force Simulation -- Force-Layout parameters
["GRAVITY_X", 0.06], ["GRAVITY_Y", 0.06], ["REPULSION_STRENGTH", 400], ["LINK_STRENGTH", 0.8], ["SF_STRENGTH", 0], ["FRICTION", 0.4], // Graph appearance
["SHOW_GRAPH", true], ["SHOW_LINKS", true], ["SHOW_NAMES", true], ["LINK_WIDTH", 2], ["NODE_RADIUS", NODE_RADIUS], ["PERSON_LABEL_OPACITY", 0.7], ["PERSON_LABELS_BELOW_NODE", true], // internal use only
// Map appearance
["SHOW_CONTOURS", false], ["REVERSE_COLORMAP", false], ["INTERPOLATE_NN", false], ["EMBED_LINKS", true], ["SHOW_TUNNELS", true], ["SHADING", true], ["SCALARFIELD_DILATION_ITERS", 2], ["RANGE_MIN", 0], // minimum value
["RANGE_MAX", 10], // maximum value
["CONTOUR_STEP", 10], // value range between contours
["CONTOUR_BIG_STEP", 50], // value range between thick contours
["INDICATOR_FONTSIZE", 15], ["INDICATOR_EPSILON", 0.1], // internal use only
["HEIGHT_SCALE", 50], ["SCALARFIELD_RESOLUTION", 400], ["LINK_SAMPLE_STEPSIZE", 2], ["UNDERGROUND_THRESHOLD", 10], // Others
["ALPHA", 0.5], // internal use only
["SF_INTERPOLATION_TYPE", InterpolationType.MIN], ["FONT_SIZE", 20], ["LINK_DISTANCE", 8 * NODE_RADIUS], ["LINK_OPACITY", 1], ["ARROW_RADIUS", 14], ["LABEL_COLOR", "black"], ["LINK_COLOR", "black"], // Scalarfield Appearance
["RENDER_UPDATE_INTERVAL", 2], // number of simulation updates before updating the tick visualization
["ARROW_DISTANCE_FACTOR", 1.0], // Contour Map Appearance 
["CONTOUR_WIDTH", 0.5], // pixel width of small contours
// Others
["MANY_SEEDS", true], ["ACTIVE_LOCALE", "de"], ["PROCREATION_AGE", 25], ["STATE", ""]];
var PARMS = new Map(PARMSarr);
var oPARMSarr = [// Scalarfield Appearance
["COLORMAP", d3.interpolateGnBu], // Nodes Appearance
["NODES_COLORMAP", d3.interpolateRainbow], // Others
["RENDERER", Object]];
var oPARMS = new Map(oPARMSarr); // Zielpositionen für H-Diagramm - 5 Vorfahren-Generationen

var H_shift = [[0, 0], // -dummy-
[0, 0], // kek  1          gen 0
[-4, 0.0], [4, 0.0], // kek  2- 3       gen 1
[-4, -2.7], [-4, 2.7], [4, -2.7], [4, 2.7], // kek  4- 7       gen 2
[-6, -3.0], [-2, -3.0], [-2, 3.0], [-6, 3.0], // kek  8-11       gen 3
[2, -3.0], [6, -3.0], [2, 3.0], [6, 3.0], // kek 12-15       ...
[-6, -4.0], [-6, -2.0], [-2, -4.0], [-2, -2.0], // kek 16-19       gen 4
[-2, 4.0], [-2, 2.0], [-6, 2.0], [-6, 4.0], // kek 20-23       ...
[2, -4.0], [2, -2.0], [6, -4 - 0], [6, -2.0], // kek 24-27       ...
[2, 4.0], [2, 2.0], [6, 4.0], [6, 2.0], // kek 28-31       ...
[-7, -4.6], [-5, -4.4], [-7, -1.4], [-5, -1.6], // kek 32-35       gen 5
[-3, -4.6], [-1, -4.4], [-1, -1.4], [-3, -1.6], // kek 36-39       ...
[-3, 4.6], [-1, 4.4], [-3, 1.6], [-1, 1.4], // kek 40-43       ...
[-7, 1.6], [-5, 1.4], [-7, 4.6], [-5, 4.4], // kek 44-47       ...
[1, -4.6], [3, -4.4], [1, -1.4], [3, -1.6], // kek 48-51       ...
[5, -4.6], [7, -4.4], [5, -1.6], [7, -1.4], // kek 52-55       ...
[1, 4.6], [3, 4.4], [1, 1.6], [3, 1.4], // kek 56-59       ...
[5, 4.6], [7, 4.4], [5, 1.6], [7, 1.4] // kek 60-63       ...
]; // Multiplikator Spreizung H-Diagramm

var H_faktor = 120; // Referenz Vorfahren-Generationen

var H_gen = 5;
function GET(key) {
  if (PARMS.has(key)) {
    return PARMS.get(key);
  } else if (oPARMS.has(key)) {
    return oPARMS.get(key);
  }

  return null;
}
function TEST(key) {
  return PARMS.has(key);
}
function SET(key, value) {
  PARMS.set(key, value);
}
function oGET(key) {
  if (oPARMS.has(key)) {
    return oPARMS.get(key);
  } else {
    return null;
  }
}
function oSET(key, value) {
  oPARMS.set(key, value);
}
function TOGGLE(key) {
  var boolV = PARMS.get(key);
  PARMS.set(key, !boolV);
}
function GETall() {
  return PARMS;
}
var tickLengthCheck = {
  'XXL': 2000,
  'XL': 1000,
  'L': 400,
  'M': 100,
  'min': 0
};
var tickCounterCheck = {
  'XXL': 50,
  'XL': 20,
  'L': 10,
  'M': 4,
  'min': 2
};
var tickCountCycles = {
  'XXL': 1,
  'XL': 1,
  'L': 1,
  'M': 1,
  'min': 1
};
function testTickLevel(_nLength) {
  var _tLevel = checkTickLevel(_nLength);

  SET("RENDERER_UPDATE_LEVEL", _tLevel.pref);

  var _tCount = getTickCount(_tLevel.pref);

  SET("RENDER_UPDATE_INTERVAL", _tCount);
  var _tickParms = {
    tLevelP: _tLevel.pref,
    tLevelV: _tLevel.val,
    tCount: _tCount.check,
    tCval: _tCount.val,
    tCycles: _tCount.cyc
  };
  return _tickParms;
}
/**
 * set tickcounter-Level depending on NODE.length - 'XXL' for large NODE-sets, 'min' is default
 */

function checkTickLevel(_nLength) {
  if (_nLength >= tickLengthCheck.XXL) return {
    pref: 'XXL',
    val: tickLengthCheck.XXL
  };
  if (_nLength >= tickLengthCheck.XL) return {
    pref: 'XL',
    val: tickLengthCheck.XL
  };
  if (_nLength >= tickLengthCheck.L) return {
    pref: 'L',
    val: tickLengthCheck.L
  };
  if (_nLength >= tickLengthCheck.M) return {
    pref: 'M',
    val: tickLengthCheck.M
  };
  return {
    pref: 'min',
    val: tickLengthCheck.min
  };
}
/**
 * gives the tickcounter-value for correspondig tickcounter-level
 */


function getTickCount(_nTc) {
  switch (_nTc) {
    case 'min':
      return {
        check: tickCounterCheck.min,
        val: tickLengthCheck.min,
        cyc: tickCountCycles.min
      };

    case 'M':
      return {
        check: tickCounterCheck.M,
        val: tickLengthCheck.M,
        cyc: tickCountCycles.M
      };

    case 'L':
      return {
        check: tickCounterCheck.L,
        val: tickLengthCheck.L,
        cyc: tickCountCycles.L
      };

    case 'XL':
      return {
        check: tickCounterCheck.XL,
        val: tickLengthCheck.XL,
        cyc: tickCountCycles.XL
      };

    case 'XXL':
      return {
        check: tickCounterCheck.XXL,
        val: tickLengthCheck.XXL,
        cyc: tickCountCycles.XXL
      };

    default:
      return {
        check: tickCounterCheck.min,
        val: tickLengthCheck.min,
        cyc: tickCountCycles.min
      };
  }
}
function TClevel_down(_nTc) {
  switch (_nTc) {
    case 'min':
      return 'min';

    case 'M':
      return 'min';

    case 'L':
      return 'M';

    case 'XL':
      return 'L';

    case 'XXL':
      return 'XL';

    default:
      return 'min';
  }
}

/***/ }),

/***/ "./src/js/scalarfield.js":
/*!*******************************!*\
  !*** ./src/js/scalarfield.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TopoMap": () => (/* binding */ TopoMap),
/* harmony export */   "GradientField": () => (/* binding */ GradientField),
/* harmony export */   "NormalField": () => (/* binding */ NormalField)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/js/utils.js");
/* harmony import */ var _parms_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parms.js */ "./src/js/parms.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } Object.defineProperty(subClass, "prototype", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
//
///////////////////////////////////////////////////////////////////////////////
// import { default as i18n } from "./i18n.js";


 ///////////////////////////////////////////////////////////////////////////////
// class Field

var Field = /*#__PURE__*/function () {
  function Field(width, height, defaultValue) {
    _classCallCheck(this, Field);

    this.width = width;
    this.height = height;
    this.values = new Array(width * height);
    this.values.fill(defaultValue);
  }

  _createClass(Field, [{
    key: "get",
    value: function get(x, y) {
      if (this.inRange(x, y)) return this.values[this.index(x, y)];
      return null;
    }
  }, {
    key: "set",
    value: function set(x, y, value) {
      if (this.inRange(x, y)) this.values[this.index(x, y)] = value;
    }
  }, {
    key: "index",
    value: function index(x, y) {
      return Math.trunc(y * this.width + x);
    }
  }, {
    key: "inRange",
    value: function inRange(x, y) {
      return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
  }]);

  return Field;
}(); ///////////////////////////////////////////////////////////////////////////////
// class TopoMap


var TopoMap = /*#__PURE__*/function (_Field) {
  _inherits(TopoMap, _Field);

  var _super = _createSuper(TopoMap);

  function TopoMap(data, interpolationType, resolution, dilationIters, xAccess, yAccess, valueAccess) {
    var _this;

    _classCallCheck(this, TopoMap);

    if (data == null) return _possibleConstructorReturn(_this, null); // specify undefined data accessors

    if (!xAccess) xAccess = function xAccess(p) {
      return p.x;
    };
    if (!yAccess) yAccess = function yAccess(p) {
      return p.y;
    };
    if (!valueAccess) valueAccess = function valueAccess(p) {
      return p.value;
    }; //--------------------------------------------------------------------
    // define field extent based on data
    // determine map size and required transformation properties

    var xmin = 1e20,
        ymin = 1e20,
        vmin = 1e20;
    var xmax = -1e20,
        ymax = -1e20,
        vmax = -1e20;
    data.forEach(function (p) {
      var x = xAccess(p);
      xmin = Math.min(xmin, x);
      xmax = Math.max(xmax, x);
      var y = yAccess(p);
      ymin = Math.min(ymin, y);
      ymax = Math.max(ymax, y);
      var value = valueAccess(p);
      vmin = Math.min(value, vmin);
      vmax = Math.max(value, vmax);
    }); // ("Value range in data: " + [vmin, vmax])

    console.log(i18n("V_range", {
      pvmi: vmin,
      pvmx: vmax
    })); // add some boundary

    var boundary = Math.min(xmax - xmin, ymax - ymin) * 0.15;
    xmin -= boundary;
    ymin -= boundary;
    ymax += boundary;
    xmax += boundary + _parms_js__WEBPACK_IMPORTED_MODULE_1__.GET("FONT_SIZE") * 5; // some more boundary to the right to account for text
    // define dimensions

    var cellSize = Math.max(xmax - xmin, ymax - ymin) / resolution;
    var width = Math.ceil((xmax - xmin) / cellSize);
    var height = Math.ceil((ymax - ymin) / cellSize); // ("Map dimensions: " + (xmax-xmin) + ", " + (ymax-ymin))

    console.log(i18n("M_dim", {
      pX: xmax - xmin,
      pY: ymax - ymin
    })); //--------------------------------------------------------------------
    // initialize class (defining 'this')

    _this = _super.call(this, width, height, 0);
    _this.xAccess = xAccess;
    _this.yAccess = yAccess;
    _this.valueAccess = valueAccess; // save transformation

    _this.origin = {
      "x": xmin,
      "y": ymin
    };
    _this.cellSize = cellSize; // create scalar field from points

    if (_parms_js__WEBPACK_IMPORTED_MODULE_1__.GET("INTERPOLATE_NN")) _this.interpolatePointsNaturalNeighbor(data, dilationIters, interpolationType);else _this.interpolatePointsDiffusion(data, dilationIters, interpolationType);
    return _this;
  }

  _createClass(TopoMap, [{
    key: "map",
    value: function map(x, y) {
      x = (x - this.origin.x) / this.cellSize;
      y = (y - this.origin.y) / this.cellSize;
      return {
        'x': x,
        'y': y
      };
    } // sampling with bilinear interpolation

  }, {
    key: "sampleBilinear",
    value: function sampleBilinear(x, y) {
      // map
      x = (x - this.origin.x) / this.cellSize;
      y = (y - this.origin.y) / this.cellSize;
      var x0 = Math.floor(x);
      var y0 = Math.floor(y);
      var x1 = x0 + 1;
      var y1 = y0 + 1;
      var tx = x - x0;
      var ty = y - y0;
      var v0 = this.get(x0, y0) * (1 - tx) + this.get(x1, y0) * tx;
      var v1 = this.get(x0, y1) * (1 - tx) + this.get(x1, y1) * tx;
      var value = v0 * (1 - ty) + v1 * ty;
      if (value == null) value = this.get(Math.round(x), Math.round(y));
      return value;
    }
  }, {
    key: "sampleNearestNeighbor",
    value: function sampleNearestNeighbor(x, y) {
      // map
      x = Math.round((x - this.origin.x) / this.cellSize);
      y = Math.round((y - this.origin.y) / this.cellSize);
      var value = this.get(x, y);
      return value;
    }
  }, {
    key: "interpolatePointsNaturalNeighbor",
    value: function interpolatePointsNaturalNeighbor(data, dilationIters, interpolationType) {
      var _this2 = this;

      var INIT_AVG = !_parms_js__WEBPACK_IMPORTED_MODULE_1__.GET("SHOW_TUNNELS"); // ("+++ Starting Natural Neighbors");

      console.log(i18n("S_NN"));
      this.values.fill(null);
      var flagField = new Field(this.width, this.height, 0);
      var front = []; // set constraint values
      //---------------------------------------------------------------
      // ("Setting Constraints");

      console.log(i18n("S_Cnstr"));
      data.forEach(function (p) {
        var value = _this2.valueAccess(p);

        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isNumber)(value)) return;
        var x = Math.round((_this2.xAccess(p) - _this2.origin.x) / _this2.cellSize);
        var y = Math.round((_this2.yAccess(p) - _this2.origin.y) / _this2.cellSize);

        var idx = _this2.index(x, y);

        if (flagField.values[idx] == 0) {
          _this2.values[idx] = value;
          flagField.values[idx] = 1;
          front.push([x, y]);
        } else if (INIT_AVG) {
          // averaging
          _this2.values[idx] += value;
          flagField.values[idx] += 1;
        } else {
          // if data is present in this cell, take max value
          _this2.values[idx] = Math.max(_this2.values[idx], value);
          flagField.values[idx] = 1;
        }
      });

      if (INIT_AVG) {
        for (var k = 0; k < this.values.length; k++) {
          var _sum = this.values[k];
          var count = flagField.values[k];

          if (_sum != null && count > 0) {
            this.values[k] /= count;
            flagField.values = 1;
          }
        }
      } // dilate constraint values
      //---------------------------------------------------------------
      // ("Dilate Constraints");


      console.log(i18n("D_Cnstr"));
      var dilatedField = new Field(this.width, this.height);

      for (var dIters = 0; dIters < dilationIters; dIters++) {
        dilatedField.values = this.values.slice(0);

        for (var x = 0; x < this.width; x++) {
          for (var y = 0; y < this.height; y++) {
            if (INIT_AVG) //--- FOR AVERAGING
              {
                if (flagField.get(x, y) == 0) {
                  var w0 = 0.25,
                      w1 = 0.125,
                      w2 = 0.0625;
                  var _w = 0;
                  var _sum2 = 0;

                  var _a = void 0;

                  _a = this.get(x - 1, y - 1);

                  if (_a != null) {
                    _sum2 += _a * w2;
                    _w += w2;
                  }

                  _a = this.get(x, y - 1);

                  if (_a != null) {
                    _sum2 += _a * w1;
                    _w += w1;
                  }

                  _a = this.get(x + 1, y - 1);

                  if (_a != null) {
                    _sum2 += _a * w2;
                    _w += w2;
                  }

                  _a = this.get(x - 1, y);

                  if (_a != null) {
                    _sum2 += _a * w1;
                    _w += w1;
                  }

                  _a = this.get(x, y);

                  if (_a != null) {
                    _sum2 += _a * w0;
                    _w += w0;
                  }

                  _a = this.get(x + 1, y);

                  if (_a != null) {
                    _sum2 += _a * w1;
                    _w += w1;
                  }

                  _a = this.get(x - 1, y + 1);

                  if (_a != null) {
                    _sum2 += _a * w2;
                    _w += w2;
                  }

                  _a = this.get(x, y + 1);

                  if (_a != null) {
                    _sum2 += _a * w1;
                    _w += w1;
                  }

                  _a = this.get(x + 1, y + 1);

                  if (_a != null) {
                    _sum2 += _a * w2;
                    _w += w2;
                  }

                  if (_w > 0) {
                    dilatedField.set(x, y, _sum2 / _w);
                    flagField.set(x, y, 1);
                    front.push([x, y]);
                  }
                }
              } else //--- FOR AVERAGING
              {
                var a_self = this.get(x, y);
                var _w2 = 0.25,
                    _w3 = 0.125,
                    _w4 = 0.0625;
                var _w5 = 0;
                var _sum3 = 0;

                var _a2 = void 0;

                _a2 = this.get(x - 1, y - 1);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w4;
                  _w5 += _w4;
                }

                _a2 = this.get(x, y - 1);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w3;
                  _w5 += _w3;
                }

                _a2 = this.get(x + 1, y - 1);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w4;
                  _w5 += _w4;
                }

                _a2 = this.get(x - 1, y);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w3;
                  _w5 += _w3;
                }

                _a2 = this.get(x, y);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w2;
                  _w5 += _w2;
                }

                _a2 = this.get(x + 1, y);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w3;
                  _w5 += _w3;
                }

                _a2 = this.get(x - 1, y + 1);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w4;
                  _w5 += _w4;
                }

                _a2 = this.get(x, y + 1);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w3;
                  _w5 += _w3;
                }

                _a2 = this.get(x + 1, y + 1);

                if (_a2 > a_self) {
                  _sum3 += _a2 * _w4;
                  _w5 += _w4;
                }

                if (_w5 > 0) {
                  dilatedField.set(x, y, _sum3 / _w5);
                  flagField.set(x, y, 1);
                  front.push([x, y]);
                }
              }
          }
        }

        this.values = dilatedField.values.slice(0); // copy thickened data back to current field   // TODO: SLICING NECESSARY????
      } // flood fill voronoi centers
      //---------------------------------------------------------------


      var offsets = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]; // init source field

      var srcField = new Field(this.width, this.height, null);

      for (var i = 0; i < front.length; i++) {
        var _front$i = _slicedToArray(front[i], 2),
            _x = _front$i[0],
            _y = _front$i[1];

        srcField.set(_x, _y, front[i]);
      } // propagate
      // ("Propagating");


      console.log(i18n("Prpg"));

      while (front.length > 0) {
        // look at each point in current propagation front
        var newFront = [];

        for (var _i2 = 0; _i2 < front.length; _i2++) {
          var _front$_i = _slicedToArray(front[_i2], 2),
              _x2 = _front$_i[0],
              _y2 = _front$_i[1];

          var value = this.get(_x2, _y2);
          var src = srcField.get(_x2, _y2); // propagate to neighbors

          for (var j = 0; j < offsets.length; j++) {
            var _offsets$j = _slicedToArray(offsets[j], 2),
                dx = _offsets$j[0],
                dy = _offsets$j[1];

            var xn = _x2 + dx;
            var yn = _y2 + dy;
            if (!this.inRange(xn, yn)) continue; // source that reached this neighbor

            var srcn = srcField.get(xn, yn); // update if neighbor doesn't contain data yet

            var update = srcn == null; // if neighbor already contains data, compare distance of this neighbor to its current source to this point's source

            if (!update) {
              var _src = _slicedToArray(src, 2),
                  xsrc = _src[0],
                  ysrc = _src[1];

              var _srcn = _slicedToArray(srcn, 2),
                  xsrcn = _srcn[0],
                  ysrcn = _srcn[1];

              var distFromNSrc = Math.sqrt(Math.pow(xn - xsrcn, 2) + Math.pow(yn - ysrcn, 2));
              var distFromMySrc = Math.sqrt(Math.pow(xn - xsrc, 2) + Math.pow(yn - ysrc, 2));
              update = distFromMySrc < distFromNSrc;
            }

            if (update) {
              // set own value and src in neighbor and set neighbor as new front point
              this.set(xn, yn, value);
              srcField.set(xn, yn, src);
              newFront.push([xn, yn]);
            }
          }
        } // set new front current


        front = newFront;
      } // Perform discrete Natural Neighbor Interpolation at certain subsampling points (performance!)
      //------------------------------------------------------------------------------------------------


      var INTERPOLATION_SUBSAMPLING = 4; // ("Interpolating ", this.width, " x ", this.height, ", 1/", INTERPOLATION_SUBSAMPLING, " Subsampling")

      console.log(i18n("Intrpl", {
        pw: this.width,
        ph: this.height,
        pIS: INTERPOLATION_SUBSAMPLING
      }));
      var indexField = new Field(this.width, this.height, null);
      var smoothedField = new Field(this.width, this.height);
      smoothedField.values = this.values.slice(0);
      var index = 0;

      for (var _xsrc = 0; _xsrc < this.width; _xsrc += INTERPOLATION_SUBSAMPLING) {
        console.log(".");

        for (var _ysrc = 0; _ysrc < this.height; _ysrc += INTERPOLATION_SUBSAMPLING, index++) {
          //-- simulate inserting this point as new Voronoi center
          //weightField.values.fill(null);
          indexField.set(_xsrc, _ysrc, index);
          front = [[_xsrc, _ysrc]];
          var totalArea = 1;
          var sumValues = this.get(_xsrc, _ysrc); //-- propagating

          while (front.length > 0) {
            // look at each point in current propagation front
            var _newFront = [];

            for (var _i3 = 0; _i3 < front.length; _i3++) {
              var _front$_i2 = _slicedToArray(front[_i3], 2),
                  _x3 = _front$_i2[0],
                  _y3 = _front$_i2[1]; // propagate to neighbors


              for (var _j = 0; _j < offsets.length; _j++) {
                var _offsets$_j = _slicedToArray(offsets[_j], 2),
                    _dx = _offsets$_j[0],
                    _dy = _offsets$_j[1];

                var _xn = _x3 + INTERPOLATION_SUBSAMPLING * _dx;

                var _yn = _y3 + INTERPOLATION_SUBSAMPLING * _dy;

                if (!this.inRange(_xn, _yn)) continue;
                var localIndex = indexField.get(_xn, _yn);

                if (localIndex != index) // not yet visited in current iteration
                  {
                    // source that reached this neigbhor
                    var _srcField$get = srcField.get(_xn, _yn),
                        _srcField$get2 = _slicedToArray(_srcField$get, 2),
                        _xsrcn = _srcField$get2[0],
                        _ysrcn = _srcField$get2[1]; // compare distance of this neighbor to its current source to this point's source


                    var _distFromNSrc = Math.sqrt(Math.pow(_xn - _xsrcn, 2) + Math.pow(_yn - _ysrcn, 2));

                    var _distFromMySrc = Math.sqrt(Math.pow(_xn - _xsrc, 2) + Math.pow(_yn - _ysrc, 2)); //console.log(distFromMySrc, " < ", distFromNSrc)


                    if (_distFromMySrc < _distFromNSrc) {
                      var _w6 = 1.0 / Math.sqrt(Math.sqrt(totalArea));

                      sumValues += _w6 * this.get(_xn, _yn);
                      totalArea += _w6; // mark cell as visited and push to new front

                      indexField.set(_xn, _yn, index);

                      _newFront.push([_xn, _yn]);
                    }
                  }
              }
            } // set new front current


            front = _newFront;
          } //-- finished propagation


          smoothedField.set(_xsrc, _ysrc, sumValues / totalArea);
          flagField.set(_xsrc, _ysrc, 2); // remember this is an intermediate source value (value 2)
        }
      } // copy back smoothed field


      this.values = smoothedField.values.slice(0); // diffuse
      //--------------------------------
      // ("Diffusing");

      console.log(i18n("Dffsng"));
      this.diffuse(flagField, interpolationType); // final smooth
      //---------------------------------------------------------------
      // ("Smoothing");

      console.log(i18n("Smthng"));

      for (var _i4 = 0; _i4 < 2 * INTERPOLATION_SUBSAMPLING; _i4++) {
        // smooth unconstrained pixels of current field
        var _smoothedField = new Field(this.width, this.height, 0);

        for (var _x4 = 0; _x4 < this.width; _x4++) {
          for (var _y4 = 0; _y4 < this.height; _y4++) {
            if (flagField.get(_x4, _y4) != 1) // smooth field value if not a constraint
              {
                var _w7 = 0.25,
                    _w8 = 0.125,
                    _w9 = 0.0625;
                var w = 0;
                var sum = 0;
                var a;
                {
                  a = this.get(_x4 - 1, _y4 - 1);

                  if (a != null) {
                    sum += a * _w9;
                    w += _w9;
                  }

                  a = this.get(_x4, _y4 - 1);

                  if (a != null) {
                    sum += a * _w8;
                    w += _w8;
                  }

                  a = this.get(_x4 + 1, _y4 - 1);

                  if (a != null) {
                    sum += a * _w9;
                    w += _w9;
                  }

                  a = this.get(_x4 - 1, _y4);

                  if (a != null) {
                    sum += a * _w8;
                    w += _w8;
                  }

                  a = this.get(_x4, _y4);

                  if (a != null) {
                    sum += a * _w7;
                    w += _w7;
                  }

                  a = this.get(_x4 + 1, _y4);

                  if (a != null) {
                    sum += a * _w8;
                    w += _w8;
                  }

                  a = this.get(_x4 - 1, _y4 + 1);

                  if (a != null) {
                    sum += a * _w9;
                    w += _w9;
                  }

                  a = this.get(_x4, _y4 + 1);

                  if (a != null) {
                    sum += a * _w8;
                    w += _w8;
                  }

                  a = this.get(_x4 + 1, _y4 + 1);

                  if (a != null) {
                    sum += a * _w9;
                    w += _w9;
                  }

                  _smoothedField.set(_x4, _y4, sum / w);
                }
              } else _smoothedField.set(_x4, _y4, this.get(_x4, _y4)); // copy hard constrained values - introduces artifcats!

          }
        }

        this.values = _smoothedField.values.slice(0); // copy smoothed data back to current field
      } // ("+++ Finished Diffusion");


      console.log(i18n("F_Dffsn"));
    }
  }, {
    key: "interpolatePointsDiffusion",
    value: function interpolatePointsDiffusion(data, dilationIters, interpolationType) {
      var _this3 = this;

      var INIT_AVG = false; //!parms.SHOW_TUNNELS;
      // ("+++ Starting Diffusion")

      console.log(i18n("S_Dffsn"));
      this.values.fill(null);
      var flagField = new Field(this.width, this.height, 0); // set constraint values
      //---------------------------------------------------------------
      // ("Setting Constraints")

      console.log(i18n("S_Cnstr"));
      data.forEach(function (p) {
        var value = _this3.valueAccess(p);

        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isNumber)(value)) return;
        var x = Math.round((_this3.xAccess(p) - _this3.origin.x) / _this3.cellSize);
        var y = Math.round((_this3.yAccess(p) - _this3.origin.y) / _this3.cellSize);

        var idx = _this3.index(x, y);

        if (flagField.values[idx] == 0) {
          _this3.values[idx] = value;
          flagField.values[idx] = 1;
        } else if (INIT_AVG) {
          // averaging
          _this3.values[idx] += value;
          flagField.values[idx] += 1;
        } else {
          // max value
          _this3.values[idx] = Math.max(_this3.values[idx], value);
          flagField.values[idx] = 1;
        }
      });

      if (INIT_AVG) {
        for (var k = 0; k < this.values.length; k++) {
          var sum = this.values[k];
          var count = flagField.values[k];
          if (sum != null && count > 0) this.values[k] /= count;
        }
      } // dilate constraint values
      //---------------------------------------------------------------
      // ("Dilate Constraints");


      console.log(i18n("D_Cnstr"));
      var dilatedField = new Field(this.width, this.height);

      for (var dIters = 0; dIters < dilationIters; dIters++) {
        dilatedField.values = this.values.slice(0);

        for (var x = 0; x < this.width; x++) {
          for (var y = 0; y < this.height; y++) {
            if (INIT_AVG) //--- FOR AVERAGING
              {
                if (flagField.get(x, y) == 0) {
                  var w0 = 0.25,
                      w1 = 0.125,
                      w2 = 0.0625;
                  var w = 0;
                  var _sum4 = 0;
                  var a = void 0;
                  a = this.get(x - 1, y - 1);

                  if (a != null) {
                    _sum4 += a * w2;
                    w += w2;
                  }

                  a = this.get(x, y - 1);

                  if (a != null) {
                    _sum4 += a * w1;
                    w += w1;
                  }

                  a = this.get(x + 1, y - 1);

                  if (a != null) {
                    _sum4 += a * w2;
                    w += w2;
                  }

                  a = this.get(x - 1, y);

                  if (a != null) {
                    _sum4 += a * w1;
                    w += w1;
                  }

                  a = this.get(x, y);

                  if (a != null) {
                    _sum4 += a * w0;
                    w += w0;
                  }

                  a = this.get(x + 1, y);

                  if (a != null) {
                    _sum4 += a * w1;
                    w += w1;
                  }

                  a = this.get(x - 1, y + 1);

                  if (a != null) {
                    _sum4 += a * w2;
                    w += w2;
                  }

                  a = this.get(x, y + 1);

                  if (a != null) {
                    _sum4 += a * w1;
                    w += w1;
                  }

                  a = this.get(x + 1, y + 1);

                  if (a != null) {
                    _sum4 += a * w2;
                    w += w2;
                  }

                  if (w > 0) {
                    dilatedField.set(x, y, _sum4 / w);
                    flagField.set(x, y, 1);
                  }
                }
              } else //--- FOR AVERAGING
              {
                var a_self = this.get(x, y);
                var _w10 = 0.25,
                    _w11 = 0.125,
                    _w12 = 0.0625;
                var _w13 = 0;
                var _sum5 = 0;

                var _a3 = void 0;

                _a3 = this.get(x - 1, y - 1);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w12;
                  _w13 += _w12;
                }

                _a3 = this.get(x, y - 1);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w11;
                  _w13 += _w11;
                }

                _a3 = this.get(x + 1, y - 1);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w12;
                  _w13 += _w12;
                }

                _a3 = this.get(x - 1, y);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w11;
                  _w13 += _w11;
                }

                _a3 = this.get(x, y);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w10;
                  _w13 += _w10;
                }

                _a3 = this.get(x + 1, y);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w11;
                  _w13 += _w11;
                }

                _a3 = this.get(x - 1, y + 1);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w12;
                  _w13 += _w12;
                }

                _a3 = this.get(x, y + 1);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w11;
                  _w13 += _w11;
                }

                _a3 = this.get(x + 1, y + 1);

                if (_a3 > a_self) {
                  _sum5 += _a3 * _w12;
                  _w13 += _w12;
                }

                if (_w13 > 0) {
                  dilatedField.set(x, y, _sum5 / _w13);
                  flagField.set(x, y, 1);
                }
              }
          }
        }

        this.values = dilatedField.values.slice(0); // copy thickened data back to current field   // TODO: SLICING NECESSARY????
      } // after setting hard constraints, diffuse


      this.diffuse(flagField, interpolationType); // ("+++ Finished Diffusion")

      console.log(i18n("F_Dffsn"));
    }
  }, {
    key: "diffuse",
    value: function diffuse(sourceField, interpolationType) {
      // Downsample
      //---------------------------------------------------------------
      console.log("Downsampling");
      var currentField = this;
      var currentFlags = sourceField; // marks hard constraints (heat sources) by 1, others 0

      var pyramid = [];
      var coarseField = new Field(Math.ceil(currentField.width / 2), Math.ceil(currentField.height / 2), 0);

      while (Math.max(currentField.width, currentField.height) > 1) {
        coarseField = new Field(Math.ceil(currentField.width / 2), Math.ceil(currentField.height / 2), 0);
        var coarseFlags = new Field(Math.ceil(currentField.width / 2), Math.ceil(currentField.height / 2), 0);

        for (var x = 0; x < coarseField.width; x++) {
          for (var y = 0; y < coarseField.height; y++) {
            var subc = [[2 * x, 2 * y], [2 * x + 1, 2 * y], [2 * x, 2 * y + 1], [2 * x + 1, 2 * y + 1]];
            var avg = 0,
                c = 0;
            var max = 0;
            var min = 1e20;
            var arr = [];

            for (var i = 0; i < 4; i++) {
              if (currentFlags.get(subc[i][0], subc[i][1])) {
                var cell_value = currentField.get(subc[i][0], subc[i][1]);
                min = Math.min(min, cell_value);
                max = Math.max(max, cell_value);
                avg += cell_value;
                c++;
                arr.push(cell_value);
              }
            }

            if (c > 0) {
              var value = max;

              switch (interpolationType) {
                case _parms_js__WEBPACK_IMPORTED_MODULE_1__.InterpolationType.MIN:
                  value = min;
                  break;

                case _parms_js__WEBPACK_IMPORTED_MODULE_1__.InterpolationType.MAX:
                  value = max;
                  break;

                case _parms_js__WEBPACK_IMPORTED_MODULE_1__.InterpolationType.AVG:
                  value = avg / c;
                  break;
              }

              coarseField.set(x, y, value);
              coarseFlags.set(x, y, 1);
            }
          }
        } // push current image onto pyramid


        pyramid.push([currentField, currentFlags]);
        currentField = coarseField;
        currentFlags = coarseFlags;
      } // Upsample
      //---------------------------------------------------------------


      console.log("Upsampling");

      while (pyramid.length > 0) {
        var tuple = pyramid.pop();
        currentField = tuple[0];
        currentFlags = tuple[1]; // fill holes using coarse field info

        for (var _x5 = 0; _x5 < currentField.width; _x5++) {
          for (var _y5 = 0; _y5 < currentField.height; _y5++) {
            // if (!currentFlags.get(x,y))   // HardConstraint all nonzero Flag Values
            if (currentFlags.get(_x5, _y5) != 1) // Only HardConstraint Flag Values 1 - others can be sources, but are overwritten when upsampled
              currentField.set(_x5, _y5, coarseField.get(Math.trunc(_x5 / 2), Math.trunc(_y5 / 2)));
          }
        } // smooth unconstrained pixels of current field


        var smoothedField = new Field(currentField.width, currentField.height, 0);

        for (var _x6 = 0; _x6 < currentField.width; _x6++) {
          for (var _y6 = 0; _y6 < currentField.height; _y6++) {
            var w0 = 0.25,
                w1 = 0.125,
                w2 = 0.0625;
            var w = 0;
            var sum = 0;
            var a = void 0;
            a = currentField.get(_x6 - 1, _y6 - 1);

            if (a != null) {
              sum += a * w2;
              w += w2;
            }

            a = currentField.get(_x6, _y6 - 1);

            if (a != null) {
              sum += a * w1;
              w += w1;
            }

            a = currentField.get(_x6 + 1, _y6 - 1);

            if (a != null) {
              sum += a * w2;
              w += w2;
            }

            a = currentField.get(_x6 - 1, _y6);

            if (a != null) {
              sum += a * w1;
              w += w1;
            }

            a = currentField.get(_x6, _y6);

            if (a != null) {
              sum += a * w0;
              w += w0;
            }

            a = currentField.get(_x6 + 1, _y6);

            if (a != null) {
              sum += a * w1;
              w += w1;
            }

            a = currentField.get(_x6 - 1, _y6 + 1);

            if (a != null) {
              sum += a * w2;
              w += w2;
            }

            a = currentField.get(_x6, _y6 + 1);

            if (a != null) {
              sum += a * w1;
              w += w1;
            }

            a = currentField.get(_x6 + 1, _y6 + 1);

            if (a != null) {
              sum += a * w2;
              w += w2;
            }

            smoothedField.set(_x6, _y6, sum / w);
          }
        }

        currentField.values = smoothedField.values.slice(0); // copy smoothed data back to current field

        coarseField = currentField;
      }
    }
  }, {
    key: "getContourPaths",
    value: function getContourPaths(thresholds) {
      // create contours
      return d3.contours().size([this.width, this.height]).thresholds(thresholds)(this.values);
    }
  }]);

  return TopoMap;
}(Field); ///////////////////////////////////////////////////////////////////////////////
// class GradientField
// defining a gradient field over a 2D scalar field, where the direction is 
// encoded in the (normalized) xy-coordinates

var GradientField = /*#__PURE__*/function (_Field2) {
  _inherits(GradientField, _Field2);

  var _super2 = _createSuper(GradientField);

  function GradientField(scalarField) {
    var _this4;

    _classCallCheck(this, GradientField);

    _this4 = _super2.call(this, scalarField.width, scalarField.height, new _utils_js__WEBPACK_IMPORTED_MODULE_0__.vec(0, 0, 0));

    for (var y = 1; y < _this4.height - 1; y++) {
      for (var x = 1; x < _this4.width - 1; x++) {
        var ddx = scalarField.get(x + 1, y) - scalarField.get(x - 1, y);
        var ddy = scalarField.get(x, y + 1) - scalarField.get(x, y - 1);
        var grad = new _utils_js__WEBPACK_IMPORTED_MODULE_0__.vec(ddx / 2, ddy / 2);

        _this4.set(x, y, grad);
      }
    } // extrapolate boundaries


    if (_this4.height > 1) for (var _x7 = 0; _x7 < _this4.width; _x7++) {
      _this4.set(_x7, 0, _this4.get(_x7, 1));

      _this4.set(_x7, _this4.height - 1, _this4.get(_x7, _this4.height - 2));
    }
    if (_this4.width > 1) for (var _y7 = 0; _y7 < _this4.height; _y7++) {
      _this4.set(0, _y7, _this4.get(1, _y7));

      _this4.set(_this4.width - 1, _y7, _this4.get(_this4.width - 2, _y7));
    }
    return _this4;
  } // sampling with bilinear interpolation


  _createClass(GradientField, [{
    key: "sampleBilinear",
    value: function sampleBilinear(x, y) {
      // map
      // get enclosing values
      var x0 = Math.floor(x);
      var y0 = Math.floor(y);
      var x1 = x0 + 1;
      var y1 = y0 + 1;
      var tx = x - x0;
      var ty = y - y0;
      var v00 = this.get(x0, y0);
      var v10 = this.get(x1, y0);
      var v01 = this.get(x0, y1);
      var v11 = this.get(x1, y1);
      if (!v00 || !v10 || !v01 || !v11) return null;
      var v0 = v00.mul(1 - tx).add(v10.mul(tx));
      var v1 = v01.mul(1 - tx).add(v11.mul(tx));
      var value = v0.mul(1 - ty).add(v1.mul(ty));
      if (isNaN(value.x) || isNaN(value.y)) value = this.get(Math.round(x), Math.round(y));
      return value;
    }
  }]);

  return GradientField;
}(Field); ///////////////////////////////////////////////////////////////////////////////
// class NormalField
// defining a field of normals over a 2D scalar field, where the field is embedded
// in the xy-plane, with scalar values extending to the z. direction. 
// The resulting normals will thus point upwards in positive z-direction.

var NormalField = /*#__PURE__*/function (_Field3) {
  _inherits(NormalField, _Field3);

  var _super3 = _createSuper(NormalField);

  function NormalField(scalarField, rangeToUnitFactor) {
    var _this5;

    _classCallCheck(this, NormalField);

    _this5 = _super3.call(this, scalarField.width, scalarField.height, new _utils_js__WEBPACK_IMPORTED_MODULE_0__.vec(0, 0, 0));

    for (var y = 1; y < _this5.height - 1; y++) {
      for (var x = 1; x < _this5.width - 1; x++) {
        var ddx = scalarField.get(x + 1, y) - scalarField.get(x - 1, y);
        var ddy = scalarField.get(x, y + 1) - scalarField.get(x, y - 1);
        var ds = 2 * scalarField.cellSize;
        var tx = new _utils_js__WEBPACK_IMPORTED_MODULE_0__.vec(ds, 0, ddx * rangeToUnitFactor);
        var ty = new _utils_js__WEBPACK_IMPORTED_MODULE_0__.vec(0, ds, ddy * rangeToUnitFactor);
        var n = tx.cross(ty).normalize();

        _this5.set(x, y, n);
      }
    } // extrapolate boundaries


    if (_this5.height > 1) for (var _x8 = 0; _x8 < _this5.width; _x8++) {
      _this5.set(_x8, 0, _this5.get(_x8, 1));

      _this5.set(_x8, _this5.height - 1, _this5.get(_x8, _this5.height - 2));
    }
    if (_this5.width > 1) for (var _y8 = 0; _y8 < _this5.height; _y8++) {
      _this5.set(0, _y8, _this5.get(1, _y8));

      _this5.set(_this5.width - 1, _y8, _this5.get(_this5.width - 2, _y8));
    }
    return _this5;
  } // lightdir: inverse vector of traveling direction of parallel light rays


  _createClass(NormalField, [{
    key: "getShadingContourPaths",
    value: function getShadingContourPaths(lightdir) {
      // encodes the shadowing of the field (higher is darker)
      var shadowField = new Field(this.width, this.height, 0);

      for (var k = 0; k < this.values.length; k++) {
        var N = this.values[k];
        var lambert = Math.max(0, N.dot(lightdir));
        shadowField.values[k] = 1 - lambert; // we want contours at where shadow is, not where light is
      } // create contours


      return d3.contours().size([this.width, this.height]).thresholds(d3.range(0, 1, 0.05))(shadowField.values);
    }
  }]);

  return NormalField;
}(Field);

/***/ }),

/***/ "./src/js/tickcounter.js":
/*!*******************************!*\
  !*** ./src/js/tickcounter.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TICKCOUNTER_html": () => (/* binding */ TICKCOUNTER_html)
/* harmony export */ });
///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
//
///////////////////////////////////////////////////////////////////////////////
function TICKCOUNTER_html() {
  var html_tc = "\n\t<div class=\"title\">\n\t\tTickcounter Information\n\t\t<span id=\"tClevel\" class=\"version\">_</span>\n\t</div>\n\t<fieldset>\n\t\t<legend><label class=\"toggler\" for=\"toggle_tcI\">Kennwerte</label></legend>\n\t\t<input class=\"menu_toggler\" type=\"checkbox\" id=\"toggle_tcI\" checked=\"\" hidden=\"\" />\n\t\t<table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n\t\t\t<tbody>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">Num Nodes</td>\n\t\t\t\t\t<td class=\"paramL\" id=\"tcinfo_ncount\">_</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">tickcount Level</td>\n\t\t\t\t\t<td class=\"paramL\" id=\"tcinfo_level\">_</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">tickcount Check</td>\n\t\t\t\t\t<td class=\"paramL\" id=\"tcinfo_check\">_</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">tickcount Cycles</td>\n\t\t\t\t\t<td class=\"paramL\" id=\"tcinfo_cycles\">_</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"paramlabel\">tickcount Modulo</td>\n\t\t\t\t\t<td class=\"paramL\" id=\"tcinfo_modvalue\">_</td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n\t</fieldset>\n\t<fieldset>\n\t\t<legend><label>tickcounter Reset</label></legend>\n\t\t<table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n\t\t\t<tr>\n\t\t\t\t<td class=\"paramlabel\">\n\t\t\t\t\t<input class=\"button\" type=\"button\" style=\"border:1px solid gray\" value=\"Reset to 'min'\" id=\"btn_tcIreset\" />\n\t\t\t\t</td>\n\t\t\t\t<td class=\"paramL\" id=\"tcinfo_cnts\">_</td>\n\t\t\t</tr>\n\t\t</table>\n\t</fieldset>\n    <fieldset>\n    <legend><label class=\"toggler\" for=\"toggle_trf\">Transform</label></legend>\n    <input class=\"menu_toggler\" type=\"checkbox\" id=\"toggle_trf\" checked=\"\" hidden=\"\" />\n    <table class=\"menu\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">\n        <tbody>\n            <tr>\n                <td class=\"paramlabel\">canvas width</td>\n                <td class=\"paramL\" id=\"trfinfo_cw\">_</td>\n            </tr>\n            <tr>\n                <td class=\"paramlabel\">canvas height</td>\n                <td class=\"paramL\" id=\"trfinfo_ch\">_</td>\n            </tr>\n            <tr>\n                <td class=\"paramlabel\">transform X</td>\n                <td class=\"paramL\" id=\"trfinfo_x\">_</td>\n            </tr>\n            <tr>\n                <td class=\"paramlabel\">transform Y</td>\n                <td class=\"paramL\" id=\"trfinfo_y\">_</td>\n            </tr>\n            <tr>\n                <td class=\"paramlabel\">transform Scale</td>\n                <td class=\"paramL\" id=\"trfinfo_scale\">_</td>\n            </tr>\n        </tbody>\n    </table>\n    </fieldset>";
  return html_tc;
}

/***/ }),

/***/ "./src/js/translations.js":
/*!********************************!*\
  !*** ./src/js/translations.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "switch_locale": () => (/* binding */ switch_locale)
/* harmony export */ });
///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2021 Reinhold Preiner
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
//
///////////////////////////////////////////////////////////////////////////////
// import {default as i18n} from "./i18n.js";
var text_en = "{\"values\":{\n                    \"Yes\": \"Yes\",\n                    \"No\": \"No\",\n                    \"Ok\": \"Ok\",\n                    \"Cancel\": \"Cancel\",\n                    \"unknown\": \"unknown\",\n                    \"birth\": \"Birth: \",\n                    \"death\": \"Death: \",\n                    \"age\": \"Age: \",\n                    \"gen\": \"Generation: \",\n                    \"mother\": \"Mother: \",\n                    \"father\": \"Father: \",\n                    \"wife\": \"Wife: \",\n                    \"husband\": \"Husband: \",\n                    \"marriage\": \"Marriage: \",\n                    \"children\": \"Children: \",\n                    \"Fchild\": \"First child: \",\n                    \"U_f_t\" : \"Unrecognized file type\",\n                    \"L_pf_f\" : \"Loading parameters from file.\",\n                    \"F_dnc_p\" : \"File does not contain parameters.\",\n                    \"C_nfG_f\" : \"Couldn't find GEDCOM file\",\n                    \"Ttl\": \"Trying to load\",\n                    \"L_Xp_Xf\": \"Loaded %{nP} persons in %{nF} families\",\n                    \"M_bdo_we\": \"Missing birth date of %{pFN} was estimated %{pbd}\",\n                    \"S_mbd_o\": \"Still missing birth date of %{pFN}\",\n                    \"LS_i_u\": \"Source %{pls} is undefined!\",\n                    \"LT_i_u\": \"Target %{plt} is undefined!\",\n                    \"C_Gw_Xn_Xl\": \"Created Graph with %{pNl} nodes and %{pLl} links.\",\n                    \"Tci_Xn_tCp\": \"TickCounter initialized: %{pNl} nodes -> Level:%{pLl}, ControlValue:%{pCnt}, Cycles:%{pCyc}, Threshold:%{pTh}.\",\n                    \"F_G_I\": \"Force Graph Initialized.\",\n                    \"SVG_E_i\": \"SVG Elements Initialized.\",\n                    \"Int_i\": \"Interactions Initialized.\",\n                    \"Top_l\": \"%{ptpl} Topopoints\", \n                    \"Ext_C\": \"Extracting Contours\",\n                    \"Cre_T\": \"Creating Tunnels\",\n                    \"Add_C\": \"Adding Contours\",\n                    \"Add_HI\": \"Adding Height Indicators\",\n                    \"Comp_NF\": \"Computing Normal Field\",\n                    \"Ext_SCP\": \"Extracting Shading Contour Paths\",\n                    \"Add_SL\": \"Adding Shading Layer\",\n                    \"Done_uSF\": \"+++ Done Updating ScalarField\",\n                    \"U_parm\": \"Unknown parameter %{pk}:%{pv}\",\n                    \"L_dpf\": \"Loading default parameters for %{pTr}.\",\n                    \"V_range\": \"Value range in data: %{pvmi},%{pvmx}\",\n                    \"M_dim\": \"Map dimensions: %{pX}, %{pY}\",\n                    \"S_NN\": \"+++ Starting Natural Neighbors\",\n                    \"S_Cnstr\": \"Setting Constraints\",\n                    \"D_Cnstr\": \"Dilate Constraints\",\n                    \"Prpg\": \"Propagating\",\n                    \"Intrpl\": \"Interpolating %{pw} x %{ph}, 1/%{pIS} Subsampling\",\n                    \"Dffsng\": \"Diffusing\",\n                    \"Smthng\": \"Smoothing\",\n                    \"S_Dffsn\": \"+++ Starting Diffusion\",\n                    \"F_Dffsn\": \"+++ Finished Diffusion\",\n                    \"language\": \"Language\",\n                    \"mb_OpSt\": \"Open / Store\",\n                    \"mb_Open\": \"Read ...\",\n                    \"mb_Store\": \"Write ...\",\n                    \"mb_lIDB\": \"from IDB\",\n                    \"mb_lF\": \"from File\",\n                    \"mb_sF\": \"to File\",\n                    \"mb_sIDB\": \"to IDB\",\n                    \"mb_sSVG\": \"SVG-Imag E\",\n                    \"mb_ntrct\": \"Interaction\",\n                    \"mb_Frz\": \"<u>F</u>reeze\",\n                    \"mb_HghlC\": \"<u>H</u>ighlight Contour\",\n                    \"mb_sYV\": \"Show <u>Y</u>ear Value\",\n                    \"mb_sNI\": \"Show Node <u>I</u>nfo\",\n                    \"mb_sTC\": \"Show Tick<u>C</u>ounter Information\",\n                    \"mb_GA\": \"Graph Appearance\",\n                    \"mb_SG\": \"Show <u>G</u>raph\",\n                    \"mb_SL\": \"Show <u>L</u>inks\",\n                    \"mb_SN\": \"Show <u>N</u>ames\",\n                    \"mb_LW\": \"Link Width:\",\n                    \"mb_NR\": \"Node Radius:\",\n                    \"mb_NLO\": \"Node Label Opacity:\",\n                    \"mb_MA\": \"Map Appearance\",\n                    \"mb_SM\": \"Show <u>M</u>ap\",\n                    \"mb_RC\": \"<u>R</u>everse Colormap\",\n                    \"mb_INN\": \"Interpolate NN\",\n                    \"mb_EL\": \"Embed Links\",\n                    \"mb_ST\": \"Show <u>T</u>unnels\",\n                    \"mb_ES\": \"Enable <u>S</u>hading\",\n                    \"mb_DD\": \"Dilation Degree:\",\n                    \"mb_MinRV\": \"Min Range Value:\",\n                    \"mb_MaxRV\": \"Max Range Value:\",\n                    \"mb_CS\": \"Contour Step:\",\n                    \"mb_CSb\": \"Big Contour Step:\",\n                    \"mb_IS\": \"Indicator Size\",\n                    \"mb_HScl\": \"Height Scale:\",\n                    \"mb_Res\": \"Resolution:\",\n                    \"mb_LSS\": \"Link Sample Step:\",\n                    \"mb_UT\": \"Underground Thresh:\",\n                    \"kc_Y\": \"Y\",\n                    \"kc_M\": \"M\",\n                    \"ZZZZ\": \"en\"\n            }}";
var text_de = "{\"values\":{\n                    \"Yes\": \"Ja\",\n                    \"No\": \"Nein\",\n                    \"Ok\": \"Ok\",\n                    \"Cancel\": \"Abbruch\",\n                    \"unknown\": \"-unbekannt-\",\n                    \"birth\": \"geboren: \",\n                    \"death\": \"gestorben: \",\n                    \"age\": \"Alter: \",\n                    \"gen\": \"Generation: \",\n                    \"mother\": \"Mutter: \",\n                    \"father\": \"Vater: \",\n                    \"wife\": \"Ehefrau: \",\n                    \"husband\": \"Ehemann: \",\n                    \"marriage\": \"Hochzeit: \",\n                    \"children\": \"Anz.Kinder: \",\n                    \"Fchild\": \"1. Kind: \",\n                    \"U_f_t\" : \"Datei-Typ nicht erkannt\",\n                    \"L_pf_f\" : \"Parameter werden gelesen.\",\n                    \"F_dnc_p\" : \"Keine Parameter in Datei.\",\n                    \"C_nfG_f\" : \"GEDcom-Datei nicht gefunden\",\n                    \"Ttl\": \"Versuche zu laden ...\",\n                    \"L_Xp_Xf\": \"%{nP} Personen in %{nF} Familien geladen\",\n                    \"M_bdo_we\": \"%{pFN} - Datum Geburt fehlt -> gesch\xE4tzt: %{pbd}\",\n                    \"LS_i_u\": \"Link-Quelle %{pls} nicht definiert!\",\n                    \"LT_i_u\": \"Link-Ziel %{plt} nicht definiert!\",\n                    \"S_mbd_o\": \"%{pFN} - Datum Geburt konnte nicht gesetzt werden\",\n                    \"C_Gw_Xn_Xl\": \"Graph erzeugt - %{pNl} Nodes und %{pLl} Links.\",\n                    \"Tci_Xn_tCp\": \"TickCounter initialisiert: %{pNl} Nodes -> Level:%{pLl}, Kontrollwert:%{pCnt}, Cyclen:%{pCyc}, Schwellwert:%{pTh}.\",\n                    \"F_G_I\": \"Force Graph initialisiert.\",\n                    \"SVG_E_i\": \"SVG Elemente initialisiert.\",\n                    \"Int_i\": \"Interaktive Elemente initialisiert.\",\n                    \"Top_l\": \"%{ptpl} Topopoints\", \n                    \"Ext_C\": \"Konturen werden ermittelt\",\n                    \"Cre_T\": \"Tunnel werden erzeugt\",\n                    \"Add_C\": \"Konturen werden sichtbar gemacht\",\n                    \"Add_HI\": \"H\xF6henwerte werden sichtbar gemacht\",\n                    \"Comp_NF\": \"Berechne Normalen-Feld\",\n                    \"Ext_SCP\": \"Verschattungen werden ermittelt\",\n                    \"Add_SL\": \"Layer Verschattungen wird sichtbar gemacht\",\n                    \"Done_uSF\": \"+++ Update ScalarFeld abgeschlossen\",\n                    \"U_parm\": \"Parameter %{pk}:%{pv} unbekannt\",\n                    \"L_dpf\": \"Default Parameter f\xFCr %{pTr} werden geladen\",\n                    \"V_range\": \"Werte-Bereich: %{pvmi},%{pvmx}\",\n                    \"M_dim\": \"Karte Ausdehnung -  x:%{pX}, y:%{pY}\",\n                    \"S_NN\": \"+++ Natural Neighbors - Start\",\n                    \"S_Cnstr\": \"Setze Randbedingungen\",\n                    \"D_Cnstr\": \"Dilatation Randbedingungen\",\n                    \"Prpg\": \"Ausbreitung l\xE4uft\",\n                    \"Intrpl\": \"Interpolation l\xE4uft - %{pw} x %{ph}, 1/%{pIS} Subsampling\",\n                    \"Dffsng\": \"Verbreitung l\xE4uft\",\n                    \"Smthng\": \"Gl\xE4ttung l\xE4uft\",\n                    \"S_Dffsn\": \"+++ Verbreitung beginnt\",\n                    \"F_Dffsn\": \"+++ Verbreitung abgeschlossen\",\n                    \"language\": \"Sprache\",\n                    \"mb_lIDB\": \"aus IDB\",\n                    \"mb_lF\": \"von Datei\",\n                    \"mb_sF\": \"in Datei\",\n                    \"mb_sIDB\": \"in IDB\",\n                    \"mb_sSVG\": \"als SVG-Imag E\",\n                    \"mb_OpSt\": \"\xD6ffnen / Speichern\",\n                    \"mb_Open\": \"Lesen ...\",\n                    \"mb_Store\": \"Schreiben ...\",\n                    \"mb_SF\": \"Speichern\",\n                    \"mb_ntrct\": \"Darstellung\",\n                    \"mb_Frz\": \"ein<u>F</u>rieren\",\n                    \"mb_HghlC\": \"<u>H</u>ervorheben Konturen\",\n                    \"mb_sYV\": \"<u>J</u>ahr zu Kontur zeigen\",\n                    \"mb_sNI\": \"Node <u>I</u>nfo zeigen\",\n                    \"mb_sTC\": \"Tick<u>C</u>ounter Information zeigen\",\n                    \"mb_GA\": \"Graph Darstellung\",\n                    \"mb_SG\": \"<u>G</u>raph zeigen\",\n                    \"mb_SL\": \"<u>L</u>inks zeigen\",\n                    \"mb_SN\": \"<u>N</u>amen zeigen\",\n                    \"mb_LW\": \"Link Intensit\xE4t:\",\n                    \"mb_NR\": \"Node Radius:\",\n                    \"mb_NLO\": \"Node Text Deckkraft:\",\n                    \"mb_MA\": \"Karte Darstellung\",\n                    \"mb_SM\": \"Zeige <u>K</u>arte\",\n                    \"mb_RC\": \"Farben inve<u>R</u>tieren\",\n                    \"mb_INN\": \"Interpolieren NN\",\n                    \"mb_EL\": \"Links einbetten\",\n                    \"mb_ST\": \"<u>T</u>unnel zeigen\",\n                    \"mb_ES\": \"<u>S</u>chatten aktiv\",\n                    \"mb_DD\": \"Erweiterung Stufe:\",\n                    \"mb_MinRV\": \"Minimum Wertebereich:\",\n                    \"mb_MaxRV\": \"Maximum Wertebereich:\",\n                    \"mb_CS\": \"Abstufung H\xF6henlinien:\",\n                    \"mb_CSb\": \"Abst. H\xF6henlinien B:\",\n                    \"mb_IS\": \"Gr\xF6\xDFe H\xF6henlinien-Text\",\n                    \"mb_HScl\": \"H\xF6hen-Skala:\",\n                    \"mb_Res\": \"Aufl\xF6sung:\",\n                    \"mb_LSS\": \"Link Sample Step:\",\n                    \"mb_UT\": \"Hintergrund Schwellw.:\",\n                    \"kc_Y\": \"J\",\n                    \"kc_M\": \"K\",\n                    \"ZZZZ\": \"de\"\n            }}";
function switch_locale(_locale) {
  var _text = '';

  switch (_locale) {
    case 'de':
      _text = text_de;
      break;

    default:
      _text = text_en;
  } // Prepare - remove newlines and double whitespaces to get proper JSON-ready text


  _text = _text.replace(/[\r]/g, '');
  _text = _text.replace(/ {2,}/g, ' '); // Parse it

  var data = JSON.parse(_text); // Clear previous state

  i18n.translator.reset(); // Set the data

  i18n.translator.add(data);
}
switch_locale('de');

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "vec": () => (/* binding */ vec),
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "jiggle": () => (/* binding */ jiggle),
/* harmony export */   "darken": () => (/* binding */ darken),
/* harmony export */   "brighten": () => (/* binding */ brighten),
/* harmony export */   "timestamp": () => (/* binding */ timestamp),
/* harmony export */   "getBaseURL": () => (/* binding */ getBaseURL),
/* harmony export */   "cleanDOM": () => (/* binding */ cleanDOM)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

//////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// 'timestamp' added by huhwt
// 'getBaseURL' added by huhwt
//
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// class vec
var vec = /*#__PURE__*/function () {
  function vec() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, vec);

    this.x = x;
    this.y = y;
    this.z = z;
  }

  _createClass(vec, [{
    key: "norm",
    value: function norm() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var il = 1.0 / this.norm();
      return new vec(this.x * il, this.y * il, this.z * il);
    }
  }, {
    key: "zero",
    value: function zero() {
      return this.x == 0 && this.y == 0 && this.z == 0;
    }
  }, {
    key: "cross",
    value: function cross(v) {
      return new vec(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    } // invert orientation

  }, {
    key: "negate",
    value: function negate() {
      return new vec(-this.x, -this.y, -this.z);
    }
  }, {
    key: "add",
    value: function add(v) {
      return new vec(this.x + v.x, this.y + v.y, this.z + v.z);
    }
  }, {
    key: "sub",
    value: function sub(v) {
      return new vec(this.x - v.x, this.y - v.y, this.z - v.z);
    }
  }, {
    key: "div",
    value: function div(s) {
      return new vec(this.x / s, this.y / s, this.z / s);
    }
  }, {
    key: "mul",
    value: function mul(s) {
      return new vec(this.x * s, this.y * s, this.z * s);
    }
  }], [{
    key: "copy",
    value: function copy(other) {
      var x = other.x ? other.x : 0;
      var y = other.y ? other.y : 0;
      var z = other.z ? other.z : 0;
      return new vec(x, y, z);
    }
  }]);

  return vec;
}(); ///////////////////////////////////////////////////////////////////////////////
// other functions

function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
function isNumber(val) {
  return typeof val == "number";
}
function jiggle() {
  var epsilon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-6;
  return epsilon * (Math.random() - 0.5) || epsilon;
}
function darken(col) {
  col = d3.hsl(col);
  col.l -= 0.1;
  col = d3.rgb(col.toString());
  col.r *= 0.9;
  col.g *= 0.9;
  col.b *= 0.9;
  return col.toString();
}
function brighten(col, factor) {
  col = d3.hsl(col);
  col = d3.rgb(col.toString());
  col.r *= 1 + factor;
  col.g *= 1 + factor;
  col.b *= 1 + factor;
  return col.toString();
}
function timestamp() {
  var ndate = Date.now();
  var today = new Date(ndate);
  return today;
}
function getBaseURL() {
  var loc = window.location;
  console.log(window.location, window.location.origin); // EW.Mod ... print origin

  var baseURL = loc.protocol + "//" + loc.hostname;
  if (typeof loc.port !== "undefined" && loc.port !== "") baseURL += ":" + loc.port;
  return baseURL;
}
function cleanDOM(_DOMelem) {
  if (_DOMelem) {
    var _ce = _DOMelem[0][0];

    while (_ce.firstChild) {
      _ce.removeChild(_ce.lastChild);
    }
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.js */ "./src/js/main.js");


function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function () {
  var idbKey = localStorage.getItem("actH_tree");

  if (idbKey) {
    (0,_main_js__WEBPACK_IMPORTED_MODULE_0__.mainDB)("H-Tree");
  } else {
    (0,_main_js__WEBPACK_IMPORTED_MODULE_0__.main)("./data", "MA.ged");
  }
});
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=tamv6.js.map