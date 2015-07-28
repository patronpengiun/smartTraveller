var nameUrlData = [
    {
    	text : "Destination",
    	children : [
    	    {text: "East", href: "http://lvcheng.us/index-east"},
    	    {text: "West", href: "http://lvcheng.us/west"},
    	    {text: "Florida", href: "http://lvcheng.us/index-florida"}]
    }
];

var LogoWrapper = React.createClass({displayName: "LogoWrapper",
	render : function() {
		return(
			React.createElement("div", {id: "logoWrapper"}, React.createElement(LogoImage, null))
			)
	}
});

var LogoImage = React.createClass({displayName: "LogoImage",
	render : function() {
		return (
			React.createElement("h1", null, React.createElement("a", {href: "/"}, React.createElement("img", {src: 'img/index.png', id: "navLogoImage"})))
			);
	}
});

var HeaderNav = React.createClass({displayName: "HeaderNav",
	render: function() {
		return (
			React.createElement("div", {id: "headerNav"}, 
			React.createElement(HeaderFolder, {data: nameUrlData}), 
			React.createElement(HeaderFolder, {data: nameUrlData})
			)
			)
	}
});

var HeaderFolder = React.createClass({displayName: "HeaderFolder",
	render: function () {
		var config = this.props.data;

		var items = config.map(function (item) {
			var children, dropdown;
			if (item.children) {
				children = item.children.map(function (child) {
					return (
						React.createElement("li", {className: "navigation-dropdown-item"}, 
						React.createElement("a", {className: "navigation-dropdown-link", href:  child.href}, 
						 child.text
						)
						)
						);
				});

				dropdown = (
					React.createElement("ul", {className: "navigation-dropdown"}, 
					 children 
					)
					);
			}
			return (
				React.createElement("li", {className: "navigation-item"}, 
				React.createElement("a", {className: "navigation-link", href:  item.href}, 
				 item.text
				), 

				 dropdown 
				)
				);
		});

		return (
			React.createElement("div", {className: "navigation"}, 
				 items 
			)
			);
	}
});

var HeaderCollection = React.createClass({displayName: "HeaderCollection",
	render: function() {
		return(
			React.createElement("div", {className: "collection"}, 
				React.createElement("a", {href: this.props.data.url}, " ", this.props.data.name, " ")
			)
			)
	}
});

var Header = React.createClass({displayName: "Header",
	render: function() {
		return (
			React.createElement("div", {className: "header-inner"}, 
			React.createElement(LogoWrapper, null), 
			React.createElement(HeaderNav, null)
			)
			)
	}
});

React.render(React.createElement(Header, null), document.getElementById('header'));