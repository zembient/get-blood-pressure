window.onload = function (e) {

    var lineId = null;
    var items = null;
    var chartData = new Array;
    var json = [];

    // Get LINE ID By Launching In LINE LIFF
    liff.init(function (data) {

        lineId = data.context.userId;
        console.log("lineId:" + lineId);
    });

    var apiUrl =
        "https://ho8169zonf.execute-api.ap-northeast-1.amazonaws.com/dev/blood-pressure";

    $.ajax({

        // Sending lineId To API-Gateway
        url: apiUrl, // URL to API-Gateway
        type: "POST", // HTTP Method For Use

        data: JSON.stringify({
            // Attention!!!!!! : Alter To "lineId" If Success To Receive JSON
            lineId: "Ubb7c210775486c25075e65cdbd287f0d"
        })

        // Execute If Successfully Connected To Lambda
    }).done(function (data, textStatus, jqXHR) {

        console.log("成功:" + jqXHR.status);
        items = data.Items;
        console.log(items[0].created);

        for (var i = 0; i < 7; i++) {

            json.push({
                created: items[i].created,
                max: items[i].max,
                min: items[i].min
            });
        }
        console.log("json: " + json);


        var chart = AmCharts.makeChart("chartdiv", {
            "theme": "none",
            "type": "serial",
            "marginRight": 80,
            "autoMarginOffset": 20,
            "marginTop": 20,
            "dataDateFormat": "YYYY/MM/DD",
            "dataProvider": json,
            "valueAxes": [{
                "id": "v1",
                "axisAlpha": 0.1
            }],
            "graphs": [{
                // Graph Option For Max-Blood-Presssure
                "useNegativeColorIfDown": false,
                "balloonText": "[[category]]<br><b>value: [[value]]</b>",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletBorderColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "lineThickness": 4,
                "lineColor": "#ff0000",
                "valueField": "max"
            },
            {
                // Graph Option For Min-Blood-Pressure
                "useNegativeColorIfDown": false,
                "balloonText": "[[category]]<br><b>value: [[value]]</b>",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletBorderColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "lineThickness": 4,
                "lineColor": "#4169e1",
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
            "categoryField": "created",
            "categoryAxis": {
                "parseDates": false,
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

        // Execute If Connection Failed
    }).fail(function (jqXHR, textStatus, errorThrown) {

        alert("エラーが発生したもん。\n時間をおいてまた試して欲しいもん。");

    });

}

