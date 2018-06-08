import { Component, ViewChild, ElementRef } from '@angular/core';
import { Http, Jsonp, Headers, RequestOptions } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { Geolocation } from '@ionic-native/geolocation';
//房屋报修
import { RepairaddPage } from '../repairadd/repairadd';
//绑定房屋
import { BindroomPage } from '../bindroom/bindroom';
//跳入登录页面
import { LoginPage } from '../login/login';

//新闻详情页面
import { NewinfoPage } from '../newinfo/newinfo';
//费用明细页面
import { PayfeePage } from '../payfee/payfee';
//费用预存页面
import { PayprefeePage } from '../payprefee/payprefee';
//资讯列表页面
import { NewslistPage } from '../newslist/newslist';
//工单详情页
import { RepairlistPage } from '../repairlist/repairlist';
//商城订单
import { ShoppinglistPage } from '../shoppinglist/shoppinglist';

//房屋明细
import { HouseinfolistPage } from '../houseinfolist/houseinfolist';
//loading
import { LoadingPage } from '../loading/loading';

//在线缴费
import{OnlinepaymentPage}from '../onlinepayment/onlinepayment';
import { LoadingController } from 'ionic-angular';
//测试页面跳转到shopmallist
// import { TestPage } from '../test/test';
import { ShopmalllistPage } from '../shopmalllist/shopmalllist';
import { RentsaleaddPage } from '../rentsaleadd/rentsaleadd';
import {RentsalePage} from '../rentsale/rentsale';
import {ShopgoodsinfoPage} from '../shopgoodsinfo/shopgoodsinfo';
import {ShopinfoPage} from '../shopinfo/shopinfo';
import {RentsaleinfoPage} from '../rentsaleinfo/rentsaleinfo'
import $ from 'jquery';
declare var BMap;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') map_container: ElementRef;
  map: any;//地图对象
  marker: any;//标记
  geolocation1: any;
  myIcon: any;
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  public roomid: any;
  public enSureLoginHome: boolean;
  //发送数据
  public token = '';
  //当前页、一页显示的个数
  public cityCode = 4004;
  public url ;
  public Id ;
  public pageIndex=1;
  public pageSize=3;
  //获得数据
  public roomname = []; /*数组 获取房屋列表*/
  public house = {};    /*对象 默认房屋*/
  public prearr = {};   /*对象 欠费金额与预存款金额*/
  public focusList=[];  /*数组 轮播图*/
  public newsList=[];   /*数组 最新资讯*/
  public publicget=[];  /*数组 公示公告*/
  public paymentList=[];/*数组 物业缴费明细 */
  public iof_defList=[];/**数组 默认房屋 */
  defRoomId = "";
  public roomidlist=[];/**数组  所有房屋 */
  //跳转页面
  // public TestPage =TestPage
  public RepairaddPage = RepairaddPage;
  public BindroomPage = BindroomPage;
  public PayfeePage=PayfeePage;
  public NewslistPage=NewslistPage;
  public RepairlistPage = RepairlistPage;
  public PayprefeePage = PayprefeePage;
  public ShoppinglistPage = ShoppinglistPage;
  public LoginPage = LoginPage;
  //轮播图的页面跳转
  public RentsalePage = RentsalePage;
  //轮播图的页面跳转
  //public RentsalePage = RentsalePage;

  public HouseinfolistPage = HouseinfolistPage;
  public LoadingPage = LoadingPage;

  public OnlinepaymentPage=OnlinepaymentPage;
  public RentsaleaddPage = RentsaleaddPage;

  constructor(public navCtrl: NavController, public config: ConfigProvider, public navParams: NavParams, public http: Http, public jsonp: Jsonp,
    public storage: StorageProvider, private geolocation: Geolocation,public loadingCtrl: LoadingController) {
      this.geolocation1 = Geolocation;
  }
  ionViewWillEnter(){
      //将PX转换为REM
      this.getRem();
      //获取首页轮播图
      this.getFocus();
      //获取最新资讯
      this.getNews();
      //获取最新公告
      this.getPublic();
      if(this.storage.get('token')){
          this.token = this.storage.get('token');
          this.enSureLoginHome = true;
         // this.getHouseDefault();
          //获取默认房屋
          if(this.storage.get('roomId')){
            this.defRoomId=this.storage.get('roomId')
            this.getroomId();
            this.getpayment(this.defRoomId);
          }else{
               this.getiof_def();
          }
      } else {
          this.enSureLoginHome = false;
      }
      
  }

   ionViewDidEnter() {
      //this.getPosition();
   }

  getPosition() {
    var that = this;
     this.geolocation.getCurrentPosition().then((resp) => {
      var point = new BMap.Point(resp.coords.longitude,resp.coords.latitude);
      var gc = new BMap.Geocoder();
      gc.getLocation(point, function (rs) {
        var addComp = rs.addressComponents;
        console.log(addComp.city)
        that.storage.set("currentPlace",addComp.city);
      });
       });
}

  //轮播图
  // getFocus() {
  //   var that = this;
  //   that.focusList = [
  //     'assets/imgs/slide01.png',
  //     'assets/imgs/slide02.png',
  //     'assets/imgs/slide03.jpg',
  //     'assets/imgs/rent1.png'
  //   ];
  // }
  getFocus(){
    $(".spinnerbox").fadeIn(200);
        $(".spinner").fadeIn(200);
    var api = this.config.apiUrl + '/api/Index/banner?citycode='+this.cityCode;
    this.http.get(api).map(res => res.json()).subscribe(data =>{
        $(".spinnerbox").fadeOut(200);
        $(".spinner").fadeOut(200);
      if(data.errcode===0 && data.errmsg === 'OK'){
        this.focusList = data.list;
        console.log(this.focusList);
      }else{

      }
    })
  }
  //轮播图详情
  getInfo(url){
    this.url=url.substring(0,3);
    this.Id = url.substring(3,)
    if(url==="HRSHome"){
      this.navCtrl.push(RentsalePage)
    }else if(this.url==="gId"){
       this.navCtrl.push(ShopinfoPage,{sid:this.Id})
    }else if(this.url ==="sId"){
      this.navCtrl.push(ShopinfoPage,{sid:this.Id})
    }else if(this.url === "rez"){
     this.navCtrl.push(RentsaleinfoPage,{ houseId:this.Id,houseType:2,quFen:1})
    }else if(this.url === "res"){
      this.navCtrl.push(RentsaleinfoPage,{ houseId:this.Id,houseType:1,quFen:1})
    }
  }

  getNews() {
    // let loading = this.loadingCtrl.create({
	  //   showBackdrop: true,
    // });
    // loading.present();
    $(".spinnerbox").fadeIn(200);
    $(".spinner").fadeIn(200);
    var j = 3;
    if(this.storage.get('token')){
      this.token = this.storage.get('token');
    }else{
      this.token = '';
    }
    var api = this.config.apiUrl + '/api/Nwes/list?pageIndex='+this.pageIndex+'&pageSize='+this.pageSize+'&keyWord=&token=' + this.token +'&act=zx&type=1';
    this.http.get(api).map(res => res.json()).subscribe(data => {
      //loading.dismiss();
        $(".spinnerbox").fadeOut(200);
        $(".spinner").fadeOut(200);
      if (data.errcode === 0 && data.errmsg === 'OK') {
        this.newsList = data.list;
      } else if (data.errcode === 40002) {
        j--;
        if (j > 0) {
          this.config.doDefLogin();
          this.getNews();
        }
      } else {
        alert("data.errmsg")
      }
    });
  }
