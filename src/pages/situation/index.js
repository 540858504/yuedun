import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { withI18n } from '@lingui/react'
import { Row, Col } from 'antd'
import store from 'store'
import { Page } from 'components'
import Header from './components/Header'
import CardList from './components/CardList'
import List from './components/List'
import LineChart from './components/LineChart'
import Completed from './components/Completed'
import GaugeChart from './components/GaugeChart'
import NumberCard from './components/NumberCard'
import MapChart from './components/MapChart'
import RadialChart from './components/RadialChart'
import styles from './index.less'

// const numbers = [{
//   number: 12345,
//   title: '高危事件',
//   color: '#ff0000',
// }, {
//   number: 12345,
//   title: '中危事件',
//   color: '#fbb03b',
// }, {
//   number: 12345,
//   title: '低危事件',
//   color: '#00ff00',
// }]
// 映射 Map
const numberCardsMap = {
  '3': {
    title: '高危事件',
    color: '#ff0000',
  },
  '2': {
    title: '中危事件',
    color: '#fbb03b',
  },
  '1': {
    title: '低危事件',
    color: '#00ff00',
  },
}
//和
function sum(arr = []) {
  return arr.reduce((acc, name) => (acc + parseInt(name.num)), 0)
}

const source = [{
  title: '202.120.223.132',
  percent: 95,
  value: '79309',
  strokeColor: '#ff0000',
}, {
  title: '202.120.223.132',
  percent: 20,
  value: '6343',
  strokeColor: '#fbb03b',
}, {
  title: '202.120.223.132',
  percent: 10,
  value: '4699',
  strokeColor: '#fcee21',
}, {
  title: '202.120.223.132',
  percent: 95,
  value: ' ',
  strokeColor: '#349e9c',
}, {
  title: '202.120.223.132',
  percent: 95,
  value: ' ',
  strokeColor: '#42dda9',
}]

const completed = [{
  'name': 8,
  '接口号1': 696,
  '接口号2': 571
}, {
  'name': 10,
  '接口号1': 226,
  '接口号2': 337
}, {
  'name': 12,
  '接口号1': 646,
  '接口号2': 598
}, {
  'name': 14,
  '接口号1': 809,
  '接口号2': 236
}, {
  'name': 16,
  '接口号1': 640,
  '接口号2': 946
}, {
  'name': 18,
  '接口号1': 411,
  '接口号2': 276
}]

@withI18n()
@connect(({ situation, loading }) => ({ situation, loading }))
class Index extends PureComponent {
  get headerProps() {
    const { dispatch, situation } = this.props
    const { mapType } = situation

    return {
      time: store.get('login_time'),
      mapType,
      onChange(field, value) {
        console.log('onChange', field, value)
        if (field === 'map') {
          dispatch({
            type: 'situation/mapType',
            payload: value,
          })
        }
      },
    }
  }

  get completedProps() {
    return {
      data: completed,
    }
  }

  get lineChartProps() {
    return {
      data: completed,
    }
  }

  get mapChartProps() {
    const { situation } = this.props
    const { mapType } = situation

    return {
      data: completed,
      mapType,
    }
  }

  get radialChartProps() {
    return {
      data: [{ name: 'DDOS攻击', value: 90 }, { name: '漏洞利用', value: 80 }, { name: '网站后门', value: 70 }, { name: '僵尸网络', value: 60 }, { name: '远程控制', value: 50 }],
      color: ['#f74d83', '#0c5ded', '#eeff00', '#804722', '#e94f46'],
    }
  }

  get targetProps() {
    const { dispatch,situation, loading } = this.props
    const sourceSum = sum(situation.srcipEvent.list)
    const target = situation.dstipEvent.list.map((v) => ({
      title: v.dstip,
      value: String(v.num),
      percent: v.num / sourceSum * 100, // 计算比例，乘以 100
    }))

    return {
      title: '事件目标IP',
      dataSource: target,
      loading: loading.effects['situation/dstipEvent'],
    }
  }

