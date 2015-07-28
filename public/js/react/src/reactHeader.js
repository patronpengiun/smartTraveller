var nameUrlData = [
    {
    	text : "Destination",
    	children : [
    	    {text: "East", href: "http://lvcheng.us/index-east"},
    	    {text: "West", href: "http://lvcheng.us/west"},
    	    {text: "Florida", href: "http://lvcheng.us/index-florida"}]
    }
];

var LogoWrapper = React.createClass({
	render : function() {
		return(
			<div id ="logoWrapper"><LogoImage/></div>
			)
	}
});

var LogoImage = React.createClass({
	render : function() {
		return (
			<h1><a href="/"><img src={'../../icon/favicon.ico'} id="navLogoImage"></img></a></h1>
			);
	}
});

var HeaderNav = React.createClass({
	render: function() {
		return (
			<div id="headerNav">
			<HeaderFolder data={nameUrlData}/>
			<HeaderFolder data={nameUrlData}/>
			</div>
			)
	}
});

var HeaderFolder = React.createClass({
	render: function () {
		var config = this.props.data;

		var items = config.map(function (item) {
			var children, dropdown;
			if (item.children) {
				children = item.children.map(function (child) {
					return (
						<li className="navigation-dropdown-item">
						<a className="navigation-dropdown-link" href={ child.href }>
						{ child.text }
						</a>
						</li>
						);
				});

				dropdown = (
					<ul className="navigation-dropdown">
					{ children }
					</ul>
					);
			}
			return (
				<li className="navigation-item">
				<a className="navigation-link" href={ item.href }>
				{ item.text }
				</a>

				{ dropdown }
				</li>
				);
		});

		return (
			<div className="navigation">
				{ items }
			</div>
			);
	}
});

var HeaderCollection = React.createClass({
	render: function() {
		return(
			<div className="collection">
				<a href={this.props.data.url}> {this.props.data.name} </a>
			</div>
			)
	}
});

var Header = React.createClass({
	render: function() {
		return (
			<div className="header-inner">
			<LogoWrapper/>
			<HeaderNav/>
			</div>
			)
	}
});

$(document).ready(function() {
    React.render(
        <Header />,
        document.getElementById('header')
    );
});