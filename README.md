# Parallax background scrolling
## applies parallax scrolling to background images
This plugin was created with the aim of automating the background image scrolling on parallax-style web pages. It takes the element's height and offset, along with the window height and calculates a vertical background position (in percent), which is applied on the scroll event. [See the demo](https://github.com/EdamL/parallax-background-scrolling/tree/master/demo) for an example of the plugin in action.

The plugin consists of a single method:

## parallaxBackgrounds(fixedHeader)

If you have a fixed header element in your page and want to exclude it from the window height calculation, you can pass it in as a DOM object in the `fixedHeader` parameter.

### Exposed functions:
#### update()
Re-calculates and updates the background positions.

## Usage

### jQuery
```js
  $('.my-parallax-elements').parallaxBackgrounds();
```

### Vanilla JS

The method can be called in vanilla JS by passing a querySelector string to the `PBg` namespace:

```js
  PBg('.my-parallax-elements').parallaxBackgrounds();
```
