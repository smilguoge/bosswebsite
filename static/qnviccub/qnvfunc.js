//电话猫
var uMaxID=64;
var uRecordID = new Array(uMaxID);//64部电话
var uPhone = new Array(uMaxID);
var daijjiaMap=null;
var zhuanMap = null;
var errandMap = null;
var phone_timestamp=null;

function  T_WaitForWin(vWin)
{
	var vTimeout=5000;
	var vBegintime=new Date();
	var vEndtime=new Date();
	while(vWin.vInit != 1 && vEndtime.getTime() - vBegintime.getTime() < (vTimeout*2))//ns超时
	{
		if(vEndtime.getTime() - vBegintime.getTime() > vTimeout)//1s还没有完成，使用等待方式
		{
			Sleep(100);//等待100ms
		}
		vEndtime=new Date();
	}
}

function TV_GetEvent()
{
	try{
		var iMax = qnviccub.QNV_DevInfo(0,QNV_DEVINFO_GETCHANNELS);
		var i = 0;
		for(var iCh=0;iCh<iMax; iCh++)
		{
			var lEventType = qnviccub.QNV_Event(iCh, QNV_EVENT_TYPE, 0, 0, 0, 0);

			var lEventHandle = -1;
			var lParam = 0;
			var lResult = -1;
			if (lEventType > 0) {
				lEventHandle = qnviccub.QNV_Event(iCh, QNV_EVENT_HANDLE,
					0, null, null, 0);
				lParam = qnviccub.QNV_Event(iCh, QNV_EVENT_PARAM, 0,
					null, null, 0);
				lResult = qnviccub.QNV_Event(iCh, QNV_EVENT_RESULT, 0,
					null, null, 0);
				var szDataBuffer = new Array();
				var szData = szDataBuffer.join("");
				var szArray = qnviccub.QNV_Event(iCh, QNV_EVENT_DATA, 0, null,
					szData, 1024);
				qnviccub.QNV_Event(iCh, QNV_EVENT_REMOVE, 0, null, null,
					0);// 删除
				T_GetEvent(iCh,lEventType,lEventHandle,lResult,szArray.toString());
			}
		}
	}catch(e){

	}
}

function isIE() { //ie?
	if (!!window.ActiveXObject || "ActiveXObject" in window)
		return true;
	else
		return false;
}

function TV_Initialize()
{
	//注册设备
	if(window.ActiveXObject){
		try{
			var Ole = new ActiveXObject("qnviccub.qnviccub");
		}
		catch(e)
		{

		}

	}else
	{
		if(!isIE()) {
			g_interval = setInterval(TV_GetEvent,"200");
		}
	}

	if(qnviccub){
		try{
			if(qnviccub.QNV_DevInfo(0,QNV_DEVINFO_GETCHANNELS) <= 0)
			{
				qnviccub.QNV_OpenDevice(0,0,0);
				//初始化状态控制
				var channels=qnviccub.QNV_DevInfo(0,QNV_DEVINFO_GETCHANNELS);
				if(channels > 0)
				{
				}else
				{
				}

				for(var i=0;i<uMaxID;i++)
				{
					uRecordID[i]=-1;
				}
			}
		}catch(e){

		}
	}
}

