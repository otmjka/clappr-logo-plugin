clappr-logo-plugin
=========

An external [Clappr player](https://github.com/clappr/clappr) plugin.

![Screenshot](screenshot.png)

## Install

```bash
npm install --save clappr-logo-plugin
```

## Usage
Add both Clappr and the logo plugin scripts to your HTML:

```html
<head>
  <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
  <script type="text/javascript" src="clappr-logo-plugin.js"></script>
</head>
``` 


```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  plugins: [LogoPlugin],
  logo: {
    path: 'http://media.moddb.com/images/members/4/3925/3924855/unnamed.png',
  }
});
```

## Scripts

- `npm start` launch public/index.html at http://0.0.0.0:port and you can see usage example
- `npm build` build to dist/clappr-logo-plugin.min.js

