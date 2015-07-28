var imgs = ['img/icons/drive.png', 'img/icons/people.png', 'img/icons/walk.png'];

var ImgIndex = React.createClass({
    render: function() {
        var imgs = this.props.data.map(function (url) {
            return (
                <Image src={url} count={this.props.data.length}/>
            );
        });
        return (
            <div className="imgIndex-wrapper">
                {imgs}
            </div>
        );
    }
});

var Image = React.createClass({
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
          <img ref="img" src={this.props.src} className={this.state.class} />  
        );
    }
});

$(document).ready(function() {
	React.render(
		<ImgIndex data={imgs} />,
		document.getElementById('img-index')
	);
});