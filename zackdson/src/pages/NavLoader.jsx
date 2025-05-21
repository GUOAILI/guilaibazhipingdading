import React from 'react';
import { redirect } from 'react-router-dom';
import MenuService from '../util/menuService';
import { notification } from "antd";
import { tokenLoader } from '../util/authentication';
import { AppstoreOutlined } from '@ant-design/icons';
import store from '../store';
import { setDpjSb } from '../store/subjectSlice';

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

export async function loader(){
    // if (tokenLoader() == null) {
    //     notification.warning({
    //         message: '警告',
    //         description: '登录已过期，请重新登录'
    //     });
    //     localStorage.removeItem("dpj-sb");
    //     localStorage.removeItem("school");
    //     localStorage.removeItem("grade");
    //     localStorage.removeItem("resetGrade");
    //     localStorage.removeItem("subject");
    //     localStorage.removeItem("branchDetail");
    //     localStorage.removeItem("notebookRecord");
    //     localStorage.removeItem("writingRecord");
    //     localStorage.removeItem("commonRecord");
    //     localStorage.removeItem("wrongRecord");
    //     localStorage.removeItem("examRecord");
    //     localStorage.removeItem("reviewRecord");
    //     localStorage.removeItem("extensionRecord");
    //     localStorage.removeItem("long");
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("expiration");

    //     return redirect('/');
    // }
    try {
        const restData = await MenuService.getInitDson();
        const subjects = await restData.data;
        let guoaili=subjects.filter(xg=>xg.allsub !== null && xg.allsub.length>2);
        if(guoaili.length===0){
          openNotificationWithIcon('warning',"您还设定没有科目，请首先点击左上方的【学科管理】按钮");
        }else{
          // 2024/7/3 add for subject and branch table curd request
        //   localStorage.setItem('dpj-sb',JSON.stringify(guoaili.map((ini)=>ini.chname)));
            store.dispatch(setDpjSb(JSON.stringify(guoaili.map((ini)=>ini.chname))));
        }

        let items=[];
        items=guoaili.map((xxg)=>{
            return {
                // key: xxg.name,
                key: xxg.chname,
                icon: <AppstoreOutlined />,
                label: xxg.chname,
                children:JSON.parse(xxg.allsub),           
            }
        });
        return items;

    }catch(err){
        // token 过期已在拦截器中处理，这里只需处理其他错误
        if (!err.response || (err.response.status !== 400 && err.response.status !== 401 && err.response.status !== 403)) {
            openNotificationWithIcon("error","后台读取用户科目信息异常，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
        return null;
    }
}
