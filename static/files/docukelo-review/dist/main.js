(() => {
  // temp/skills-utilities/skills/slides-generator/src/utils/core.js
  var LOGO_NEG_SVG = `<svg class="logo-negative" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 288">
  <defs><style>.cls-white-logo { fill: #ffffff; stroke-width: 0px; }</style></defs>
  <g>
    <g><path class="cls-white-logo" d="M179.6,71.1c1.7,1.2,3.4,2.4,5,3.6l-13.9,19.2c-1.6-1.3-3.3-2.5-5-3.6l13.9-19.2Z"/><path class="cls-white-logo" d="M179.6,71.1c1.7,1.2,3.4,2.4,5,3.6l-13.9,19.2c-1.6-1.3-3.3-2.5-5-3.6l13.9-19.2Z"/></g>
    <g><path class="cls-white-logo" d="M96.1,63.2l7.4,22.6c4.7-2.2,9.6-3.8,14.8-4.8l-7.4-22.6c-5.1,1.2-10.1,2.8-14.8,4.8Z"/><path class="cls-white-logo" d="M96.1,63.2l7.4,22.6c4.7-2.2,9.6-3.8,14.8-4.8l-7.4-22.6c-5.1,1.2-10.1,2.8-14.8,4.8Z"/></g>
    <g><path class="cls-white-logo" d="M147.7,82.1c1.8.5,3.6,1.1,5.3,1.7l7.3-22.5c-1.7-.6-3.5-1.2-5.3-1.7l-7.3,22.5Z"/><path class="cls-white-logo" d="M147.7,82.1c1.8.5,3.6,1.1,5.3,1.7l7.3-22.5c-1.7-.6-3.5-1.2-5.3-1.7l-7.3,22.5Z"/></g>
    <g><path class="cls-white-logo" d="M74.8,112.2c2.3-4.1,5.1-7.9,8.3-11.4l-19.2-14c-3.1,3.6-5.8,7.4-8.3,11.4l19.2,14Z"/><path class="cls-white-logo" d="M74.8,112.2c2.3-4.1,5.1-7.9,8.3-11.4l-19.2-14c-3.1,3.6-5.8,7.4-8.3,11.4l19.2,14Z"/></g>
    <g><path class="cls-white-logo" d="M87.1,96.8c3.6-3.3,7.7-6.3,12-8.7l-14-19.2c-4.2,2.6-8.3,5.5-12,8.7l14,19.2Z"/><path class="cls-white-logo" d="M87.1,96.8c3.6-3.3,7.7-6.3,12-8.7l-14-19.2c-4.2,2.6-8.3,5.5-12,8.7l14,19.2Z"/></g>
    <g><path class="cls-white-logo" d="M212.9,113.4l-22.5,7.3c.9,2.2,1.6,4.5,2.2,6.9l22.5-7.3c-.7-2.3-1.4-4.6-2.2-6.9Z"/><path class="cls-white-logo" d="M212.9,113.4l-22.5,7.3c.9,2.2,1.6,4.5,2.2,6.9l22.5-7.3c-.7-2.3-1.4-4.6-2.2-6.9Z"/></g>
    <g><path class="cls-white-logo" d="M66.3,144c0-2.1.1-4.3.3-6.4h-23.7c-.2,2.1-.2,4.2-.2,6.4s0,4.3.2,6.4h23.7c-.2-2.1-.3-4.2-.3-6.4Z"/><path class="cls-white-logo" d="M66.3,144c0-2.1.1-4.3.3-6.4h-23.7c-.2,2.1-.2,4.2-.2,6.4s0,4.3.2,6.4h23.7c-.2-2.1-.3-4.2-.3-6.4Z"/></g>
    <g><path class="cls-white-logo" d="M194.8,144c0,1.3,0,2.7-.1,4h23.7c0-1.3,0-2.7,0-4s0-2.7,0-4h-23.7c0,1.3.1,2.7.1,4Z"/><path class="cls-white-logo" d="M194.8,144c0,1.3,0,2.7-.1,4h23.7c0-1.3,0-2.7,0-4s0-2.7,0-4h-23.7c0,1.3.1,2.7.1,4Z"/></g>
    <g><path class="cls-white-logo" d="M67.7,130.6c.9-4.4,2.3-8.7,4.1-12.7l-22.6-7.3c-1.7,4.1-3.1,8.3-4.1,12.7l22.6,7.3Z"/><path class="cls-white-logo" d="M67.7,130.6c.9-4.4,2.3-8.7,4.1-12.7l-22.6-7.3c-1.7,4.1-3.1,8.3-4.1,12.7l22.6,7.3Z"/></g>
    <g><path class="cls-white-logo" d="M180.4,103.6c1.4,1.8,2.8,3.6,4,5.6l19.2-13.9c-1.3-1.9-2.6-3.8-4-5.6l-19.2,13.9Z"/><path class="cls-white-logo" d="M180.4,103.6c1.4,1.8,2.8,3.6,4,5.6l19.2-13.9c-1.3-1.9-2.6-3.8-4-5.6l-19.2,13.9Z"/></g>
    <g><path class="cls-white-logo" d="M122.3,56.5v23.8s0,0,0,0c1.1-.1,4.5-.5,8.2-.5s7.1.4,8.2.5c0,0,0,0,0,0v-23.8c-1.3-.1-4.7-.4-8.2-.4s-6.9.3-8.2.4Z"/><path class="cls-white-logo" d="M122.3,56.5v23.8s0,0,0,0c1.1-.1,4.5-.5,8.2-.5s7.1.4,8.2.5c0,0,0,0,0,0v-23.8c-1.3-.1-4.7-.4-8.2-.4s-6.9.3-8.2.4Z"/></g>
    <g><path class="cls-white-logo" d="M172.4,192.6c-2.4,2-4.9,3.9-7.5,5.6l14,19.2c2.6-1.7,5.1-3.6,7.5-5.6l-14-19.2Z"/><path class="cls-white-logo" d="M172.4,192.6c-2.4,2-4.9,3.9-7.5,5.6l14,19.2c2.6-1.7,5.1-3.6,7.5-5.6l-14-19.2Z"/></g>
    <g><path class="cls-white-logo" d="M71.6,169.5c-1.6-3.7-2.8-7.5-3.7-11.5l-22.6,7.3c1,3.9,2.2,7.8,3.7,11.5l22.6-7.3Z"/><path class="cls-white-logo" d="M71.6,169.5c-1.6-3.7-2.8-7.5-3.7-11.5l-22.6,7.3c1,3.9,2.2,7.8,3.7,11.5l22.6-7.3Z"/></g>
    <g><path class="cls-white-logo" d="M154.8,203.5c-2.9,1.2-5.8,2.1-8.9,2.9l7.3,22.6c3-.8,6-1.8,8.9-2.9l-7.3-22.6Z"/><path class="cls-white-logo" d="M154.8,203.5c-2.9,1.2-5.8,2.1-8.9,2.9l7.3,22.6c3-.8,6-1.8,8.9-2.9l-7.3-22.6Z"/></g>
    <g><path class="cls-white-logo" d="M192.8,159.8c-.7,2.7-1.6,5.4-2.6,8l22.6,7.3c1-2.6,1.9-5.3,2.6-8l-22.5-7.3Z"/><path class="cls-white-logo" d="M192.8,159.8c-.7,2.7-1.6,5.4-2.6,8l22.6,7.3c1-2.6,1.9-5.3,2.6-8l-22.5-7.3Z"/></g>
    <g><path class="cls-white-logo" d="M185,178c-1.6,2.5-3.3,4.9-5.2,7.2l19.2,13.9c1.9-2.3,3.6-4.7,5.2-7.2l-19.2-13.9Z"/><path class="cls-white-logo" d="M185,178c-1.6,2.5-3.3,4.9-5.2,7.2l19.2,13.9c1.9-2.3,3.6-4.7,5.2-7.2l-19.2-13.9Z"/></g>
    <g><path class="cls-white-logo" d="M83.4,218.2l13.9-19.2c-3.1-1.9-6.1-4-8.8-6.4l-14,19.2c2.8,2.3,5.7,4.5,8.8,6.4Z"/><path class="cls-white-logo" d="M83.4,218.2l13.9-19.2c-3.1-1.9-6.1-4-8.8-6.4l-14,19.2c2.8,2.3,5.7,4.5,8.8,6.4Z"/></g>
    <g><path class="cls-white-logo" d="M82.2,186.2c-2.5-2.9-4.8-6-6.8-9.3l-19.2,14c2,3.2,4.3,6.3,6.7,9.3l19.2-14Z"/><path class="cls-white-logo" d="M82.2,186.2c-2.5-2.9-4.8-6-6.8-9.3l-19.2,14c2,3.2,4.3,6.3,6.7,9.3l19.2-14Z"/></g>
    <g><path class="cls-white-logo" d="M115.7,206.5c-3.4-.8-6.7-1.9-9.9-3.2l-7.3,22.6c3.2,1.3,6.5,2.3,9.8,3.2l7.3-22.6Z"/><path class="cls-white-logo" d="M115.7,206.5c-3.4-.8-6.7-1.9-9.9-3.2l-7.3,22.6c3.2,1.3,6.5,2.3,9.8,3.2l7.3-22.6Z"/></g>
    <g><path class="cls-white-logo" d="M135.5,231.7v-23.7c-1.6.1-3.3.2-4.9.2s-3.3,0-4.9-.2v23.7c1.6,0,3.3.1,4.9.1s3.3,0,4.9-.1Z"/><path class="cls-white-logo" d="M135.5,231.7v-23.7c-1.6.1-3.3.2-4.9.2s-3.3,0-4.9-.2v23.7c1.6,0,3.3.1,4.9.1s3.3,0,4.9-.1Z"/></g>
    <path class="cls-white-logo" d="M120.3,106.5c-1.2.3-2.4.7-3.5,1.1l-6.6-20.4c1.2-.4,2.3-.8,3.5-1.1l6.6,20.4ZM130.5,83.7c-1.4,0-2.9,0-4.3.2v21.6c1.4-.2,2.8-.2,4.3-.2,1.5,0,2.9,0,4.3.2v-21.6c-1.4,0-2.8-.2-4.3-.2ZM153.1,88c-2.6-1-5.2-1.9-7.9-2.6l-6.7,20.5c2.8.6,5.4,1.5,7.9,2.6l6.7-20.5ZM169.2,97.7c-2.1-1.7-4.2-3.3-6.5-4.7l-12.7,17.4c2.3,1.4,4.5,2.9,6.5,4.7l12.7-17.4ZM96.7,94c-1.1.7-2.1,1.5-3.2,2.3l12.6,17.4c1-.8,2.1-1.6,3.2-2.3l-12.6-17.4ZM181.5,111.8c-1.4-2.2-2.9-4.3-4.6-6.3l-17.4,12.7c1.7,1.9,3.3,4.1,4.6,6.3l17.4-12.7ZM72.5,127.5l20.4,6.6c.4-1.4.9-2.9,1.4-4.2l-20.5-6.6c-.5,1.4-1,2.8-1.4,4.2ZM169.2,147.6h21.5c0-1.2.1-2.4.1-3.6s0-2.4-.1-3.6h-21.5c.1,1.2.2,2.4.2,3.6,0,1.2,0,2.4-.2,3.6ZM83,106.8c-.9,1.1-1.7,2.2-2.5,3.4l17.4,12.6c.8-1.2,1.6-2.3,2.5-3.4l-17.4-12.6ZM91.8,141.6h-21.5c0,.8,0,1.6,0,2.4s0,1.6,0,2.4h21.5c0-.8,0-1.6,0-2.4s0-1.6,0-2.4ZM92.9,191.1c1.4,1.1,2.9,2.2,4.4,3.2l12.6-17.4c-1.6-1-3-2.1-4.4-3.2l-12.6,17.4ZM109.2,200.4c1.8.7,3.6,1.3,5.5,1.8l6.7-20.5c-1.9-.5-3.7-1.1-5.5-1.8l-6.7,20.5ZM80.2,177.3c1,1.5,2,2.9,3.1,4.2l17.4-12.6c-1.1-1.3-2.1-2.8-3.1-4.2l-17.4,12.6ZM72.4,160.3c.4,1.6,1,3.2,1.5,4.7l20.5-6.6c-.6-1.5-1.1-3.1-1.5-4.7l-20.4,6.6ZM130.5,204.3c1,0,2,0,3,0v-21.5c-1,0-2,.1-3,.1s-2,0-3-.1v21.5c1,0,2,0,3,0ZM189,129c-.6-2.5-1.4-4.9-2.3-7.2l-20.5,6.7c1,2.3,1.8,4.7,2.3,7.2l20.5-6.7ZM146.2,202.3c2-.5,4-1.2,6-1.9l-6.7-20.5c-1.9.8-3.9,1.4-6,1.9l6.7,20.5ZM186.7,166c.9-2.2,1.6-4.4,2.2-6.7l-20.5-6.7c-.5,2.3-1.2,4.6-2.2,6.7l20.5,6.7ZM177.3,182.1c1.4-1.7,2.8-3.6,4-5.5l-17.4-12.7c-1.2,1.9-2.5,3.8-4,5.5l17.4,12.7ZM163.3,194.7c1.8-1.2,3.6-2.5,5.3-3.8l-12.7-17.4c-1.6,1.4-3.4,2.7-5.3,3.8l12.6,17.4Z"/>
  </g>
  <g>
    <path class="cls-white-logo" d="M248.7,128h12.2v70.7h-12.2v-70.7Z"/>
    <path class="cls-white-logo" d="M275.3,163.8c0-21.3,16.1-37.4,37-37.4s23.4,5.3,30.2,15l-9.7,7.4c-5.7-7.7-12.8-11.3-20.6-11.3-13.5,0-24.2,10.7-24.2,25.9s11,25.9,24.4,25.9,16.4-4.3,21.9-11.8l9.3,6.8c-6.8,10.3-18.2,16.1-31.3,16.1-21.3,0-36.9-15.5-36.9-36.6Z"/>
    <path class="cls-white-logo" d="M422.4,166.1h-59c1,14.9,10.9,23.4,25.1,23.4s17.4-3.9,23.4-12l8.8,6.7c-6.8,10.2-18.2,16.1-32.4,16.1-22.1,0-37.3-14.9-37.3-36.5s15.9-37.6,37.4-37.6,34.5,13.8,34.5,34.5-.1,3.6-.4,5.3ZM364.1,155.5h46.2c-1.8-12.2-9.9-18.7-22-18.7s-21.4,6.8-24.2,18.7Z"/>
    <path class="cls-white-logo" d="M432.4,189.1l7.8-9.2c6.7,6.3,15.5,9.5,23.7,9.5s15.2-4.3,15.2-10.2-3.1-7.5-12.1-9.6l-12.4-2.8c-14.2-3.2-20.2-9.3-20.2-18.9s10.6-21.6,27.1-21.6,22,4,28.7,11.3l-8.2,8.5c-5.8-5.8-13.1-8.8-21.3-8.8s-14.3,3.9-14.3,9.6,2.6,6.8,12.4,9l12.4,2.8c14.3,3.2,19.9,9.7,19.9,19.5s-10.2,22.1-27.6,22.1-23.9-4.3-31-11.3Z"/>
    <path class="cls-white-logo" d="M505.1,128h12.2v70.7h-12.2v-70.7Z"/>
    <g>
      <path class="cls-white-logo" d="M248.7,101.1v-12.3h3.7v12c0,3.7,1.8,5.5,4.9,5.5s4.9-1.8,4.9-5.5v-12h3.7v12.3c0,5.5-3.3,8.6-8.6,8.6s-8.6-3.1-8.6-8.6Z"/>
      <path class="cls-white-logo" d="M284.7,100.3v9h-3.5v-8.3c0-2.6-1.2-3.9-3.2-3.9s-2.6.5-3.7,1.8v10.4h-3.5v-15h3.5v1.3c1.2-1,2.9-1.6,4.6-1.6,3.5,0,5.8,2.3,5.8,6.4Z"/>
      <path class="cls-white-logo" d="M288.9,90c0-1.2,1-2.2,2.3-2.2s2.2,1,2.2,2.2-1,2.3-2.2,2.3-2.3-1-2.3-2.3ZM289.4,94.3h3.5v15h-3.5v-15Z"/>
      <path class="cls-white-logo" d="M312.1,94.3l-6.2,15h-3.8l-6.2-15h3.9l4.2,10.7,4.2-10.7h3.9Z"/>
      <path class="cls-white-logo" d="M329.2,102.7h-11.9c.3,2.6,2,4,4.6,4s3.2-.6,4.4-2.1l2.5,1.9c-1.6,2.1-4,3.3-7,3.3-4.9,0-8.1-3.2-8.1-7.8s3.3-8,8-8,7.5,2.9,7.5,7.4,0,.9,0,1.3ZM317.5,100h8.3c-.4-2.1-1.8-3.1-3.9-3.1s-3.8,1.1-4.3,3.1Z"/>
      <path class="cls-white-logo" d="M342.5,94.1l-.2,3.3c-.5,0-1-.1-1.4-.1-1.7,0-3.2.8-4.1,2.3v9.8h-3.5v-15h3.5v1.6c1-1.3,2.6-2,4.2-2s1,0,1.6.2Z"/>
      <path class="cls-white-logo" d="M344.9,107.5l1.8-2.6c1.6,1.2,3.3,1.8,5,1.8s2.6-.7,2.6-1.6-.5-1.2-2.1-1.6l-2.6-.6c-3-.7-4.3-2-4.3-4.1s2.3-4.8,6-4.8,4.7.8,6.2,2.2l-1.9,2.5c-1.4-1.1-2.9-1.7-4.5-1.7s-2.4.6-2.4,1.5.5,1.1,2.1,1.5l2.6.6c3.1.7,4.3,2.1,4.3,4.2s-2.3,4.9-6.2,4.9-5.1-.9-6.7-2.2Z"/>
      <path class="cls-white-logo" d="M361,90c0-1.2,1-2.2,2.3-2.2s2.2,1,2.2,2.2-1,2.3-2.2,2.3-2.3-1-2.3-2.3ZM361.5,94.3h3.5v15h-3.5v-15Z"/>
      <path class="cls-white-logo" d="M384.3,87.6v21.7h-3.5v-1.1c-1.1,1-2.7,1.5-4.3,1.5-4.1,0-7.5-3.3-7.5-7.9s3.4-7.9,7.5-7.9,3.2.5,4.3,1.5v-7.8h3.5ZM380.8,104.7v-5.8c-1-1.2-2.4-1.7-3.8-1.7-2.5,0-4.4,1.8-4.4,4.6s1.9,4.6,4.4,4.6,2.8-.6,3.8-1.8Z"/>
      <path class="cls-white-logo" d="M403.5,94.3v15h-3.5v-1.1c-1.1,1-2.7,1.5-4.3,1.5-4.1,0-7.5-3.3-7.5-7.9s3.4-7.9,7.5-7.9,3.2.5,4.3,1.5v-1.1h3.5ZM400,104.7v-5.8c-1-1.2-2.4-1.7-3.8-1.7-2.5,0-4.4,1.8-4.4,4.6s1.9,4.6,4.4,4.6,2.8-.6,3.8-1.8Z"/>
      <path class="cls-white-logo" d="M422.8,87.6v21.7h-3.5v-1.1c-1.1,1-2.7,1.5-4.3,1.5-4.1,0-7.5-3.3-7.5-7.9s3.4-7.9,7.5-7.9,3.2.5,4.3,1.5v-7.8h3.5ZM419.3,104.7v-5.8c-1-1.2-2.4-1.7-3.8-1.7-2.5,0-4.4,1.8-4.4,4.6s1.9,4.6,4.4,4.6,2.8-.6,3.8-1.8Z"/>
    </g>
  </g>
</svg>`;
  var LOGO_POS_SVG = `<svg class="logo-positive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 288">
  <defs><style>.cls-blue-logo { fill: #5454e9; stroke-width: 0px; }</style></defs>
  <g>
    <g><path class="cls-blue-logo" d="M179.6,71.1c1.7,1.2,3.4,2.4,5,3.6l-13.9,19.2c-1.6-1.3-3.3-2.5-5-3.6l13.9-19.2Z"/><path class="cls-blue-logo" d="M179.6,71.1c1.7,1.2,3.4,2.4,5,3.6l-13.9,19.2c-1.6-1.3-3.3-2.5-5-3.6l13.9-19.2Z"/></g>
    <g><path class="cls-blue-logo" d="M96.1,63.2l7.4,22.6c4.7-2.2,9.6-3.8,14.8-4.8l-7.4-22.6c-5.1,1.2-10.1,2.8-14.8,4.8Z"/><path class="cls-blue-logo" d="M96.1,63.2l7.4,22.6c4.7-2.2,9.6-3.8,14.8-4.8l-7.4-22.6c-5.1,1.2-10.1,2.8-14.8,4.8Z"/></g>
    <g><path class="cls-blue-logo" d="M147.7,82.1c1.8.5,3.6,1.1,5.3,1.7l7.3-22.5c-1.7-.6-3.5-1.2-5.3-1.7l-7.3,22.5Z"/><path class="cls-blue-logo" d="M147.7,82.1c1.8.5,3.6,1.1,5.3,1.7l7.3-22.5c-1.7-.6-3.5-1.2-5.3-1.7l-7.3,22.5Z"/></g>
    <g><path class="cls-blue-logo" d="M74.8,112.2c2.3-4.1,5.1-7.9,8.3-11.4l-19.2-14c-3.1,3.6-5.8,7.4-8.3,11.4l19.2,14Z"/><path class="cls-blue-logo" d="M74.8,112.2c2.3-4.1,5.1-7.9,8.3-11.4l-19.2-14c-3.1,3.6-5.8,7.4-8.3,11.4l19.2,14Z"/></g>
    <g><path class="cls-blue-logo" d="M87.1,96.8c3.6-3.3,7.7-6.3,12-8.7l-14-19.2c-4.2,2.6-8.3,5.5-12,8.7l14,19.2Z"/><path class="cls-blue-logo" d="M87.1,96.8c3.6-3.3,7.7-6.3,12-8.7l-14-19.2c-4.2,2.6-8.3,5.5-12,8.7l14,19.2Z"/></g>
    <g><path class="cls-blue-logo" d="M212.9,113.4l-22.5,7.3c.9,2.2,1.6,4.5,2.2,6.9l22.5-7.3c-.7-2.3-1.4-4.6-2.2-6.9Z"/><path class="cls-blue-logo" d="M212.9,113.4l-22.5,7.3c.9,2.2,1.6,4.5,2.2,6.9l22.5-7.3c-.7-2.3-1.4-4.6-2.2-6.9Z"/></g>
    <g><path class="cls-blue-logo" d="M66.3,144c0-2.1.1-4.3.3-6.4h-23.7c-.2,2.1-.2,4.2-.2,6.4s0,4.3.2,6.4h23.7c-.2-2.1-.3-4.2-.3-6.4Z"/><path class="cls-blue-logo" d="M66.3,144c0-2.1.1-4.3.3-6.4h-23.7c-.2,2.1-.2,4.2-.2,6.4s0,4.3.2,6.4h23.7c-.2-2.1-.3-4.2-.3-6.4Z"/></g>
    <g><path class="cls-blue-logo" d="M194.8,144c0,1.3,0,2.7-.1,4h23.7c0-1.3,0-2.7,0-4s0-2.7,0-4h-23.7c0,1.3.1,2.7.1,4Z"/><path class="cls-blue-logo" d="M194.8,144c0,1.3,0,2.7-.1,4h23.7c0-1.3,0-2.7,0-4s0-2.7,0-4h-23.7c0,1.3.1,2.7.1,4Z"/></g>
    <g><path class="cls-blue-logo" d="M67.7,130.6c.9-4.4,2.3-8.7,4.1-12.7l-22.6-7.3c-1.7,4.1-3.1,8.3-4.1,12.7l22.6,7.3Z"/><path class="cls-blue-logo" d="M67.7,130.6c.9-4.4,2.3-8.7,4.1-12.7l-22.6-7.3c-1.7,4.1-3.1,8.3-4.1,12.7l22.6,7.3Z"/></g>
    <g><path class="cls-blue-logo" d="M180.4,103.6c1.4,1.8,2.8,3.6,4,5.6l19.2-13.9c-1.3-1.9-2.6-3.8-4-5.6l-19.2,13.9Z"/><path class="cls-blue-logo" d="M180.4,103.6c1.4,1.8,2.8,3.6,4,5.6l19.2-13.9c-1.3-1.9-2.6-3.8-4-5.6l-19.2,13.9Z"/></g>
    <g><path class="cls-blue-logo" d="M122.3,56.5v23.8s0,0,0,0c1.1-.1,4.5-.5,8.2-.5s7.1.4,8.2.5c0,0,0,0,0,0v-23.8c-1.3-.1-4.7-.4-8.2-.4s-6.9.3-8.2.4Z"/><path class="cls-blue-logo" d="M122.3,56.5v23.8s0,0,0,0c1.1-.1,4.5-.5,8.2-.5s7.1.4,8.2.5c0,0,0,0,0,0v-23.8c-1.3-.1-4.7-.4-8.2-.4s-6.9.3-8.2.4Z"/></g>
    <g><path class="cls-blue-logo" d="M172.4,192.6c-2.4,2-4.9,3.9-7.5,5.6l14,19.2c2.6-1.7,5.1-3.6,7.5-5.6l-14-19.2Z"/><path class="cls-blue-logo" d="M172.4,192.6c-2.4,2-4.9,3.9-7.5,5.6l14,19.2c2.6-1.7,5.1-3.6,7.5-5.6l-14-19.2Z"/></g>
    <g><path class="cls-blue-logo" d="M71.6,169.5c-1.6-3.7-2.8-7.5-3.7-11.5l-22.6,7.3c1,3.9,2.2,7.8,3.7,11.5l22.6-7.3Z"/><path class="cls-blue-logo" d="M71.6,169.5c-1.6-3.7-2.8-7.5-3.7-11.5l-22.6,7.3c1,3.9,2.2,7.8,3.7,11.5l22.6-7.3Z"/></g>
    <g><path class="cls-blue-logo" d="M154.8,203.5c-2.9,1.2-5.8,2.1-8.9,2.9l7.3,22.6c3-.8,6-1.8,8.9-2.9l-7.3-22.6Z"/><path class="cls-blue-logo" d="M154.8,203.5c-2.9,1.2-5.8,2.1-8.9,2.9l7.3,22.6c3-.8,6-1.8,8.9-2.9l-7.3-22.6Z"/></g>
    <g><path class="cls-blue-logo" d="M192.8,159.8c-.7,2.7-1.6,5.4-2.6,8l22.6,7.3c1-2.6,1.9-5.3,2.6-8l-22.5-7.3Z"/><path class="cls-blue-logo" d="M192.8,159.8c-.7,2.7-1.6,5.4-2.6,8l22.6,7.3c1-2.6,1.9-5.3,2.6-8l-22.5-7.3Z"/></g>
    <g><path class="cls-blue-logo" d="M185,178c-1.6,2.5-3.3,4.9-5.2,7.2l19.2,13.9c1.9-2.3,3.6-4.7,5.2-7.2l-19.2-13.9Z"/><path class="cls-blue-logo" d="M185,178c-1.6,2.5-3.3,4.9-5.2,7.2l19.2,13.9c1.9-2.3,3.6-4.7,5.2-7.2l-19.2-13.9Z"/></g>
    <g><path class="cls-blue-logo" d="M83.4,218.2l13.9-19.2c-3.1-1.9-6.1-4-8.8-6.4l-14,19.2c2.8,2.3,5.7,4.5,8.8,6.4Z"/><path class="cls-blue-logo" d="M83.4,218.2l13.9-19.2c-3.1-1.9-6.1-4-8.8-6.4l-14,19.2c2.8,2.3,5.7,4.5,8.8,6.4Z"/></g>
    <g><path class="cls-blue-logo" d="M82.2,186.2c-2.5-2.9-4.8-6-6.8-9.3l-19.2,14c2,3.2,4.3,6.3,6.7,9.3l19.2-14Z"/><path class="cls-blue-logo" d="M82.2,186.2c-2.5-2.9-4.8-6-6.8-9.3l-19.2,14c2,3.2,4.3,6.3,6.7,9.3l19.2-14Z"/></g>
    <g><path class="cls-blue-logo" d="M115.7,206.5c-3.4-.8-6.7-1.9-9.9-3.2l-7.3,22.6c3.2,1.3,6.5,2.3,9.8,3.2l7.3-22.6Z"/><path class="cls-blue-logo" d="M115.7,206.5c-3.4-.8-6.7-1.9-9.9-3.2l-7.3,22.6c3.2,1.3,6.5,2.3,9.8,3.2l7.3-22.6Z"/></g>
    <g><path class="cls-blue-logo" d="M135.5,231.7v-23.7c-1.6.1-3.3.2-4.9.2s-3.3,0-4.9-.2v23.7c1.6,0,3.3.1,4.9.1s3.3,0,4.9-.1Z"/><path class="cls-blue-logo" d="M135.5,231.7v-23.7c-1.6.1-3.3.2-4.9.2s-3.3,0-4.9-.2v23.7c1.6,0,3.3.1,4.9.1s3.3,0,4.9-.1Z"/></g>
    <path class="cls-blue-logo" d="M120.3,106.5c-1.2.3-2.4.7-3.5,1.1l-6.6-20.4c1.2-.4,2.3-.8,3.5-1.1l6.6,20.4ZM130.5,83.7c-1.4,0-2.9,0-4.3.2v21.6c1.4-.2,2.8-.2,4.3-.2,1.5,0,2.9,0,4.3.2v-21.6c-1.4,0-2.8-.2-4.3-.2ZM153.1,88c-2.6-1-5.2-1.9-7.9-2.6l-6.7,20.5c2.8.6,5.4,1.5,7.9,2.6l6.7-20.5ZM169.2,97.7c-2.1-1.7-4.2-3.3-6.5-4.7l-12.7,17.4c2.3,1.4,4.5,2.9,6.5,4.7l12.7-17.4ZM96.7,94c-1.1.7-2.1,1.5-3.2,2.3l12.6,17.4c1-.8,2.1-1.6,3.2-2.3l-12.6-17.4ZM181.5,111.8c-1.4-2.2-2.9-4.3-4.6-6.3l-17.4,12.7c1.7,1.9,3.3,4.1,4.6,6.3l17.4-12.7ZM72.5,127.5l20.4,6.6c.4-1.4.9-2.9,1.4-4.2l-20.5-6.6c-.5,1.4-1,2.8-1.4,4.2ZM169.2,147.6h21.5c0-1.2.1-2.4.1-3.6s0-2.4-.1-3.6h-21.5c.1,1.2.2,2.4.2,3.6,0,1.2,0,2.4-.2,3.6ZM83,106.8c-.9,1.1-1.7,2.2-2.5,3.4l17.4,12.6c.8-1.2,1.6-2.3,2.5-3.4l-17.4-12.6ZM91.8,141.6h-21.5c0,.8,0,1.6,0,2.4s0,1.6,0,2.4h21.5c0-.8,0-1.6,0-2.4s0-1.6,0-2.4ZM92.9,191.1c1.4,1.1,2.9,2.2,4.4,3.2l12.6-17.4c-1.6-1-3-2.1-4.4-3.2l-12.6,17.4ZM109.2,200.4c1.8.7,3.6,1.3,5.5,1.8l6.7-20.5c-1.9-.5-3.7-1.1-5.5-1.8l-6.7,20.5ZM80.2,177.3c1,1.5,2,2.9,3.1,4.2l17.4-12.6c-1.1-1.3-2.1-2.8-3.1-4.2l-17.4,12.6ZM72.4,160.3c.4,1.6,1,3.2,1.5,4.7l20.5-6.6c-.6-1.5-1.1-3.1-1.5-4.7l-20.4,6.6ZM130.5,204.3c1,0,2,0,3,0v-21.5c-1,0-2,.1-3,.1s-2,0-3-.1v21.5c1,0,2,0,3,0ZM189,129c-.6-2.5-1.4-4.9-2.3-7.2l-20.5,6.7c1,2.3,1.8,4.7,2.3,7.2l20.5-6.7ZM146.2,202.3c2-.5,4-1.2,6-1.9l-6.7-20.5c-1.9.8-3.9,1.4-6,1.9l6.7,20.5ZM186.7,166c.9-2.2,1.6-4.4,2.2-6.7l-20.5-6.7c-.5,2.3-1.2,4.6-2.2,6.7l20.5-6.7ZM177.3,182.1c1.4-1.7,2.8-3.6,4-5.5l-17.4-12.7c-1.2,1.9-2.5,3.8-4,5.5l17.4,12.7ZM163.3,194.7c1.8-1.2,3.6-2.5,5.3-3.8l-12.7-17.4c-1.6,1.4-3.4,2.7-5.3,3.8l12.6,17.4Z"/>
  </g>
  <g>
    <path class="cls-blue-logo" d="M248.7,128h12.2v70.7h-12.2v-70.7Z"/>
    <path class="cls-blue-logo" d="M275.3,163.8c0-21.3,16.1-37.4,37-37.4s23.4,5.3,30.2,15l-9.7,7.4c-5.7-7.7-12.8-11.3-20.6-11.3-13.5,0-24.2,10.7-24.2,25.9s11,25.9,24.4,25.9,16.4-4.3,21.9-11.8l9.3,6.8c-6.8,10.3-18.2,16.1-31.3,16.1-21.3,0-36.9-15.5-36.9-36.6Z"/>
    <path class="cls-blue-logo" d="M422.4,166.1h-59c1,14.9,10.9,23.4,25.1,23.4s17.4-3.9,23.4-12l8.8,6.7c-6.8,10.2-18.2,16.1-32.4,16.1-22.1,0-37.3-14.9-37.3-36.5s15.9-37.6,37.4-37.6,34.5,13.8,34.5,34.5-.1,3.6-.4,5.3ZM364.1,155.5h46.2c-1.8-12.2-9.9-18.7-22-18.7s-21.4,6.8-24.2,18.7Z"/>
    <path class="cls-blue-logo" d="M432.4,189.1l7.8-9.2c6.7,6.3,15.5,9.5,23.7,9.5s15.2-4.3,15.2-10.2-3.1-7.5-12.1-9.6l-12.4-2.8c-14.2-3.2-20.2-9.3-20.2-18.9s10.6-21.6,27.1-21.6,22,4,28.7,11.3l-8.2,8.5c-5.8-5.8-13.1-8.8-21.3-8.8s-14.3,3.9-14.3,9.6,2.6,6.8,12.4,9l12.4,2.8c14.3,3.2,19.9,9.7,19.9,19.5s-10.2,22.1-27.6,22.1-23.9-4.3-31-11.3Z"/>
    <path class="cls-blue-logo" d="M505.1,128h12.2v70.7h-12.2v-70.7Z"/>
    <g>
      <path class="cls-blue-logo" d="M248.7,101.1v-12.3h3.7v12c0,3.7,1.8,5.5,4.9,5.5s4.9-1.8,4.9-5.5v-12h3.7v12.3c0,5.5-3.3,8.6-8.6,8.6s-8.6-3.1-8.6-8.6Z"/>
      <path class="cls-blue-logo" d="M284.7,100.3v9h-3.5v-8.3c0-2.6-1.2-3.9-3.2-3.9s-2.6.5-3.7,1.8v10.4h-3.5v-15h3.5v1.3c1.2-1,2.9-1.6,4.6-1.6,3.5,0,5.8,2.3,5.8,6.4Z"/>
      <path class="cls-blue-logo" d="M288.9,90c0-1.2,1-2.2,2.3-2.2s2.2,1,2.2,2.2-1,2.3-2.2,2.3-2.3-1-2.3-2.3ZM289.4,94.3h3.5v15h-3.5v-15Z"/>
      <path class="cls-blue-logo" d="M312.1,94.3l-6.2,15h-3.8l-6.2-15h3.9l4.2,10.7,4.2-10.7h3.9Z"/>
      <path class="cls-blue-logo" d="M329.2,102.7h-11.9c.3,2.6,2,4,4.6,4s3.2-.6,4.4-2.1l2.5,1.9c-1.6,2.1-4,3.3-7,3.3-4.9,0-8.1-3.2-8.1-7.8s3.3-8,8-8,7.5,2.9,7.5,7.4,0,.9,0,1.3ZM317.5,100h8.3c-.4-2.1-1.8-3.1-3.9-3.1s-3.8,1.1-4.3,3.1Z"/>
      <path class="cls-blue-logo" d="M342.5,94.1l-.2,3.3c-.5,0-1-.1-1.4-.1-1.7,0-3.2.8-4.1,2.3v9.8h-3.5v-15h3.5v1.6c1-1.3,2.6-2,4.2-2s1,0,1.6.2Z"/>
      <path class="cls-blue-logo" d="M344.9,107.5l1.8-2.6c1.6,1.2,3.3,1.8,5,1.8s2.6-.7,2.6-1.6-.5-1.2-2.1-1.6l-2.6-.6c-3-.7-4.3-2-4.3-4.1s2.3-4.8,6-4.8,4.7.8,6.2,2.2l-1.9,2.5c-1.4-1.1-2.9-1.7-4.5-1.7s-2.4.6-2.4,1.5.5,1.1,2.1,1.5l2.6.6c3.1.7,4.3,2.1,4.3,4.2s-2.3,4.9-6.2,4.9-5.1-.9-6.7-2.2Z"/>
      <path class="cls-blue-logo" d="M361,90c0-1.2,1-2.2,2.3-2.2s2.2,1,2.2,2.2-1,2.3-2.2,2.3-2.3-1-2.3-2.3ZM361.5,94.3h3.5v15h-3.5v-15Z"/>
      <path class="cls-blue-logo" d="M384.3,87.6v21.7h-3.5v-1.1c-1.1,1-2.7,1.5-4.3,1.5-4.1,0-7.5-3.3-7.5-7.9s3.4-7.9,7.5-7.9,3.2.5,4.3,1.5v-7.8h3.5ZM380.8,104.7v-5.8c-1-1.2-2.4-1.7-3.8-1.7-2.5,0-4.4,1.8-4.4,4.6s1.9,4.6,4.4,4.6,2.8-.6,3.8-1.8Z"/>
      <path class="cls-blue-logo" d="M403.5,94.3v15h-3.5v-1.1c-1.1,1-2.7,1.5-4.3,1.5-4.1,0-7.5-3.3-7.5-7.9s3.4-7.9,7.5-7.9,3.2.5,4.3,1.5v-1.1h3.5ZM400,104.7v-5.8c-1-1.2-2.4-1.7-3.8-1.7-2.5,0-4.4,1.8-4.4,4.6s1.9,4.6,4.4,4.6,2.8-.6,3.8-1.8Z"/>
      <path class="cls-blue-logo" d="M422.8,87.6v21.7h-3.5v-1.1c-1.1,1-2.7,1.5-4.3,1.5-4.1,0-7.5-3.3-7.5-7.9s3.4-7.9,7.5-7.9,3.2.5,4.3,1.5v-7.8h3.5ZM419.3,104.7v-5.8c-1-1.2-2.4-1.7-3.8-1.7-2.5,0-4.4,1.8-4.4,4.6s1.9,4.6,4.4,4.6,2.8-.6,3.8-1.8Z"/>
    </g>
  </g>
</svg>`;
  var state = {
    n: 0,
    logoNegFn: () => LOGO_NEG_SVG,
    logoPosFn: () => LOGO_POS_SVG
  };
  function setN(val) {
    state.n = val;
  }
  function getN() {
    return state.n;
  }
  function setLogos(neg, pos) {
    state.logoNegFn = () => `<img class="logo-negative" src="${neg}" alt="Universidad Icesi">`;
    state.logoPosFn = () => `<img class="logo-positive" src="${pos}" alt="Universidad Icesi">`;
  }
  function _pageNum(color, side = "right", num) {
    const n = num !== void 0 ? num : state.n;
    const colorMap = {
      white: "#FFFFFF",
      blue: "#5454E9",
      dark: "#393939"
    };
    const c = colorMap[color] || color;
    return `<span class="icesi-slide-number ${side}" style="color:${c}">${n}</span>`;
  }
  function _section(className, content, numColor = "blue", numSide = "right") {
    state.n++;
    return `<section data-slide-index="${state.n}">
  <div class="slide ${className}">
${content}
${_pageNum(numColor, numSide, state.n)}
  </div>
</section>`;
  }

  // temp/skills-utilities/skills/slides-generator/src/components/title-slides.js
  function titleSlideA(title, subtitle) {
    return _section("title-a", `
  ${state.logoNegFn()}
  <div class="title-box">
    <h1>${title}</h1>
  </div>
  <div class="subtitle-box">
    <p>${subtitle}</p>
  </div>
  `, "white", "right");
  }
  function titleSlideB(title, subtitle, footer) {
    return _section("title-b", `
  ${state.logoPosFn()}
  <div class="green-bar"></div>
  <div class="slide-title">${title}</div>
  <div class="slide-subtitle">${subtitle}</div>
  <div class="slide-footer">${footer}</div>
  `, "blue", "left");
  }
  function titleSlideC(title, subtitle) {
    return _section("title-c", `
  ${state.logoPosFn()}
  <div class="blue-block"></div>
  <div class="stripe-pattern"></div>
  <div class="slide-title">${title}</div>
  <div class="slide-subtitle">${subtitle}</div>
  `, "white", "right");
  }
  function titleSlideD(title, subtitle, badge) {
    return _section("title-d", `
  <div class="blue-half"></div>
  <div class="purple-half"></div>
  <div class="yellow-accent"></div>
  ${state.logoNegFn()}
  <div class="slide-title">${title}</div>
  <div class="slide-subtitle">${subtitle}</div>
  <div class="slide-badge">${badge}</div>
  `, "white", "right");
  }
  function titleSlideE(title, subtitle) {
    return _section("title-e", `
  ${state.logoPosFn()}
  <div class="blue-box"></div>
  <div class="purple-box"></div>
  <div class="slide-title">${title}</div>
  <div class="slide-subtitle">${subtitle}</div>
  `, "blue", "right");
  }
  function titleSlideF(title, subtitle) {
    return _section("title-f", `
  <div class="blue-top"></div>
  <div class="orange-accent"></div>
  <div class="slide-title">${title}</div>
  <div class="slide-subtitle">${subtitle}</div>
  ${state.logoPosFn()}
  `, "blue", "right");
  }

  // temp/skills-utilities/skills/slides-generator/src/components/section-slides.js
  function sectionSlideA(title) {
    return _section("section-a", `
  ${state.logoPosFn()}
  <div class="blue-bar"></div>
  <div class="section-title">${title}</div>
  `, "white", "right");
  }
  function sectionSlideB(title, imagePath = "") {
    const img = imagePath ? `<img class="right-image" src="${imagePath}" alt="${title}">` : "";
    return _section("section-b", `
  ${state.logoPosFn()}
  ${img}
  <div class="orange-bar"></div>
  <div class="section-title">${title}</div>
  `, "white", "right");
  }
  function sectionSlideC(title) {
    return _section("section-c", `
  ${state.logoNegFn()}
  <div class="green-accent"></div>
  <div class="white-box"></div>
  <div class="section-title">${title}</div>
  `, "white", "right");
  }
  function sectionSlideE(title, content = "") {
    return _section("section-e", `
  ${state.logoPosFn()}
  <div class="section-title">${title}</div>
  <div class="section-content">${content}</div>
  `, "blue", "right");
  }
  function sectionSlideEBlue(title, content = "") {
    return _section("section-e bg-blue", `
  ${state.logoNegFn()}
  <div class="section-title">${title}</div>
  <div class="section-content">${content}</div>
  `, "white", "right");
  }
  function sectionSlideEGreen(title, content = "") {
    return _section("section-e bg-green", `
  ${state.logoNegFn()}
  <div class="section-title">${title}</div>
  <div class="section-content">${content}</div>
  `, "white", "right");
  }
  function sectionSlideEYellow(title, content = "") {
    return _section("section-e bg-yellow", `
  ${state.logoPosFn()}
  <div class="section-title">${title}</div>
  <div class="section-content">${content}</div>
  `, "dark", "right");
  }
  function sectionSlideEOrange(title, content = "") {
    return _section("section-e bg-orange", `
  ${state.logoNegFn()}
  <div class="section-title">${title}</div>
  <div class="section-content">${content}</div>
  `, "white", "right");
  }

  // temp/skills-utilities/skills/slides-generator/src/components/sidebar-slides.js
  function _sidebarLeft(color, title, content, sidebarVisual = "") {
    let sidebarInner = "";
    if (!sidebarVisual) {
      sidebarInner = "";
    } else if (typeof sidebarVisual === "string") {
      if (sidebarVisual.trim().startsWith("<")) {
        sidebarInner = `<div class="sidebar-graphic">${sidebarVisual}</div>`;
      } else {
        sidebarInner = `<img class="sidebar-image" src="${sidebarVisual}" alt="Diagrama">`;
      }
    } else if (sidebarVisual.type === "graphic") {
      sidebarInner = `<div class="sidebar-graphic">${sidebarVisual.html}</div>`;
    } else if (sidebarVisual.type === "mermaid") {
      sidebarInner = `<div class="mermaid">${sidebarVisual.code}</div>`;
    } else if (sidebarVisual.type === "icons") {
      const iconItems = (sidebarVisual.items || []).map((item) => `
      <div class="icon-item">
        <div class="icon-mark">${item.icon}</div>
        <div class="icon-label">${item.label}</div>
      </div>`).join("");
      sidebarInner = `<div class="sidebar-icons">${iconItems}</div>`;
    }
    return _section(`sidebar-left ${color}`, `
  <div class="sidebar">
    ${state.logoNegFn()}
    ${sidebarInner}
  </div>
  <div class="sidebar-title"><h2>${title}</h2></div>
  <div class="sidebar-content">${content}</div>
  `, "blue", "right");
  }
  function slideSidebarLeftOrange(title, content, sidebarVisual = "") {
    return _sidebarLeft("orange", title, content, sidebarVisual);
  }
  function slideSidebarLeftBlue(title, content, sidebarVisual = "") {
    return _sidebarLeft("blue", title, content, sidebarVisual);
  }
  function slideSidebarLeftPurple(title, content, sidebarVisual = "") {
    return _sidebarLeft("purple", title, content, sidebarVisual);
  }

  // temp/skills-utilities/skills/slides-generator/src/components/stripe-slides.js
  function slideStripeTopLeft(title, content) {
    return _section("stripe-top-left", `
  ${state.logoNegFn()}
  <div class="blue-banner"></div>
  <div class="green-accent"></div>
  <div class="slide-title">${title}</div>
  <div class="slide-content">${content}</div>
  `, "blue", "right");
  }
  function slideStripeTopRight(title, content) {
    return _section("stripe-top-right", `
  ${state.logoNegFn()}
  <div class="blue-banner"></div>
  <div class="green-accent"></div>
  <div class="slide-title">${title}</div>
  <div class="slide-content">${content}</div>
  `, "blue", "right");
  }

  // temp/skills-utilities/skills/slides-generator/src/components/content-slides.js
  function slideStandard(title, content) {
    return _section("standard", `
  ${state.logoPosFn()}
  <div class="slide-header"><h2>${title}</h2></div>
  <div class="slide-content">${content}</div>
  `, "blue", "right");
  }
  function slideTwoCols(title, col1, col2) {
    return _section("two-cols", `
  ${state.logoPosFn()}
  <div class="slide-header"><h2>${title}</h2></div>
  <div class="cols-container">
    <div class="col">${col1}</div>
    <div class="col">${col2}</div>
  </div>
  `, "blue", "right");
  }
  function slideThreeCols(title, col1, col2, col3) {
    return _section("three-cols", `
  ${state.logoPosFn()}
  <div class="slide-header"><h2>${title}</h2></div>
  <div class="cols-container">
    <div class="col">${col1}</div>
    <div class="col">${col2}</div>
    <div class="col">${col3}</div>
  </div>
  `, "blue", "right");
  }
  function slideTwoCards(title, c1title, c1, c2title, c2) {
    function _card(colorClass, header, body) {
      return `<div class="card ${colorClass}">
      <div class="card-header">${header}</div>
      <div class="card-body">${body}</div>
    </div>`;
    }
    return _section("four-cards cards-grid-2-slide", `
  ${state.logoPosFn()}
  <div class="slide-header"><h2>${title}</h2></div>
  <div class="cards-grid cards-grid-2">
    ${_card("blue", c1title, c1)}
    ${_card("green", c2title, c2)}
  </div>
  `, "blue", "right");
  }
  function slideThreeCards(title, c1title, c1, c2title, c2, c3title, c3) {
    function _card(colorClass, header, body) {
      return `<div class="card ${colorClass}">
      <div class="card-header">${header}</div>
      <div class="card-body">${body}</div>
    </div>`;
    }
    return _section("four-cards cards-grid-3-slide", `
  ${state.logoPosFn()}
  <div class="slide-header"><h2>${title}</h2></div>
  <div class="cards-grid cards-grid-3">
    ${_card("blue", c1title, c1)}
    ${_card("purple", c2title, c2)}
    ${_card("orange", c3title, c3)}
  </div>
  `, "blue", "right");
  }
  function slideFourCards(title, c1title, c1, c2title, c2, c3title, c3, c4title, c4) {
    function _card(colorClass, header, body) {
      return `<div class="card ${colorClass}">
      <div class="card-header">${header}</div>
      <div class="card-body">${body}</div>
    </div>`;
    }
    return _section("four-cards", `
  ${state.logoPosFn()}
  <div class="slide-header"><h2>${title}</h2></div>
  <div class="cards-bg"></div>
  <div class="cards-grid">
    ${_card("blue", c1title, c1)}
    ${_card("purple", c2title, c2)}
    ${_card("orange", c3title, c3)}
    ${_card("green", c4title, c4)}
  </div>
  `, "blue", "right");
  }
  function slideCards(title, cards = []) {
    const colors = ["blue", "purple", "orange", "green", "blue", "purple"];
    const gridClass = cards.length === 2 ? "cards-grid-2" : cards.length === 3 ? "cards-grid-3" : cards.length > 4 ? "cards-grid-6" : "";
    const cardsHtml = cards.map((c, i) => {
      const colorClass = c.color || colors[i % colors.length];
      const iconHtml = c.icon ? `<span class="card-icon-slot" style="margin-right:8px; display:inline-flex; align-items:center; vertical-align:middle;">${c.icon}</span>` : "";
      return `<div class="card ${colorClass}">
      <div class="card-header" style="display:flex; align-items:center; gap:8px;">${iconHtml}<span>${c.title}</span></div>
      <div class="card-body">${c.body}</div>
    </div>`;
    }).join("");
    return _section("four-cards dynamic-cards-slide", `
  ${state.logoPosFn()}
  <div class="slide-header"><h2>${title}</h2></div>
  <div class="cards-grid ${gridClass}">
    ${cardsHtml}
  </div>
  `, "blue", "right");
  }

  // temp/skills-utilities/skills/slides-generator/src/utils/helpers.js
  function mermaid(code) {
    return `<div class="mermaid">${code}</div>`;
  }
  function markdown(md) {
    return `<div data-markdown>${md}</div>`;
  }
  function codeBlock(code, lang = "") {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
  }

  // temp/skills-utilities/skills/slides-generator/src/utils/icons.js
  var icons = {
    check: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#4CB979"/><polyline points="7,12 10,15 17,8" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cpu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#5454E9"/><rect x="8" y="8" width="8" height="8" rx="1" stroke="white" stroke-width="1.5" fill="none"/><line x1="10" y1="5" x2="10" y2="8" stroke="white" stroke-width="1.5"/><line x1="14" y1="5" x2="14" y2="8" stroke="white" stroke-width="1.5"/><line x1="10" y1="16" x2="10" y2="19" stroke="white" stroke-width="1.5"/><line x1="14" y1="16" x2="14" y2="19" stroke="white" stroke-width="1.5"/><line x1="5" y1="10" x2="8" y2="10" stroke="white" stroke-width="1.5"/><line x1="5" y1="14" x2="8" y2="14" stroke="white" stroke-width="1.5"/><line x1="16" y1="10" x2="19" y2="10" stroke="white" stroke-width="1.5"/><line x1="16" y1="14" x2="19" y2="14" stroke="white" stroke-width="1.5"/></svg>`,
    code: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#865CF0"/><polyline points="9,9 6,12 9,15" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><polyline points="15,9 18,12 15,15" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    gear: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#5454E9"/><circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.5" fill="none"/><line x1="12" y1="5" x2="12" y2="7" stroke="white" stroke-width="1.5"/><line x1="12" y1="17" x2="12" y2="19" stroke="white" stroke-width="1.5"/><line x1="5" y1="12" x2="7" y2="12" stroke="white" stroke-width="1.5"/><line x1="17" y1="12" x2="19" y2="12" stroke="white" stroke-width="1.5"/></svg>`,
    alert: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#E9683B"/><line x1="12" y1="7" x2="12" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1" fill="white"/></svg>`,
    lightning: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#E4EB60"/><polygon points="13,6 7,14 12,14 11,18 17,10 12,10" fill="#393939"/></svg>`,
    box: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#4CB979"/><rect x="7" y="9" width="10" height="7" rx="1" stroke="white" stroke-width="1.5" fill="none"/><line x1="7" y1="12" x2="17" y2="12" stroke="white" stroke-width="1.5"/></svg>`,
    pointer: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#865CF0"/><path d="M9 7L16 12L12 13.5L10.5 17.5L9 7Z" stroke="white" stroke-width="1.5" fill="white" stroke-linejoin="round"/></svg>`,
    memory: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#E9683B"/><rect x="7" y="8" width="10" height="8" rx="1" stroke="white" stroke-width="1.5" fill="none"/><line x1="9" y1="10" x2="9" y2="14" stroke="white" stroke-width="1.5"/><line x1="12" y1="10" x2="12" y2="14" stroke="white" stroke-width="1.5"/><line x1="15" y1="10" x2="15" y2="14" stroke="white" stroke-width="1.5"/></svg>`,
    shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#E9683B"/><path d="M12 6L17 9V13.5C17 16.5 12 19 12 19C12 19 7 16.5 7 13.5V9L12 6Z" stroke="white" stroke-width="1.5" fill="none"/></svg>`,
    database: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#393939"/><ellipse cx="12" cy="9" rx="5" ry="2" stroke="white" stroke-width="1.5" fill="none"/><line x1="7" y1="9" x2="7" y2="15" stroke="white" stroke-width="1.5"/><line x1="17" y1="9" x2="17" y2="15" stroke="white" stroke-width="1.5"/><ellipse cx="12" cy="15" rx="5" ry="2" stroke="white" stroke-width="1.5" fill="none"/></svg>`,
    terminal: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#5454E9"/><polyline points="8,9 11,12 8,15" stroke="white" stroke-width="1.5" fill="none"/><line x1="13" y1="15" x2="16" y2="15" stroke="white" stroke-width="1.5"/></svg>`,
    arrow: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#5454E9"/><polyline points="10,8 14,12 10,16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    star: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; display: inline-block; flex-shrink: 0;"><circle cx="12" cy="12" r="10" fill="#E4EB60"/><polygon points="12,6 13.8,9.6 17.8,10.2 14.9,13 15.6,17 12,15.1 8.4,17 9.1,13 6.2,10.2 10.2,9.6" fill="#393939"/></svg>`
  };

  // temp/skills-utilities/skills/slides-generator/src/utils/init.js
  function init(options = {}) {
    if (typeof Reveal !== "undefined") {
      Reveal.initialize({
        width: 1280,
        height: 720,
        margin: 0,
        minScale: 0.2,
        maxScale: 2,
        controls: true,
        controlsTutorial: false,
        progress: true,
        slideNumber: false,
        hash: true,
        keyboard: true,
        overview: true,
        center: true,
        // center:true es necesario con position:absolute dentro de sections
        touch: true,
        loop: false,
        fragments: true,
        embedded: false,
        help: true,
        transition: "slide",
        transitionSpeed: "default",
        backgroundTransition: "fade",
        pdfSeparateFragments: false,
        plugins: [
          ...typeof RevealMarkdown !== "undefined" ? [RevealMarkdown] : [],
          ...typeof RevealHighlight !== "undefined" ? [RevealHighlight] : [],
          ...typeof RevealNotes !== "undefined" ? [RevealNotes] : []
        ],
        ...options
      });
    } else {
      console.warn("[icesibeamer] Reveal.js no est\xE1 cargado. Llama a icesi.init() despu\xE9s de cargar Reveal.js.");
    }
    if (typeof window.mermaid !== "undefined") {
      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            primaryColor: "#5454E9",
            secondaryColor: "#865CF0",
            tertiaryColor: "#4CB979",
            primaryTextColor: "#FFFFFF",
            secondaryTextColor: "#393939",
            lineColor: "#393939",
            nodeBorder: "#5454E9",
            clusterBkg: "#f0f0ff",
            titleColor: "#FFFFFF",
            edgeLabelBackground: "#f8f8ff"
          },
          flowchart: {
            curve: "basis",
            padding: 20
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50
          },
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        });
        window.mermaid.run({ querySelector: ".mermaid" });
      } catch (e) {
        console.warn("[icesibeamer] Mermaid initialize error:", e);
      }
    } else {
      console.warn("[icesibeamer] Mermaid.js no est\xE1 cargado.");
    }
  }
  function _reset() {
    setN(0);
  }
  function _count() {
    return getN();
  }
  function setBasePath(basePath) {
    const neg = basePath + "resources/logos/ICESI_logo_prin_descriptor_WHITE.svg";
    const pos = basePath + "resources/logos/ICESI_logo_prin_descriptor_RGB_POSITIVO_0924.svg";
    setLogos(neg, pos);
  }

  // temp/skills-utilities/skills/slides-generator/src/main.js
  var icesi = {
    titleSlideA,
    titleSlideB,
    titleSlideC,
    titleSlideD,
    titleSlideE,
    titleSlideF,
    sectionSlideA,
    sectionSlideB,
    sectionSlideC,
    sectionSlideE,
    sectionSlideEBlue,
    sectionSlideEGreen,
    sectionSlideEYellow,
    sectionSlideEOrange,
    slideSidebarLeftOrange,
    slideSidebarLeftBlue,
    slideSidebarLeftPurple,
    slideStripeTopLeft,
    slideStripeTopRight,
    slideStandard,
    slideTwoCols,
    slideThreeCols,
    slideTwoCards,
    slideThreeCards,
    slideFourCards,
    slideCards,
    mermaid,
    markdown,
    codeBlock,
    icons,
    init,
    setBasePath,
    _reset,
    _count
  };
  if (typeof window !== "undefined") {
    window.icesi = icesi;
  }
  var main_default = icesi;
})();
