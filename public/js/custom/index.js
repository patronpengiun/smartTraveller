var React = require('react');
var $ = require('jquery');
var ImgIndex = require('../react/build/imgIndex');

var urls = ['img/fish.jpg', 'img/mt.jpg'];
var component = React.createElement(ImgIndex, {urls:urls});

$(document).ready(function() {
    React.render(component, $('#img-index')[0]);
});
