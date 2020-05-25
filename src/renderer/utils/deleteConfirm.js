
export const deleteConfirm = (that,sucFn=false,failFn=false) => {
  that.$confirm('确认删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {    
    if(sucFn) {
      sucFn()
    }
  }).catch(() => {
    that.$message({
      type: 'info',
      message: '已取消删除'
    });
    if(failFn) {
      failFn()
    }
  });
}


