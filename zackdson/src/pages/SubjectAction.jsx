// import React from "react";
import { redirect} from "react-router-dom";
import MenuService from "../util/menuService";
import { notification } from "antd";
// import { useSelector } from "react-redux";
import store from '../store';

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

export async function action({ request }) {
    const formData=await request.formData();
    const updates = Object.fromEntries(formData);
    // const subject = localStorage.getItem('subject');
    // const subject = useSelector((state) => state.subject.subject); 
    const subject = store.getState().subject.subject;
    if (Object.keys(updates).length < 1) {
        openNotificationWithIcon("warning","你没有选择任何子分类!主学科会从左侧菜单移除！")
    }
    let arr=[];
    for(let obj in updates){
        arr.push({
            key:subject + ' ' + obj,
            // key:updates['subject']+obj,
            label:updates[obj]
        })
    }

    const requestData={
        subject:subject,
        allsub:JSON.stringify(arr),
    }
    try{
        await MenuService.updateOneInitDson(requestData);
        openNotificationWithIcon("success",subject+" 设定成功!")
        return redirect("/nav/");
    }catch(err){
        // token 过期已在拦截器中处理，这里只需处理其他错误
        if (!err.response || (err.response.status !== 400 && err.response.status !== 401 && err.response.status !== 403)) {
            openNotificationWithIcon("error","科目管理后台更新失败!再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
        return null;
    }
}
