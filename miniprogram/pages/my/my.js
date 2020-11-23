// miniprogram/pages/my/my.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    idList: [],
    bankList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    this.setData({
      openid: app.globalData.openid
    })

    // this.getInfo('IDCard', this.data.idList, 0)
    // this.getInfo('bankCard', this.data.bankList, 1)
  
  },

  // 获取信息
  getInfo(collectionName, list, type) {
    wx.cloud.database().collection(collectionName)
    .where({
      openid: this.data.openid
    })
    .get()
    .then(res => {
      const oldlist = list
      oldlist.push(...res.data)
      if (type == 0) {
        this.setData({
          idList: oldlist
        })
      } else {
        this.setData({
          bankList: oldlist
        })
      }
    })
  },

  onTabItemTap(item) {
    this.setData({
      idList: [],
      bankList: []
    })
    this.getInfo('IDCard', this.data.idList, 0)
    this.getInfo('bankCard', this.data.bankList, 1)
  }

})