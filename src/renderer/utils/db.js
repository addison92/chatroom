import fse from "fs-extra";
import path from "path";
import sq3 from "sqlite3";
import { docDir } from "./settings";
//将数据存至系统用户目录(bx-application文件夹),防止误删/重新安装导致数据清空
export const dbPath = path.join(docDir, "database_offline.db");
fse.ensureFileSync(dbPath);

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);

// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database("database_offline.db");

import { sqlite_sqls, dic_data, czff_data, xxsz_data } from "../constants/initSql";

//init tables初始化表结构,表数据
export function initTables() {
  db.serialize(() => {
    sqlite_sqls.forEach((sql, index) => {
      db.run(sql, err => {
        if (!err) {
          if (index == "1") {
            //初始化处置方法表数据
            czff_data.forEach(record => {
              db.run(record, err => {
                if (err) {
                  console.log("init czff data error:", err);
                }
              });
            });
          } else if (index == "2") {
            //初始化字典表数据
            dic_data.forEach(record => {
              db.run(record, err => {
                if (err) {
                  console.log("init dic data error:", err);
                }
              });
            });
          }else if (index == "10"){
            //系统设置
            xxsz_data.forEach(record => {
              db.run(record, err => {
                if (err) {
                  console.log("init xxsz data error:", err);
                }
              });
            });
          }
        }
      });
    });
  });
}