function T_GetEvent(uID,uEventType,uHandle,uResult,szdata)
{
	switch(uEventType)
	{
		case BriEvent_PhoneHook:// 本地电话机摘机事件
		{
			//获取硬盘列表
			var vDiskList=qnviccub.QNV_Tool(QNV_TOOL_DISKLIST,0,0,0,0,0);
			var disk = vDiskList.split(",")[0] +"record\\";
			qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_SETROOT,0,0,disk); //设置默认录音存放地址

			//有来电，先停止录音
			if(uRecordID[uID] > 0){
				var vRecPath=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_PATH,uRecordID[uID],0,0);  //录音路径
				var vElapse=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_ELAPSE,uRecordID[uID],0,0); //录音时间
				qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_STOP,uRecordID[uID],0,0);
				uRecordID[uID]=0;

				uploadRecordFile(uID);
			}

			var vFormatID=BRI_WAV_FORMAT_IMAADPCM8K4B;//选择使用4K/S的ADPCM格式录音
			var vmask=RECORD_MASK_ECHO|RECORD_MASK_AGC;//使用回音抵消后并且自动增益的数据
			var vFile = uPhone[uID]+".wav";
			uRecordID[uID]=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_START,vFormatID,vmask,vFile);
		}
			break;
		case BriEvent_PhoneDial:// 只有在本地话机摘机，没有调用软摘机时，检测到DTMF拨号
			break;
		case BriEvent_PhoneHang:// 本地电话机挂机事件
		{
			//停止录音
			TV_HangUpCtrl(0);//挂机

			if(uRecordID[uID] > 0){

				var vRecPath=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_PATH,uRecordID[uID],0,0);  //录音路径
				var vElapse=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_ELAPSE,uRecordID[uID],0,0); //录音时间
				qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_STOP,uRecordID[uID],0,0);
				uRecordID[uID]=0;
				uploadRecordFile(uID);

			}

		}
			break;
		case BriEvent_CallIn:// 外线通道来电响铃事件
			break;
		case BriEvent_GetCallID://得到来电号码
		{
			uPhone[uID]=szdata+"";
			phone_timestamp=Math.round(new Date().getTime()/1000);
			if(uPhone[uID].length>=6){

				window.open(window.sysinfo.siteurl+"/index.php?c=site&a=entry&m=daijia&do=web&r=order.create&phone="+uPhone[uID]+"&timestamp="+phone_timestamp, "_blank", "height=770,width=1220,scrollbars=yes,resizable=yes,alwaysRaised=yes,toolbar=no");

				//alert("来电电话:"+uPhone[uID]);
			}
		}
			break;
		case BriEvent_StopCallIn:// 对方停止呼叫(产生一个未接电话)
			break;
		case BriEvent_DialEnd:// 调用开始拨号后，全部号码拨号结束
			break;
		case BriEvent_PlayFileEnd:// 播放文件结束事件
			break;
		case BriEvent_PlayMultiFileEnd:// 多文件连播结束事件
			break;
		case BriEvent_PlayStringEnd://播放字符结束
			break;
		case BriEvent_RepeatPlayFile:// 播放文件结束准备重复播放
			break;
		case BriEvent_SendCallIDEnd:// 给本地设备发送震铃信号时发送号码结束
			break;
		case BriEvent_RingTimeOut://给本地设备发送震铃信号时超时
			break;
		case BriEvent_Ringing://正在内线震铃
			break;
		case BriEvent_Silence:// 通话时检测到一定时间的静音.默认为5秒
			break;
		case BriEvent_GetDTMFChar:// 线路接通时收到DTMF码事件
			break;
		case BriEvent_RemoteHook:// 拨号后,被叫方摘机事件
			break;
		case BriEvent_RemoteHang://对方挂机事件
		{
			//停止录音
			TV_HangUpCtrl(0);//挂机

			if(uRecordID[uID] > 0){
				var vRecPath=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_PATH,uRecordID[uID],0,0);  //录音路径
				var vElapse=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_ELAPSE,uRecordID[uID],0,0); //录音时间
				qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_STOP,uRecordID[uID],0,0);
				uRecordID[uID]=0;

				uploadRecordFile(uID);
			}


		}
			break;
		case BriEvent_Busy:// 检测到忙音事件,表示PSTN线路已经被断开
		{
			//挂机
			TV_HangUpCtrl(0);
			//停止录音
			if(uRecordID[uID] > 0){
				var vRecPath=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_PATH,uRecordID[uID],0,0);  //录音路径
				var vElapse=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_ELAPSE,uRecordID[uID],0,0); //录音时间
				qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_STOP,uRecordID[uID],0,0);
				uRecordID[uID]=0;

				uploadRecordFile(uID);
			}
		}
			break;
		case BriEvent_PSTNFree:
		{
			//停止录音
			if(uRecordID[uID] > 0){
				var vRecPath=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_PATH,uRecordID[uID],0,0);  //录音路径
				var vElapse=qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_ELAPSE,uRecordID[uID],0,0); //录音时间
				qnviccub.QNV_RecordFile(uID,QNV_RECORD_FILE_STOP,uRecordID[uID],0,0);
				uRecordID[uID]=0;

				uploadRecordFile(uID);
			}
		}
			break;
		case BriEvent_DialTone:// 本地摘机后检测到拨号音
			break;
		case BriEvent_RingBack:// 电话机拨号结束呼出事件。
			break;
		case BriEvent_MicIn:// MIC插入状态
			break;
		case BriEvent_MicOut:// MIC拔出状态
			break;
		case BriEvent_FlashEnd:// 拍插簧(Flash)完成事件，拍插簧完成后可以检测拨号音后进行二次拨号
			break;
		case BriEvent_RefuseEnd:// 拒接完成
		{
			qnviccub.QNV_CallLog(uID,QNV_CALLLOG_DELRECFILE,"",0); //拒接后直接删除本地录音
		}
			break;
		case BriEvent_SpeechResult:// 语音识别完成
			break;
		case BriEvent_FaxRecvFinished:// 接收传真完成
			break;
		case BriEvent_FaxRecvFailed:// 接收传真失败
			break;
		case BriEvent_FaxSendFinished:// 发送传真完成
			break;
		case BriEvent_FaxSendFailed:// 发送传真失败
			break;
		case BriEvent_OpenSoundFailed:// 启动声卡失败
			break;
		case BriEvent_UploadSuccess://远程上传成功
			break;
		case BriEvent_UploadFailed://远程上传失败
			break;
		case BriEvent_EnableHook:// 应用层调用软摘机/软挂机成功事件
			break;
		case BriEvent_EnablePlay:// 喇叭被打开或者/关闭
			break;
		case BriEvent_EnableMic:// MIC被打开或者关闭
			break;
		case BriEvent_EnableSpk:// 耳机被打开或者关闭
			break;
		case BriEvent_EnableRing:// 电话机跟电话线(PSTN)断开/接通
			break;
		case BriEvent_DoRecSource:// 修改录音源
			break;
		case BriEvent_DoStartDial:// 开始软件拨号
			break;
		case BriEvent_RecvedFSK:// 接收到FSK信号，包括通话中FSK/来电号码的FSK
			break;
		case BriEvent_DevErr://设备错误
			break;
		default:
			if(uEventType < BriEvent_EndID){

			}
			break;
	}
}

function TV_StartDial(uID,szCode)
{	//正常拨号必须使用 DIALTYPE_DTMF
	if(qnviccub){
		if(qnviccub.QNV_General(uID,QNV_GENERAL_STARTDIAL,DIALTYPE_DTMF,szCode) <= 0)
		{
		}else
		{
		}
	}
}

function TV_OffHookCtrl(uID)
{
	TV_EnableHook(uID,TRUE);
}

function TV_HangUpCtrl(uID)
{
	TV_EnableHook(uID,FALSE);
}

function TV_EnableHook(uID,bEnable)
{
	TV_SetDevCtrl(uID,QNV_CTRL_DOHOOK,bEnable);
}

function TV_SetDevCtrl(nChannel,paramName,nValue)
{
	qnviccub.QNV_SetDevCtrl(nChannel,paramName,nValue);
}
