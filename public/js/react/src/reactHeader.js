var destination = [
    {
    	text : "目的地",
    	children : [
    	    {text: "美西", href: "http://lvcheng.us/index-east"},
    	    {text: "美东", href: "http://lvcheng.us/west"},
    	    {text: "佛州", href: "http://lvcheng.us/index-florida"}]
    }
];

var travelOption = [
    {
    	text : "出行方式",
    	children : [
    	    {text: "传统跟团游", href: "http://lvcheng.us/index-east"},
    	    {text: "逍遥自驾游", href: "http://lvcheng.us/west"},
    	    {text: "地陪定制游", href: "http://lvcheng.us/index-florida"}]
    }
];

var aboutLvC = [
    {
    	text : "关于旅橙",
    	children : [
    	    {text: "旅称简介", href: "http://lvcheng.us/index-east"},
    	    {text: "旅称团队", href: "http://lvcheng.us/west"},
    	    {text: "加入我们", href: "http://lvcheng.us/index-florida"}]
    }
];

var collectionData1 = {url: "/", name:"攻略&游记"};
var collectionData2 = {url: "/", name:"联系我们"};
var collectionData3 = {url: "/", name:"新生入口"};

var LogoWrapper = React.createClass({
	render : function() {
		return(
			<div id ="logoWrapper"><LogoImage /></div>
		);
	}
});

var LogoImage = React.createClass({
	render : function() {
		return (
			<h1 id = "logoHeader"><a href="/"><img src={'../../icon/favicon.ico'} id="navLogoImage"></img></a></h1>
		);
	}
});

var HeaderNav = React.createClass({
	render: function() {
		return (
			<div id="headerNav">
			<HeaderFolder data={destination}/>
			<HeaderFolder data={travelOption}/>
			<HeaderCollection data={collectionData1}/>
			<LogoWrapper />
			<HeaderFolder data={aboutLvC}/>
			<HeaderCollection data={collectionData2}/>
			<HeaderCollection data={collectionData3}/>
			</div>
		);
	}
});

var HeaderFolder = React.createClass({
	getInitialState: function () {
        return {
            openDropdown: -1
        };
    },
    openDropdown: function (id) {
        this.setState({
            openDropdown: id
        });
    },
    closeDropdown: function () {
        this.setState({
            openDropdown: -1
        });
    },

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
				<li className="navigation-item"  xs>
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
			<HeaderNav />
			</div>
		);
	}
});

$(document).ready(function() {
    React.render(
        <Header />,
        document.getElementById('header')
    );

	$(".navigation-item").mouseover(function(event) {
		$("ul", this).show();
	}).mouseout(function(event) {
		$("ul", this).hide();
	});

});