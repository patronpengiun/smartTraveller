var React = require('react');
var classSet = require('react-classset');

module.exports = React.createClass({displayName: "exports",
    getInitialState: function() {
        return {
            allLoaded: false,
            loadedCount: 0,
        };
    },
    
    onImageLoad: function() {
        this.setState({loadedCount: this.state.loadedCount+1});
        var imgCount = this.props.urls.length
        if (this.state.loadedCount == imgCount) {
            this.setState({allLoaded: true});
            var currentIdx = 0;
            setInterval(function(component) {
                // TODO: get rid of toString
                component.refs[currentIdx].setState({class: "active"});
                component.refs[(currentIdx+imgCount-1) % imgCount].setState({class: ""});
                currentIdx = (currentIdx+1) % imgCount;
            }, 3000, this);
        }
    },
    
    render: function() {
        var classes = classSet({
            'loaded': this.state.allLoaded 
        });
        var imgs = this.props.urls.map(function (url,idx) {
            return (
                React.createElement(Image, {ref: idx.toString(), src: url, callbackParent: this.onImageLoad})
            );
        }, this);
        return (
            React.createElement("div", {id: "img-index-wrapper", className: classes}, 
                React.createElement("div", {className: "default-backdrop"}), 
                imgs
            )
        );
    }
});

var Image = React.createClass({displayName: "Image",
    getInitialState: function() {
        return {
            class: ""
        }
    },
    
    onImageLoad: function() {
        this.props.callbackParent();
    },
    
    componentDidMount: function() {
        var imgNode = this.refs.img.getDOMNode();
        imgNode.onload = this.onImageLoad;
    },
    
    render: function() {
        return (
          React.createElement("img", {ref: "img", src: this.props.src, className: this.state.class})  
        );
    }
});