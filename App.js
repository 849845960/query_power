import React, { Component } from "react";
import "antd/dist/antd.css";
import "./App.css";
import guangyuan from "./mapJson/guangyuan.json";
import cangxi from "./mapJson/cangxi.json";
import chaotian from "./mapJson/chaotian.json";
import jiange from "./mapJson/jiange.json";
import lizhou from "./mapJson/lizhoucopy.json";

import qingchuan from "./mapJson/qingchuan.json";
import wangcang from "./mapJson/wangcang.json";
import zhaohua from "./mapJson/zhaohua.json";
import * as Echarts from "echarts";
import { Button } from "antd";
import { promiseMap, jingweiduMap, getPowerCutCounty } from "./common";
import mapData from "./a.json";

//第一层数据处理函数
function formatMapData(mapData) {
  const arr = [];
  mapData.forEach((element, index) => {
    const obj = {};
    if (element["停电范围"]) {
      obj.name = getPowerCutCounty(element["停电范围"]);
      // obj.name = element["标题"].slice(0, 3) || "";
      obj.value = splitStr(element["停电范围"]).split("、").length || 0;
      obj.time = element["停电时长"].split("停电时长：")[1] || "";
      obj.date = element["停电时间"].split("停电时间")[1] || "";
      obj.powerarea = splitStr(element["停电范围"]) || "";
      arr[index] = obj;
    }
  });

  return arr;
}

function splitStr(str) {
  const splitStr1 = str.split("围：")[1] || "：";
  const splitStr2 = splitStr1.split("：")[1] || "";
  return splitStr2;
}

const cityData = formatMapData(mapData);
//console.log("cityData: ", cityData);

let areaData = [
  {
    name: "青川县",
    city: "乔庄镇",
    value: [105.23951, 32.581833],
  },
  {
    name: "青川县",
    city: "木鱼镇",
    value: [105.41359, 32.639192],
  },
  {
    name: "苍溪县",
    city: "东溪镇",
    value: [106.367386, 31.865574],
  },
  {
    name: "朝天区",
    city: "羊木镇",
    value: [105.788914, 32.600741],
  },
  {
    name: "剑阁县",
    city: "金仙镇",
    value: [105.592567, 31.63273],
  },
  {
    name: "利州区",
    city: "三堆镇",
    value: [105.626984, 32.494942],
  },
  {
    name: "旺苍县",
    city: "东河镇",
    value: [106.30513, 32.231663],
  },
  {
    name: "昭化区",
    city: "朝阳乡",
    value: [105.698425, 32.27494],
  },
]; //静态数据，测试用

//从下载好的地图json数据获取经纬度
let geoCoordMap = guangyuan.features.map((item) => {
  return {
    name: item.properties.name,
    value: item.properties.center,
  };
});
let convertData = function (data) {
  let res = [];
  // console.log('newdata: ', data)
  for (let i = 0; i < data.length; i++) {
    if (geoCoordMap.filter((item) => item.name === data[i].name).length)
      res.push({
        name: data[i].name,
        num: data[i].value,
        durationtime: data[i].time,
        value: geoCoordMap
          .filter((item) => item.name === data[i].name)[0]
          .value.concat(data[i].value),
      });
  }
  //console.log("convertData: ", res);
  return res;
};

const dddd = convertData(cityData);
// 洗红点点数据
function sortPoint(dddd) {
  let arr = [
    { name: "利州区", num: 0 },
    { name: "苍溪县", num: 0 },
    { name: "朝天区", num: 0 },
    { name: "剑阁县", num: 0 },
    { name: "青川县", num: 0 },
    { name: "旺苍县", num: 0 },
    { name: "昭化区", num: 0 },
  ];
  for (let i = 0; i < arr.length; i++) {
    for (let y = 0; y < dddd.length; y++) {
      if (arr[i].name === dddd[y].name) {
        arr[i].num += dddd[y].num;
      }
    }
  }
  return arr;
}
let abc = sortPoint(dddd);
//console.log("红点数据---------------------------------------: ", abc);

//从下载好的地图json数据获取经纬度

