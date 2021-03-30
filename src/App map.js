import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import guangyuan from './mapJson/guangyuan.json'
import cangxi from './mapJson/cangxi.json'
import chaotian from './mapJson/chaotian.json'
import jiange from './mapJson/jiange.json'
import lizhou from './mapJson/lizhou.json'
import qingchuan from './mapJson/qingchuan.json'
import zhaohua from './mapJson/zhaohua.json'
import * as echarts from 'echarts';

class EchartsTest extends Component {
  componentDidMount() {
    let myChart = echarts.init(document.getElementById('map'))
    
    let name = 'guangyuan' //地图名是guangyuan
    let data = guangyuan  //地图的数据来自之前引入的json文件
    //获得数据这一步我就不写了,用下面的死数据
    let cityData = [{name:'青川县',value:47},{name:'苍溪县',value:22},{name:'剑阁县',value:4},
    {name:'利州区',value:47},{name:'旺苍县',value:22},{name:'昭化区',value:4},{name:'朝天区',value:66}]; //静态数据
    let areaData = [
        {
            name:'青川县',
            city:'乔庄镇',
            value:[105.23951,32.581833,23]
        },
        {
            name:'苍溪县',
            city:'东溪镇',
            value:[106.367386,31.865574,12]
        },
        {
            name:'剑阁县',
            city:'金仙镇',
            value:[105.592567,31.63273,18]
        },
        {
            name:'利州区',
            city:'三堆镇',
            value:[105.626984,32.494942,36]
        },
        {
            name:'旺苍县',
            city:'东河镇',
            value:[106.30513,32.231663,66]
        },
        {
            name:'昭化区',
            city:'朝阳乡',
            value:[105.698425,32.27494,44]
        },
        {
            name:'朝天区',
            city:'沙河镇',
            value:[105.853264,332.5634,16]
        }
    ]

    echarts.registerMap(name, data) //此步不可省略，要想展示一个地图，先需要注册，巨坑（官方根本无文档，全靠瞎猜）

    myChart.on('click', (e) => {
        console.log('click', e)
   })

    //获取气泡数据函数
    let geoCoordMap = guangyuan.features.map(item => {
        return {
          name: item.properties.name,
          value: item.properties.center
        }
    });

    let convertData = function (data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          if (geoCoordMap.filter(item => item.name === data[i].name).length)
            res.push({
              name: data[i].name,
              value: geoCoordMap.filter(item => item.name === data[i].name)[0].value.concat(data[i].value)
            })
        }
        return res;
  }

    let option = {
        backgroundColor: '#5470c6',
        title: {
          top: 20,
          text: '广元停电区域展示',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#000'
          }
        },
        geo: {
          type: 'map',
          map: name, //'guangyuan'
          data:cityData,
          roam: true,
          geoIndex: 1,
          zoom: 1.1,  //地图的比例
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#000000'  //字体颜色
              }
            },
            emphasis: {
              textStyle: {
                color: '#008956'  //选中后的字体颜色
              }
            }
          },
          //用来设置地图的色块
          visualMap: {
            show: true,
            //设置最大值和最小值
            min: 0,
            max: 50,
            //设置位置
            left: '4%',
            top: '40%',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [0], //作用在哪个series上
            inRange: {
              color: ['#ffcbc5', '#ffd661'] //粉黄
            }
          },
          
          // series参数用于标记地图
          series:[
            {
                name: "市报名人数",
                type: "map",
                geoIndex: 0,
                data: cityData,
            },
            // 新增一个圆点标记
            {
                name: '区县报名人数',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                rippleEffect: {
                  period: 15,
                  scale: 4,
                  brushType: 'fill'
                },
                hoverAnimation: true,
                itemStyle: {
                  normal: {
                    color: '#fffd21', //设置圆点的颜色
                    shadowBlur: 10,
                    shadowColor: '#333'
                  }
                },
                symbolSize: function (params) {
                  console.log('paramsparams', params[2])
                  if (params[2] > 30)
                    return params[2] / 5
                  else
                    return 3
                }, //圆点的大小可以自行设置，这里不赘述
                data: areaData,
            },
            //气泡标记
            {
                name: 'Top 5',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin',
                symbolSize: 40,
                label: {
                  normal: {
                    show: true,
                    textStyle: {
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 'bold'
                    },
                    formatter(value) {
                      return value.data.value[2]
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#F62157', //标志颜色
                  }
                },
                    //使用之前的函数处理数据，为之前的cityData添加经纬度，当然也可以让初始数据像之前的areaData一样就有经纬度
                data: convertData(cityData), 
                showEffectOn: 'render',
                rippleEffect: {
                  brushType: 'stroke'
                },
                hoverAnimation: true,
                zlevel: 1
             },

                ],
         
            

          //
          itemStyle: {
            normal: {
              areaColor: '#EEEEEE',
              borderColor: '#8b8b8b',
            },
            emphasis: {
              areaColor: '#ffffff',
            }
          },
        },
      }
    myChart.setOption(option, true);

  }
  render() {
    return (
        <div id='map' style={{height: 800, width: 800}}></div>
    );
  }

}


const App =() =>{
  
  return(
       <div>
       <EchartsTest />
      </div>
    
  )

}

export default App;