//获取公示公告
  getPublic() {
    // let loading = this.loadingCtrl.create({
	  //   showBackdrop: true,
    // });
    // loading.present();
    $(".spinnerbox").fadeIn(200);
        $(".spinner").fadeIn(200);
    var j = 3;
    if(this.storage.get('token')){
      this.token = this.storage.get('token');
    }else {
      this.token = '';
    }
    var api = this.config.apiUrl + '/api/Nwes/list?pageIndex='+this.pageIndex+'&pageSize=' + this.pageSize+'&keyWord=&token='+ this.token +'&act=gs&type=1';
    this.http.get(api).map(res => res.json()).subscribe(data => {
      //loading.dismiss();
      $(".spinnerbox").fadeOut(200);
        $(".spinner").fadeOut(200);
      if (data.errcode === 0 && data.errmsg === 'OK') {
        this.publicget = data.list;
        console.log(this.publicget)
      } else if (data.errcode === 40002) {
        j--;
        if (j > 0) {
          this.config.doDefLogin();
          this.getPublic();
        }
      } else {
        alert("data.errmsg")
      }
    });

  }

 getNewInfo(nid) {
    this.navCtrl.push(NewinfoPage, {
      id: nid
    });
  }
  //查询默认房屋
  getiof_def(){
    //  let loading = this.loadingCtrl.create({
	  //   showBackdrop: true,
    // });
    // loading.present();
    $(".spinnerbox").fadeIn(200);
        $(".spinner").fadeIn(200);
    var j=3
    var api= this.config.apiUrl +'/api/userroom/info_def?token='+this.storage.get('token');
     this.http.get(api).map(res => res.json()).subscribe(data =>{
       //loading.dismiss();
       $(".spinnerbox").fadeOut(200);
        $(".spinner").fadeOut(200);
          if(data.errcode===0&&data.errmsg==='OK'){
            //this.iof_defList=data.model;
            this.defRoomId = data.model.House_Room_Id;
            this.roomid = this.defRoomId;
            this.storage.set('roomId',this.defRoomId)
            this.getpayment(data.model.House_Room_Id);
            this.getroomId();
          }else if (data.errcode===4002){
            j--;
            this.config.doDefLogin();
            this.getiof_def();
          }else{
            alert(data.errmsg)
          }
     })
  }
  //查询用户绑定的所有房屋
  getroomId(){
    $(".spinnerbox").fadeIn(200);
        $(".spinner").fadeIn(200);
    var that=this;
    var j=3;
    var api = this.config.apiUrl+'/api/vuserroom/dw?token='+this.storage.get('token');
     this.http.get(api).map(res => res.json()).subscribe(data =>{
       $(".spinnerbox").fadeOut(200);
        $(".spinner").fadeOut(200);
          if(data.errcode===0&&data.errmsg==='OK'){ 
            that.roomidlist=data.list;
            console.log(that.roomidlist)
          }else if (data.errcode===4002){
            j--;
            this.config.doDefLogin();
            this.getroomId();
          } else{
            alert(data.errmsg)
          }
     })
  }
