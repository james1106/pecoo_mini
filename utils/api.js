const app = getApp()
const request = require('../utils/request.js');

/**
 * 获取首页接口
 */
// 首页banner
const appIndexBanner = data => request('/content/appindex/banner', data, 'POST');
// 新品特供
const appIndex = data => request('/content/appindex', data, 'POST');
// 首页猜你喜欢、
const likeGoods = data => request('/content/likegoods', data, 'POST');
// 首页拍品搜索
const auctionSearch = data => request('/search/doSearch', data, 'POST', 'search');
/**
 * 分类接口
 */
// 一级分类
const firstCategory = data => request('/category/list/first', data, 'POST');
// 二级分类
const twoCategory = data => request('/category/list/second/parent', data, 'POST');
// 获取父节点下的分类列表（包含二、三级）
const parentCategory = data => request('/category/list/parent', data, 'POST');
// 获取分类列表
const queryGoodsByKind = data => request('/auctiongoods/list', data, 'POST');
// 分类列表筛选
const queryFilterList = data => request('/auctiongoods/list/getfilterlist', data, 'POST');
// 奢侈品的分类筛选
const luxuryCateFilter = data => request('/luxury/brand/list/bycode', data, 'POST');
// 奢侈品的品牌筛选
const luxuryBrandFilter = data => request('/luxury/category/list/bybrand', data, 'POST');
/**
 * 验证是否登陆和授权接口
 */
// 微信授权接口
const getUserInfo = data => request('/login/userinfo', data, 'POST');
// 校验是否登陆
const isLogin = data => request('/login/islogin', data, 'POST');
/**
 * 用户注册登陆
 */
// 用户登陆
const loginIn = data => request('/login/login', data, 'POST');
// 校验手机号是否存在
const verificationMobile = data => request('/thirdlogin/isexist', data, 'POST');
// 获取图形验证码的值
const picVerificationCodeUrl = app.globalData.host + '/register/vcode/app';
// 获取图形验证码的key值
const picVerificationKey= data => request('/register/vcode/temp', data, 'POST');
// 获取注册的短信验证码
const getRegisterCode = data => request('/register/sendcode', data, 'POST');
// 注册
const register = data => request('/register/register', data, 'POST');
// 找回密码/重置密码
const resetPwd = data => request('/login/resetpwd', data, 'POST');
// 用户修改密码
const changePassword = data => request('/user/update/password', data, 'POST');
// 发送实名认证的验证码
const sendMobileReal = data => request('/user/sendcode/realname', data, 'POST');
// 用户实名认证
const userVerify = data => request('/user/verify', data, 'POST');
// 用户修改手机号给老手机号发送验证码
const sendCodeMobileOld = data => request('/user/sendcode/updphoneold', data, 'POST');
// 校验老手机号的验证码
const isCodeOld = data => request('/user/update/mobilecheck', data, 'POST');
// 用户修改新手机号的验证码
const sendCodeMobileNew = data => request('/user/sendcode/updphone', data, 'POST');
// 用户修改手机号
const updateMobile = data => request('/user/update/mobile', data, 'POST');


/**
 * 拍品详情接口
 */
// 拍品详情 
const getGoodsDetailData = data => request('/auctiongoods/detail', data, 'POST');
// 翻译接口
const goodsTranslate = data => request('/auctiongoods/translate', data, 'POST');
// 拍品下单
const createOrder = data => request('/order/create', data, 'POST');
// 拍品猜你喜欢
const goodsLikeList = data => request('/content/goodslist', data, 'POST');
// 获取百度语音的token
const getToken = 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=LMtoAGDFpEYKGuSjGDuKiH82&client_secret=0l8IKTsUk85pqihg3h8ZTKxsRuSZFjoT'

/**
 * 拍卖行/拍卖会
 */
// 拍卖会
const auctionList = data => request('/auction/list', data, 'POST');
// 根据日期改变拍卖会
const queryByDate = data => request('/auction/list/bydate', data, 'POST');
// 拍卖会场
const auctionListGoods = data => request('/auction/listgoods', data, 'POST');
// 拍卖行列表
const auctionHouseList = data => request('/auctionhouse/list', data, 'POST');
// 拍卖行详情
const auctionHouseDetail = data => request('/auctionhouse/detail', data, 'POST');


/**
 * 获取奢侈品首页接口
 */
