function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LazyLoadController = /*#__PURE__*/function () {
  function LazyLoadController() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LazyLoadController);

    // The items being watched
    this.items = []; // The selector we will use to find lazy elements

    this.selectors = []; // The images that have already been loaded

    this.loaded = []; // Some throttles / timeouts

    this.timeouts = {}; // The default settings

    this.settings = {
      offset: 500
    }; // Assign the user options to the settings

    for (var key in this.settings) {
      if (Object.hasOwnProperty.call(this.settings, key) && Object.hasOwnProperty.call(options, key)) {
        this.settings[key] = options[key];
      }
    } // Set up a new intersection observer


    this.IntersectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Tell the page to load this image
          _this.load(entry.target); // Stop observing the element


          _this.IntersectionObserver.unobserve(entry.target); // Add the element to the loaded array


          _this.loaded.push(entry.target);
        }
      });
    }, {
      rootMargin: "".concat(this.settings.offset, "px")
    }); // Set up a mutation observer to watch for new elements

    this.MutationObserver = new MutationObserver(function () {
      return _this.update();
    }); // Observe the entire document

    this.MutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  _createClass(LazyLoadController, [{
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

      // Clear the update timeout
      clearTimeout(this.timeouts['update']); // Set the update timeout

      this.timeouts['update'] = setTimeout(function () {
        // Loop through all the items, and check if they are still on the page
        _this2.items.forEach(function (item) {
          // If the item is still on the page, continue
          if (document.body.contains(item)) return; // Remove the item from the list of items

          _this2.items.splice(_this2.items.indexOf(item), 1); // Remove the item from the list of loaded items


          _this2.loaded.splice(_this2.loaded.indexOf(item), 1); // Unobserve the item


          _this2.IntersectionObserver.unobserve(item);
        }); // Loop through the selectors


        _this2.selectors.forEach(function (selector) {
          // Loop through all the elements on the page that match the selector
          _toConsumableArray(document.querySelectorAll(selector)).forEach(function (element) {
            // If this element is already being watched, return
            if (_this2.items.includes(element)) return; // If the element has already been loaded, return

            if (_this2.loaded.includes(element)) return; // Add the element to the intersection observer

            _this2.IntersectionObserver.observe(element); // Add the element to the list of items


            _this2.items.push(element);
          });
        });
      }, 100);
    }
  }, {
    key: "load",
    value: function load(element) {
      var image = new Image(); // When the image has loaded, we will add a class to the element

      image.addEventListener('load', function () {
        element.classList.add('lazy-loaded');
        element.parentNode.classList.add('lazy-loaded--holder');
      }); // If the image fails to load

      image.addEventListener('error', function () {
        element.classList.add('lazy-error');
      }); // Load the image

      image.src = element.getAttribute('data-src'); // Set up the image src / background image appropriately

      element.tagName === 'IMG' || element.tagName === 'VIDEO' ? element.src = image.src : element.style.backgroundImage = "url(".concat(image.src, ")");
    }
  }]);

  return LazyLoadController;
}();

export { LazyLoadController as default };