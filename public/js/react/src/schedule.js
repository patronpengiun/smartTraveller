var React = require('react');
var List = require('./component/list')

module.exports = React.createClass({
    render: function() {
        var contents = this.props.schedules.map(function(schedule, idx) {
            return (
                <div className="schedule-day-container">
                    <div className="schedule-title">{"Day " + (idx+1)}</div>
                    <List class="schedule-list" contents={schedule}></List>
                </div>
            )
        }, this);
        
        return (
            <div className="schedule-container">
                <div className="schedule-wrapper">
                    <div className="schedule-header">SCHEDULE</div>
                    {contents}
                </div>
            </div>
        );
    }
});