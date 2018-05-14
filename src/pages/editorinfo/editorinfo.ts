import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import $ from 'jquery';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import { Http,Jsonp }from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-editorinfo',
  templateUrl: 'editorinfo.html',
})
export class EditorinfoPage {

  //定义congfig中公共链接的变量
  public pg = this.config.apiUrl;
  //定义token
  public token=this.storage.get('token');
  //定义个人信息
  public personInfo={
        "token":"",
        "name":"",
        "birthday":"",
        "cardno" : '',
        "cardtype" : '',
        "education" : '',
        "industryinfo" : '',
        "maritalstatus" : '',
        "monthlyincome" : '',
        "sex" : false,
  };

  //定义用户基本信息
  public data = {
        "token":"",
        "name":"",
        "birthday":"",
        "cardno" : '',
        "cardtype" : '',
        "education" : '',
        "industryinfo" : '',
        "maritalstatus" : '',
        "monthlyincome" : '',
        "sex" : false,
  }
  //定义用户
  user = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigProvider, public http:Http, public storage:StorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorinfoPage');
    this.getUserInfo();
  }

  getBaseInfo(){
    $(".zhuc_qieh div:nth-of-type(1)").attr("class","zhuc");
    $(".zhuc_qieh div:nth-of-type(2)").removeAttr("class","zhuc")
    $("#base").css("display","block");
    $("#more").css("display","none");
  }

  getMoreInfo(){
    $(".zhuc_qieh div:nth-of-type(2)").attr("class","zhuc");
    $(".zhuc_qieh div:nth-of-type(1)").removeAttr("class","zhuc")
    $("#base").css("display","none");
    $("#more").css("display","block");
  }

    //获取用户信息
    getUserInfo(){
    var api = this.config.apiUrl + '/api/User/info?token=' +  this.storage.get('token');
    this.http.get(api).map(res => res.json()).subscribe(data =>{
      if (data.errcode === 0 && data.errmsg === 'OK') {
        if(data.model.birthday){

        data.model.birthday = data.model.birthday.substring(0,10);
        }
      this.personInfo = data.model
      console.log(data.model);
      }
    });
  }

    //修改用户基本信息，点击提交时生效
    editBasicInfo(){
      var data = {
        "name": this.personInfo.name,
        "birthday":this.personInfo.birthday,
        "sex":this.personInfo.sex,
      }
      console.log(JSON.stringify(data))
    var api = this.config.apiUrl + '/api/User/edit_Basic?token' +  this.storage.get('token');
    this.http.post(api,data).map(res => res.json()).subscribe(data =>{
      if (data.errcode === 0 && data.errmsg === 'OK') {
      console.log("修改成功！");
      } else {
        console.log("pg" + data.errmsg);
      }
    });
  }

    //修改用户更多信息，点击提交时生效
    editMoreInfo(){
      var data = {
        "token":this.storage.get('token'),
        "education":this.personInfo.education,
        "cardType":this.personInfo.cardtype,
        "cardNo":this.personInfo.cardno,
        "monthlyIncome":this.personInfo.monthlyincome,
        "maritalStatus":this.personInfo.maritalstatus,
        "industryInfo":this.personInfo.industryinfo,
      }
      console.log(JSON.stringify(data))
    var api = this.config.apiUrl + '/api/User/edit_More?token' +  this.storage.get('token');
    this.http.post(api,JSON.stringify(data)).map(res => res.json()).subscribe(data =>{
      if (data.errcode === 0 && data.errmsg === 'OK') {
      console.log("修改成功!");
      } else {
        console.log("pg" + data.errmsg);
      }
    });
  }


  backTo(){
    this.navCtrl.pop();
  }

}
