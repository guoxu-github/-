// 云函数入口文件
const cloud = require('wx-server-sdk')
const { ImageClient } = require('image-node-sdk')


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const fileURL = event.fileURL
  const type = event.type
  
  let AppId = '1304054844'; // 腾讯云 AppId
  let SecretId = 'AKIDzd2Mdg2MN8sOfos64mJmzy4wndGL8RSM'; // 腾讯云 SecretId
  let SecretKey = '2MTNAounun0zkf7g2QZu0rY2oE3d9Ylr'; // 腾讯云 SecretKey

  let idCardImageUrl = fileURL;
  let imgClient = new ImageClient({ AppId, SecretId, SecretKey });
  if (type == 0) {
    const res = await imgClient.ocrIdCard({
      data: {
        url_list: [idCardImageUrl]
      }
    })
    return res
  } else {
    const res = await imgClient.ocrBankCard({
      data: {
        url: idCardImageUrl
      }
    })
    return res
  }
}