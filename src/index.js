import { attach, nodeArray, offset, loopObject, Event } from '@meteora-digital/helpers';

export default class Lazy {
  constructor(selector = '[data-src]', offset = 1) {
    this.selector = selector;
    this.images = {};
    this.cache = [];
    this.event = new Event('resize');
    this.offset = offset;
    this.view = {
      top: window.pageYOffset,
      bottom: window.pageYOffset + window.innerHeight,
    }

    setTimeout(() => {
      nodeArray(document.querySelectorAll(this.selector)).forEach((element, index) => this.load(element, index));

      attach(window, 'scroll', () => this.observe(), 250);

      attach(window, 'resize', () => {
        this.observe();
        this.resize();
      }, 250);
    }, 500);
  }

  load(element, index) {
    this.cache.push(element);
    this.images[index] = {
      element: element,
      src: element.getAttribute('data-src'),
      top: 0,
      bottom: 0,
      loaded: false,
    }

    this.images[index].top = offset(element).y;
    this.images[index].bottom = this.images[index].top + element.clientHeight;
  }

  observe() {
    this.view = {
      top: window.pageYOffset + (window.innerHeight - (window.innerHeight * this.offset)),
      bottom: window.pageYOffset + window.innerHeight - (window.innerHeight - (window.innerHeight * this.offset))
    }

    loopObject(this.images, (index, item) => {
      (item.loaded === false) ? this.render(item) : this.detach(index);
    });
  }

  resize() {
    loopObject(this.images, (index, item) => {
      item.top = offset(item.element).y;
      item.bottom = item.top + item.element.clientHeight;
    });
  }

  render(item) {
    if (item) {
      if (this.view.bottom >= item.top && this.view.top <= item.bottom) {
        const loader = document.createElement('img');
        loader.src = item.src;
        loader.addEventListener('load', () => {
          item.loaded = true;

          if (item.element.tagName === 'IMG') {
            item.element.parentElement.classList.add('js-loaded');
            item.element.src = item.src;
            window.dispatchEvent(this.event);
          }else {
            item.element.classList.add('js-loaded');
            item.element.style.backgroundImage = `url('${item.src}')`;
          }
        });
      }
    }
  }

  detach(index) {
    if (index && this.images[index]) delete this.images[index];
  }

  update() {
    nodeArray(document.querySelectorAll(this.selector)).forEach((item, index) => {
      if (!this.cache.includes(item)) this.load(item, index);
    });

    this.observe();
  }
}
