import { Message } from "element-ui";
export default {
  showToast: function(message, type = "waring", duration = 1000) {
    Message({
      message,
      type,
      duration
    });
  }
};