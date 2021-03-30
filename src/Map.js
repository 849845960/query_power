
<script src="https://webapi.amap.com/maps?v=1.4.8&key=e46ca14d3f77ed8bc9940219de8694c2&plugin=Map3D"></script>
import * as L7 from '@antv/l7';




class EchartsTest extends Component {
  
    
    

  render() {
    return <div id="orderDetailMap">最好地图自己设置高度，否则地图容易不显示出来</div>
  }
};


const App =() =>{
  
  return(
       <div>
       <EchartsTest />
      </div>
    
  )

}

export default App;