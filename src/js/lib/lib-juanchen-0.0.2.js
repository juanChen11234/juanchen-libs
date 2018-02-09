/**
 *  Created by JuAn chen.
 *  QQ 528159689
 */


 //inputWithCheck要改，改成用的时候再绑定
 //只能输入数字也写成用的时候再绑定。

//必须在微信Weixin JSAPI的WeixinJSBridgeReady才能生效
//document.addEventListener("WeixinJSBridgeReady", callback, false);


define(['zepto'],function($){
    'use strict';

    /**
     *  轮播；用swiper的吧。有空写两个简单的轮播，一个滚动一个fade
     *  滚动到页面某个地方就触发callback
     */

    //fn.bind() 
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (context) {
            //获取要传入的所有参数
            var args = arguments,
            //获取要绑定的上下文
                obj = arguments[0],
            //获取要调用的函数
                func = this;
            return function(){
                //获取bind的剩余传入参数
                var argc = Array.prototype.slice.call(args,1);
                //将调用时的参数放到最后
                Array.prototype.push.apply(argc,arguments);
                //使用新的this执行func函数
                return func.apply(obj||null,argc);
            }
        }
    }
    //str.trim() 
    if(!String.prototype.trim){
        String.prototype.trim=function(){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
    //arr.indexOf()  
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {

            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;

            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0){
                from += len;
            }

            for (; from < len; from++) {
                if (from in this && this[from] === elt){
                    return from;
                }

            }

            return -1;
        };
    }
    //不支持placeholder浏览器下对placeholder进行处理
    if (document.createElement('input').placeholder !== '') {
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur().parents('form').submit(function () {
            $(this).find('[placeholder]').each(function () {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            });
        });
    }
    //window.requestAnimationFrame
    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());




    var juanchen={
        tools:{},
        dores:{},
        dom:{},
        Factory:null
    };




    //------------------------ 静态变量 --------------------------------------------
    juanchen.CONST=(function(){
		var dc=document;
        var obj={
            $body:$('body'),
            $head:$('head'),
            $window:$(window),
            body:dc.querySelector('body'),
			docWidth:dc.documentElement.offsetWidth||dc.body.offsetWidth,
			docHeight:dc.documentElement.offsetHeight||dc.body.offsetHeight,
			windowHeight:window.innerHeight,
            windowWidth:window.innerWidth
        };

        return {
            get:function(name){
                return obj[name]
            }
        }
    }());








    //------------------------ tools 工具-----------------------------------------------

	// 【从href中获取Obj】
	juanchen.tools.getQueryObjFromHref = function(str, condition) {
		 
		/*
        * condition : {isGov: '_channel', isKr: '_lang'}
        * */

        str = decodeURIComponent(str);
        var _str = str.slice(str.indexOf('?') + 1);

        if (!_str) {
            return {};
        }

        let res = {};
        _str.split('&').forEach( s => {
            let tempArr = s.split('=');
            let _key = tempArr[0], _val = tempArr[1];

            if ( condition && condition[_key] && _val === '1') {
                res[condition[_key]] = _key;

            } else {
                res[_key] = _val || '';
            }


        });
        return res;
	}

	// 【格式化json字符串】
	juanchen.tools.beautifyJsonString = function(txt,compress/*是否为压缩模式*/) {
		var indentChar = '    ';
        if(/^\s*$/.test(txt)){
            alert('数据为空,无法格式化! ');
            return;
        }
        try{var data=eval('('+txt+')');}
        catch(e){
            alert('数据源语法错误,格式化失败! 错误信息: '+e.description);
            return;
        };
        var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;

        var notify=function(name,value,isLast,indent/*缩进*/,formObj){
            nodeCount++;/*节点计数*/
            for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */
            tab=compress?'':tab;/*压缩模式忽略缩进*/
            maxDepth=++indent;/*缩进递增并记录*/
            if(value&&value.constructor==Array){/*处理数组*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
                for (var i=0;i<value.length;i++)
                    notify(i,value[i],i==value.length-1,indent,false);
                draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
            }else   if(value&&typeof value=='object'){/*处理对象*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/
                var len=0,i=0;
                for(var key in value)len++;
                for(var key in value)notify(key,value[key],++i==len,indent,true);
                draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/
            }else{
                if(typeof value=='string')value='"'+value+'"';
                draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
            };
        };
        var isLast=true,indent=0;
        notify('',data,isLast,indent,false);
        return draw.join('');
	}


	// 【去掉数组或则对象中的空值】
	juanchen.tools.cutEmptyItem = function(objOrArr) {
		var res;
        if (Object.prototype.toString.call(objOrArr) === '[object Object]') {
            res = {};
            let key;
            for (key in objOrArr) {
                if (objOrArr.hasOwnProperty(key) && objOrArr[key] !== ''
                    && objOrArr[key] !==  undefined && objOrArr[key] !== null) {
                    res[key] = objOrArr[key];
                }
            }
        } else if (Object.prototype.toString.call(objOrArr) === '[object Array]') {
            res = [];
            let i;
            for (i = 0; i < objOrArr.length; i++) {
                if (objOrArr[i] !== '' && objOrArr[i] !== undefined && objOrArr[i] !== null) {
                    res.push(objOrArr[i]);
                }
            }
        }
        return res;
	}

	// 【去掉html中的空元素】
	juanchen.tools.cutEmptyEleFormInnerhtml = function(htmlStr) {
		if (!htmlStr)
		{
			return '';
		}
		// 去掉空格
		htmlStr = htmlStr.replace(/\s+/ig, '');

		var reg = /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?(<\/?br>)*?(&nbsp;)*?(\n)*?<\/\1>/ig;
		while (reg.test(htmlStr)) {
            htmlStr = htmlStr.replace(reg, '');
        }

		return htmlStr;

	}


    //【事件绑定】
    juanchen.tools.addEvent=(function() {
        var fn=null;
        if(document.querySelector('body').addEventListener){
            fn=function(obj,ev,fn){
                obj.addEventListener(ev,fn,false);
            }
        }else{
            fn=function(obj,ev,fn){
                obj.attachEvent("on"+ev,fn,false);
            }
        }
        return fn
    }());

    //【tools-播放图片】
    /*播放：juanchen.tools.playImg.play('a01', '.playimgIns', 300, true);
     停止：juanchen.tools.playImg.stop('a01');*/
    juanchen.tools.playImg={
        imgPlayTimer:{},
        play:function(timerIndex, selector_imgCon, speed, isRecycle){
            var self = this;
            var $imgs = $(selector_imgCon).find("img");
            var i = 0;
            var len = $imgs.length||$imgs.size();
            //timer是undefined或是null

            if (!self.imgPlayTimer[timerIndex]) {
                play()
            }

            //播放一次和循环播放
            function play() {
                if (isRecycle) {
                    self.imgPlayTimer[timerIndex] = setInterval(function () {
                        $imgs.eq(i).show().siblings().hide();
                        i++;
                        i >= len && (i = 0);
                    }, speed);
                } else {
                    self.imgPlayTimer[timerIndex] = setInterval(function () {
                        $imgs.eq(i).show().siblings().hide();
                        i++;
                        if (i >= len) {
                            self.stopPlayImg(self.imgPlayTimer[timerIndex]);
                        }
                    }, speed);
                }
            }
        },
        stop:function(index){
            var self = this;
            clearInterval(self.imgPlayTimer[index]);
            self.imgPlayTimer[index] = null;
        }
    };

   //【获取元素相对于屏幕的位置】
    juanchen.tools.getPosRelativeToScreen=function(element){
        return element.getBoundingClientRect();
    };

    //【获取元素相对于文档的位置】
    juanchen.tools.getPosRelativeToDocument=function(element){
        var dc = document,
            rec = element.getBoundingClientRect(),
            _x = rec.left, // 获取元素相对浏览器视窗window的左、上坐标
            _y = rec.top;

        // 与html或body元素的滚动距离相加就是元素相对于文档区域document的坐标位置
        _x +=  dc.documentElement.scrollLeft || dc.body.scrollLeft;
        _y +=  dc.documentElement.scrollTop || dc.body.scrollTop;

        return {
            left: _x,
            top: _y
        };
    };

	// 【去掉对象或者数组中的空值项】
	juanchen.tools.cutEmptyItem = function(objOrArr){
		 if (Object.prototype.toString.call(objOrArr) === "[object Object]") {
            const resObj = {};
            let key;
            for (key in objOrArr) {
                if (objOrArr.hasOwnProperty(key) && objOrArr[key]) {
                    resObj[key] = objOrArr[key];
                }
            }
            return resObj;
        } else if (Object.prototype.toString.call(objOrArr) === "[object Array]") {
            const resArr = [];
            let i;
            for (i = 0; i < objOrArr.length; i++) {
                if (objOrArr[i] !== '' && objOrArr[i] !== undefined && objOrArr[i] !== null) {
                    resArr.push(objOrArr[i]);
                }
            }
            return resArr;
        }
	}

	//【对象转字符串】
	juanchen.tools.obj2str=function(obj){
		return JSON.stringify(obj);
	};

	//【字符串转对象】
	juanchen.tools.str2obj=function(str){
		return JSON.parse(str);
	};

	//【反转字符串】
    juanchen.tools.reverseStr=function(str){
        return str.split("").reverse().join("");
    };
	

	
    //【图片上传】
    /*$inputFile：jq的inputFile对象，
     url：上传的url，
     callback：上传完成的回调 */
    juanchen.tools.uploadImg=function($inputFile,url,callback){
        //todo 做个判断是不是图片数据 $inputFile.val()

        //创建FormData对象
        var data = new FormData();
        //为FormData对象添加数据
        $.each($inputFile[0].files, function(i, file) {
            data.append('imageFile', file);
        });
        //发送
        $.ajax({
            url:url,
            type:'POST',
            data:data,
            cache: false,
            contentType: false,    //不可缺
            processData: false,    //不可缺
            success:function(data){
                callback(data);
            },
            error:function(){
                console.dir(arguments);
            }
        });
    };

    // 【判断是不是数组】
	juanchen.tools.isArray=function(objOrArr){
		return Object.prototype.toString.call(objOrArr) === "[object Array]";
	}
	
	// 【判断是不是对象】
	juanchen.tools.isObject=function(objOrArr){
		return Object.prototype.toString.call(objOrArr) === "[object Object]";
	}

	// 【判断是不是空对象】
	juanchen.tools.isEmptyObj = function(obj) {
		 for (let key in obj) {
            if ( obj.hasOwnProperty(key) &&  obj[key] !== '' &&  obj[key] !== null &&  obj[key] !== undefined )  {
                return false;
            }
        }
        return true;
	}
	
	//【判断是不是ie浏览器】
    juanchen.tools.isIE=function(){
        return !!("ActiveXObject" in window||window.ActiveXObject)||false;
    };

	//【获取联网状态:并没有什么用】
	juanchen.tools.getConnectionType=function(){
		var connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection||{type:'unknow'};
		var type_text=['unknown','ethernet','wifi','2g','3g','4g','none'];
        if(typeof (connection.type)=='number'){
            connection.type_text=type_text[connection.type];
        }else {
            connection.type_text=connection.type;
        }
        if(typeof (connection.bandwidth)=='number'){
            if(connection.bandwidth>10){
                connection.type='WI-FI';
            }else if(connection.bandwidth>2){
                connection.type='3G';
            }else if(connection.bandwidth>0){
                connection.type='2G';
            }else if(connection.bandwidth==0){
                connection.type='none';
            }else{
                connection.type='unknown';
            }
        }
        return connection.type_text||connection.type;
	};

    //【关闭视频】
    juanchen.tools.playVideo=function(v){
        !!v.paused&&(v.play())
    };
	//【打开视频】
    juanchen.tools.pauseVideo=function(v){
        !v.paused&&(v.pause())
    };

    //【清除定时器】
    juanchen.tools.clearInterval=function(timerID){
        clearInterval(timerID);
        timerID=null;
    };

    //【点击某个东西把元素滚动到某个地方】
    juanchen.tools.DomScrollTo=function(param){
        /*param={
            $clickEle:'',点击的元素,jq对象
            $scrollEle:'',滚动的元素，jq对象
            targetScrollTop:'',//顶部是0，正方向向下
            allTime:''//滚动总时间
        }*/

        //匀速滚动,每次移动15像素

        var timer=null;

        var isFn='';
        if(typeof (param.targetScrollTop)=='function'){
            isFn=param.targetScrollTop.bind(null);
        }

        param.$clickEle.on('click',function(){

            //做个判断：
            // targetScrollTop直接用param.targetScrollTop还是调用param.targetScrollTop()的返回值。
            var targetScrollTop;
            if(isFn){
                targetScrollTop=isFn(this);
            }else{
                targetScrollTop=param.targetScrollTop;
            }
            //点击时元素相对于滚动条向下滚动的像素值，是一个正数
            var curScrollTop=param.$scrollEle.scrollTop();
			// 基础的Step
            var  basicStep = Math.abs(targetScrollTop - curScrollTop) > 3000 ? 100 : 15;
            //本次点击移动的方向
            var dir=curScrollTop<targetScrollTop?1:-1;
            //本次点击的interval
            var interval=param.allTime/(Math.abs(targetScrollTop-curScrollTop)/basicStep);
            // var step;

            if(timer===null){
                timer=setInterval(function(){

                    var _step=Math.abs(targetScrollTop-curScrollTop)<15?1:basicStep;

                    if((dir>0&&curScrollTop>targetScrollTop)||(dir<0&&curScrollTop<targetScrollTop)){
                        juanchen.tools.clearInterval(timer);
                    }else{
                        curScrollTop+=dir*_step;
                        param.$scrollEle.scrollTop(curScrollTop);
                    }

                },interval);
            }
        });
    };

    //【某个元素处于某个位置就执行某个方法】
    /*
    * tips:固定定位的只能相对于doc,其他应该相对于screen
    * */
    juanchen.tools.whenScroll=function(param){

        /*
        //tips：同时给了临界点和最值，优先使用临界点判断、
        
		用法1：监听容器滚动了多少
		param = {
			type: "calcWraperScroll",
            scrollContainer: $('.wrap'), // 滚动的容器
            offsetTopCritical: 300,//文档滚动临界点
            callback_in: function () {
               
            },
            callback_out: function () {
                
            }
		}

		用法2：监听容器滚动的时候，某个元素相对于屏幕的位置
		param = {
			type:'calcDomRToScreen',
            scrollContainer: $('.wrap'), // 滚动的容器
            dom:document.getElementById('ai'), // 计算容器内元素 #ai 相对于屏幕的位置
            offsetTopMin:window.innerHeight*0.05,
            offsetTopMax:window.innerHeight*0.35,
            callback_in:function(){
               
            },
            callback_out:function(){
                
            }
		}
		
		*/

        if(param.type=='calcDomRToScreen')
        {//计算元素相对于屏幕的位置。
            param.$scrollContainer.on('scroll',function(){
                window.requestAnimationFrame(function(){
                    var domOffset2Screen=juanchen.tools.getPosRelativeToScreen(param.dom).top;
                    //domOffset2Screen 最上面是0，正方向是从上向下
                    if(isTarget(domOffset2Screen)){
                        param.callback_in();
                    }else{
                        param.callback_out();
                    }
                });

            });
        }
        else
        {//计算文档滚动了多少，
            param.$scrollContainer.on('scroll',function(){
                window.requestAnimationFrame(function(){
                    var doc_scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
                    if(isTarget(doc_scrollTop)){
                        param.callback_in();
                    }else{
                        param.callback_out();
                    }
                })

            });
        }



        function isTarget(n){
            return (n<param.offsetTopCritical)||(n>=param.offsetTopMin&&n<=param.offsetTopMax);
        }

    };



    //纯属学习【原生js兼容获取元素计算后的样式】
    juanchen.tools.getStyle=function(obj,attr){
        if(window.getComputedStyle){
            return window.getComputedStyle(obj,null)[attr];
        }else{
            return obj.currentStyle[attr];
        }
    };

   /*纯属学习20171015【兼容的获取元素样式的方法】*/
    juanchen.tools.getStyle2=function(elem, name){
        if(elem.style[name])
        {	//如果属性存在于style[]中，直接取
            return elem.style[name];
        }
        else if(elem.currentStyle)
        {	//否则 尝试IE的方法
            return elem.currentStyle[name];
        }
        else if(document.defaultView && document.defaultView.getComputedStyle)
        {	//尝试W3C的方式
            name = name.replace(/([A-Z])/g, "-$1");//W3C中为textAlign样式，转为text-align
            name = name.toLowerCase();
            var s = document.defaultView.getComputedStyle(elem, "");
            return s && s.getPropertyValue(name);
        }
        else
        {
            return null;
        }
    };


	/*
		【返回上一页】
	*/
	juanchen.tools.backLastPage=function(){
		
		//window.location.reload();   刷新
		//window.history.go(1); //前进
		window.history.go(-1);  //返回+刷新
		
		//window.history.forward(); //前进
		//window.histoty.back(); //返回
		
	}


    //------------------------- dores 响应class -----------------------------------------
    juanchen.dores.config=function(arr){
        for(var i=0;i<arr.length;i++){
            this[arr[i]]();
        }
    };

    //input正则验证，配合html
    juanchen.dores.inputWithCheck=function(){
        $('body').on('blur','.c_input_withCheck input',function(){
            //验证的正则
            var $input=$(this);
            var $result_error=$input.parents('.c_input_withCheck').find('.check_result.error');
            var $result_correct=$input.parents('.c_input_withCheck').find('.check_result.correct');
            var reg=new RegExp($input.attr('data-reg')),
                val=$input.val().trim();

            var wrongInfo={};
            wrongInfo['empty']=$input.attr('data-check-empty');
            wrongInfo['false']=$input.attr('data-check-false');
            if(val==''){
                //空
                $result_error.html(wrongInfo['empty']).addClass('active').siblings('.check_result').removeClass('active');
            }else if(!reg.test(val)){
                //错误
                $result_error.html(wrongInfo['false']).addClass('active').siblings('.check_result').removeClass('active');
            }else{
                //正确
                $result_correct.addClass('active').siblings('.check_result').removeClass('active');
            }

        });
    };

    //切换tab
    juanchen.dores.tab=function(){
        var targetEleSelector='';
        var $targetTabWrap=null;
        juanchen.CONST.get('$body').on('click','.c_tabBtn a',function(){

            var $currA = $(this);

            var data_tab=$currA.parent(".c_tabBtn").attr('data-tab');
            if(data_tab!==targetEleSelector){
                targetEleSelector=data_tab;
                $targetTabWrap=$($currA.parent(".c_tabBtn").attr('data-tab'));
            }

            var $targetTab = $targetTabWrap.children().eq($currA.index());
            $currA.addClass("active").siblings(".active").removeClass("active");
            $targetTab.addClass("active").siblings(".active").removeClass("active");
            //耗时 2-3ms
        });
    };

    //打开与关闭，加减目标元素的class
    juanchen.dores.collapse=function(){
        var $body=juanchen.CONST.get('$body');
        //打开，点击带有.c_collapse_open的类，会根据data-target找谁，根据data-addclass决定加什么类上去
        $body.on('click',".c_collapse_open",function(e){
            e.preventDefault();
            var $ele=$(this);
            $($ele.attr('data-target')).addClass($ele.attr('data-addclass'));
        });

        //关闭,点击带有.c_collapse_close,根据data-close找谁，data-removeclass决定去掉哪个class
        $body.on('click','.c_collapse_close',function(){
            var $ele=$(this);
            $($ele.attr('data-close')).removeClass($ele.attr('data-removeclass'))
        });
    };

    //楼层：处于某个位置就显示电梯，电梯的灯跟着目前的楼变化
    juanchen.dores.floor=function(){
        /*分析：
         有个元素本来在页面的很下面，body滚动的时候，它会上来，上到某个地方就改变它的定位为fixed并且显示出来
         body滚动的时候，检查那个楼是不是处于那个范围，处于就点亮电梯上那个楼的灯；
         点击电梯上的灯，要刚好楼处于那个位置，不好办。获取目标楼层相对于document的top距离，body的scroll就是那么多。
         */

    };






    //--------------------------dom ----------------------------------------------------------
    //【H5添加音乐播放】
    /* param : Object
      *use：juanchen.dom.H5_music(param);*/
    juanchen.dom.H5_music=function(param){
        var _param={
            musicSrc:'',
            bgPlay:"imgs/state1.png",
            bgStop:'imgs/state0.png',
            top:'1%',
            right:'2%'
        };
        if(param){
            _param.top=param.top||_param.top;
            _param.right=param.right||_param.right;
            _param.musicSrc=param.musicSrc||_param.musicSrc;
            _param.bgStop=param.bgStop||_param.bgStop;
            _param.bgPlay=param.bgPlay||_param.bgPlay;
        }
        var base_css=[
            '.c_audio{position:fixed;right:'+_param.right+';top:'+_param.top+';width:50px;height:50px;background-position:50% 50%;background-size:100% 100%;background-repeat:no-repeat;cursor:pointer;border-radius:50%}',
            '.c_audio.stop{background-image:url('+_param.bgStop+')}',
            '.c_audio.play{background-image:url('+_param.bgPlay+');animation:j_audio 3s infinite linear;-webkit-animation:j_audio 3s infinite linear}',
            '@keyframes j_audio{0%{transform:rotate(0);-webkit-transform:rotate(0)}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg)}}',
            '@-webkit-keyframes j_audio{0%{transform:rotate(0);-webkit-transform:rotate(0)}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg)}}'
        ];
        $('head').append('<style class="juan-H5Music-style">'+base_css.join('')+'</style>');

        $('body').prepend('<div class="c_audio stop"> <audio src="'+_param.musicSrc+'"></audio></div>').on('click','.c_audio',function(e){
            var $con = $(e.target);
            var $audio = $con.find("audio").get(0);
            var transform = $con.css("transform");

            if ($audio.paused == true) {
                $audio.play();
                $con.addClass("play").removeClass("stop");
            } else {
                $audio.pause();
                $con.addClass("stop").removeClass("play").css("transform", transform);
            }
        });
    };







    
    //--------------------- Factory --------------------------------------------------

    juanchen.Factory=function(type,param){

        if(juanchen.Factory.prototype[type]){
            return new juanchen.Factory.prototype[type](param);
        }else{
            throw new Error('Factory.prototype中没有'+type);
        }
    };
    juanchen.Factory.prototype={
        /*
         loading
         使用： 先写好html和css,再 var ins=new Loading(param);  ins.load();
         */
        Loading:(function(){

            function _loading(param){
                var _param={
                    id:"#c_loading",
                    needLoad:[],//需要加载的数组
                    callback:function(){}//加载完成执行的回调函数
                };

                this.id          =param.id          ||_param.id;
                this.needLoad    =param.needLoad    ||_param.needLoad;
                this.callback    =param.callback    ||_param.callback;

            }

            _loading.prototype={
                init:function(){
                    //
                    var _that=this;
                    //
                    var progress = 0,
                        len = _that.needLoad.length,
                        weightAll = 0,
                        $progress=null;

                    if($(_that.id).find('.progress').length>0){
                        $progress=$(_that.id).find('.progress');
                    }

                    // 用1,2,3级别,把数组遍历2次。。。
                    for (var m = 0; m < len; m++) {
                        weightAll += _that.needLoad[m].weight;
                    }

                    for (var i = 0; i < len; i++) {
                        var imgTemp = document.createElement(_that.needLoad[i].type);
                        imgTemp.src = _that.needLoad[i].src;
                        (function (i) {
                            imgTemp.onload = function () {
                                progress += parseInt(_that.needLoad[i].weight / weightAll * 100) + 1;
                                $progress.html(progress+"%");
                                if (progress >=100) {
                                    $progress.html("100%");
                                    //让人家看一看100%
                                    setTimeout(function(){
                                        $(_that.id).hide();
                                        _that.callback();
                                    },500);
                                }
                            }
                        }(i));
                    }
                }
            };

            return _loading;
        }()),
        /*
         Alert
         使用：var myAlert=new Alert(); myAlert.alert('你好');
         */
        Alert:(function(){

            var alert_num=0;

            function _alert(){
                this.alertNum='num'+(++alert_num);
                juanchen.CONST.get('$body').prepend('<div class="c_alert '+this.alertNum+'" ><div class="con" ></div></div>');
                this.$alert=$('.c_alert.'+this.alertNum);
            }

            _alert.prototype={
                initCSS:function(){
                    var $body=juanchen.CONST.get('$body');
                    var base_css=[
                        '.c_alert{display: none;position:fixed;left:0;right:0;top:0;bottom:0;z-index:999;background-color: rgba(0,0,0,0.7);}',
                        '.c_alert.active{display: block;}',
                        '.c_alert .con{text-align: center;background-color: #fff;padding:3%;position: absolute;top:20%;left:50%;transform:translateX(-50%);-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%)}',
                        '.c_alert_btn {width:30%;font-size:13px;margin:0 10px;display: inline-block;background-color: #E40013;color:#fff;text-decoration:none;}'
                    ];
                    $('head').append("<style class='juan-alert-style'>"+base_css.join('')+"</style>");
                    $body.on("click",".c_alert .c_alert_btn",function(e){
                        $(e.target).parents(".c_alert").toggleClass('active').find('.con').html('');
                    });
                    return new Error('Alert._init自动执行一次，不需要手动调用');
                },
                //这个方法有两个版本
                alert:function(){
                    //var $c_alert=$('.c_alert.'+this.alertNum); //用this.$alert 替换了
                    var contentHtml,contentText;
                    if(Object.prototype.toString.call(arguments[0]) == '[object Object]')
                    {
                        //复杂版本：参数是一个对象
                        //obj={btn_sure:"",btn_cancle:"",callback_sure:null,callback_cancel:null,content:'你好/a.jpg'};
                        //一个按钮，两个按钮，按钮的回调
                        //内容是文字，内容是图片
                        var arg=arguments[0];
                        contentText=arg.content;
                        var btn_sure,btn_html;


                        //1 确定按钮有吗
                        if(arg.hasOwnProperty('btn_sure')){
                            btn_sure=arg.btn_sure;
                        }else{
                            btn_sure='确定';
                        }
                        //2 确定的回调有吗
                        if(arg.hasOwnProperty('callback_sure')){
                            this.$alert.one("click",'.c_alert_btn.sure',arg.callback_sure);
                        }


                        btn_html='<a href="javascript:void(0);"  class="c_alert_btn sure">'+btn_sure+'</a>';

                        //3 取消按钮有吗
                        if(arg.hasOwnProperty('btn_cancel')){
                            btn_html+='<a href="javascript:void(0);"  class="c_alert_btn cancel">'+arg.btn_cancel+'</a>';
                            //取消的回调有吗
                            if(arg.hasOwnProperty('callback_cancel')){
                                this.$alert.one("click",'.c_alert_btn.cancel',arg.callback_cancel);
                            }
                        }


                        //4 内容是文字还是图片
                        if(is_pic(contentText)){
                            //内容是图片
                            contentHtml='<p ><img src=\"'+contentText+'\"/></p>';
                        }else{
                            //内容是文本
                            contentHtml='<p style="padding:0 100px 50px 100px;">'+contentText+'</p>';
                        }


                        //5 加上按钮
                        contentHtml+=btn_html;

                    }
                    else
                    {
                        //简单版本：参数是contentText,btnText，
                        contentText=arguments[0];   //第一个参数 内容
                        var btnText=arguments[1];    //第二个参数 按钮（只有一个按钮）
                        !btnText&&(btnText="确定");


                        if(is_pic(contentText)){
                            //内容是图片
                            contentHtml='<p ><img src=\"'+contentText+'\" /></p>';

                        }else{
                            //内容是文本
                            contentHtml='<p style="padding:0 100px 50px 100px;">'+contentText+'</p>';

                        }
                        //加上按钮
                        contentHtml+= '<a href="javascript:void(0);"  class="c_alert_btn sure">'+btnText+'</a>';
                    }

                    this.$alert.toggleClass('active').find('.con').append(contentHtml);

                    function is_pic(str){
                        var is_pic=true;
                        if(str.search(/(.jpg)|(.png)|(.gif)/i)==-1){
                            is_pic=false;
                        }
                        return  is_pic;
                    }
                }
            };

            return _alert;
        }()),
        /*
         给定一个有高和宽的canvas，碰撞运动
         var collisionInstance = new juanchen.Factory('Collide',{
             selector:".collide canvas",
             moveObjArr:moveObjArr}
          );
         collisionInstance.init();
         */
        Collide:(function(){
            function _collide(param){
                var selector=param.selector;
                var moveObjArr=param.moveObjArr;
                // 用canvas吧
                this.can = document.querySelector(selector);
                this.ctx = this.can.getContext("2d");

                this.stageWidth = parseInt($(this.can).css("width"));
                this.stageHeight = parseInt($(this.can).css("height"));

                if (this.stageHeight < 1 || this.stageWidth < 1) {
                    throw new Error("canvas的高和宽太小")
                }

                //运动的东西可以是img，text，或者是canvas画的图形，的混合？
                //img-src text-文字 canvas图形对应图形的参数(圆形，长方形，路径)
                this.drawFnArr = [];
                this.imgDomArr = [];
                this.xs = [];
                this.dirs = [];
                this.ks = [];
                this.bs = [];
                this.ys = [];
                this.timer = null;

                for (var i = 0; i < moveObjArr.length; i++) {
                    var draw = {};
                    this.xs[i] = getRandom(20, 200);
                    this.bs[i] = getRandom(10, 100);
                    this.ks[i] = Math.random();
                    this.dirs[i] = Math.random() < 0.5 ? 1 : -1;

                    var tempType = moveObjArr[i].type;

                    if (tempType == "img") {
                        draw.type = 'img';
                        var src = moveObjArr[i].src;

                        if (this.imgDomArr[src] == undefined) {
                            this.imgDomArr[src] = document.createElement("img");
                            this.imgDomArr[src].src = src;
                        }

                        (function (src) {
                            draw.fn = function (ctx, imgDomArr, x, y, width, height) {
                                ctx.drawImage(imgDomArr[src], x, y, width, height);
                            };
                        }(src));

                    } else if (tempType == "rect") {
                        draw.type = "rect";
                        var width = moveObjArr[i].option.width;
                        var height = moveObjArr[i].option.height;
                        (function (width, height) {
                            draw.fn = function (ctx, x, y) {
                                ctx.fillRect(x, y, width, height);
                            }
                        }(width, height));
                    }

                    this.drawFnArr.push(draw);
                }

                function getRandom(min, max) {
                    return parseInt(Math.random() * (max - min + 1) + min);
                }
            }

            _collide.prototype={
                init: function () {
                    if (this.timer === null) {
                        this.timer = setInterval(function () {

                            this.clear();
                            this.changeXY();
                            this.draw();

                        }.bind(this), 30);
                    }
                },
                clear: function () {
                    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
                },
                changeXY: function () {

                    function kby(obj) {
                        obj.ks[i] *= -1;
                        obj.bs[i] = obj.ys[i] - obj.ks[i] * obj.xs[i];
                        obj.ys[i] = obj.ks[i] * obj.xs[i] + obj.bs[i];
                    }

                    function ky(obj) {
                        obj.ks[i] *= -1;
                        obj.ys[i] = obj.ks[i] * obj.xs[i] + obj.bs[i];
                    }

                    function dir(obj, num) {
                        obj.dirs[i] = num;
                    }

                    for (var i = 0; i < this.xs.length; i++) {
                        this.xs[i] += (i + 1) * this.dirs[i];
                        this.ys[i] = this.ks[i] * this.xs[i] + this.bs[i];

                        if (this.ys[i] <= 2 || this.ys[i] >= this.stageHeight - 32) {
                            kby(this);
                        }
                        if (this.xs[i] >= this.stageWidth - 30) {
                            dir(this, -1);
                            kby(this);
                        }
                        if (this.xs[i] <= 0) {
                            dir(this, 1);
                            ky(this);
                        }

                    }
                },
                draw: function () {
                    for (var i = 0; i < this.drawFnArr.length; i++) {
                        var cur = this.drawFnArr[i];
                        var x = this.xs[i];
                        var y = this.ys[i];

                        if (cur.type == "img") {
                            cur.fn(this.ctx, this.imgDomArr, x, y, 30, 30);
                        } else if (cur.type == "rect") {
                            cur.fn(this.ctx, x, y);
                        }

                    }
                }
            };

            return _collide;
        }())
    };

    return juanchen;

});
/*暗黑：
*   获取模拟的静态变量里面的对象
 Object.defineProperty(Object.prototype,"_self",{
    get:function(){return this;}
 });
* */

