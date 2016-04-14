
var $ = Schema.$

describe('schema', function(){

	it("should produce a vNode", function() {
  		var vNode = $('div')
  			.vNode()
		expect(vNode.type).toEqual('VirtualNode');
	});

	it("will set the tag to 'div' by default", function() {
  		var vNode = $()
  			.vNode()
		expect(vNode.tagName).toEqual('DIV');
	});

	it("can set attributes", function() {
  		var vNode = $('div')
  			.attr('id','tester')
  			.vNode()
		expect(vNode.properties.id).toEqual('tester');
	});

	it("can set id", function() {
  		var vNode = $('div')
  			.id('tester')
  			.vNode()
		expect(vNode.properties.id).toEqual('tester');
	});

	it("can set className", function() {
  		var vNode = $('div')
  			.class('tester')
  			.vNode()
		expect(vNode.properties.className).toEqual('tester');
	});

	it("can add children to the node", function() {
  		var vNode = $('div')
  			.children(
  				$('div')
  			)
  			.vNode()
		expect(vNode.children.length).toEqual(1);
	});

	it("can add multiple children to the node", function() {
  		var vNode = $('div')
  			.children(
  				$('div'),
  				$('h1')
  			)
  			.vNode()
		expect(vNode.children.length).toEqual(2);
	});

	it("can add VirtualText to the node", function() {
  		var vNode = $()
  			.text('content text')
  			.vNode()
		expect(vNode.children[0].type).toEqual("VirtualText");
		expect(vNode.children[0].text).toEqual("content text");
	});

	it("can add styles to the node", function() {
  		var vNode = $()
  			.style('color','blue')
  			.vNode()
		expect(vNode.properties.style.color).toEqual("blue");
	});

	it("can add color styles", function() {
  		var vNode = $()
  			.color('blue')
  			.vNode()
		expect(vNode.properties.style.color).toEqual("blue");
	});

	it("can add background-color styles", function() {
  		var vNode = $()
  			.background('blue')
  			.vNode()
		expect(vNode.properties.style['background-color']).toEqual("blue");
	});

	it("can add colors using rgb in arguments", function() {
  		var vNode = $()
  			.color(10,50,120)
  			.vNode()
		expect(vNode.properties.style.color).toEqual('rgb(10,50,120)');
	});

	it("can add colors using rgba in arguments", function() {
  		var vNode = $()
  			.color(10,50,120,0.8)
  			.vNode()
		expect(vNode.properties.style.color).toEqual('rgba(10,50,120,0.8)');
	});

	it("can add height size style with px by default", function() {
  		var vNode = $()
  			.size(10)
  			.vNode()
		expect(vNode.properties.style.height.replace(' ','')).toEqual('10px');
	});

	it("can add height and width size style with different units: %, em, etc", function() {
  		var vNode = $()
  			.size(10,20,'%')
  			.vNode()
		expect(vNode.properties.style.height.replace(' ','')).toEqual('10%');
		expect(vNode.properties.style.width.replace(' ','')).toEqual('20%');

		var vNode = $()
  			.size(10,20,'em')
  			.vNode()
		expect(vNode.properties.style.height.replace(' ','')).toEqual('10em');
		expect(vNode.properties.style.width.replace(' ','')).toEqual('20em');
	});

	it("can add padding style with px as default", function() {
  		var vNode = $()
  			.padding(10)
  			.vNode()
		expect(vNode.properties.style.padding.replace(' ','')).toEqual('10px');
	});

	it("can add padding style with different units: %, em, etc", function() {
  		var vNode = $()
  			.padding(10,'%')
  			.vNode()
		expect(vNode.properties.style.padding.replace(' ','')).toEqual('10%');

		var vNode = $()
  			.padding(10,'em')
  			.vNode()
		expect(vNode.properties.style.padding.replace(' ','')).toEqual('10em');
	});

	it("can add margin style with px as default", function() {
  		var vNode = $()
  			.margin(10)
  			.vNode()
		expect(vNode.properties.style.margin.replace(' ','')).toEqual('10px');
	});

	it("can add margin style with different units: %, em, etc", function() {
  		var vNode = $()
  			.margin(10,'%')
  			.vNode()
		expect(vNode.properties.style.margin.replace(' ','')).toEqual('10%');

		var vNode = $()
  			.margin(10,'em')
  			.vNode()
		expect(vNode.properties.style.margin.replace(' ','')).toEqual('10em');
	});

	it("can add border style with px as default", function() {
  		var vNode = $()
  			.border(5,'solid','blue')
  			.vNode()
		expect(vNode.properties.style.border).toEqual('5px solid blue');
	});

	it("can add opacity style", function() {
  		var vNode = $()
  			.opacity(0.5)
  			.vNode()
		expect(vNode.properties.style.opacity).toEqual(0.5);
	});

	it("can add transition style", function() {
  		var vNode = $()
  			.transition('all',1.5)
  			.vNode()
		expect(vNode.properties.style.transition).toEqual('all 1.5s');

		var vNode = $()
  			.transition('opacity',0.8)
  			.vNode()
		expect(vNode.properties.style.transition).toEqual('opacity 0.8s');
	});

	it("can extend abstract nodes", function() {
		var abstract = $().opacity(0.8).padding(20)

  		var vNode = $()
  			.extend(abstract)
  			.vNode()
		expect(vNode.properties.style.opacity).toEqual(0.8);
		expect(vNode.properties.style.padding).toEqual('20px ');
	});

	it("can add element events", function() {
  		var vNode = $()
  			.event('onclick',function clicked(){})
  			.vNode()
		expect(vNode.properties.onclick).toEqual(jasmine.any(Function));
		expect(vNode.properties.onclick.name).toEqual('clicked');
	});

	it("can change styles from events", function() {
  		var domNode = $()
  			.event('onclick',$(this).opacity(0.5))
  			.render()
  			.click()
  			.domNode()
		expect(domNode.style.opacity).toEqual('0.5');
	});


})