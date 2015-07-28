var NavBar = React.createClass({displayName: "NavBar",
	render: function() {
		var navs = this.props.data.map(function (title) {
            return (
                React.createElement(NavCell, {content: title}
		        )
            );
        });
		return (
			React.createElement("div", {className: "nav", id: "header-nav", data: this.props.data}, 
				navs
			)
		);
	}
});

var NavCell = React.createClass({displayName: "NavCell",
	render: function() {
		return (
			React.createElement("div", {className: "nav-cell"}, 
				this.props.content
			)
		);
	}
});

var data = ['旅橙', '地陪','活动','关于'];

$(document).ready(function() {
	React.render(
		React.createElement(NavBar, {data: data}),
		document.getElementById('navbar-wrapper')
	);
});
