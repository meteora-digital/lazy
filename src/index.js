export default class LazyLoadController {
  constructor(options = {}) {
    // The items being watched
    this.items = [];
    // The selector we will use to find lazy elements
    this.selectors = [];
    // The images that have already been loaded
    this.loaded = [];
    // Some throttles / timeouts
    this.timeouts = {};
    // The default settings
    this.settings = {
      offset: 500,
    };

    // Assign the user options to the settings
    for (const key in this.settings) {
      if (Object.hasOwnProperty.call(this.settings, key) && Object.hasOwnProperty.call(options, key)) {
        this.settings[key] = options[key];
      }
    }

    // Set up a new intersection observer
    this.IntersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Tell the page to load this image
          this.load(entry.target);
          // Stop observing the element
          this.IntersectionObserver.unobserve(entry.target);
          // Add the element to the loaded array
          this.loaded.push(entry.target);
        }
      });
    }, {
      rootMargin: `${this.settings.offset}px`,
    });

    // Set up a mutation observer to watch for new elements
    this.MutationObserver = new MutationObserver(() => this.update());

    // Observe the entire document
    this.MutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  watch(selector = '') {
    // if the argument is a string, use it as a selector
    if (typeof selector === 'string') {
      // Update the selectors
      if (this.selectors.indexOf(selector) === -1) {
        this.selectors.push(selector);
        this.update();
      };
    }
  }

  update() {
    // Clear the update timeout
    clearTimeout(this.timeouts['update']);

    // Set the update timeout
    this.timeouts['update'] = setTimeout(() => {
      // Loop through all the items, and check if they are still on the page
      this.items.forEach((item) => {
        // If the item is still on the page, continue
        if (document.body.contains(item)) return;
        // Remove the item from the list of items
        this.items.splice(this.items.indexOf(item), 1);
        // Remove the item from the list of loaded items
        this.loaded.splice(this.loaded.indexOf(item), 1);
        // Unobserve the item
        this.IntersectionObserver.unobserve(item);
      });

      // Loop through the selectors
      this.selectors.forEach((selector) => {
        // Loop through all the elements on the page that match the selector
        [...document.querySelectorAll(selector)].forEach((element) => {
          // If this element is already being watched, return
          if (this.items.includes(element)) return;
          // If the element has already been loaded, return
          if (this.loaded.includes(element)) return;
          // Add the element to the intersection observer
          this.IntersectionObserver.observe(element);
          // Add the element to the list of items
          this.items.push(element);
        });
      });
    }, 100);
  }

  load(element) {
    const image = new Image();
    // When the image has loaded, we will add a class to the element
    image.addEventListener('load', () => {
      element.classList.add('lazy-loaded');
      element.parentNode.classList.add('lazy-loaded--holder');
    });

    // If the image fails to load
    image.addEventListener('error', () => {
      element.classList.add('lazy-error');
    });

    // Load the image
    image.src = element.getAttribute('data-src');
    // Set up the image src / background image appropriately
    (element.tagName === 'IMG' || element.tagName === 'VIDEO') ? element.src = image.src : element.style.backgroundImage = `url(${image.src})`;
  }
}