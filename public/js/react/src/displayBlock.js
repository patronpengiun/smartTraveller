var React = require('react');
var classSet = require('react-classset');

module.exports = React.createClass({
    render: function() {
        var contents = this.props.contents.map(function (content) {
            var mainClasses = classSet('display-element', this.props.size);
            var imgWrapperClasses = classSet({
                'adjust': this.props.adjust,
                'display-img-wrapper': true,
            });
            return (
                <div className={mainClasses}>
                    <a className={imgWrapperClasses} href={content.hrefURL}>
                        <img src={content.imgURL}/>
                    </a>
                    <div className="display-element-description" dangerouslySetInnerHTML={{__html:content.descriptionHTML}}>
                    </div>
                </div>
            );
        }, this);
        
        return (
            <div className="display-wrapper">
                <div className="display-header">
                    <div className="display-title">{this.props.title}</div>
                    <div className="display-subtitle">{this.props.subtitle}</div>
                </div>
                <div className="display-content">
                    {contents}
                </div>
            </div>
        );
    }
});