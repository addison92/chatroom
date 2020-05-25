import request from '@/utils/request'

//新增
export function insertJbjlRyJcsj(data) {
    return request({
        url: '/jbjlRyJcsj/insertJbjlRyJcsj',
        method: 'post',
        data,
    })
}

//同步
export function insertJbjlRyJcsjTb(data) {
    return request({
        url: '/jbjlRyJcsj/insertJbjlRyJcsj',
        method: 'post',
        data,
    })
}

//分页查询人
export function getJbjlJmJcsjPage(params) {
    return request({
        url: '/jbjlRyJcsj/getJbjlRyJcsjPage',
        method: 'get',
        params,
    })
}

//获取详情
export function getJbjlRyJcsjInfo(params) {
    return request({
        url: '/jbjlRyJcsj/getJbjlRyJcsjInfo',
        method: 'get',
        params,
    })
}

//删除
export function deleteJbjlRyJcsj(params) {
    return request({
        url: '/jbjlRyJcsj/deleteJbjlRyJcsj',
        method: 'delete',
        params,
    })
}

//修改
export function updateJbjlRyJcsj(data) {
    return request({
        url: '/jbjlRyJcsj/updateJbjlRyJcsj',
        method: 'post',
        data,
    })
}

//军衔
export function getJbjcSysJxList(params) {
    return request({
        url: '/jbjcSysJx/getJbjcSysJxList',
        method: 'get',
        params,
    })
}

//职务
export function getJbjcSysZwList(params) {
    return request({
        url: '/jbjcSysZw/getJbjcSysZwList',
        method: 'get',
        params,
    })
}

//组织机构
export function getJbjcSysOrgList(params) {
    return request({
        url: '/jbjcSysOrg/getJbjcSysOrgList',
        method: 'get',
        params,
    })
}

//处理情况
export function getJbjcSysJbtlList(data) {
    return request({
        url: '/jbjcSysJbtl/getJbjcSysJbtlList',
        method: 'post',
        data,
    })
}


//违纪违法情形
export function getJbjcSysJbtlQXMSList(params) {
    return request({
        url: '/jbjcSysJbtl/getJbjcSysJbtlQXMSList',
        method: 'post',
        params,
    })
}


//修改留置申请表
export function updateJbjlLzsq(data) {
    return request({
        url: '/jbjlLzsq/updateJbjlLzsq',
        method: 'post',
        data,
    })
}

// //执勤任务
// export function getJbchZCDutyTaskPage(paraams) {
//     return request({
//         url: '/jbjlRyJcsj/getJbchZCDutyTaskPage',
//         method: 'get',
//         paraams,
//     })
// }


//新增人员车辆留置看管登记表
export function insertJbjlRyclLzdj(data) {
    return request({
        url: '/jbjlRyclLzdj/insertJbjlRyclLzdj',
        method: 'post',
        data,
    })
}

//修改人员车辆留置看管登记表
export function updateJbjlRyclLzdj(data) {
    return request({
        url: '/jbjlRyclLzdj/updateJbjlRyclLzdj',
        method: 'post',
        data,
    })
}

//驻地单位
export function getJbjlZddwXxInfoList(params) {
    return request({
        url: '/jbjlZddwXx/getJbjlZddwXxInfoList',
        method: 'get',
        params,
    })
}

//执勤任务表
export function getJbchTaskDTOList(params) {
    return request({
        url: '/jbchDutyTask/getJbchTaskDTOList',
        method: 'get',
        params,
    })
}   

//下载附件
export function downloadFile(params) {
    return request({
        url: '/minIoController/downloadFile',
        method: 'get',
        params,
    })
}

//检查人员
export function getZqryList(params) {
    return request({
        url: '/jbchDutyTask/getZqryList',
        method: 'get',
        params,
    })
}
//军种
export function getJbjcSysJzList(params) {
    return request({
        url: '/jbjcSysJz/getJbjcSysJzList',
        method: 'get',
        params,
    })
}

//系统配置表
export function getJbjcSysConfigList(params) {
    return request({
        url: '/jbjcSysConfig/getJbjcSysConfigList',
        method: 'get',
        params,
    })
}
 
//省市区 getParentList
export function getParentList(params) {
    return request({
        url: '/jbjcSysArea/getParentList',
        method: 'get',
        params,
    })
}

//上传
export function uploadFile(data) {
    return request({
        url: '/minIoController/uploadFile?wjlx=0&rwlx=RYWJ',
        method: 'post',
        data,
    })
}

//违纪违法条例
export function getJbglCzffList(params) {
    return request({
        url: '/jbglCzff/getJbglCzffList',
        method: 'get',
        params,
    })
}

//获取执勤人员列表通过任务编号
export function getZqryListByRwbh(params) {
    return request({
        url: '/jbchDutyTask/getZqryListByRwbh',
        method: 'get',
        params,
    })
}
//获取经纬度坐标
export function getSbDwInfo(params) {
    return request({
        url: '/jbchDutyTask/getSbDwInfo',
        method: 'get',
        params,
    })
}