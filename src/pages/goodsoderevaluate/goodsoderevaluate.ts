import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//请求数据
import {Http,Jsonp}from '@angular/http';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
//config.ts
import { ConfigProvider } from '../../providers/config/config';
//StorageProvider
import { StorageProvider } from '../../providers/storage/storage';
//商品购物列表
import { ShoppinglistPage } from '../shoppinglist/shoppinglist';

@IonicPage()
@Component({
  selector: 'page-goodsoderevaluate',
  templateUrl: 'goodsoderevaluate.html',
})

export class GoodsoderevaluatePage {


    public list=[];
    public ShoppinglistPage=ShoppinglistPage;

    public SD_id;
    public evaluateList={
    trade_Id:'',
    commentGroup:'',
    token : ''
  };

     //定义token
  public token=this.storage.get('token');
  //定义congfig中公共链接的变量aa
  public aa = this.config.apiUrl;//http://test.api.gyhsh.cn/api/tradegoods/add?pageSize=10&pageIndex=1&trade_State=0&token=111
 
  constructor(public storage:StorageProvider,public navCtrl: NavController, public navParams: NavParams,public http:Http, public jsonp:Jsonp ,public httpService:HttpServicesProvider ,/*引用服务*/public config:ConfigProvider) {
        this.SD_id=navParams.get('tradeId');
        this.evaluateList.trade_Id= this.SD_id;
      

  }
  ionViewWillLoad() {//钩子函数，将要进入页面的时候触发
        this.getRem();
        this.getdetaillist();
  }
  getRem(){
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    document.documentElement.style.fontSize = (w / 750 * 120) + 'px';
  }
  getdetaillist(){
  }
  addEvaluate(){
    alert("评价添加");
      var api = this.aa+'/api/tradegoods/add';
      this.evaluateList.token = this.token;
      //var date = this.evaluateList;
      this.http.post(api,this.evaluateList).map(res => res.json()).subscribe(data =>{
        alert("高海乐视察");
      if (data.errcode === 0 && data.errmsg === 'OK') {
        alert("添加成功！");
        this.navCtrl.push(ShoppinglistPage);
      } else {
        alert("添加失败！");
      }
    });
    
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad ShoppingevaluatePage');
  }

}