//保存登录人的通讯录
export function saveTxl(data) {
  return new Promise(function(resolve, reject) {
    db.run(
      "insert or replace into jbjl_txl(userid, list) values(?, ?)",
      [data.userid, data.list],
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

//根据userid获取登录人离线通讯录列表
export function getTxlListById(data) {
  return new Promise(function(resolve, reject) {
    db.all(
      "select * from jbjl_txl where userid = ?",
      [data.userid],
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

/**
 * 离线聊天历史消息
 */

//批量新增
export function saveHistoryMsg(list) {
  return new Promise(function(resolve, reject) {
    db.serialize(() => {
      list.forEach(record => {
        db.run(
          "insert into jbjl_history_msg(sendId,receiveId,message,fromUser,time) values(?,?,?,?,?)",
          [record.sendId, record.receiveId, record.message, record.fromUser, record.time],
          (err, res) => {
            if (!err) {
              resolve(res);
            } else {
              console.log("error:", err);
            }
          }
        );
      });
    });
  });
}

//根据id获取当前聊天人历史消息
export function getHistoryMsgById(params) {
  return new Promise(function(resolve, reject) {
    db.all(
      "select * from jbjl_history_msg where sendId = ? and receiveId = ?",
      [params.sendId, params.receiveId],
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

/*
 * ----假冒记录----
 */

//新增假冒军人事件
export function insertJbjlJrJmsj(values) {
  return new Promise(function(resolve, reject) {
    db.run(
      "insert into jbjl_jr_jmsj(bh,cbyj,csny,czyj,gzczjg,gzczsj,gzczyj,jcdd,jcddjwd,jcrybh ,jcsj ,jg,jgbh,lxdh ,n,psrybh ,r,rwbh ,sjjlsj ,sjmc ,sjycd ,sm ,szpsnr ,szpssj ,wfwt ,xb ,xm ,y,yzbs ,zhgxrybh ,zhgxsj ,zjhm ,zjlx ,zrwbh ,zy ,zz,userid,jmrssdw,sfjr,sfkl) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      values,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

//分页
export function getJbjlJrJmsjPage(params) {
  var sql = "select * from jbjl_jr_jmsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.xm) {
    sql_query.push(" xm like '%" + params.xm + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.wfwt) {
    sql_query.push(" wfwt like '%" + params.wfwt + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  //分页偏移量
  if (params.pageSize || params.page) {
    sql += " limit " + params.pageSize;
    sql += " offset " + (params.page - 1) * params.pageSize;
  }
  console.log("======SQL======", sql);
  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//列表数量total
export function getJbjlJrJmsjCount(params) {
  var sql = "select count(*)as count from jbjl_jr_jmsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.xm) {
    sql_query.push(" xm like '%" + params.xm + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.wfwt) {
    sql_query.push(" wfwt like '%" + params.wfwt + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows[0].count);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//详情
export function getJbjlJrJmsjInfo(params) {
  var sql = "select * from jbjl_jr_jmsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.all(sql, params.bh, (err, rows) => {
      if (!err && rows.length == "1") {
        resolve(rows[0]);
      } else {
        console.log("error:获取详情有误", err);
      }
    });
  });
}

//更新
export function updateJbjlJrJmsj(params) {
  var sql = "update jbjl_jr_jmsj set ";
  // 拼接参数
  var keys = [
    "cbyj",
    "csny",
    "czyj",
    "gzczjg",
    "gzczsj",
    "gzczyj",
    "jcdd",
    "jcddjwd",
    "jcrybh",
    "jcsj",
    "jg",
    "jgbh",
    "lxdh",
    "n",
    "psrybh",
    "r",
    "rwbh",
    "sjjlsj",
    "sjmc",
    "sjycd",
    "sm",
    "szpsnr",
    "szpssj",
    "wfwt",
    "xb",
    "xm",
    "y",
    "yzbs",
    "zhgxrybh",
    "zhgxsj",
    "zjhm",
    "zjlx",
    "zrwbh",
    "zy",
    "zz",
    "jmrssdw",
    "sfjr",
    "sfkl"
  ];
  var sql_params = [],
    sql_params_values = [];
  keys.forEach(item => {
    if (params[item]) {
      sql_params.push(` ${item} = ? `);
      sql_params_values.push(params[item]);
    }
  });
  sql += sql_params.join(",") + " where bh= ?";

  sql_params_values.push(params.bh);

  return new Promise(function(resolve, reject) {
    db.run(sql, sql_params_values, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//删除
export function deleteJbjlJrJmsj(params) {
  var sql = "delete from jbjl_jr_jmsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.run(sql, params.bh, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

/*
 * ----start 假冒车辆----
 */

//新增假冒军车事件
export function insertJbjlJmJcsj(values) {
  return new Promise(function(resolve, reject) {
    db.run(
      "insert into jbjl_jm_jcsj(bh,n,y,r,rwbh,zrwbh,jgbh,sjmc,ckclhp,dyzshpdw,jcsj,jcdd,jcddjwd,jsyxm,jsyxb,jsycsny,jsyzz,jsylxdh,jsyjg,jsyzjlx,jsyzjhm,clcx,clys,cldfhp,cldfdjh,clywhfly,clcjh,wfwt,czyj,jcrybh,cbyj,sjjlsj,psrybh,szpsnr,szpssj,gzczjg,gzczsj,gzczyj,yzbs,sm,sfkl,userid,jsyssdw,sfjr,dyzshp) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      values,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

//分页
export function getJbjlJmJcsjPage(params) {
  var sql = "select * from jbjl_jm_jcsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.ckclhp) {
    sql_query.push(" ckclhp like '%" + params.ckclhp + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.wfwt) {
    sql_query.push(" wfwt like '%" + params.wfwt + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  //分页偏移量
  if (params.limit || params.page) {
    sql += " limit " + params.limit;
    sql += " offset " + (params.page - 1) * params.limit;
  }

  console.log("分页_sql:", sql);

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//列表数量total
export function getJbjlJmJcsjCount(params) {
  var sql = "select count(*)as count from jbjl_jm_jcsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.ckclhp) {
    sql_query.push(" ckclhp like '%" + params.ckclhp + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.wfwt) {
    sql_query.push(" wfwt like '%" + params.wfwt + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows[0].count);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//详情
export function getJbjlJmJcsjInfo(params) {
  var sql = "select * from jbjl_jm_jcsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.all(sql, params.bh, (err, rows) => {
      if (!err && rows.length == "1") {
        resolve(rows[0]);
      } else {
        console.log("error:获取详情有误");
      }
    });
  });
}

//更新
export function updateJbjlJmJcsj(params) {
  var sql = "update jbjl_jm_jcsj set ";
  // 拼接参数
  var keys = [
    "bh",
    "n",
    "y",
    "r",
    "rwbh",
    "zrwbh",
    "jgbh",
    "sjmc",
    "ckclhp",
    "dyzshpdw",
    "jcsj",
    "jcdd",
    "jcddjwd",
    "jsyxm",
    "jsyxb",
    "jsycsny",
    "jsyzz",
    "jsylxdh",
    "jsyjg",
    "jsyzjlx",
    "jsyzjhm",
    "clcx",
    "clys",
    "cldfhp",
    "cldfdjh",
    "clywhfly",
    "clcjh",
    "wfwt",
    "czyj",
    "jcrybh",
    "cbyj",
    "sjjlsj",
    "psrybh",
    "szpsnr",
    "szpssj",
    "gzczjg",
    "gzczsj",
    "gzczyj",
    "yzbs",
    "sm",
    "sfkl",
    "jsyssdw",
    "sfjr",
    "dyzshp"
  ];

  var sql_params = [],
    sql_params_values = [];
  keys.forEach(item => {
    if (params[item]) {
      sql_params.push(` ${item} = ? `);
      sql_params_values.push(params[item]);
    }
  });
  sql += sql_params.join(",") + " where bh= ?";

  sql_params_values.push(params.bh);

  return new Promise(function(resolve, reject) {
    db.run(sql, sql_params_values, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//删除
export function deleteJbjlJmJcsj(params) {
  var sql = "delete from jbjl_jm_jcsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.run(sql, params.bh, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

/*
 * ----end 假冒车辆----
 */

/*
 * ----start 假冒军事单位----
 */

//新增假冒军车事件
export function insertJbjlJmJsdw(values) {
  return new Promise(function(resolve, reject) {
    db.run(
      "insert into jbjl_jm_jsdw(bh,n,y,r,rwbh,zrwbh,jgbh,sjmc,jcsj,jcdd,jcddjwd,bjmdwmc,bjmdwfzr,fzrzz,fzrzjlx,fzrzjhm,fzrjg,fzrlxfs,wfwt,czyj,jcrybh,sjjlsj,cbyj,psrybh,szpsnr,szpssj,gzczjg,gzczsj,gzczyj,yzbs,sm,hy,jmdwfzr,jmdwmc,userid,sfjr,sfkl) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      values,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

//分页
export function getJbjlJmJsdwPage(params) {
  var sql = "select * from jbjl_jm_jsdw ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.jmdwmc) {
    sql_query.push(" bjmdwmc like '%" + params.jmdwmc + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (params.wfwt) {
    sql_query.push(" wfwt like '%" + params.wfwt + "%'");
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  //分页偏移量
  if (params.limit || params.page) {
    sql += " limit " + params.limit;
    sql += " offset " + (params.page - 1) * params.limit;
  }

  console.log("分页_sql:", sql);

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//列表数量total
export function getJbjlJmJsdwCount(params) {
  var sql = "select count(*)as count from jbjl_jm_jsdw ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.jmdwmc) {
    sql_query.push(" bjmdwmc like '%" + params.jmdwmc + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (params.wfwt) {
    sql_query.push(" wfwt like '%" + params.wfwt + "%'");
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows[0].count);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//详情
export function getJbjlJmJsdwInfo(params) {
  var sql = "select * from jbjl_jm_jsdw where bh= ?";
  return new Promise(function(resolve, reject) {
    db.all(sql, params.bh, (err, rows) => {
      if (!err && rows.length == "1") {
        resolve(rows[0]);
      } else {
        console.log("error:获取详情有误");
      }
    });
  });
}

//更新
export function updateJbjlJmJsdw(params) {
  var sql = "update jbjl_jm_jsdw set ";
  // 拼接参数
  var keys = [
    "bh",
    "n",
    "y",
    "r",
    "rwbh",
    "zrwbh",
    "jgbh",
    "sjmc",
    "jcsj",
    "jcdd",
    "jcddjwd",
    "bjmdwmc",
    "bjmdwfzr",
    "fzrzz",
    "fzrzjlx",
    "fzrzjhm",
    "fzrjg",
    "fzrlxfs",
    "wfwt",
    "czyj",
    "jcrybh",
    "sjjlsj",
    "cbyj",
    "psrybh",
    "szpsnr",
    "szpssj",
    "gzczjg",
    "gzczsj",
    "gzczyj",
    "yzbs",
    "sm",
    "hy",
    "jmdwfzr",
    "jmdwmc",
    "sfjr",
    "sfkl"
  ];

  var sql_params = [],
    sql_params_values = [];
  keys.forEach(item => {
    if (params[item]) {
      sql_params.push(` ${item} = ? `);
      sql_params_values.push(params[item]);
    }
  });
  sql += sql_params.join(",") + " where bh= ?";

  sql_params_values.push(params.bh);

  return new Promise(function(resolve, reject) {
    db.run(sql, sql_params_values, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//删除
export function deleteJbjlJmJsdw(params) {
  var sql = "delete from jbjl_jm_jsdw where bh= ?";
  return new Promise(function(resolve, reject) {
    db.run(sql, params.bh, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

/*
 * ----end 假冒军事单位----
 */

/*
 * ---- 过检记录----
 */

/*
 * ----start 过检记录  过检人员----
 */

//新增过检
export function insertJbjlRyJcsj(values) {
  return new Promise(function(resolve, reject) {
    db.run(
      "insert into jbjl_ry_jcsj(bh,n,y,r,rwbh,zrwbh,jgbh,sjmc,jcsj,jcdd,jcddjwd,xm,xb,nl,zjlx,zjhm,ssdwbm,sjlx,wjwfqx,wjwfqxbh,czqk,jcrybh,sjjlsj,sm,gzcljg,gzclsj,zhgxsj,zhgxrybh,yzbs,yj,jx,zw,zy,sjycd,lxfs,zd,jz,ssdwmc,userid,sqlzsc,czbh,csny) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      values,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

//分页
export function getJbjlRyJcsjPage(params) {
  var sql = "select * from jbjl_ry_jcsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.xm) {
    sql_query.push(" xm like '%" + params.xm + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.ssdwmc) {
    sql_query.push(" ssdwmc like '%" + params.ssdwmc + "%'");
  }

  if (params.wjwfqxbh) {
    sql_query.push(" wjwfqxbh like '%" + params.wjwfqxbh + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (["0", "1"].indexOf(params.sjlx) != -1) {
    sql_query.push(" sjlx = " + params.sjlx);
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  //分页偏移量
  if (params.limit || params.page) {
    sql += " limit " + params.limit;
    sql += " offset " + (params.page - 1) * params.limit;
  }

  console.log("======:", sql);

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//列表数量total
export function getJbjlRyJcsjCount(params) {
  var sql = "select count(*)as count from jbjl_ry_jcsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.xm) {
    sql_query.push(" xm like '%" + params.xm + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.ssdwmc) {
    sql_query.push(" ssdwmc like '%" + params.ssdwmc + "%'");
  }

  if (params.wjwfqxbh) {
    sql_query.push(" wjwfqxbh like '%" + params.wjwfqxbh + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (["0", "1"].indexOf(params.sjlx) != -1) {
    sql_query.push(" sjlx = " + params.sjlx);
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows[0].count);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//详情
export function getJbjlRyJcsjInfo(params) {
  var sql = "select * from jbjl_ry_jcsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.all(sql, params.bh, (err, rows) => {
      if (!err && rows.length == "1") {
        resolve(rows[0]);
      } else {
        console.log("error:获取详情有误");
      }
    });
  });
}

//更新
export function updateJbjlRyJcsj(params) {
  var sql = "update jbjl_ry_jcsj set ";
  // 拼接参数
  var keys = [
    "bh",
    "n",
    "y",
    "r",
    "rwbh",
    "zrwbh",
    "jgbh",
    "sjmc",
    "jcsj",
    "jcdd",
    "jcddjwd",
    "xm",
    "xb",
    "nl",
    "zjlx",
    "zjhm",
    "ssdwbm",
    "sjlx",
    "wjwfqx",
    "wjwfqxbh",
    "czqk",
    "jcrybh",
    "sjjlsj",
    "sm",
    "gzcljg",
    "gzclsj",
    "zhgxsj",
    "zhgxrybh",
    "yzbs",
    "yj",
    "jx",
    "zw",
    "zy",
    "sjycd",
    "lxfs",
    "zd",
    "jz",
    "ssdwmc",
    "sqlzsc",
    "czbh",
    "csny"
  ];

  var sql_params = [],
    sql_params_values = [];
  keys.forEach(item => {
    //解决更新时ssdwbm改为 "" 的问题
    if (params[item] || item == "ssdwbm") {
      sql_params.push(` ${item} = ? `);
      sql_params_values.push(params[item]);
    }
  });
  sql += sql_params.join(",") + " where bh= ?";

  sql_params_values.push(params.bh);

  return new Promise(function(resolve, reject) {
    db.run(sql, sql_params_values, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//删除
export function deleteJbjlRyJcsj(params) {
  var sql = "delete from jbjl_ry_jcsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.run(sql, params.bh, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

/*
 * ----start 过检记录  过检车辆----
 */

//新增
export function insertJbjlClJcsj(values) {
  return new Promise(function(resolve, reject) {
    db.run(
      "insert into jbjl_cl_jcsj(bh,n,y,r,rwbh,zrwbh,jgbh,sjmc,jcsj,jcdd,jcddjwd,cphm,cx,fdjbh,ys,cjh,dw,wgtz,jsyxm,jsyxb,jsyzjlx,jsyzjhm,csdwbm,sjlx,wjwfqx,wjwfqxbh,czqk,jcrybh,sjjlsj,sm,gzcljg,gzclsj,zhgxsj,zhgxrybh,yzbs,ssdwmc,jz,lxfs,clssdwmc,userid,sqlzsc,csny,czbh,jx,zw,zd) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      values,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

//分页
export function getJbjlClJcsjPage(params) {
  var sql = "select * from jbjl_cl_jcsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.cphm) {
    sql_query.push(" cphm like '%" + params.cphm + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.ssdwmc) {
    sql_query.push(" ssdwmc like '%" + params.ssdwmc + "%'");
  }

  if (params.wjwfqxbh) {
    sql_query.push(" wjwfqxbh like '%" + params.wjwfqxbh + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (["0", "1"].indexOf(params.sjlx) != -1) {
    sql_query.push(" sjlx = " + params.sjlx);
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  //分页偏移量
  if (params.limit || params.page) {
    sql += " limit " + params.limit;
    sql += " offset " + (params.page - 1) * params.limit;
  }

  console.log("===纠察事件===:", sql);

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//列表数量total
export function getJbjlClJcsjCount(params) {
  var sql = "select count(*)as count from jbjl_cl_jcsj ";

  //模糊查询
  var sql_query = [];
  if (params.sync) {
    sql_query.push(" sync = " + params.sync);
  }

  if (params.userid) {
    sql_query.push(" userid = " + params.userid);
  }

  if (params.cphm) {
    sql_query.push(" cphm like '%" + params.cphm + "%'");
  }

  if (params.sjmc) {
    sql_query.push(" sjmc like '%" + params.sjmc + "%'");
  }

  if (params.ssdwmc) {
    sql_query.push(" ssdwmc like '%" + params.ssdwmc + "%'");
  }

  if (params.wjwfqxbh) {
    sql_query.push(" wjwfqxbh like '%" + params.wjwfqxbh + "%'");
  }

  if (params.jcsj) {
    sql_query.push(
      ` jcsj between '${params.jcsj} 00:00:00' and '${params.jcsj} 23:59:59' `
    );
  }

  if (["0", "1"].indexOf(params.sjlx) != -1) {
    sql_query.push(" sjlx = " + params.sjlx);
  }

  if (sql_query.length > 0) {
    sql += " where " + sql_query.join(" and ");
  }

  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows[0].count);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//详情
export function getJbjlClJcsjInfo(params) {
  var sql = "select * from jbjl_cl_jcsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.all(sql, params.bh, (err, rows) => {
      if (!err && rows.length == "1") {
        resolve(rows[0]);
      } else {
        console.log("error:获取详情有误", err);
      }
    });
  });
}

//更新
export function updateJbjlClJcsj(params) {
  var sql = "update jbjl_cl_jcsj set ";
  // 拼接参数

  var keys = [
    "bh",
    "n",
    "y",
    "r",
    "rwbh",
    "zrwbh",
    "jgbh",
    "sjmc",
    "jcsj",
    "jcdd",
    "jcddjwd",
    "cphm",
    "cx",
    "fdjbh",
    "ys",
    "cjh",
    "dw",
    "wgtz",
    "jsyxm",
    "jsyxb",
    "jsyzjlx",
    "jsyzjhm",
    "csdwbm",
    "sjlx",
    "wjwfqx",
    "wjwfqxbh",
    "czqk",
    "jcrybh",
    "sjjlsj",
    "sm",
    "gzcljg",
    "gzclsj",
    "zhgxsj",
    "zhgxrybh",
    "yzbs",
    "ssdwmc",
    "jz",
    "lxfs",
    "clssdwmc",
    "sqlzsc",
    "csny",
    "czbh",
    "jx",
    "zw",
    "zd"
  ];

  var sql_params = [],
    sql_params_values = [];
  keys.forEach(item => {
    // 解决车辆所属单位编码 更新为 "" 的问题
    if (params[item] || item == "csdwbm") {
      sql_params.push(` ${item} = ? `);
      sql_params_values.push(params[item]);
    }
  });
  sql += sql_params.join(",") + " where bh= ?";

  sql_params_values.push(params.bh);

  return new Promise(function(resolve, reject) {
    db.run(sql, sql_params_values, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        console.log("error:", err);
      }
    });
  });
}

//删除
export function deleteJbjlClJcsj(params) {
  var sql = "delete from jbjl_cl_jcsj where bh= ?";
  return new Promise(function(resolve, reject) {
    db.run(sql, params.bh, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:", err);
      }
    });
  });
}

/**
 * 附件表
 */
export function uploadFileToDb(values) {
  return new Promise(function(resolve, reject) {
    db.run(
      "insert into jbjl_fj(bh,filename,fileurl,createtime,createuser,sjbh) values(?,?,?,?,?,?)",
      values,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log("error:", err);
        }
      }
    );
  });
}

//更新附件
export function updateAttachments(bjbh, bh) {
  var bjbh_list = bjbh.split(",");
  bjbh_list.forEach(id => {
    new Promise(function(resolve, reject) {
      db.run(
        "update jbjl_fj set sjbh = ? where bh = ?",
        [bh, id],
        (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            console.log("error:", err);
          }
        }
      );
    });
  });
}

//根据事件编号获取关联的附件
export function getAttachmentsByBh(sjbh) {
  var sql = "select * from jbjl_fj where sjbh= ?";
  return new Promise(function(resolve, reject) {
    db.all(sql, sjbh, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:获取附件列表", err);
      }
    });
  });
}

//获取附件事件编号和事件编号关联关系
export function getAttachmentsList() {
  var sql = "select * from jbjl_fj where sjbh is not null";
  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:获取附件列表", err);
      }
    });
  });
}

//获取字典表
export function getDicList(type) {
  var sql = "select * from jbjl_dic where lx = ? ";
  return new Promise(function(resolve, reject) {
    db.all(sql, type, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:列表", err);
      }
    });
  });
}

//更新数据为已同步
export function updateRecordToSynchronized(tablename, p) {
  var sql = `update ${tablename} set sync = '1', rwbh = ? , jcrybh = ? where bh = ? `;
  console.log("同步sql:", sql);
  return new Promise(function(resolve, reject) {
    db.all(sql, p, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:更新", err);
      }
    });
  });
}

/**
 * 处置方法
 */
export function getJbjlCzffList(data) {
  var sql = "select * from jbjl_czff where lx= ?";
  return new Promise(function(resolve, reject) {
    db.all(sql, [data.lx], (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:获取处置方法列表", err);
      }
    });
  });
}

export function getXxszConfig() {
  var sql = "select * from XXSZ where id = '1' ";
  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows[0]);
      } else {
        console.log("error:系统消息", err);
      }
    });
  });
}

export function setXxszConfig(val) {
  console.log(val)
  var sql = "update XXSZ set status = ? where id = '1' ";
  return new Promise(function(resolve, reject) {
    db.all(sql, [val], (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.log("error:设置系统消息", err);
      }
    });
  });
}
