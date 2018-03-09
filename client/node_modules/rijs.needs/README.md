# Ripple | Needs
[![Coverage Status](https://coveralls.io/repos/rijs/needs/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/needs?branch=master)
[![Build Status](https://travis-ci.org/rijs/needs.svg)](https://travis-ci.org/rijs/needs)

Extends the [rendering pipeline]() to apply default attributes defined for a component. 

General syntax for the `needs` header is:

```js
needs: [attr1=value2][attr2=value3 value4]
```

Most components have their own default base CSS. Instead of requiring consumers to add this, specifying the following header in the resource defintion will always load the component's CSS (the value here conventionally defaults to `component-name.css`):

```js
needs: '[css]'
```

Components within an application may also require certain data resources:

```js
needs: '[data=foo]'
```

The value of attributes are extended rather than overwritten. So a consumer can still specify any attributes which may modify the behaviour of the component, but will not need to also add the essential attributes the component itself always requires.