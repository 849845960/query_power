import React, { Component } from "react";
import "antd/dist/antd.css";
import "./App.css";
import guangyuan from "./mapJson/guangyuan.json";
import cangxi from "./mapJson/cangxi.json";
import chaotian from "./mapJson/chaotian.json";
import jiange from "./mapJson/jiange.json";
import lizhou from "./mapJson/lizhou.json";
import qingchuan from "./mapJson/qingchuan.json";
import wangcang from "./mapJson/wangcang.json";
import zhaohua from "./mapJson/zhaohua.json";
import * as Echarts from "echarts";

let cityData = [
  { name: "青川县", value: 47 },
  { name: "苍溪县", value: 22 },
  { name: "剑阁县", value: 4 },
  { name: "利州区", value: 47 },
  { name: "旺苍县", value: 22 },
  { name: "昭化区", value: 4 },
  { name: "朝天区", value: 111 },
]; //静态数据
let areaData = [
  {
    name: "青川县",
    city: "乔庄镇",
    value: [105.23951, 32.581833, 23],
  },
  {
    name: "青川县",
    city: "木鱼镇",
    value: [105.41359, 32.639192, 77],
  },
  {
    name: "苍溪县",
    city: "东溪镇",
    value: [106.367386, 31.865574, 12],
  },
  {
    name: "朝天区",
    city: "羊木镇",
    value: [105.788914, 32.600741, 66],
  },
  {
    name: "剑阁县",
    city: "金仙镇",
    value: [105.592567, 31.63273, 18],
  },
  {
    name: "利州区",
    city: "三堆镇",
    value: [105.626984, 32.494942, 36],
  },
  {
    name: "旺苍县",
    city: "东河镇",
    value: [106.30513, 32.231663, 66],
  },
  {
    name: "昭化区",
    city: "朝阳乡",
    value: [105.698425, 32.27494, 44],
  },
];

let geoCoordMap = guangyuan.features.map((item) => {
  return {
    name: item.properties.name,
    value: item.properties.center,
  };
});

let convertData = function (data) {
  let res = [];
  for (let i = 0; i < data.length; i++) {
    if (geoCoordMap.filter((item) => item.name === data[i].name).length)
      res.push({
        name: data[i].name,
        value: geoCoordMap
          .filter((item) => item.name === data[i].name)[0]
          .value.concat(data[i].value),
      });
  }
  return res;
};

function showMap(cityData, areaData) {
  let myChart = Echarts.init(document.getElementById("map"));
  //默认地图：广元市
  let thisMap = "guangyuan";
  let thisData = guangyuan;

  let loadMap = (name, data) => {
    //地图名转回中文，为了方便过滤数据
    if (name !== "guangyuan") {
      let key = "";
      switch (name) {
        case "lizhou":
          key = "利州区";
          break;
        case "cangxi":
          key = "苍溪县";
          break;
        case "chaotian":
          key = "朝天区";
          break;
        case "jiange":
          key = "剑阁县";
          break;
        case "qingchuan":
          key = "青川县";
          break;
        case "wangcang":
          key = "旺苍县";
          break;
        case "zhaohua":
          key = "昭化区";
          break;
      }
      //在areaData中找到对应市的区和县
      let array = areaData.filter((item) => item.city === key);
      let cd = array.map((item) => {
        return {
          name: item.name,
          value: item.value[2],
        };
      });
      console.log('arry',array);
      console.log('cd',cd);

      areaData = [];
      cityData = cd;
    } 
    Echarts.registerMap(name, data); //注册地图
    
    let option = {
      backgroundColor: "#5470c6",
      title: {
        top: 20,
        text: "区县停电区域展示",
        subtext: "data from www.sttcq.com",
        sublink: "http://www.sttcq.com/td/sc/gy/",
        x: "center",
        textStyle: {
          color: "#fff",
        },
      },
      geo: {
        type: "map",
        map: name, //'guangyuan'
        date: cityData,
        roam: true,
        geoIndex: 1,
        zoom: 1.1, //地图的比例
        label: {
          normal: {
            show: true,
            textStyle: {
              color: "#000000", //字体颜色
            },
          },
          emphasis: {
            textStyle: {
              color: "#008956", //选中后的字体颜色
            },
          },
        },

        itemStyle: {
          normal: {
            areaColor: "#EEEEEE",
            borderColor: "#8b8b8b",
          },
          emphasis: {
            areaColor: "#ffffff",
          },
        },
        },
        visualMap: {
          show: true,
          //设置最大值和最小值
          min: 0,
          max: 50,
          //设置位置
          left: "4%",
          top: "40%",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
          seriesIndex: [0], //作用在哪个series上
          inRange: {
            color: ["#ffcbc5", "#ffd661"], //粉黄
          },
        },

        series: [
        {
          name: "市停电区域",
          type: "map",
          geoIndex: 0,
          data: cityData,
        },
        {
          name: "区县停电区域",
          type: "effectScatter",
          coordinateSystem: "geo",
          showEffectOn: "render",
          rippleEffect: {
            period: 15,
            scale: 4,
            brushType: "fill",
          },
          hoverAnimation: true,
          itemStyle: {
            normal: {
              color: "#fffd21", //设置圆点的颜色
              shadowBlur: 10,
              shadowColor: "#333",
            },
          },
          symbolSize: function (params) {
            console.log("paramsparams", params[2]);
            if (params[2] > 30) return params[2] / 5;
            else return 3;
          }, //圆点的大小可以自行设置，这里不赘述
          data: areaData,
        },
        {
          name: "Top 5",
          type: "scatter",
          coordinateSystem: "geo",
          symbol: "pin",
          symbolSize: 40,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
                fontSize: 9,
                fontWeight: "bold",
              },
              formatter(value) {
                return value.data.value[2];
              },
            },
          },
          itemStyle: {
            normal: {
              color: "#F62157", //标志颜色
            },
          },
          //使用之前的函数处理数据，为之前的cityData添加经纬度，当然也可以让初始数据像之前的areaData一样就有经纬度
          data: convertData(cityData),
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke",
          },
          hoverAnimation: true,
          zlevel: 1,
        },
        ],
    };
    myChart.setOption(option, true);
  };

  loadMap(thisMap, thisData);
  myChart.on("click", (e) => {
    switch (e.name) {
      case "利州区":
        thisMap = "lizhou";
        break;
      case "苍溪县":
        thisMap = "cangxi";
        break;
      case "朝天区":
        thisMap = "chaotian";
        break;
      case "剑阁县":
        thisMap = "jiange";
        break;
      case "青川县":
        thisMap = "qingchuan";
        break;
      case "旺苍县":
        thisMap = "wangcang";
        break;
      case "昭化区":
        thisMap = "zhaohua";
        break;
    }
    let area = {
      利州区: lizhou,
      苍溪县: cangxi,
      朝天区: chaotian,
      剑阁县: jiange,
      青川县: qingchuan,
      旺苍县: wangcang,
      昭化区: zhaohua,
    };

    thisData = area[e.name];
    

    //下钻
    if (thisData) {
      
      loadMap(thisMap, thisData);
      
      
    } 
  });
}
  

class EchartsTest extends Component {
  componentDidMount() {
    showMap(cityData, areaData);
  }
  render() {
    return <div id="map" style={{height: 800, width: '100%'}}></div>;
  }
}
const DownMap = () => {
  return (
    <div>
      <EchartsTest />
    </div>
  );
};
export default DownMap;