function showMap(cityData, areaData, that) {
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
        default:
          key = "";
      }
      //在areaData中找到对应市的区和县
      let array = areaData.filter((item) => item.city === key);
      let cd = array.map((item) => {
        return {
          name: item.name,
          value: item.value[2],
        };
      });
      // console.log("arry", array);
      // console.log("cd", cd);

      areaData = [];
      cityData = cd;
    }
    Echarts.registerMap(name, data); //注册地图
    let option = {
      backgroundColor: "#20293d",
      title: {
        top: 20,
        text: "广元停电区域展示",
        subtext: "data from www.sttcq.com",
        sublink: "http://www.sttcq.com/td/sc/gy/",
        x: "center",
        textStyle: {
          color: "#3ecffa",
        },
      },
      tooltip: {
        position: ["10%", "10%"],
        backgroundColor: "rgba(50,50,50,0.7)",
        borderColor: "#333",
        padding: 5,
        textStyle: {
          color: "#617ca1",
          width: "80px",
          height: "100px",
          overflow: "break",
        },
        // extraCssText:'width:100px;height:60px;',
        formatter: function (params) {
          // console.log('params: ', params)

          if (params.data && params.data.time) {
            return (
              "停电区域：" +
              (params.data ? params.name : "") +
              "<br/>停电时长：" +
              (params.data ? params.data.time : "") +
              "<br/>停电时间：" +
              (params.data ? params.data.date : "") +
              "<br/>停电区域个数：" +
              (params.data ? params.value : "") +
              "<br/>停电范围：<br/>" +
              (params.data ? params.data.powerarea : "")
            );
          } else if (params.data && params.data.durationtime) {
            return null;
          } else {
            return (
              "停电位置：" +
              (params.data ? params.data.city : "无停电区域区域") +
              "</br>" +
              (params.data ? params.data.value : "")
            );
          }
        },
      },
      geo: {
        type: "map",
        map: name, //'guangyuan'
        date: cityData,
        geoIndex: 1,
        roam: true, //缩放
        zoom: 1.1, //地图的比例
        //地名图层
        label: {
          normal: {
            show: true,
            textStyle: {
              color: "#617ca1", //字体颜色
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
            areaColor: "#20293d",
            borderColor: "#314258",
          },
          emphasis: {
            areaColor: "#314258",
          },
        },
      },
      //设置地图的色块,停电区域数量筛选器
      visualMap: {
        show: true,
        //设置最大值和最小值
        min: 0,
        max: 50,
        //设置位置
        left: "4%",
        top: "40%",
        text: ["高", "低"], // 文本，默认为数值文本
        calculable: true, //筛选横条
        seriesIndex: [0], //作用在哪个series上
        inRange: {
          color: ["#20293d", "#334052"],
        },
      },

      series: [
        {
          name: "市停电区域",
          type: "map",
          geoIndex: 0,
          data: cityData,
        },
        //圆点图层
        {
          name: "区县停电区域",
          type: "effectScatter", //散点图
          coordinateSystem: "geo",
          showEffectOn: "render",
          hoverAnimation: true,
          itemStyle: {
            color: "#fffd21", //设置圆点的颜色
          },
          symbolSize: function () {
            return Math.floor(Math.random() * (15 - 5 + 1)) + 5;
          }, //圆点的大小,随机生成整数5-15
          data: areaData,
        },
        //气泡图层
        {
          name: "Top 5",
          type: "scatter",
          coordinateSystem: "geo",
          symbol: "pin",
          symbolSize: 50,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
                fontSize: 12,
                fontWeight: "bold",
              },
              formatter(value, ...arg) {
                for (let i = 0; i < abc.length; i++) {
                  if (abc[i].name === value.data.name) {
                    return abc[i].num;
                  }
                }
              },
            },
          },
          itemStyle: {
            normal: {
              color: "#F62157", //标志颜色
            },
          },
          //使用之前的函数处理数据，为之前的cityData添加经纬度
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
    that.setState((state) => {
      return {
        isDisplay: !state.isDisplay,
      };
    });

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
      default:
        thisMap = "";
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
    //console.log("thismap", thisMap);
    thisData = area[e.name];
    //console.log("thisdata", thisData);

    //下钻
    if (thisData) {
      let myChart = Echarts.init(document.getElementById("map"));
      let name = thisMap; //地图名
      let trans = thisMap; //地名中英文转换中间值
      let data = thisData; //地图的数据来自之前引入的json文件
      let res = [];
      switch (name) {
        case "lizhou":
          trans = "利州区";
          break;
        case "cangxi":
          trans = "苍溪县";
          break;
        case "chaotian":
          trans = "朝天区";
          break;
        case "jiange":
          trans = "剑阁县";
          break;
        case "qingchuan":
          trans = "青川县";
          break;
        case "wangcang":
          trans = "旺苍县";
          break;
        case "zhaohua":
          trans = "昭化区";
          break;
        default:
          trans = "";
      }
      //下钻地图圆点数据
      for (let i = 0; i < areaData.length; i++) {
        if (areaData[i].name === trans) {
          res.push({
            name: areaData[i].name,
            city: areaData[i].city,
            value: areaData[i].value,
          });
          // console.log("res", res);
        }
      }

      Echarts.registerMap(name, data); //注册

      let option = {
        backgroundColor: "#20293d",
        title: {
          top: 20,
          text: trans + "停电区域展示",
          subtext: "data from www.sttcq.com",
          sublink: "http://www.sttcq.com/td/sc/gy/",
          x: "center",
          textStyle: {
            color: "#3ecffa",
          },
        },
        geo: {
          type: "map",
          map: name,
          roam: true,
          geoIndex: 1,
          zoom: 1.1, //地图的比例
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#617ca1", //字体颜色
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
              areaColor: "#20293d",
              borderColor: "#314258",
            },
            emphasis: {
              areaColor: "#314258",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(50,50,50,0.7)",
          borderColor: "#333",
          padding: 5,
          formatter: function (params) {
            // console.log('ddddd:  ', JSON.stringify(params.data));
            return "停电乡镇：" + params.data.city + "</br>" + "经纬度：" + params.value;
          },
        },

        series: [
          //圆点图层
          {
            name: "区县停电区域",
            type: "effectScatter", // 散点图
            coordinateSystem: "geo",
            showEffectOn: "render",

            hoverAnimation: true,
            itemStyle: {
              normal: {
                color: "#fffd21", //设置圆点的颜色
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            symbolSize: function () {
              return Math.floor(Math.random() * (15 - 5 + 1)) + 5;
            }, //圆点的大小,随机生成整数5-15
            data: res,
          },
        ],
      };

      myChart.setOption(option, true);
    }
  });
}

class EchartsTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areaData: [],
      isDisplay: true,
    };
  }

  // componentWillMount() {}

  componentDidMount() {
    const jingweiduData = jingweiduMap(mapData);
    //console.log("jingweiduData: ", jingweiduData);
    const promiseArr = [];
    jingweiduData.forEach((ele) => {
      const p = promiseMap(ele);
      promiseArr.push(p);
    });
    // 异步加载处理数据
    Promise.all(promiseArr).then((res) => {
      if (res.length) {
        const arr = [];
        res.forEach((ele) => {
          const obj = {};
          const districtName = ele.district || "";
          obj.name = districtName;
          obj.city = ele.formatted_address.split(districtName)[1] || "未知区域";
          obj.value = ele.location.split(",") || [];
          // obj.formatted_address = districtName
          arr.push(obj);
        });
        this.setState({
          areaData: arr,
        });

        const _that = this;
        showMap(cityData, this.state.areaData, _that);
      }
    });
  }

  handleBack = () => {
    window.location.reload();
  };

  render() {
    return (
      <div>
        <Button
          type="primary"
          className={this.state.isDisplay ? "btn-hide" : "btn-show"}
          onClick={this.handleBack}
        >
          返回
        </Button>
        <div
          id="map"
          className={this.state.isDisplay ? "" : "map-top"}
          style={{ height: 1000, width: "100%" }}
        ></div>
      </div>
    );
  }
}

const App = () => {
  return (
    <div>
      {/* <BtnBack/> */}
      <EchartsTest />
    </div>
  );
};
export default App;
