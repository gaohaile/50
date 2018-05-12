import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import $ from 'jquery';
import { ConfigProvider } from '../../providers/config/config';

import { HttpServicesProvider } from '../../providers/http-services/http-services';
//工单详情页
import { RepairdetailsPage } from '../repairdetails/repairdetails';
//增加工单页
import { RepairaddPage } from '../repairadd/repairadd';
//StorageProvider
import { StorageProvider } from '../../providers/storage/storage';
import {Http,Jsonp}from '@angular/http';
@Component({
  selector: 'page-repairlist',
  templateUrl: 'repairlist.html',
})
export class RepairlistPage {

  public repairlist=[];
  public type="";

  public list=[{title:"123",price:"123"},{title:"123",price:"123"},{title:"123",price:"123"},
   {title:"123",price:"123"},{title:"123",price:"123"},{title:"123",price:"123"},{title:"123",price:"123"},
   {title:"123",price:"123"},{title:"123",price:"123"},{title:"123",price:"123"}];

  public cid='';/*获取分类id*/

  public page=1; /*分页*/

  public RepairdetailsPage=RepairdetailsPage;
  public RepairaddPage = RepairaddPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService:HttpServicesProvider
  ,public config:ConfigProvider,public storage:StorageProvider,public http:Http) {

    this.cid=this.navParams.get('cid');

    this.getProductList('');

  }

  ionViewWillLoad(){
    this.getRem();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RepairlistPage');
  }

  onCancel(event){

  }

  repairTypeSub(){
    alert();
  }

// getProductList(infiniteScroll){
//     var api= this.config.apiUrl + '/api/list/list?tId=1&keyWord=eee&pageIndex=1&pageSize=15&token='+this.storage.get('token');
//     this.httpService.requestData(api,(data)=>{
//       // console.log(data);
//       this.list=this.list.concat(data.result);  /*数据拼接*/
//       if(infiniteScroll){
//         //告诉ionic 请求数据完成
//         infiniteScroll.complete();
//         if(data.result.length<10){  /*没有数据停止上拉更新*/
//           infiniteScroll.enable(false);
//           $('.nomore').css('display','block');
//         }
//       };
//       this.page++;
//     })

//   }
  getProductList(infiniteScroll){
     var that=this;
    var api= this.config.apiUrl + '/api/list/list?tId=1&keyWord=eee&pageIndex=1&pageSize=15&token='+this.storage.get('token');
     this.http.get(api).map(res => res.json()).subscribe(data =>{
          if(data.errcode===0&&data.errmsg==='OK'){
            this.repairlist=data.list;//怎么知道那个是默认房屋
            console.log(this.repairlist)
          }else{
            alert(data.errmsg)
          }
     })
  }
  //加载更多
  doLoadMore(infiniteScroll){
    this.getProductList(infiniteScroll);
  }

  repairDetails(item){
      this.navCtrl.push(RepairdetailsPage,{
      item:item
    })
  }

  backToRepair(){
    this.navCtrl.pop();
  }

  getRem(){
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    document.documentElement.style.fontSize = (w / 750 * 115) + 'px';
  }

}