// 奢侈品页banner
const luxuryBanner = data => request('/luxury/index/banner', data, 'POST');
// 奢侈品的新品来袭
const luxuryGoodsNew =data => request('/luxury/index/goodsnew', data, 'POST');
// 奢侈品的故事
const luxuryStory = data => request('/luxury/index/story', data, 'POST');
// 奢侈品的列表  -----
const luxuryGoodsList = data => request('/luxury/goods/list', data, 'POST');
// 奢侈品的详情
const luxuryGoodsDetail = data => request('/luxury/goods/detail', data, 'POST');
// 获取品牌A-Z
const queryGoodsbrand = data => request('/luxury/brand/querygoodsbrand', data, 'POST');
// 品牌列表与查询
const luxuryBrandList = data => request('/luxury/brand/list', data, 'POST');
// 奢侈品搜索
const queryLuxuryGoods = data => request('/search/luxury/queryLuxuryGoods', data, 'POST', 'search');
// 奢侈品的分类热门推荐
const luxuryCategoryRecommend = data => request('/luxury/category/list/recommend', data, 'POST');
// 奢侈品翻译
const luxuryTranslate = data => request('/luxury/goods/translate', data, 'POST');
// 奢侈品猜你喜欢
const luxuryLike = data => request('/recommend/luxury/guessYouLikeApp', data, 'POST', 'recommend');
// 奢侈品绑定清关证件
const luxuryBindCard = data => request('/luxury/luxuryorder/bindingcardid', data, 'POST');

/**
 * 奢侈品订单
 */
// 下单
const luxuryCreateOrder = data => request('/luxury/luxuryorder/createorder', data, 'POST');
// 获取默认地址and清关证件信息
const getAddressAndIdCard = data => request('/address/getaddressidcard', data, 'POST');
// 奢侈品的计算订单费用
const getOrderPrice = data => request('/luxury/luxuryorder/getorderprice', data, 'POST');
// 奢侈品订单详情
const luxuryOrderDetail = data => request('/luxury/luxuryorder/detail', data, 'POST');
// 奢侈品订单列表
const luxuryOrderList = data => request('/luxury/luxuryorder/list', data, 'POST');
// 奢侈品取消订单
const luxuryOrderCancel = data => request('/luxury/luxuryorder/cancelorder', data, 'POST');
// 奢侈品确认收货
const luxuryConfirmGoods = data => request('/luxury/luxuryorder/receiptorder', data, 'POST');
// 奢侈品订单支付
const luxuryOrderPay = data => request('/orderpay/setLuxuryOrderPaymentNew', data, 'POST');
// 奢侈品的物流信息
const luxuryExpress = data => request('/expressinfo/luxurydetail', data, 'POST')
/**
 * 用户收藏
 */
// 设置收藏
const addUserCollection = data => request('/collection/save', data, 'POST', 'json');
// 取消收藏
const delUserCollection = data => request('/collection/delete', data, 'POST');
// 我的收藏
const collectionList = data => request('/collection/list', data, 'POST');
// 获取货币单位
const queryUnitList = data => request('/collection/queryunitlist', data, 'POST');



/**
 * 用户地址
 */
// 查询用户地址
const queryUserAddressList = data => request('/address/list/byuser', data, 'POST');
// 删除地址
const delUserAddress = data => request('/address/delete', data, 'POST');
// 保存地址
const saveUserAddress = data => request('/address/save', data, 'POST', 'json');
// 修改地址
const updateUserAddress = data => request('/address/update', data, 'POST', 'json');

/**
 * 用户身份证信息表
 */
// 清关证件修改/保存
const saveOrUpdate = '/useridcard/saveorupdate';
// 清关证件修改只修改名字
const saveName = data => request('/useridcard/saveorupdate', data, 'POST');
// 删除证件
const delUserCard = data => request('/useridcard/delete', data, 'POST');
// 清关证件列表
const userIdCardList = data => request('/useridcard/list', data, 'POST');
// 查询某一个清关信息
const currentInfo = data => request('/useridcard/detail', data, 'POST');

/**
 * 我的推荐
 */
// 获取分享码
const getRecommendCode = data => request('/user/recommendcode', data, 'POST');
// 获取推荐记录
const recommendList = data => request('/user/recommend/list', data, 'POST');
// 获取推荐订单
const recommendOrder = data => request('/order/queryChannelOrderList', data, 'POST');
// 获取推荐订单详情
const recommendOrderDetail = data => request('/order/queryChannelOrderDetail', data, 'POST');

/**
 * 站内信
 */
// 查询站内信列表
const queryMessageList = data => request('/message/list', data, 'POST');
// 删除站内信
const delMessage = data => request('/message/delete', data, 'POST');
// 站内信详情
const queryMessageInfo = data => request('/message/detail', data, 'POST');
// 查询站内信未读数量
const queryMessageListCount = data => request('/message/count/unread', data, 'POST');
// 发送站内信
const updateStatus = data => request('/message/updatestatus', data, 'POST');

/**
 * 优惠券
 */
// 优惠券列表
const voucherList = data => request('/voucher/list', data, 'POST');
// 根据优惠券码获取优惠券
const voucherGetByCode = data => request('/voucher/get/bycode', data, 'POST');
// 激活代金券
const voucherUpdateStatus = data => request('/voucher/update/status', data, 'POST');
// 使用记录
const voucherDetail = data => request('/voucher/detail', data, 'POST');

/**
 * 用户
 */
// 用户信息
const myUsreInfo = data => request('/user/info', data, 'POST');
// 取消支付改变订单状态
const updateCancelOrderPay = data => request('/useraccount/updateCancelFrozenMoney', data, 'POST');

