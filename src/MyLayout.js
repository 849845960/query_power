import { Layout, Menu } from 'antd';
import App from './App';
import React from "react";


const { Content } = Layout;
class SiderLayout extends React.Component {
  
  render() {
    return (
      <Layout>
        
        <Layout className="site-layout">
         
          <Content
            className="site-layout-background"
            style={{
             
              padding: 24,
              minHeight: 280,
            }}
          >
            <App></App>
          </Content>
        </Layout>
      </Layout>
    );
  }
}


const MyLayout = () => {
  return (
    <SiderLayout>21123</SiderLayout>
  );
};
export default MyLayout;