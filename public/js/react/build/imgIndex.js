var imgs = ['img/icons/drive.png', 'img/icons/people.png', 'img/icons/walk.png'];

var ImgIndex = React.createClass({displayName: "ImgIndex",
    render: function() {
        var imgs = this.props.data.map(function (url) {
            return (
                React.createElement(Image, {src: url, count: this.props.data.length})
            );
        });
        return (
            React.createElement("div", {className: "imgIndex-wrapper"}, 
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
        this.setState({class: "loaded inactive"});
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

$(document).ready(function() {
	React.render(
		React.createElement(ImgIndex, {data: imgs}),
		document.getElementById('img-index')
	);
});