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
                React.createElement("div", {id: "img-index-content"}, 
                    React.createElement("div", {className: "default-backdrop"}), 
                    imgs, 
                    React.createElement("div", {id: "img-inner-text"}, 
                        React.createElement("div", {className: "img-inner-header"}, 
                            React.createElement("div", {className: "img-inner-h1"}, "留学生带你游美国"), 
                            React.createElement("div", {className: "img-inner-h2"}, "旅橙 —— 我的地盘听你的")
                        ), 
                        React.createElement("div", {className: "img-inner-content"}, 
                            React.createElement("div", {className: "category-wrapper"}, 
                                React.createElement("a", {href: "/group_tour"}, 
                                    React.createElement("img", {src: "/img/icon/group_tour.png"})
                                )
                            ), 
                            React.createElement("div", {className: "category-wrapper"}, 
                                React.createElement("a", {href: "/self_tour"}, 
                                    React.createElement("img", {src: "/img/icon/self_tour.png"})
                                )
                            ), 
                            React.createElement("div", {className: "category-wrapper"}, 
                                React.createElement("a", {href: "guided_tour"}, 
                                    React.createElement("img", {src: "/img/icon/guided_tour.png"})
                                )
                            )
                        )
                    )
                )
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