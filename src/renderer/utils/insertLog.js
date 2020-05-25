import fse from "fs-extra";
import path from "path";
import fs from "fs";

import { logDir } from "./settings";

const insertLog = function(txt) {
  //获取客户端日志路径
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const now = `${year}${month}${day}`;
  const logPath = path.join(logDir, `${now}.log`);

  fse.ensureFileSync(logPath);

  fs.appendFile(logPath, `${txt}\r\n`, function(err) {
    if (err) {
      throw err;
    }
    console.log("inserted.");
  });
};

export default insertLog;
