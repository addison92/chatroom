export const confirmBox = (that, sucFn = false, failFn = false,message) => {
  that.$confirm('确认'+message+'?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    that.$message({
      type: 'success',
      message: message+'成功'
    });
    if (sucFn) {
      sucFn()
    }
  }).catch(() => {
    that.$message({
      type: 'info',
      message: '已取消'+message
    });
    if (failFn) {
      failFn()
    }
  });
}
