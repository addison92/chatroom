import request from '@/utils/request'

//登录
export function login(params) {
    return request({
        url: '/login',
        method: 'post',
        params,
    })
}

//注销
export function logout() {
    return request({
        url: '/logout',
        method: 'post',
    })
}

//修改密码
export function updateUserPassword(params) {
    return request({
        url: '/jbjcSysUser/updateUserPassword',
        method: 'get',
        params
    })
}


//用户列表
export function getUserList(params) {
    return request({
        url: '/sysUser/list',
        method: 'get',
        params
    })
}
