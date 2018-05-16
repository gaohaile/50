import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import {NewinfoPage} from '../newinfo/newinfo'
import $ from 'jquery';
/**
 * Generated class for the NewslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newslist',
  templateUrl: 'newslist.html',
})
export class NewslistPage {
  //接收数据 get
  public newsList=[];
  //页面跳转
  public NewinfoPage = NewinfoPage;
//接收传过来的新闻类型
  public type='';
  public keywords='';
  public page=1;
 constructor(public navCtrl: NavController,public config:ConfigProvider, public navParams: NavParams,public http: Http,
  public storage:StorageProvider) {
  }

  ionViewWillEnter(){
    this.getRem();
    this.getNews('');

  }
//获取最新资讯全部列表
    getNews(infiniteScroll){
      if(this.navParams.get("type")){
        this.type=this.navParams.get("type");
      }
        var j = 3;
        var api = this.config.apiUrl + '/api/Nwes/list?pageIndex='+this.page +'&pageSize=10&keyWord='+this.keywords+'&type='+this.type+'&token=' + this.storage.get('token');
        console.log(api);
        this.http.get(api).map(res => res.json()).subscribe(data =>{
      if (data.errcode === 0 && data.errmsg === 'OK') {
       this.newsList=this.newsList.concat(data.list);
       if(infiniteScroll){
          infiniteScroll.complete();
          if(data.list.length<10){
             infiniteScroll.enable(false);
           $('.nomore').css('display','block');
          }
       }      
        console.log(this.newsList);
      } else if(data.errcode === 40002){
          j--;
          if(j>0){
            this.config.doDefLogin();
            this.getNews(infiniteScroll);
          }
      } else {
        alert(data.errmsg)
      }
       this.page++;
       console.log("获取最新资讯" , data)
    });
  }
  //跳转到资讯详情页面
    getNewInfo(id){
    this.navCtrl.push(NewinfoPage,{
      id:id
    });
  }
  onSearchKeyUp(event){
    if("Enter"==event.key){
      this.page=1;
     this.getNews("");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewslistPage');
  }
    //加载更多
  doLoadMore(infiniteScroll){
    this.getNews(infiniteScroll);
  }

  backTo(){
    this.navCtrl.pop();
  }
  getRem(){
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    document.documentElement.style.fontSize = (w / 750 * 115) + 'px';
  }

}