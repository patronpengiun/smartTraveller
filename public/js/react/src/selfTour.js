var React = require('react');

var Price = require('./price');
var Schedule = require('./schedule');
var classSet = require('react-classset');

module.exports = React.createClass({
    render: function() {
        var schedule = this.props.schedule.map(function(day, idx) {
            return (
                <div className="schedule-element">
                    <div className="schedule-element-header">
                        {day.header}
                    </div>
                    <div className="schedule-element-content">
                        <div className="schedule-element-img">
                            <img src={day.imgURL} />
                            <div className="img-description">{day.imgText}</div>
                        </div>
                        <div className="schedule-element-text">
                            {day.text}
                        </div>
                    </div>
                </div>
            );
        }, this);
        
        return (
            <div className="group-tour-container">
                <div className="header-container">
                    <div className="header-img-container">
                        <img src={this.props.titleImg}/>
                    </div>
                    <div className="header-description-container" dangerouslySetInnerHTML={{__html:this.props.description}}>
                    </div>
                </div>
                <div className="schedule-container">
                    {schedule}
                </div>
                <div className="purchase-container">
                    <div className="step-container">
                        <div className="depature-place">
                            您从哪里出发＊
                            <input type="radio" name="depature" value="国内出发"/>国内出发
                            <input type="radio" name="depature" value="美国出发"/>美国出发
                        </div>
                        <div className="flight">
                            是否需要帮您订购机票＊
                            <input type="radio" name="flight" value="是"/>是
                            <input type="radio" name="flight" value="否"/>否
                        </div>
                        <div className="people-count">
                            随行人数＊
                            <select name="people-count">
                                <option value="1人">1人</option>
                                <option value="2人">2人</option>
                                <option value="3人">3人</option>
                                <option value="4人">4人</option>
                                <option value="5人">5人</option>
                                <option value="5人以上">5人以上</option>
                            </select>
                        </div>
                        <div className="depature-date">
                            <div className="month">
                                <input className="month-input"/>MM
                            </div>
                            <div className="day">
                                 <input className="day-input"/>DD
                            </div>
                            <div className="year">
                                 <input className="year-input"/>YYYY
                            </div>
                        </div>
                        <div className="car-rental">
                            租车类型(请参见左侧图示)
                            <input type="radio" name="car" value="Ford Focus"/>Ford Focus
                            <input type="radio" name="car" value="Ford Escape"/>Ford Escape
                            <input type="radio" name="car" value="Ford Mustang"/>Ford Mustang
                        </div>
                        <div className="hotel">
                            预订酒店类型
                            <input type="radio" name="flight" value="三星酒店"/>三星酒店
                            <input type="radio" name="flight" value="四星酒店"/>四星酒店
                        </div>
                    </div>
                    <div className="form-container">
                    </div>
                </div>        
            </div>
        )
    }
});