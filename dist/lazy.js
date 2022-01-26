function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LazyLoad = /*#__PURE__*/function () {
  function LazyLoad() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LazyLoad);

    // The selector we will use to find lazy elements
    this.selectors = []; // The images that have already been loaded

    this.loaded = []; // The default settings

    this.settings = {
      offset: 500
    }; // Assign the user options to the settings

    for (var key in this.settings) {
      if (Object.hasOwnProperty.call(this.settings, key) && Object.hasOwnProperty.call(options, key)) {
        this.settings[key] = options[key];
      }
    } // Set up a new intersection observer


    this.intersectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Tell the page to load this image
          _this.load(entry.target); // Stop observing the element


          _this.intersectionObserver.unobserve(entry.target); // Add the element to the loaded array


          _this.loaded.push(entry.target);
        }
      }, {
        threshold: 1,
        rootMargin: "0 0 ".concat(_this.settings.offset, "px 0")
      });
    });
  }

  _createClass(LazyLoad, [{
    key: "watch",
    value: function watch() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      // if the argument is a string, use it as a selector
      if (typeof selector === 'string') {
        // Update the selectors
        if (this.selectors.indexOf(selector) === -1) {
          this.selectors.push(selector);
          this.update();
        }

        ;
      }
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      // Loop through all the selectors and observe the relevant elements
      this.selectors.forEach(function (selector) {
        // Find all the elements
        var elements = document.querySelectorAll(selector); // Observe the elements

        for (var index = 0; index < elements.length; index++) {
          if (_this2.loaded.indexOf(elements[index]) === -1) {
            _this2.intersectionObserver.observe(elements[index]);
          }
        }
      });
    }
  }, {
    key: "load",
    value: function load(element) {
      var image = new Image(); // When the image has loaded, we will add a class to the element

      image.addEventListener('load', function () {
        element.classList.add('lazy-loaded');
        element.parentNode.classList.add('lazy-loaded--holder');
      }); // Load the image

      image.src = element.getAttribute('data-src'); // Set up the image src / background image appropriately

      element.tagName === 'IMG' ? element.src = image.src : element.style.backgroundImage = "url(".concat(image.src, ")");
    }
  }]);

  return LazyLoad;
}();

export { LazyLoad as default };