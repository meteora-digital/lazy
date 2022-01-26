# Lazy Load

##### Note: version 2.0.0+ has updates that will break previous versions, updates to your code will be required.

```sh 
yarn add @meteora-digital/lazy
```

```javascript
import Lazy from '@meteora-digital/lazy';

window.Lazy = new Lazy({
    offset: 500,
});

window.Lazy.watch('selector');
```

- selector is a string
- offset is a pixel value from the bottom of the screen