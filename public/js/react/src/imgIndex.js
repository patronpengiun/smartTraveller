var React = require('react');
var classSet = require('react-classset');

module.exports = React.createClass({
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
                <Image ref={idx.toString()} src={url} callbackParent={this.onImageLoad}/>
            );
        }, this);
        return (
            <div id="img-index-wrapper" className={classes}>
                <div id="img-index-content">
                    <div className="default-backdrop"></div>
                    {imgs}
                    <div id="img-inner-text">
                        <div className="img-inner-header">
                            <div className="img-inner-h1">留学生带你游美国</div>
                            <div className="img-inner-h2">旅橙 —— 我的地盘听你的</div>
                        </div>
                        <div className="img-inner-content">
                            <div className="category-wrapper">
                                <a href="/group_tour">
                                    <img src="/img/icons/group_tour.png"/>
                                </a>
                            </div>
                            <div className="category-wrapper">
                                <a href="/self_tour">
                                    <img src="/img/icons/self_tour.png"/>
                                </a>
                            </div>
                            <div className="category-wrapper">
                                <a href="guided_tour">
                                    <img src="/img/icons/guided_tour.png"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
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
        this.props.callbackParent();
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