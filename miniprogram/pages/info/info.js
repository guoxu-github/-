// miniprogram/pages/info/info.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    type: 0,
    page: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    this.setData({
      type: options.type,
      openid: app.globalData.openid
    })
    const collectionName = this.data.type == 0 ? 'IDCard' : 'bankCard'
    this.getInfo(collectionName)
    
  },

  // 获取信息
  getInfo(collectionName) {
    wx.cloud.database().collection(collectionName)
    .where({
      openid: this.data.openid
    })
    .skip(this.data.page * 10).limit(10)
    .get()
    .then(res => {
      const oldlist = this.data.list
      oldlist.push(...res.data)
      this.setData({
        page: this.data.page + 1,
        list: oldlist
      })
      this.show(this.data.type)
    })
  },

  copy(event) {
    const index = event.target.dataset.index
    wx.setClipboardData({
      data: this.data.list[index].id,
    })
  },

  delete(event) {
    const index = event.target.dataset.index
    const collectionName = this.data.type == 0 ? 'IDCard' : 'bankCard'
    
    wx.cloud.database().collection(collectionName).doc(this.data.list[index]._id).remove().then(res => {
      const oldlist = this.data.list
      const list = oldlist.splice(index, 1)
      this.setData({ list: oldlist })
      this.show(this.data.type)
    })
  },


  show(type) {
    if (this.data.list.length == 0) {
      wx.showModal({
        title: '提示',
        content: this.data.type == 0 ? '请添加身份证' : '请添加银行卡',
        success (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: `/pages/card/card?type=${type}`,
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const collectionName = this.data.type == 0 ? 'IDCard' : 'bankCard'
    this.getInfo(collectionName)
  },

})