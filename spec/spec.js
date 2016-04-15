
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

	it("can add height styles with px as default", function() {
  		var vNode = $()
  			.height(50)
  			.vNode()
		expect(vNode.properties.style.height).toEqual("50px");

		var vNode = $()
  			.height(50,'%')
  			.vNode()
		expect(vNode.properties.style.height).toEqual("50%");

		var vNode = $()
  			.height('50em')
  			.vNode()
		expect(vNode.properties.style.height).toEqual("50em");
	});

	it("can add width styles with px as default", function() {
  		var vNode = $()
  			.width(50)
  			.vNode()
		expect(vNode.properties.style.width).toEqual("50px");

		var vNode = $()
  			.width(50,'%')
  			.vNode()
		expect(vNode.properties.style.width).toEqual("50%");

		var vNode = $()
  			.width('50em')
  			.vNode()
		expect(vNode.properties.style.width).toEqual("50em");
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

	it("can add height size style using 'size' method with px by default", function() {
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

	it("can add transition style with 'all' by default", function() {
  		var vNode = $()
  			.transition(1.2)
  			.vNode()
		expect(vNode.properties.style.transition).toEqual('all 1.2s');
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

	it("can add click events", function() {
  		var vNode = $()
  			.onclick(function clicked(){})
  			.vNode()
		expect(vNode.properties.onclick).toEqual(jasmine.any(Function));
		expect(vNode.properties.onclick.name).toEqual('clicked');
	});

	it("can add styles from events", function() {
  		var domNode = $()
  			.onclick($(this).opacity(0.5))
  			.render()
  			.click()
  			.domNode()
		expect(domNode.style.opacity).toEqual('0.5');
	});

	it("can change styles from events", function() {
  		var domNode = $()
  			.color('white')
  			.onclick($(this).color('blue'))
  			.render()
  			.click()
  			.domNode()
		expect(domNode.style.color).toEqual('blue');
	});

	var $action = Schema.$action


	it("can pull actions to add/change styles", function() {
  		var vNode = $()
  			.color('white')
  			.action('@changeColor',
  				$(this).color('blue')
  			)
  			.render()

  		$action.getActions('@changeColor')[0]()
  		var domNode = vNode.domNode()
		expect(domNode.style.color).toEqual('blue');
	});

	it("can push actions from events", function() {
		var mutateResult = "not changed"
		$action.pull('@clickAction', function(){ mutateResult = "has changed" })

  		var vNode = $()
  			.onclick('@clickAction')
  			.render()
  			.click()

		expect(mutateResult).toEqual('has changed');
		$action.removeAllActions()
	});

	it("can push actions from events with arguments", function() {
		var mutateResult = "not changed"
		$action.pull('@clickAction', function(text){ mutateResult = text })

  		var vNode = $()
  			.onclick('@clickAction','has changed')
  			.render()
  			.click()

		expect(mutateResult).toEqual('has changed');
		$action.removeAllActions()
	});

	it("can push actions from events with multiple arguments", function() {
		var mutateResult = "not changed"
		$action.pull('@clickAction',
			function(first,second,third){ mutateResult = first + ' ' + second + ' ' + third })

  		var vNode = $()
  			.onclick('@clickAction',['has changed','with second','and third param'])
  			.render()
  			.click()

		expect(mutateResult).toEqual('has changed with second and third param');
		$action.removeAllActions()
	});

	it("can push actions from one node and pull actions from another to change styles", function() {
  		var firstNode = $()
  			.action('@changeOpacity',
  				$(this).opacity(0.4)
  			)
  			.render()

  		var secondNode = $()
  			.onclick('@changeOpacity')
  			.render()
  			.click()

		expect(firstNode.domNode().style.opacity).toEqual('0.4');
		$action.removeAllActions()
		firstNode.removeStyles()
	});

	it("can push actions from one node and pull actions from another to change styles with arguments", function() {
  		var firstNode = $()
  			.width(80)
  			.action('@changeWidth',
  				function(width){
	  				return $(this).width(width)
  				}
  			)
  			.render()

  		var secondNode = $()
  			.onclick('@changeWidth',200)
  			.render()
  			.click()

		expect(firstNode.domNode().style.width).toEqual('200px');
		$action.removeAllActions()
		firstNode.removeStyles()
	});

	it("can push actions from one node and pull actions from another to change styles with multiple arguments", function() {
  		var firstNode = $()
  			.height(0)
  			.width(0)
  			.action('@changeSize',
  				function(height,width){
	  				return $(this)
	  					.height(height)
	  					.width(width)
	  					.hide()
  				}
  			)
  			.render()

  		var secondNode = $()
  			.onclick('@changeSize',[560,920])
  			.render()
  			.click()

		expect(firstNode.domNode().style.width).toEqual('920px');
		expect(firstNode.domNode().style.height).toEqual('560px');
		$action.removeAllActions()
		firstNode.removeStyles()
	});

	it("can map over data into a VirtualText node child", function() {

		var data = [1,2,3,4]

  		var vNode = $()
  			.mapToText(data,function(item){
  				return item + ' '
  			})

		expect(vNode.vNode().children[0].text).toEqual('1 2 3 4 ');
	});

	it("can map over data into child nodes", function() {

		var data = [
			{name: 'Jack', age: '27'},
			{name: 'Dave', age: '44'}
		]

  		var vNode = $()
  			.map(data, function(item){
  				return $('div')
  					.padding(5)
  					.text(item.name + ' is ' + item.age)
  			})

		expect(vNode.vNode().children.length).toEqual(2);
		expect(vNode.vNode().children[0].children[0].text).toEqual('Jack is 27');
		expect(vNode.vNode().children[0].properties.style.padding).toEqual('5px ');
		expect(vNode.vNode().children[1].children[0].text).toEqual('Dave is 44');
		expect(vNode.vNode().children[1].properties.style.padding).toEqual('5px ');
	});

	it("can filter then map over data into child nodes", function() {

		var data = [
			{name: 'Kai', age: '8'},
			{name: 'Anna', age: '28'}
		]

  		var vNode = $()
  			.filterMap(data, 
  				function(item){
  					return item.age > 10
  				},
  				function(item){
  				return $('div')
  					.padding(5)
  					.text(item.name + ' is ' + item.age)
  			})

		expect(vNode.vNode().children.length).toEqual(1);
		expect(vNode.vNode().children[0].children[0].text).toEqual('Anna is 28');
		expect(vNode.vNode().children[0].properties.style.padding).toEqual('5px ');
	});


})