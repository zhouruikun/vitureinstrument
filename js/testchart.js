
var detailDataLength = 256;
var overviewDataLength = 2560;

var Ch1Data = {
	detailChart : null,
	container : null,
	detailContainer : null,
	masterContainer : null,
	Set_V : [],
	Set_I : [],
	Real_V : [],
	Real_I : [],
};
var Ch2Data = {
	detailChart : null,
	container : null,
	detailContainer : null,
	masterContainer : null,
	Set_V : [],
	Set_I : [],
	Real_V : [],
	Real_I : [],
};
function createSimulateData()
{
	for (let index = 0; index < overviewDataLength; index++) {
		Ch1Data.Set_V.push(7);
		Ch1Data.Set_I.push(1);
		Ch1Data.Real_V.push(8+Math.random());
		Ch1Data.Real_I.push(1+Math.random());
		Ch2Data.Set_V.push(5);
		Ch2Data.Set_I.push(1);
		Ch2Data.Real_V.push(5+Math.random());
		Ch2Data.Real_I.push(1+Math.random());
	}
}
Ch1Data.container =  document.getElementById('container1');
Ch2Data.container =  document.getElementById('container2');

// 创建导航图
function createMaster(ChData) {
	/*
		* 创建 detailContainer 并 append 到 container 中
		*/
		ChData.detailContainer = document.createElement('div');
		ChData.container.appendChild(ChData.detailContainer);
		/*
		* 创建 masterContainer 并 append 到 container 中
		*/
		ChData.masterContainer = document.createElement('div');
		ChData.masterContainer.style.position = 'relative';
		ChData.masterContainer.style.top = '0px';
		ChData.masterContainer.style.height = '100px';
		ChData.masterContainer.style.width = '100%';
		ChData.container.appendChild(ChData.masterContainer);
		return Highcharts.chart(ChData.masterContainer, {
				chart: {
						reflow: false,
						borderWidth: 0,
						backgroundColor: null,
						marginLeft: 50,
						marginRight: 20,
						zoomType: 'x',
						events: {
								// listen to the selection event on the master chart to update the
								// extremes of the detail chart
								selection: function (event) {
										var extremesObject = event.xAxis[0],
												min = extremesObject.min,
												max = extremesObject.max,
												detailData = [],
												detailData_one = [],
												index = 0,
												xAxis = this.xAxis[0];

										 
										
										// move the plot bands to reflect the new detail span
										xAxis.removePlotBand('mask-before');
										xAxis.addPlotBand({
												id: 'mask-before',
												from: 0,
												to: min,
												color: 'rgba(0, 0, 0, 0.2)'
										});
										xAxis.removePlotBand('mask-after');
										xAxis.addPlotBand({
												id: 'mask-after',
												from: max,
												to: 2560,
												color: 'rgba(0, 0, 0, 0.2)'
										});
										 
										ChData.detailChart.xAxis[0].setExtremes(min,max);
										// ChData.detailChart.xAxis.max = max;
										// ChData.detailChart.xAxis.min = min;
										 
										return false;
								}
						}
				},
				title: {
						text: null
				},
				xAxis: {
						type: 'number',
						showLastTickLabel: true,
						maxZoom: 0, // fourteen days
						plotBands: [{
								id: 'mask-before',
								from: 0,
								to: 1100,
								color: 'rgba(0, 0, 0, 0.2)'
						}],
						title: {
								text: null
						}
				},
				yAxis: {
						gridLineWidth: 0,
						labels: {
								enabled: false
						},
						title: {
								text: null
						},
						min: 0.6,
						showFirstLabel: false
				},
				tooltip: {
						formatter: function () {
								return false;
						}
				},
				legend: {
						enabled: false
				},
				credits: {
						enabled: false
				},
				plotOptions: {
						series: {
								fillColor: {
										linearGradient: [0, 0, 0, 70],
										stops: [
												[0, Highcharts.getOptions().colors[0]],
												[1, 'rgba(255,255,255,0)']
										]
								},
								lineWidth: 1,
								marker: {
										enabled: false
								},
								shadow: false,
								states: {
										hover: {
												lineWidth: 1
										}
								},
								enableMouseTracking: false
						}
				},
				series: [{
					name: '设置电压',	
					pointInterval:1,
					data: ChData.Set_V,
					lineWidth: 1,
					},
					{
						name: '设置电流',
						pointInterval:1,
						data: ChData.Set_I
					},
					{
						name: '实际电压',
						pointInterval:1,
						data: ChData.Real_V
					},
					{
						name: '实际电流',
						pointInterval:1,
						data: ChData.Real_I
					}
			],
				exporting: {
						enabled: false
				}
		}, function (masterChart) {	 
			
			createDetail(masterChart,ChData);
		});	
}
function createDetail(masterChart,ChData){
	var detailData = [],
	detailData_one = [],
	detailStart = 0;
	var index =0;
	Highcharts.each(masterChart.series,function(datas){
		detailData_one = [],
		Highcharts.each(datas.data, function(data) {
			if(data.x >= detailStart) {
				detailData_one.push(data.y);
			}
		})	 
 
	detailData.push(detailData_one);
	});
	
	ChData.detailChart = Highcharts.chart(ChData.detailContainer, {
		chart: {
				type : 'spline',
				zoomType: 'xy',
				panning: true,
				panKey: 'shift',
				reflow: false,
				marginLeft: 50,
				height:'50%',
				marginRight: 20,
				style: {
						position: 'relative'
				}
		},
		credits: {
				enabled: false
		},
		title: {
				text: '数字电源'
		},
		xAxis: {
				type: '时间'
		},
		yAxis:[
				{
				title: {
						text: '电压'
				},
				max:12.0,
				min:0,
				maxZoom: 0.1,
				allowDecimals :true
				},
				{
					title: {
							text: '电流'
					},
					max:2.00,
					min:0,
					maxZoom: 0.01,
					opposite:true,
					allowDecimals :true
				}
		],
		tooltip: {
				formatter: function () {
						var str = '';
						Highcharts.each(this.points,function(point){
							str +=  '<b>' + point.series.name + '</b>:' +Highcharts.numberFormat(point.y, 2) +'<br>' ;
						});
						return str;
				},
				shared: true
		},
		legend: {
				enabled: false
		},
		plotOptions: {
				series: {
						marker: {
								enabled: false,
								states: {
										hover: {
												enabled: true,
												radius: 3
										}
								}
						}
				}
		},
		series: [{yAxis:0,
				name: '设置电压',
				pointStart: detailStart,
				pointInterval:1,
				data: detailData[0]
				},
				{yAxis:1,
					name: '设置电流',
					pointStart: detailStart,
					pointInterval:1,
					data: detailData[1]
				},
				{
					yAxis:0,
					name: '实际电压',
					pointStart: detailStart,
					pointInterval:1,
					data: detailData[2]
				},
				{	yAxis:1,
					name: '实际电流',
					pointStart: detailStart,
					pointInterval:1,
					data: detailData[3]
				}
		],
	});
}
/*
 * 开始创建导航图，详细的图是在导航图的回调函数中创建的
 * 代码入口
 */
createSimulateData();
createMaster(Ch1Data);
createMaster(Ch2Data);
