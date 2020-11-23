// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardType: [
      { title: '身份证', icon: '/assets/zhengjian.png' },
      { title: '银行卡', icon: '/assets/yhk.png' }
    ]
  },
  add(event) {
    wx.navigateTo({
      url: `/pages/card/card?type=${event.detail.value}`,
    })
  },
  info(event) {
    const type = event.target.dataset.index
    wx.navigateTo({
      url: `/pages/info/info?type=${type}`,
    })
  }
})