//获取物业费用
getpayment(roomid){
   var that=this;
   var j = 3;
    var api = this.config.apiUrl + '/api/charge/list?roomId='+roomid;   //获取到绑定的房屋
    this.http.get(api).map(res => res.json()).subscribe(data =>{
         this.paymentList = data.json.totalNum.model;
    });
}

changeRoom(roomid) {
    if (this.roomid === "add") {
      this.navCtrl.push(BindroomPage);
    }else{
      this.storage.set('roomId',roomid)
      this.getpayment(roomid)
    }
  }
  getNewsList(act){
    this.navCtrl.push(NewslistPage,{
      act:act
    })
  }

  getRem() {
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    document.documentElement.style.fontSize = (w / 750 * 115) + 'px';
  }
  //跳转页面
  goPayfee(){
      //确认登录状态
      if(this.storage.get('token')){
        this.navCtrl.push(PayfeePage);
      } else {
        this.navCtrl.push(LoginPage);
      } 
  }
  goRepairadd(type){
          //确认登录状态
      if(this.storage.get('token')){
        this.navCtrl.push(RepairaddPage,{type:type});
      } else {
        this.navCtrl.push(LoginPage);
      }
  }
  goHouseinfolist(){
      //确认登录状态
      if(this.storage.get('token')){
        this.navCtrl.push(HouseinfolistPage);
      } else {
        this.navCtrl.push(LoginPage);
      }
  }
  goPayrefee(){
          //确认登录状态
      if(this.storage.get('token')){
        this.navCtrl.push(PayprefeePage);
      } else {
        this.navCtrl.push(LoginPage);
      }
  }
  goShoppinglist(id){
      //确认登录状态
      if(this.storage.get('token')){
        this.navCtrl.push(ShoppinglistPage,{id:id});
      } else {
        this.navCtrl.push(LoginPage);
      }
  }
  goRentsaleadd(){
              //确认登录状态
      if(this.storage.get('token')){
        this.navCtrl.push(RentsaleaddPage);
      } else {
        this.navCtrl.push(LoginPage);
      }
  }
  goNewslist(act){
        if(this.storage.get('token')){
        this.navCtrl.push(NewslistPage,{act:act});
      } else {
        this.navCtrl.push(LoginPage);
      }
  }
  goOnlinepayment(){
        if(this.storage.get('token')){
        this.navCtrl.push(OnlinepaymentPage);
      } else {
        this.navCtrl.push(LoginPage);
      }
  }

}
