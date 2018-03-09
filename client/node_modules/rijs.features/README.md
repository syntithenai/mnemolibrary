# Ripple | Features
[![Coverage Status](https://coveralls.io/repos/rijs/features/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/features?branch=master)
[![Build Status](https://travis-ci.org/rijs/features.svg)](https://travis-ci.org/rijs/features)

Extends the [rendering pipeline]() to enhance a component with other features (mixins).

Extend components with features

```html
<custom-form is="validatable">
```

Features are just components, and will be invoked on the element during a render in the same way as the base component. The base component will be invoked first and then any features specified (you can specify multiple features).

```js
ripple('base-component', function(){ this.innerHTML = 'foo' } )
ripple('feature', function(){ this.innerHTML += 'bar' } )
```

```html
<base-component is="feature">foobar<base-component>
```

This pattern is the same as:

```js
d3.select(element)
  .call(component)
  .call(feature1)
  .call(feature2)
  .call(feature3)
```

Features may also contribute and mixin their own styles (just extend `css` attribute). 