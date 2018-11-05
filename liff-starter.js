window.onload = function(e) {

    var lineId = null;
    var items = null;

    // Get LINE ID By Launching In LINE LIFF
	liff.init(function(data) {
		lineId = data.context.userId;
		console.log("lineId:" + lineId);
	});

	var apiUrl =
		"https://ho8169zonf.execute-api.ap-northeast-1.amazonaws.com/dev/blood-pressure";

	$.ajax({
        // Sending lineId To API-Gateway
		url : apiUrl, // URL to API-Gateway
		type : "POST", // HTTP Method For Use

		data : JSON.stringify({
            // Attention!!!!!! : Alter To "lineId" If Success To Receive JSON
			lineId : "Ubb7c210775486c25075e65cdbd287f0d"
		})

	// Execute If Successfully Connected To Lambda
	}).done(function(data, textStatus, jqXHR) {
        
        console.log("成功:" + jqXHR.status);
        console.log(JSON.stringify(data.Items));
        console.log(JSON.stringify(data.Items[0].created)); 
        items = data.Items;

    // Execute If Connection Failed
	}).fail(function(jqXHR, textStatus, errorThrown) {
        
        alert("エラーが発生したもん。\n時間をおいてまた試して欲しいもん。");

    });
    

    //Generate Blood Pressure Graphs
    var chartData = generatechartData();
    
    function generatechartData() {

        for (var i = 0; i < data.Items.length; i++){

            let chartComp = {
                date:   JSON.stringify(items[i].created),
                max:    JSON.stringify(items[i].max),
                min:    JSON.stringify(items[i].min)
            };
            console.log("created" + JSON.stringify(items[i].created));

            chartData.push(chartComp);
        }

        // var chartData = [
        //     {date: '2018/10/27',max: 120,min: 56},
        //     {date: '2018/10/28',max: 111,min: 78},
        //     {date: '2018/10/29',max: 127,min: 80},
        //     {date: '2018/10/30',max: 130,min: 78},
        //     {date: '2018/10/31',max: 108,min: 98},
        //     {date: '2018/11/01',max: 121,min: 55},
        //     {date: '2018/11/02',max: 116,min: 78},
        // ];
        return chartData;
    }
    
    
    var chart = AmCharts.makeChart("chartdiv", {
        "theme": "dark",
        "type": "serial",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop":20,
        "dataProvider": chartData,
        "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0.1
        }],
        "graphs": [{
            // Graph Option For Max-Blood-Presssure
            "useNegativeColorIfDown": true,
            "balloonText": "[[category]]<br><b>value: [[value]]</b>",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletBorderColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "lineThickness": 4,
            "lineColor": "#fdd400",
            "negativeLineColor": "#67b7dc",
            "valueField": "max"
        },
        {
            // Graph Option For Min-Blood-Pressure
            "useNegativeColorIfDown": true,
            "balloonText": "[[category]]<br><b>value: [[value]]</b>",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletBorderColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "lineThickness": 4,
            "lineColor": "#fdd400",
            // TO DO
            "negativeLineColor": "#67b7dc",
            "valueField": "min"
        }],
        "chartScrollbar": {
            "scrollbarHeight": 5,
            "backgroundAlpha": 0.1,
            "backgroundColor": "#868686",
            "selectedBackgroundColor": "#67b7dc",
            "selectedBackgroundAlpha": 1
        },
        "chartCursor": {
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true
        },
        // Setting Around Data
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "axisAlpha": 0,
            "minHorizontalGap": 60
        },
        "export": {
            "enabled": false
        }
    });
    
    chart.addListener("dataUpdated", zoomChart);
    //zoomChart();
    
    function zoomChart() {
        if (chart.zoomToIndexes) {
            chart.zoomToIndexes(130, chartData.length - 1);
        }
    }
}

