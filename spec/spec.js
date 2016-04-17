
var $ = Flow.$

describe('flow', function(){

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
		expect(vNode.properties.className).toEqual('tester ');
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

	it("can extend multiple abstract nodes", function() {
		var first = $().opacity(0.8)
		var second = $().padding(20)

  		var vNode = $()
  			.extend(first,second)
  			.vNode()
		expect(vNode.properties.style.opacity).toEqual(0.8);
		expect(vNode.properties.style.padding).toEqual('20px ');
	});

	it("can extend abstract nodes in the constructor", function() {
		var abstract = $().opacity(1)

  		var vNode = $(abstract)
  			.vNode()
		expect(vNode.properties.style.opacity).toEqual(1);
	});

	it("can extend multiple abstract nodes in the constructor", function() {
		var first = $().opacity(0.8)
		var second = $().padding(20)

  		var vNode = $(first,second)
  			.vNode()
		expect(vNode.properties.style.opacity).toEqual(0.8);
		expect(vNode.properties.style.padding).toEqual('20px ');
	});

	it("can extend abstract nodes with arguments", function() {

		function abstract(opacity,padding){
			return $().opacity(opacity).padding(padding)
		}

  		var vNode = $()
  			.extend(abstract(0.2,50))
  			.vNode()
		expect(vNode.properties.style.opacity).toEqual(0.2);
		expect(vNode.properties.style.padding).toEqual('50px ');
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

	var $action = Flow.$action


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
		vNode.removeStyles()
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
		vNode.removeStyles()
	});

	it("mounts flexbox grid", function() {

		var grid = document.getElementById('schema-flexboxgrid')
		expect(grid.tagName).toEqual('STYLE');

	});

	it("have children structured inside a flexbox column", function() {

		var vNode = $()
			.rows(
				$('div'),
				$('div')
			)

		expect(vNode.vNode().properties.style.display).toEqual('flex');
		expect(vNode.vNode().properties.style['flex-direction']).toEqual('column');
		vNode.removeStyles()
	});

	it("have children structured inside a flexbox row", function() {

		var vNode = $()
			.columns(
				$('div'),
				$('div')
			)

		expect(vNode.vNode().properties.style.display).toEqual('flex');
		expect(vNode.vNode().properties.style['flex-direction']).toEqual('row');
		vNode.removeStyles()
	});

	it("can have children/items have order properties", function() {

		var vNode = $()
			.columns(
				$('div').order(2),
				$('div').order(1)
			)

		expect(vNode.vNode().children[0].properties.style.order).toEqual(2);
		expect(vNode.vNode().children[1].properties.style.order).toEqual(1);
		vNode.removeStyles()
	});

	it("can have children/items have grow and shrink properties", function() {

		var vNode = $()
			.columns(
				$('div').grow(1),
				$('div').shrink(1)
			)

		expect(vNode.vNode().children[0].properties.style['flex-grow']).toEqual(1);
		expect(vNode.vNode().children[1].properties.style['flex-shrink']).toEqual(1);
		vNode.removeStyles()
	});

	it("can have children/items wrap within the parent/container", function() {

		var vNode = $()
			.columns(
				$('div'),
				$('div')
			)
			.wrap()

		expect(vNode.vNode().properties.style['flex-wrap']).toEqual('wrap');
		vNode.removeStyles()
	});

	it("can have children/items align themselves using various declarations", function() {

		var vNode = $()
			.columns(
				$('div').align('flex-start'),
				$('div').align('end'),
				$('div').baseline(),
				$('div').stretch(),
				$('div').align('auto')
			)

		expect(vNode.vNode().children[0].properties.style['align-self']).toEqual('flex-start');
		expect(vNode.vNode().children[1].properties.style['align-self']).toEqual('flex-end');
		expect(vNode.vNode().children[2].properties.style['align-self']).toEqual('baseline');
		expect(vNode.vNode().children[3].properties.style['align-self']).toEqual('stretch');
		expect(vNode.vNode().children[4].properties.style['align-self']).toEqual('auto');
		vNode.removeStyles()
	});

	it("can have children/items align within the parent/container", function() {

		var vNode = $()
			.columns(
				$('div'),
				$('div')
			)
			.items('stretch')

		expect(vNode.vNode().properties.style['align-items']).toEqual('stretch');

		var vNode = $()
			.columns(
				$('div'),
				$('div')
			)
			.items('start')

		expect(vNode.vNode().properties.style['align-items']).toEqual('flex-start');

		vNode.removeStyles()
	});

	it("can align content where there is more than one line of flex items", function() {

		var vNode = $()
			.columns(
				$('div'),
				$('div')
			)
			.content('start')

		expect(vNode.vNode().properties.style['align-content']).toEqual('flex-start');

		vNode.removeStyles()
	});

	it("can supply responsive grid attributes", function() {

		var vNode = $()
			.columns(
				$('div')
					.xs(12).sm(8).md(6).lg(4)
			)

		expect(vNode.vNode().children[0].properties.className).toEqual('col-xs-12 col-sm-8 col-md-6 col-lg-4 ');

		vNode.removeStyles()
	});

	// it("can supply responsive grid offsets", function() {

	// 	var vNode = $()
	// 		.columns(
	// 			$('div')
	// 				.sm().offset(3)
	// 				.md().offset(6)
	// 		)

	// 	expect(vNode.vNode().children[0].properties.className).toEqual('col-sm-offset-3 col-md-offset-6 ');

	// 	vNode.removeStyles()
	// });

	// it("can supply responsive grid offsets with cols", function() {

	// 	var vNode = $()
	// 		.columns(
	// 			$('div')
	// 				.sm(9).offset(3)
	// 				.md(6).offset(6)
	// 		)

	// 	expect(vNode.vNode().children[0].properties.className).toEqual('col-sm-9 col-sm-offset-3 col-md-6 col-md-offset-6 ');

	// 	vNode.removeStyles()
	// });

	it("can take data in the constructor and can pipe through it", function() {

		var data = ['a','b','c']
		var chain = $(data).pipe(function(data){
			return data.concat(['d'])
		}).data()

		expect(chain).toEqual(['a','b','c','d']);
	});

	it("can take data in the constructor and can map through it", function() {

		var data = [1,2,3]
		var chain = $(data).map(function(item){
			return item + 1
		}).data()

		expect(chain).toEqual([2,3,4]);
	});

	it("can take data in the constructor and can filter it", function() {

		var data = [1,2,3]
		var chain = $(data).filter(function(item){
			return item > 2
		}).data()

		expect(chain).toEqual([3]);
	});

	it("can take data in the constructor and can filter and map through it", function() {

		var data = [1,2,3]
		var chain = $(data)
			.filter(function(item){
				return item > 1
			})
			.map(function(item){
				return item + 1
			}).data()

		expect(chain).toEqual([3,4]);
	});

	it("can take data in the constructor and can map through it into vNodeChains", function() {

		var data = [1,2,3]
		var chain = $(data).map(function(item){
			return $().text(item)
		}).data()

		expect(chain[0].type).toEqual('vNodeChain');
		expect(chain[1].type).toEqual('vNodeChain');
		expect(chain[2].type).toEqual('vNodeChain');
		expect(chain[0].vNode().children[0].text).toEqual('1');
		expect(chain[1].vNode().children[0].text).toEqual('2');
		expect(chain[2].vNode().children[0].text).toEqual('3');
	});

	it("can convert an array of vNodeChains into a single vNodeChain", function() {

		var data = [1,2,3]
		var chain = $(data)
			.map(function(item){
				return $().text(item)
			})
			.contain('div')

		expect(chain.type).toEqual('vNodeChain');
		expect(chain.getTag()).toEqual('div');
		expect(chain.vNode().tagName).toEqual('DIV');
		expect(chain.vNode().children.length).toEqual(3);

		var el = chain.render().domNode()
		expect(el.tagName).toEqual('DIV');
		expect(el.children[0].innerHTML).toEqual('1');
		expect(el.children[1].innerHTML).toEqual('2');
		expect(el.children[2].innerHTML).toEqual('3');
	});

	it("can convert an array of vNodeChains into a single vNodeChain automatically", function() {

		var data = [1,2,3]
		var chain = $(data)
			.map(function(item){
				return $().text(item)
			})
			.render()
			.domNode()

		expect(chain.tagName).toEqual('DIV');
		expect(chain.children[0].innerHTML).toEqual('1');
		expect(chain.children[1].innerHTML).toEqual('2');
		expect(chain.children[2].innerHTML).toEqual('3');
	});

	it("can convert data into a VirtualText node", function() {

		var collection = [1,2,3]
		var chain = $(collection)
			.pipe(function(data){
				return 'the first item is ' + data[0]
			})
			.toText()

		expect(chain.tagName).toEqual('DIV');
		expect(chain.children.length).toEqual(1);
		expect(chain.children[0].text).toEqual('the first item is 1');
	});

	it("can convert data into a VirtualText node using toString()", function() {

		var collection = [1,2,3]
		var chain = $(collection)
			.toText()

		expect(chain.tagName).toEqual('DIV');
		expect(chain.children.length).toEqual(1);
		expect(chain.children[0].text).toEqual('1,2,3');

	});

	it("can convert data into a domNode on render automatically", function() {

		var data = [1,2,3]
		var chain = $(data)
			.render()

		expect(chain.domNode().tagName).toEqual('DIV');
		chain.remove()
	});

	it("can data object and pipe through it", function() {

		var data = {name: 'John', age: '32'}

		var chain = $(data)
			.pipe(function(inputData){
				inputData.name = 'Jim'
				return inputData
			}).data()

		expect(chain.name).toEqual('Jim');
	});

	it("can data object map through it", function() {

		var data = {apple: 0.5, bread: 1.2}

		var chain = $(data)
			.map(function(value,key){
				return value + 0.2
			})
			.data()

		expect(chain.apple).toEqual(0.7);
		expect(chain.bread).toEqual(1.4);
	});

	it("can data object filter it", function() {

		var data = {apple: 0.5, bread: 1.2}

		var chain = $(data)
			.filter(function(value,key){
				return value > 1
			})
			.data()

		expect(chain).toEqual( {bread: 1.2} );
	});

	it("can data object filter and map through it", function() {

		var data = {bannana: 0.4, apple: 0.5, bread: 1.2}

		var chain = $(data)
			.filter(function(value,key){
				return value >= 0.5
			})
			.map(function(item){
				return item + 0.4
			})
			.data()

		expect(chain).toEqual( {apple: 0.9, bread: 1.6} );
	});


})