function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { attach, nodeArray, offset, loopObject, Event } from 'meteora';

var Lazy = /*#__PURE__*/function () {
  function Lazy() {
    var _this = this;

    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-src]';
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    _classCallCheck(this, Lazy);

    this.selector = selector;
    this.images = {};
    this.cache = [];
    this.event = new Event('resize');
    this.offset = offset;
    this.view = {
      top: window.pageYOffset,
      bottom: window.pageYOffset + window.innerHeight
    };
    setTimeout(function () {
      nodeArray(document.querySelectorAll(_this.selector)).forEach(function (element, index) {
        return _this.load(element, index);
      });
      attach(window, 'scroll', function () {
        return _this.observe();
      }, 250);
      attach(window, 'resize', function () {
        _this.observe();

        _this.resize();
      }, 250);
    }, 500);
  }

  _createClass(Lazy, [{
    key: "load",
    value: function load(element, index) {
      this.cache.push(element);
      this.images[index] = {
        element: element,
        src: element.getAttribute('data-src'),
        top: 0,
        bottom: 0,
        loaded: false
      };
      this.images[index].top = offset(element).y;
      this.images[index].bottom = this.images[index].top + element.clientHeight;
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      this.view = {
        top: window.pageYOffset + (window.innerHeight - window.innerHeight * this.offset),
        bottom: window.pageYOffset + window.innerHeight - (window.innerHeight - window.innerHeight * this.offset)
      };
      loopObject(this.images, function (index, item) {
        item.loaded === false ? _this2.render(item) : _this2.detach(index);
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      loopObject(this.images, function (index, item) {
        item.top = offset(item.element).y;
        item.bottom = item.top + item.element.clientHeight;
      });
    }
  }, {
    key: "render",
    value: function render(item) {
      var _this3 = this;

      if (item) {
        if (this.view.bottom >= item.top && this.view.top <= item.bottom) {
          var loader = document.createElement('img');
          loader.src = item.src;
          loader.addEventListener('load', function () {
            item.loaded = true;

            if (item.element.tagName === 'IMG') {
              item.element.parentElement.classList.add('js-loaded');
              item.element.src = item.src;
              window.dispatchEvent(_this3.event);
            } else {
              item.element.classList.add('js-loaded');
              item.element.style.backgroundImage = "url('".concat(item.src, "')");
            }
          });
        }
      }
    }
  }, {
    key: "detach",
    value: function detach(index) {
      if (index && this.images[index]) delete this.images[index];
    }
  }, {
    key: "update",
    value: function update() {
      var _this4 = this;

      nodeArray(document.querySelectorAll(this.selector)).forEach(function (item, index) {
        if (!_this4.cache.includes(item)) _this4.load(item, index);
      });
      this.observe();
    }
  }]);

  return Lazy;
}();

export { Lazy as default };