var React = require('react');
var List = require('./component/list')

module.exports = React.createClass({
    render: function() {
        return (
            <div className="price-container">
                <div className="price-wrapper">
                    <div className="price-header">PRICE</div>
                    <div className="price-title">价格包括：</div>
                    <List class="price-list" contents={this.props.data.includes} />
                    <div className="price-title">价格不包括：</div>
                    <List class="price-list" contents={this.props.data.excludes} />
                </div>
            </div>
        );
    }
});