  get sourceProps() {
    const { dispatch,situation, loading } = this.props
    const sourceSum = sum(situation.srcipEvent.list)
    const source = situation.srcipEvent.list.map((v) => ({
      title: v.srcip,
      value: String(v.num),
      percent: v.num / sourceSum * 100, // 计算比例，乘以 100
    }))

    return {
      title: '事件源目标IP',
      dataSource: source,
      loading: loading.effects['situation/srcipEvent'],
    }
  }

  // get cardListProps() {
  //   const { dispatch, dashboard, loading } = this.props
  //   const sourceSum = sum(dashboard.srcipEvent.list)
  //   const source = dashboard.srcipEvent.list.map((v) => ({
  //     title: v.srcip,
  //     value: String(v.num),
  //     percent: v.num / sourceSum * 100, // 计算比例，乘以 100
  //   }))
  //   const target = dashboard.dstipEvent.list.map((v) => ({
  //     title: v.dstip,
  //     value: String(v.num),
  //     percent: v.num / sourceSum * 100, // 计算比例，乘以 100
  //   }))

  //   return {
  //     source,
  //     target,
  //     loading: loading.effects['dashboard/srcipEvent'] || loading.effects['dashboard/dstipEvent'],
  //   }
  // }


  // get listProps() {
  //   const { dispatch, situation, loading } = this.props
  //   const { list } = situation

  //   return {
  //     dataSource: list.slice(0, 6),
  //     color: ['#fbb03b', '#ff0000', '#ff0000', '#00ff00', '#fbb03b', '#ff0000'],
  //     pagination: false,
  //     bordered: false,
  //     // loading: loading.effects['situation/query'],
  //     onEditItem(item) {
  //       console.log('onEditItem', item)
  //     },
  //   }
  // }

  get listProps() {
    const { dispatch, situation, loading } = this.props
    const { list = [] } = situation.listEvent

    return {
      dataSource: list,
      color: ['#fbb03b', '#ff0000', '#ff0000', '#00ff00', '#fbb03b', '#ff0000'],
      pagination: false,
      bordered: false,
      loading: loading.effects['dashboard/listEvent'],
      onEditItem(item) {
        console.log('onEditItem', item)
      },
    }
  }

  get numberCardsProps() {
    const { dispatch, situation, loading } = this.props
    const { list = [] } = situation.totalEvent

    const numbers = [...list].map((v) => ({ ...numberCardsMap[v.level], number: v.num }))

    return {
      numbers,
    }
  }

  render() {
    const pageStyle = {
      height: '100%',
      backgroundColor: '#0f110f',
      overflowX: 'hidden',
    }
    const { numbers } = this.numberCardsProps
    const numberCards = numbers.map((item, key) => (
      <Col key={key} md={8}>
        <NumberCard {...item} />
      </Col>
    ))

    return (
      <Page inner pageStyle={pageStyle}>
        <Header {...this.headerProps} />
        <Row>
          <Col xl={6} lg={6}>
            <Row>
              <Col xl={24}><GaugeChart {...this.completedProps} /></Col>
              <Col xl={24}><LineChart {...this.lineChartProps} /></Col>
            </Row>
          </Col>
          <Col xl={12} lg={12}>
            <div className={styles.numberCards}>{numberCards}</div>
            <MapChart {...this.mapChartProps} />
          </Col>
          <Col xl={6} lg={6}>
            <Row>
              <Col xl={24}><Completed {...this.completedProps} /></Col>
              <Col xl={24}><RadialChart {...this.radialChartProps} /></Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xl={6} lg={6}><CardList {...this.targetProps} /></Col>
          <Col xl={12} lg={12}><List {...this.listProps} /></Col>
          <Col xl={6} lg={6}><CardList {...this.sourceProps} /></Col>
        </Row>
      </Page>
    )
  }
}

Index.propTypes = {
  situation: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Index