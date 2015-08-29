var React = require('react');

module.exports = React.createClass({
    render: function() {
        var lists = this.props.contents.map(function(content) {
            return (
                <li dangerouslySetInnerHTML={{__html:content}}></li>
            );
        },this);
        
        return (
            <ul className={this.props.class}>
                {lists}
            </ul>
        );
    }
});
         
        