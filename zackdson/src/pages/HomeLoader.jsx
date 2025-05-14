import { redirect } from 'react-router-dom';
import { notification } from "antd";
import GradeService from "../util/gradeService";

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

export async function loader() {
  try{
    const resData = await GradeService.getGrade();
    const zpddyz = await resData.data;
    if (zpddyz)  {
      localStorage.setItem('school', zpddyz.school); //string school, int grade
      localStorage.setItem('grade', zpddyz.grade); //string school, int grade
      // 2024/6/25 first look at the initdson to verify the subject existing status

      return redirect('/nav');
      // return redirect('/nav');
    } else {
      if(localStorage.getItem('resetGrade')){
        openNotificationWithIcon("info", "正在重新设定年级情报");
      } else {
        openNotificationWithIcon("warning", "发现您是新用户，初次使用需要设定年级情报");
      }
      return null;
    }

  } catch(err) {
    openNotificationWithIcon("error", "后台访问异常，请确认后台已经启动。或者请联系管理员");
    return redirect('/');
  }
}