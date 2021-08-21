##### Misc tips
https://dev.to/simonpaix/10-useful-vs-code-shortcuts-you-should-know-42m

### Shared folder
Webpack makes sure to copy everything from this folder and into public


### Pros
- alias when fetching files or classes
- hot reload

### Cons




### Domains/Media

```
const fov = this.camera.fov * (Math.PI / 180)
const height = 2 * Math.tan(fov / 2) * this.camera.position.z
const width = height * this.camera.aspect

this.sizes = {
  height,
  width
}

They are "unit" values, could be seen as meters, like in Blender
```

this.sizes.width
is a float value, not the screen size in pixels but a unit number, eg. 5.4597...

this.x
is a fraction of the sizes width value






interpolate(startValue, endValue, progress)
startValue : * - The starting value. This can be almost any data type (Number, String, Array, complex String, color, Object)
endValue : * - The ending value. This can be almost any data type, as long as it matches the startValue
progress : Number - A value between 0 and 1 where 0 is the start, 0.5 is halfway between, and 1 is the end.




getBoundingClientRect
{
  bottom: 895.8359375
  height: 807.671875
  left: 303.8999938964844
  right: 876.0562438964844
  top: 88.1640625
  width: 572.15625
  x: 303.8999938964844
  y: 88.1640625
}