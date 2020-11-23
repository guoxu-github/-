// miniprogram/pages/card/card.js
const IDCard = wx.cloud.database().collection('IDCard')
const bankCard = wx.cloud.database().collection('bankCard')
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    idInfo: null,
    bankInfo: null,
    fileID: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
  },

  choose() {
    wx.chooseImage({

    }).then(res => {
      wx.showLoading({
        title: '正在识别中',
        mask: true
      })
      //获取图片地址上传云存储
      const time = new Date().getTime()
      const fileURL = res.tempFilePaths[0]
      wx.cloud.uploadFile({
        cloudPath: `images/${time}.jpg`,
        filePath: fileURL
      }).then(res => {
        const fileID = res.fileID
        this.setData({ fileID })
        // 获取临时网络链接
        wx.cloud.getTempFileURL({
          fileList: [fileID]
        }).then(res => {
          // console.log(res.fileList[0].tempFileURL);
          // 调用云函数
          wx.cloud.callFunction({
            name: 'choose',
            data: {
              fileURL: res.fileList[0].tempFileURL,
              type: this.data.type
            }
          }).then(res => {
            if (this.data.type == 0) {
              this.handIdInfo(res)
            } else {
              this.handBankInfo(res)
            }
          })
        })
      })
    })
  },

// 展示身份证信息
  handIdInfo(res) {
    
    const info = JSON.parse(res.result.body).result_list[0].data
    
    if (!info.id ) {
      wx.showToast({
        title: '识别失败',
        image: '/assets/fail.png'
      })
      wx.cloud.deleteFile({
        fileList: [this.data.fileID]
      })
      return
    }

    const idInfo = {
      name: info.name,
      sex: info.sex,
      nation: info.nation,
      birth: info.birth,
      address: info.address,
      id: info.id,
      fileID: this.data.fileID,
      openid: app.globalData.openid
    }

    this.setData({idInfo})
    wx.hideLoading()
  },

// 展示银行卡信息
  handBankInfo(res) {
    const info = JSON.parse(res.result.body).data.items

    if (info.length < 5 ) {
      wx.showToast({
        title: '识别失败',
        image: '/assets/fail.png'
      })
      wx.cloud.deleteFile({
        fileList: [this.data.fileID]
      })
      return
    }

    const bank = {
      id : info[0].itemstring,
      type : info[1].itemstring,
      name : info[2].itemstring,
      info : info[3].itemstring,
      date : info[4].itemstring,
      fileID: this.data.fileID,
      openid: app.globalData.openid
    }
    this.setData({
      bankInfo : bank
    })
    wx.hideLoading()
  },

// 保存信息
  save() {
    wx.showLoading({
      title: '正在保存中',
    })
    if (this.data.type == 0) {
      // 查询是否含有相同的信息
      IDCard.where({
        id: this.data.idInfo.id
      }).get().then(res => {
        if (res.data.length > 0) {
          IDCard.doc(res.data[0]._id).set({
            data: this.data.idInfo
          })
          wx.cloud.deleteFile({
            fileList: [res.data[0].fileID]
          })
        } else {
          IDCard.add({
            data: this.data.idInfo
          })
        }
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      })
    } else {
      // 查询是否含有相同的信息
      bankCard.where({
        id: this.data.bankInfo.id
      }).get().then(res => {
        if (res.data.length > 0) {
          bankCard.doc(res.data[0]._id).set({
            data: this.data.bankInfo
          })
          wx.cloud.deleteFile({
            fileList: [res.data[0].fileID]
          })
        } else {
          bankCard.add({
            data: this.data.bankInfo
          })
        }
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      })
    }
    
  },

  // 复制信息
  copy() {
    wx.setClipboardData({
      data: this.data.type == 0 ? this.data.idInfo.id : this.data.bankInfo.id
    }).then(res => {
      wx.showToast({
        title: '复制成功',
      })
    })
  }
})