import EditableTable from '@ant-design/pro-table/lib/components/EditableTable'
import axios from 'axios'

const COUNTY = ["利州区","苍溪县","朝天区","剑阁县","青川县","旺苍县","昭化区"]

const KEY = 'cadf1a577a7ab117b4aeb056dd8d4970'

const promiseMap = function (address) {
  const url = `https://restapi.amap.com/v3/geocode/geo?address=${address}&output=JSON&key=${KEY}`
  return axios.get(url)
    .then(response => {
      return response.data && response.data.geocodes[0]
    })
    .catch(err => {
      throw err
    })
}

const jingweiduMap = function (mapArray) {
  console.log('mapArray: ', mapArray)
  const arr = []
  mapArray.forEach(element => {
    const valArr = element['停电范围'].split('围：') || ['', '：']
    if (valArr.length > 1) {
      const str = valArr[1].split('：')[0] || ''
      arr.push(str)
    }
  });
  return arr
}

const getPowerCutCounty = function (countyStr) {
  let currentCounty = ''
  COUNTY.some((element) => {
    if (countyStr.indexOf(element) !== -1) {
      currentCounty = element
      return true
    }
    return false
  })
  return currentCounty
}

export { 
  promiseMap,
  jingweiduMap,
  getPowerCutCounty
}