var React = require('react');

var Price = require('./price');
var Schedule = require('./schedule');
var classSet = require('react-classset');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="group-tour-container">
                <div className="contract-container">
                    <Price data={this.props.price} />
                    <Schedule data={this.props.schedule} />
                </div>
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
        )
    }
});