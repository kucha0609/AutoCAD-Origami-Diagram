# AutoCAD-Origami-Diagram
Use AutoCAD for Origami Diagram. 
Author: kucha , Copyright © 2021


一、基本信息
---------------------------------------------------------------------------------------------------------------
	;Reference
		Windows10 + AutoCAD2020 (Simplified Chinese or English) 

	;Website
		https://space.bilibili.com/28181671
		www.twitter.com/kucha_Mai   

	;E-mail
		kucha0609@qq.com


二、主程序功能总览
---------------------------------------------------------------------------------------------------------------
;参数说明 and 调用的命令:

	功能00：工具下载：打开OrigamiTools项目界面，同时打开个人主页
		命令:OTD
	功能01：配置工作界面：-工作空间WorkSpace+首选项Option+状态栏DSETTINGS
		命令:KuCha
	功能02：切换背景色：模型空间的背景色相互转换
		命令:BG/BackGround
	功能03：复位工作环境：复位状态栏和图层，并将谷线图层置为当前活跃图层
		命令:FW   ←"复位"的拼音
	功能04：创建图层：新建折纸制图所需的图层
		命令:Get_Layer
	功能05：图层切换：所选对象移动到指定图层 or 切换到指定图层并执行预设的命令
		命令:SS/MM/VV/BB/RR/EE/FF 
	功能06：字段转换：分解特定名称的块。然后全选文件内的字段转为普通文字
	        命令:TOTEXT
	功能07：图层转换：针对Orihime_Mod/Oripa导出的DXF文件
		命令:TL/Trans_Layer
	功能08：颜色转换：彩图和白图相互转换
		命令:CC/Change_Color 
	功能09：填充转换：填充和填充轮廓相互转换
		命令:HB/Hatch_Border
	功能10：对象顺序：根据图层名称调整对象显示顺序，并重生成对象
		命令:LO/Layer_Order
	功能11：重做填充：使用拾取对象的方式重新生成填充
		命令:RH/Redo_Hatch
	功能12：一键转换：重做填充#RH#+颜色转换#CC#+字段转换TOTEXT+对象顺序LO
		命令:TOAI/`TOAI 
	功能13：图层管理：采用数字+汉语拼音简写的方式来调用对应的图层状态
		命令一:GBTC=1=关闭图层    TCQK=2=图层全开
		命令二:SDTC=3=锁定图层    JSTC=4=解锁图层	
		命令三:GBQT=5=关闭其它    SDQT=6=锁定其它
		命令四:HFTC=7=恢复图层    ZWDQ=8=置为当前
		命令五:YZDQ=9=移至当前    XZLS=0=选择类似	


