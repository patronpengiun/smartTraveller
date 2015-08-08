var NavBar = React.createClass({
	render: function() {
		var navs = this.props.data.map(function (title) {
            return (
                <NavCell content={title}>
		        </NavCell>
            );
        });
		return (
			<div className="nav" id="header-nav" data={this.props.data}>
				{navs}
			</div>
		);
	}
});

var NavCell = React.createClass({
	render: function() {
		return (
			<div className="nav-cell">
				{this.props.content}
			</div>
		);
	}
});

var data = ['旅橙', '地陪','活动','关于'];

$(document).ready(function() {
	React.render(
		<NavBar data={data} />,
		document.getElementById('navbar-wrapper')
	);
});
