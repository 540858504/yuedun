import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const {
  typeEvent,
  pageEvent,
  delEvent,
  // queryUserList,
  createUser,
  // removeUser,
  updateUser,
  removeUserList,
} = api

export default modelExtend(pageModel, {
  namespace: 'event',

  state: {
    typeEvent: {
      list: [],
    },
    pageEvent:{
      list: [],
    },
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/event', location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'pageEvent',
            payload,
          })
          dispatch({ type: 'typeEvent' })
          dispatch({ type: 'delete' })
        }
      })
    },
  },

  effects: {
    *typeEvent({ payload = {} }, { call, put }) {
      const data = yield call(typeEvent, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            $$type: 'typeEvent',
            list: data.data,
          },
        })
      }
    },
    *pageEvent({ payload = {} }, { call, put }) {
      const data = yield call(pageEvent, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            $$type: 'pageEvent',
            list: data.data,
            pagination: {
              current: Number(data.currentPage) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.count,
            },
          },
        })
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(delEvent, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.event)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeUserList, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createUser, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(updateUser, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  }, 
})
