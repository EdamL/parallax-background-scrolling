# Parallax background scrolling
This plugin was created with the aim of automating the background image scrolling on parallax-style web pages. It takes the element's height and offset, along with the window height and calculates a vertical background position (in percent), which is applied on the scroll event. See the `demo` for an example of the plugin in action.

## parallaxBackgrounds(fixedHeader)

If you have a fixed header element in your page and want to exclude it from the window height calculation, you can pass it in as a jQuery object in the `fixedHeader` parameter.

### Exposed functions:
#### update()
Re-calculates and updates the background positions.
