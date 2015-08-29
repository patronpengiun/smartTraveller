var React = require('react');

var Price = require('./price');
var Schedule = require('./schedule');
var classSet = require('react-classset');

var countMap = ['one', 'two', 'three', 'four', 'five', 'six'];

module.exports = React.createClass({
    render: function() {
        var guides = this.props.guides.map(function (guide) {
            return (
                <div className="guide-element-container">
                    <div className="guide-thumbnail">
                        <img src={guide.thumbnail} />
                    </div>
                    <div className="guide-name">{guide.name}</div>
                </div>
            );
        }, this);
        
        var listClass = classSet("guide-list", countMap[(this.props.guides.length-1) % 6]);
        
        return (
            <div className="guided-tour-content">
                <div className="guide-container">
                    <div className="guide-header">可选地陪</div>
                    <div className={listClass}>
                        {guides}
                    </div>
                </div>
                <div><hr/></div>
                <div className="dest-description-container">
                    <div className="dest-img-wrapper pull-left">
                        <img src={this.props.imgURL} />
                    </div>
                        <div className="dest-description" dangerouslySetInnerHTML={{__html:this.props.description}}></div>
                </div>
                <div className="clearfix"><hr/></div>
                <div className="contract-container">
                    <Price data={this.props.price} />
                    <Schedule data={this.props.schedule} />
                </div>
                <div><hr/></div>
                <div className="others-container">
                    <div className="btn-container">
                        <button><a className="link-content">购买产品</a></button>
                    </div>
                    <div className="btn-container">
                        <button className="btn-preview"><a className="link-content">行程预览</a></button>
                    </div>
                    <div className="btn-container">
                        <button className="btn-contact"><a className="link-content">联系我们</a></button>
                    </div>
                    <div className="btn-container">
                        <button className="btn-ps"><a className="link-content">特别说明</a></button>
                    </div>
                </div>
                <div className="goback-all">
                    <a>←查看所有线路</a>
                </div>
            </div>
        );
    },
});