/**
 * 订单
 */
// 拍品订单列表
const getAuctionOrderList = data => request('/order/list', data, 'POST');
// 拍品订单详情
const getAuctionOrderDetail = data => request('/order/detail', data, 'POST');
// 修改竞拍价格
const updateAuctionOrder = data => request('/order/update', data, 'POST');
// 取消订单
const cancelAuctionOrder = data => request('/order/cancel', data, 'POST');
// 确认收货
const receiveAuctionGoods = data => request('/order/receive', data, 'POST');
// 去支付页面的信息接口
const payAuctionInfo = data => request('/order/paymess', data, 'POST');
// 拍品订单支付
const auctionOrderPay = data => request('/orderpay/setorderpayment', data, 'POST');
// 查看物流
const lookExpressInfo = data => request('/expressinfo/detail', data, 'POST');
// 物流信息实时查询
const getExpressInfo = data => request('/expressinfo/queryexpressinfo', data, 'POST');
const queryOrderStatusList = data => request('/order/status', data, 'POST');
// 拍品的申请售后图片上传
const afterSalesUpload = '/uploadone/img';
// 保存用户的申请售后
const updateAfterSales = data => request('/customerservice/saveorupdate', data, 'POST')
// 查询用户的售后服务
const getCustomerService = data => request('/customerservice/getcustomerservice', data, 'POST');
/**
 * 金币订单
 */
// 金币订单列表
const goldOrderList = data => request('/coin/order/list', data, 'POST');
// 金币确认收货
const receiveGoldGoods = data => request('/coin/order/receive', data, 'POST');
// 
/**
 * 用户转账/充值
 */
// 转账
const transfer = data => request('/useraccount/transfer', data, 'POST');
// 充值申请
const rechargeApply = data => request('/useraccount/recharge', data, 'POST');
// 充值支付
const rechargePay = data => request('/useraccount/rechargeapp', data, 'POST');
// 充值记录
const rechargeRecord = data => request('/userlog/rechargelog', data, 'POST');
// 提现记录
const showRecord = data => request('/userlog/withdrawlog', data, 'POST');
// 消费记录
const consumeRecord = data => request('/userlog/orderpaylog', data, 'POST');
module.exports={
  getToken,
  appIndexBanner,
  appIndex,
  likeGoods,
  auctionSearch,
  resetPwd,
  getUserInfo,
  picVerificationKey,
  getRegisterCode,
  register,
  firstCategory,
  twoCategory,
  parentCategory,
  picVerificationCodeUrl,
  loginIn,
  isLogin,
  verificationMobile,
  voucherUpdateStatus,
  voucherDetail,
  voucherGetByCode,
  voucherList,
  delUserCard,
  saveOrUpdate,
  saveName,
  currentInfo,
  userIdCardList,
  sendMobileReal,
  userVerify,
  sendCodeMobileOld,
  isCodeOld,
  sendCodeMobileNew,
  updateMobile,
  changePassword,
  recommendList,
  recommendOrder,
  recommendOrderDetail,
  getRecommendCode,  
  delUserCollection,
  addUserCollection,
  collectionList,
  queryUnitList,
  delUserAddress,
  updateUserAddress,
  saveUserAddress,
  queryUserAddressList,
  delMessage,
  queryMessageInfo,
  queryMessageListCount,
  queryMessageList,
  updateStatus,
  getAuctionOrderDetail,
  updateAuctionOrder,
  cancelAuctionOrder,
  receiveAuctionGoods,
  payAuctionInfo,
  auctionOrderPay,
  queryOrderStatusList,
  afterSalesUpload,
  getCustomerService,
  updateAfterSales,
  lookExpressInfo,
  getExpressInfo,
  goldOrderList,
  receiveGoldGoods,
  getAuctionOrderList,
  queryFilterList,
  luxuryCateFilter,
  luxuryBrandFilter,
  goodsTranslate,
  createOrder,
  goodsLikeList,
  queryGoodsByKind,
  getGoodsDetailData,
  auctionHouseDetail,
  queryByDate,
  auctionList,
  auctionListGoods,
  auctionHouseList,
  luxuryBanner,
  luxuryGoodsNew,
  luxuryStory,
  luxuryGoodsList,
  luxuryGoodsDetail,
  queryGoodsbrand,
  luxuryBrandList,
  queryLuxuryGoods,
  luxuryCategoryRecommend,
  luxuryTranslate,
  luxuryLike,
  luxuryBindCard,
  luxuryCreateOrder,
  getAddressAndIdCard,
  getOrderPrice,
  luxuryOrderDetail,
  luxuryOrderList,
  luxuryOrderCancel,
  luxuryConfirmGoods,
  luxuryExpress,
  luxuryOrderPay,
  myUsreInfo,
  updateCancelOrderPay,
  rechargeApply,
  rechargePay,
  rechargeRecord,
  showRecord,
  consumeRecord,
  transfer,
}