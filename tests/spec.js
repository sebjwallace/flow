
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

	it('renders templates as functions', function(){
		var schematic = {
			data: {
				title: 'The test heading'
			},
			template: function(self){
				return ['h1', '#title', self.data.title]
			}
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

	it('can have nested components', function(){
		var Child = {
			template: ['#child', '>']
		}
		var Parent = {
			template: ['#parent',
				[Child,
					['p', 'this is the child']
				]
			]
		}
		Schema.engine(Parent,root);

		var parentEl = document.getElementById('parent');
		var childEl = parentEl.querySelectorAll('#child')[0];
		expect(childEl.innerHTML).toEqual('<p>this is the child</p>');
		Schema.clean();
	});

	it('can pass data down into child element', function(){
		var Child = {
			data: { title: 'this is the child' },
			template: ['#child', '$title']
		}
		var Parent = {
			template: ['#parent',
				[Child, {title: 'this is from the parent'}, '']
			]
		}
		Schema.engine(Parent,root);

		var parentEl = document.getElementById('parent');
		var childEl = parentEl.querySelectorAll('#child')[0];
		expect(childEl.innerHTML).toEqual('this is from the parent');
		Schema.clean();
	});

	it('can loop nested components with injected data', function(){
		var Child = {
			data: { title: 'this is the child' },
			template: ['.child', '$title']
		}
		var Parent = {
			data: {
				items: ['milk','eggs','bread']
			},
			template: ['#parent',
				['ul', '% $item in $items',
					[Child, {title: '$item'}, '']
				]
			]
		}
		Schema.engine(Parent,root);

		var parentEl = document.getElementById('parent');
		var childEls = parentEl.getElementsByClassName('child');
		expect(childEls[0].innerHTML).toEqual('milk');
		expect(childEls[1].innerHTML).toEqual('eggs');
		expect(childEls[2].innerHTML).toEqual('bread');
		Schema.clean();
	});

	it('can loop nested components with injected data with js', function(){
		var Child = {
			data: { title: 'this is the child' },
			template: ['.child', '$title']
		}
		var Parent = {
			data: {
				items: ['milk','eggs','bread']
			},
			template: function(self){
				const template = ['#parent'];
				self.data.items.forEach(function(item,i){
					template.push([Child, {title: i + ':' + item}, '']);
				})
				return template;
			}
		}
		Schema.engine(Parent,root);

		var parentEl = document.getElementById('parent');
		var childEls = parentEl.getElementsByClassName('child');
		expect(childEls[0].innerHTML).toEqual('0:milk');
		expect(childEls[1].innerHTML).toEqual('1:eggs');
		expect(childEls[2].innerHTML).toEqual('2:bread');
	});

});
