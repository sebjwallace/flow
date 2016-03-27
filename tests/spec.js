
describe('Schema', function(){

	var root = document.getElementById('root');

	it('gets loaded', function(){
		expect(Schema).toBeDefined();
	});

	it('renders a div', function(){
		var schematic = {
			template: ['div', '#test1' ,'this is the content']
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('test1');
		expect(testDiv.id).toEqual('test1');
		expect(testDiv.innerHTML).toEqual('this is the content');
	});

	it('renders nested divs', function(){
		var schematic = {
			template: ['div', '#test1',
				['div', '#subdiv', 'this is the subdiv']
			]
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('test1');
		expect(testDiv.children['subdiv']).toBeDefined();
		expect(testDiv.children['subdiv'].innerHTML).toEqual('this is the subdiv');
	});

	it('renders a div using id', function(){
		var schematic = {
			template: ['#test2' ,'no need for div, just use the id']
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('test2');
		expect(testDiv.id).toEqual('test2');
		expect(testDiv.innerHTML).toEqual('no need for div, just use the id');
	});

	it('renders a div using className', function(){
		var schematic = {
			template: ['.test2' ,'no need for div, just use the className']
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementsByClassName('test2')[0];
		expect(testDiv.innerHTML).toEqual('no need for div, just use the className');
	});

	it('renders an element with attributes', function(){
		var schematic = {
			template: ['a', '#testlink', 'href: http://github.com', 'style: color:brown', 'github']
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('testlink');
		expect(testDiv.tagName).toEqual('A');
		expect(testDiv.getAttribute('href')).toEqual('http://github.com');
		expect(testDiv.style.color).toEqual('brown');
	});

	it('renders data into a rendered element', function(){
		var schematic = {
			data: {
				title: 'The test heading'
			},
			template: ['h1', '#title', '$title']
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('title');
		expect(testDiv.innerHTML).toEqual('The test heading');
	});

	it('loops data from an array into a rendered element', function(){
		var schematic = {
			data: {
				list: ['milk','eggs','bread']
			},
			template: ['ul', '#list', '% $item in $list',
				['li', '$item']
			]
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('list');
		expect(testDiv.innerHTML)
			.toEqual('<li>milk</li><li>eggs</li><li>bread</li>');
	});

	it('loops data from an object literal into a rendered element', function(){
		var schematic = {
			data: {
				items: [
					{title:'milk', price:1.20},
					{title:'bread', price: 1.50}
				]
			},
			template: ['ul', '#objectList', '% $item in $items',
				['li',
					['h2', '$item.title'],
					['p', '$item.price']
				]
			]
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('objectList');
		expect(testDiv.innerHTML)
			.toEqual('<li><h2>milk</h2><p>1.2</p></li><li><h2>bread</h2><p>1.5</p></li>');
	});

	it('attaches events to rendered elements', function(){
		var schematic = {
			template: ['ul', '#event', '!onclick: clicker'],
			clicker: function(){ console.log('clicker works'); }
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('event');
		expect(testDiv.onclick).toBeDefined();
	});

	it('runs an init function once rendered, if it has such a method defined', function(){
		var schematic = {
			data: {
				title: 'loading...'
			},
			template: ['#initMethod', '$title'],
			init: function(self){ self.setData({title:'loaded'}) }
		}
		Schema.engine(schematic,root);

		var testDiv = document.getElementById('initMethod');
		expect(testDiv.innerHTML).toEqual('loaded');
	});

});
