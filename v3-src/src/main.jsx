import React from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import App from './App.jsx'
import './styles.css'

dayjs.locale('zh-cn')

const theme = {
  token: {
    colorPrimary: '#1c5bb8',
    colorSuccess: '#2e9d5b',
    colorError: '#d4380d',
    colorWarning: '#d48806',
    borderRadius: 4,
    fontSize: 14,
    colorBgLayout: '#f3f5f8',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: { headerBg: '#ffffff', siderBg: '#ffffff', headerHeight: 56, headerPadding: '0 24px' },
    Menu: { itemBorderRadius: 4 },
    Card: { headerFontSize: 15 },
  },
}

createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN} theme={theme}>
    <AntApp>
      <App />
    </AntApp>
  </ConfigProvider>
)
