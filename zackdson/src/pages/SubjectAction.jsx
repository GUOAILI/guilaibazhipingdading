// import React from "react";
import { redirect} from "react-router-dom";
import MenuService from "../util/menuService";
import { notification } from "antd";

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

export async function action({ request }) {
    const formData=await request.formData();
    const updates = Object.fromEntries(formData);
    const subject = localStorage.getItem('subject');
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
    }catch(ex){
        // token 过期已在拦截器中处理，这里只需处理其他错误
        if (!ex.response || ex.response.status !== 401) {
            openNotificationWithIcon("error","科目管理后台更新失败!请联系管理员")}
        return null;
    }
}
