# Lazy Load

```sh 

yarn add @meteora-digital/lazy

```

```javascript

import Lazy from '@meteora-digital/lazy';

window.Lazy = new Lazy(selector, offset);

```

- selector is a string, default value is '[data-src]'
- offset is a percentage off the top of the window, default is 1 which targets the bottom of the scrolled window. 0.5 would be the middle, 0 would be the top.