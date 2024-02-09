import crud from 'modules/qcrud/_services/baseService'

//Get all user teams
export const GET_UNREAD_COUNT = ({state, commit, dispatch, rootState}, params = {}) => {
  return new Promise(async (resolve, reject) => {
    //Request params
    let requestParams = {
      refresh: params.refresh || true,
      params: {
        include : '',
        filter: {userId: rootState.quserAuth.userId}
      }
    }

    //Request
    crud.index('apiRoutes.qnotification.notifications', requestParams).then(response => {
      //console.warn(response)

      //commit('SET_UNREAD_COUNT', response.data)//Comit data
      resolve(response.data)//Response
    }).catch(error => reject(error))
  })
}
