import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { DropOption, TableFinder, Button, Operation } from 'components'
import { Trans, withI18n } from '@lingui/react'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>用户ID</Trans>,
        dataIndex: 'createTime',
        key: 'createTime',
        fixed: 'left',
      },
      {
        title: <Trans>角色名称</Trans>,
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: <Trans>登录账号</Trans>,
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: <Trans>姓名</Trans>,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: <Trans>联系邮箱</Trans>,
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: <Trans>联系手机</Trans>,
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: <Trans>目标IP</Trans>,
        dataIndex: 'sourceIp',
        key: 'sourceIp',
      },
      {
        title: <Trans>可访问起始IP</Trans>,
        dataIndex: 'startIp',
        key: 'startIp',
      },
      {
        title: <Trans>可访问结束IP</Trans>,
        dataIndex: 'endIp',
        key: 'endIp',
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          const onClick = (key) => {
            if (key === 'edit') {
              this.handleMenuClick(record, { key: '1' })
            } else if (key === 'del') {
              this.handleMenuClick(record, { key: '2' })
            }
          }
          return <Operation data={['edit', 'del']} onClick={onClick} />
          // return (
          //   <div>
          //     <Button type="success" size="small" className="margin-right">详情</Button>
          //     <DropOption
          //       onMenuClick={e => this.handleMenuClick(record, e)}
          //       menuOptions={[
          //         { key: '1', name: i18n.t`Update` },
          //         { key: '2', name: i18n.t`Delete` },
          //       ]}
          //     />
          //   </div>
          // )
        },
      },
    ]

    return (
      <TableFinder
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        columns={columns}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List