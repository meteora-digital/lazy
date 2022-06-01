export default class LazyLoad {
  constructor(options = {}) {
    // The selector we will use to find lazy elements
    this.selectors = [];
    // The images that have already been loaded
    this.loaded = [];
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
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Tell the page to load this image
          this.load(entry.target);
          // Stop observing the element
          this.intersectionObserver.unobserve(entry.target);
          // Add the element to the loaded array
          this.loaded.push(entry.target);
        }
      });
    }, {
      rootMargin: `${this.settings.offset}px`,
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
    // Loop through all the selectors and observe the relevant elements
    this.selectors.forEach((selector) => {
      // Find all the elements
      const elements = document.querySelectorAll(selector);
      // Observe the elements
      for (let index = 0; index < elements.length; index++) {
        if (this.loaded.indexOf(elements[index]) === -1) {
          this.intersectionObserver.observe(elements[index]);
        }
      }
    });
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
    (element.tagName === 'IMG') ? element.src = image.src : element.style.backgroundImage = `url(${image.src})`;
  }
}