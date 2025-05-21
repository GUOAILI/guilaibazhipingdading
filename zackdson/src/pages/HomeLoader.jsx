import React from 'react';
import { redirect } from 'react-router-dom';
import { notification } from "antd";
import GradeService from "../util/gradeService";
import { setSchool, setGrade } from '../store/userSlice';
import store from '../store';

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

export async function loader() {
  try{
    const resData = await GradeService.getGrade();
    const zpddyz = await resData.data;
    // const dispatch = useDispatch();


    if (zpddyz)  {
      // localStorage.setItem('school', zpddyz.school); //string school, int grade
      store.dispatch(setSchool(zpddyz.school));
      // localStorage.setItem('grade', zpddyz.grade); //string school, int grade
      store.dispatch(setGrade(zpddyz.grade));
      // 2024/6/25 first look at the initdson to verify the subject existing status

      return redirect('/nav');
      // return redirect('/nav');
    } else {
      // if(localStorage.getItem('resetGrade')){
      if(store.getState().user.resetGrade){
        openNotificationWithIcon("info", "正在重新设定年级情报");
      } else {
        openNotificationWithIcon("warning", "发现您是新用户，初次使用需要设定年级情报");
      }
      return null;
    }

  } catch(err) {
    // token 过期已在拦截器中处理，这里只需处理其他错误
    if (!err.response || (err.response.status !== 400 && err.response.status !== 401 && err.response.status !== 403)) {
      openNotificationWithIcon("error", "年级取得异常，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
    return redirect('/');
  }
}