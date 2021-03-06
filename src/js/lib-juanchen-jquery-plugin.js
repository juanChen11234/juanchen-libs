/**
 *  Created by JuAn chen.
 *  QQ 528159689
 * $.fn.extend 是扩展到 jquery实例对象 上
 * $.extend    是扩展到 jquey对象      上
 */


(function ($) {
    var _uniqueExtend = null;
    var obj_extend_to_fn = {},
        obj_extend_to_$ = {};
    var dc = document;

    // 检查依赖
    if (!$) {
        throw new Error('请引入jquery或者zepto');
    }


    /**
     * 因为直接$.fn.extend 有可能覆盖已有的
     * target: 'fn'/'$' 默认扩展到$.fn
     */
    _uniqueExtend = function (obj, target) {
        var key, usefulObj = {};
        // 检查参数格式
        if ($.type(obj) !== 'object') {
            console.warn('参数为对象的格式');
            return;
        }
        // 防止覆盖
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if ($.fn[key] === void(0)) {
                    usefulObj[key] = obj[key];
                } else {
                    console.warn('$.fn' + key + '已经存在哦');
                }
            }
        }
        // 扩展
        if (target === '$') {
            $.extend(usefulObj);
        } else {
            $.fn.extend(usefulObj);
        }

    }

    // -------------------------------------------------------------

    /**
     * 扩展到 jquery对象 上
     * 
     */

    obj_extend_to_$ = {
        $body: $('body'),
        $head: $('head'),
        $window: $(window),
        Body: dc.querySelector('body'),
        /*
         * 从href中获取Obj
         * @param str:string    location.href
         * @param condition:{}  有点费解
         * @return object
         * */
        getQueryObjFromHref: function (str, condition) {
            /*
             * condition : {isGov: '_channel', isEn: '_channel', isKr: '_lang'}
             *  如果str中出现isGov = 1，那么返回的结果回是：{_channel: 'isGov'}
             * */

            // str = decodeURIComponent(str);
            var _str = str.slice(str.indexOf('?') + 1);

            if (!_str) {
                return {};
            }

            let res = {};
            _str.split('&').forEach(s => {
                let tempArr = s.split('=');
                let _key = tempArr[0],
                    _val = tempArr[1];

                if (condition && condition[_key] && _val === '1') {
                    res[condition[_key]] = _key;

                } else {
                    res[_key] = _val || '';
                }


            });
            return res;
        },
        /**
         * 美化jsonString
         * @return string
         */
        beautifyJsonString: function (txt, compress /*是否为压缩模式*/ ) {
            var indentChar = '    ';
            if (/^\s*$/.test(txt)) {
                alert('数据为空,无法格式化! ');
                return;
            }
            try {
                var data = eval('(' + txt + ')');
            } catch (e) {
                alert('数据源语法错误,格式化失败! 错误信息: ' + e.description);
                return;
            };
            var draw = [],
                last = false,
                This = this,
                line = compress ? '' : '\n',
                nodeCount = 0,
                maxDepth = 0;

            var notify = function (name, value, isLast, indent /*缩进*/ , formObj) {
                nodeCount++; /*节点计数*/
                for (var i = 0, tab = ''; i < indent; i++) tab += indentChar; /* 缩进HTML */
                tab = compress ? '' : tab; /*压缩模式忽略缩进*/
                maxDepth = ++indent; /*缩进递增并记录*/
                if (value && value.constructor == Array) { /*处理数组*/
                    draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line); /*缩进'[' 然后换行*/
                    for (var i = 0; i < value.length; i++)
                        notify(i, value[i], i == value.length - 1, indent, false);
                    draw.push(tab + ']' + (isLast ? line : (',' + line))); /*缩进']'换行,若非尾元素则添加逗号*/
                } else if (value && typeof value == 'object') { /*处理对象*/
                    draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line); /*缩进'{' 然后换行*/
                    var len = 0,
                        i = 0;
                    for (var key in value) len++;
                    for (var key in value) notify(key, value[key], ++i == len, indent, true);
                    draw.push(tab + '}' + (isLast ? line : (',' + line))); /*缩进'}'换行,若非尾元素则添加逗号*/
                } else {
                    if (typeof value == 'string') value = '"' + value + '"';
                    draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
                };
            };
            var isLast = true,
                indent = 0;
            notify('', data, isLast, indent, false);
            return draw.join('');
        },
        /*
         * 去掉数组或则对象中的空值，包括：null undefined '' 。 (0 不是空值)
         * @return object | array
         * */
        cutEmptyItem: function (objOrArr) {
            var res;
            if (Object.prototype.toString.call(objOrArr) === '[object Object]') {
                res = {};
                let key;
                for (key in objOrArr) {
                    if (objOrArr.hasOwnProperty(key) && objOrArr[key] !== '' &&
                        objOrArr[key] !== undefined && objOrArr[key] !== null) {
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
        },
        // 原生的事件绑定
        originAddEvent: (function () {
            var fn = null;
            if (document.querySelector('body').addEventListener) {
                fn = function (obj, ev, fn) {
                    obj.addEventListener(ev, fn, false);
                }
            } else {
                fn = function (obj, ev, fn) {
                    obj.attachEvent("on" + ev, fn, false);
                }
            }
            return fn
        }()),
        //【反转字符串】
        reverseStr: function (str) {
            return str.split("").reverse().join("");
        },
        isEmptyObj: function (obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key) && obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
                    return false;
                }
            }
            return true;
        },
        isIE: function () {
            return !!("ActiveXObject" in window || window.ActiveXObject) || false;
        },
        /**
         * @return string ; 'Mac/Unix/Linux/Win2000/winXP/Win2003/WinVista/Win7/Win10/other'
         */
        detectOS:function(){
            var sUserAgent = navigator.userAgent;
            var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) return "Mac";
            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return "Unix";
            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux) return "Linux";
            if (isWin) {
                var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
                if (isWin2K) return "Win2000";
                var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
                if (isWinXP) return "WinXP";
                var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
                if (isWin2003) return "Win2003";
                var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
                if (isWinVista) return "WinVista";
                var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
                if (isWin7) return "Win7";
                var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
                if (isWin10) return "Win10";
            }
            return "other";
        },
        backLastPage: function () {

            //window.location.reload();   刷新
            //window.history.go(1); //前进
            window.history.go(-1); //返回+刷新

            //window.history.forward(); //前进
            //window.histoty.back(); //返回

        },
        /**
         *  预加载页面img video等资源
         * @param: {
         *  animateContainer: '',  // loading 动画的容器id
            needLoad:object[],     //需要加载的资源数组 {"type": "img", "src": '', "weight": 1} type用户document.createElement
            callback:function
         * }
         */
        preLoadSource: function (params) {
            var id = params.animateContainerId;
            var needLoad = params.needLoad;
            var callback = params.callback;
            //
            var progress = 0,
                len = needLoad.length,
                weightAll = 0,
                $progress = null;

            if ($(id).find('.progress').length > 0) {
                $progress = $(id).find('.progress');
            } else {
                console.log('no div-pro');
            }

            // 用1,2,3级别,把数组遍历2次。。。
            for (var m = 0; m < len; m++) {
                weightAll += needLoad[m].weight;
            }

            for (var i = 0; i < len; i++) {
                var imgTemp = document.createElement(needLoad[i].type);
                imgTemp.src = needLoad[i].src;
                (function (i) {
                    imgTemp.onload = function () {
                        progress += parseInt(needLoad[i].weight / weightAll * 100) + 1;
                        $progress.html(progress + "%");
                        if (progress >= 100) {
                            $progress.html("100%");
                            //让人家看一看100%
                            setTimeout(function () {
                                $(id).hide();
                                callback();
                            }, 500);
                        }
                    }
                }(i));
            }
        },
        AlertNum: 0,
        /**
         * @param object {
         *  html:'<p><img src="你好/a.jpg"/></p>',
         *  btn_sure_txt:"",
         *  btn_cancle_txt:"",
         *  callback_sure:null,
         *  callback_cancel:null,
         * }
         */
        Alert: function (params) {
            // css
            var $body = $('body'),
                $alertEle = null;
          
            if ($('.juan-alert-style').length < 1) {
                      
                var initCSS = function () {
                    var base_css = [
                        '.c_alert{display: none;position:fixed;left:0;right:0;top:0;bottom:0;z-index:999;background-color: rgba(0,0,0,0.7);}',
                        '.c_alert.active{display: block;}',
                        '.c_alert .con{text-align: center;background-color: #fff;padding:3%;position: absolute;top:20%;left:50%;transform:translateX(-50%);-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%)}',
                        '.c_alert_btn {width:30%;font-size:13px;margin:0 10px;display: inline-block;background-color: #E40013;color:#fff;text-decoration:none;}'
                    ];
                    $('head').append("<style class='juan-alert-style'>" + base_css.join('') + "</style>");
                    $body.on("click", ".c_alert .c_alert_btn", function (e) {
                        $(e.target).parents(".c_alert").toggleClass('active').find('.con').html('');
                    });
                }

                initCSS();
            }
            
            // ---------------

            var _param = {
                html: params.html || '内容',
                btn_sure_txt: '',
                btn_cancel_txt: '',
                callback_sure: params.callback_sure || null,
                callback_cancel: params.callback_cancel || null,
            };

            // 找一下有没有空的alert-con，不然就加一个。
            if ($('.c_alert .con:empty').length === 0) {
                var class_alertNum = 'num' + (++this.AlertNum);
                $body.prepend('<div class="c_alert ' + class_alertNum + '" ><div class="con" ></div></div>');
                $alertEle = $('.c_alert.' + class_alertNum);
            } else {
                $alertEle = $('.c_alert .con:empty').eq(0).parents('.c_alert');
            }
           

            var btnHtmls = '',contentHtml;
             
            // 根据回掉和参数判断按钮的有无。
            if (_param.callback_sure) {
                _param.btn_sure_txt = params.btn_sure_txt || '确定';
            } else {
                _param.btn_sure_txt = params.btn_sure_txt || '';
            }

            if (_param.callback_cancel) {
                _param.btn_cancel_txt = params.btn_calcel_txt || '取消';
            } else {
                _param.btn_calcel_txt = params.btn_calcel_txt || '';
            }

            // 是否需要绑定事件
            if (_param.btn_sure_txt ) {

                btnHtmls = '<a href="javascript:void(0);"  class="c_alert_btn sure">' + _param.btn_sure_txt + '</a>';
                if(_param.callback_sure) {
                    $alertEle.one("click", '.c_alert_btn.sure', _param.callback_sure);
                }
                
            }
            if (_param.btn_cancel_txt ) {

                btnHtmls += '<a href="javascript:void(0);"  class="c_alert_btn cancel">' + _param.btn_cancel_txt + '</a>';
                if (_param.callback_cancel) {
                    $alertEle.one("click", '.c_alert_btn.cancel', _param.callback_cancel);
                }
                
            }

            contentHtml = contentHtml = '<div style="padding:0 100px 50px 100px;">' + _param.html + '</div>';
            contentHtml += btnHtmls;
            $alertEle.toggleClass('active').find('.con').append(contentHtml);
        },
        /**
         * @param
         */
        add_H5_music: function (param) {
            var _param = {
                musicSrc: './assets/1.mp3',
                bgPlay: "./assets/imgs/state1.png",
                bgStop: './assets/imgs/state0.png',
                top: '1%',
                right: '2%'
            };
            if (param) {
                _param.top = param.top || _param.top;
                _param.right = param.right || _param.right;
                _param.musicSrc = param.musicSrc || _param.musicSrc;
                _param.bgStop = param.bgStop || _param.bgStop;
                _param.bgPlay = param.bgPlay || _param.bgPlay;
            }
            var base_css = [
                '.c_audio{position:fixed;right:' + _param.right + ';top:' + _param.top + ';width:50px;height:50px;background-position:50% 50%;background-size:100% 100%;background-repeat:no-repeat;cursor:pointer;border-radius:50%}',
                '.c_audio.stop{background-image:url(' + _param.bgStop + ')}',
                '.c_audio.play{background-image:url(' + _param.bgPlay + ');animation:j_audio 3s infinite linear;-webkit-animation:j_audio 3s infinite linear}',
                '@keyframes j_audio{0%{transform:rotate(0);-webkit-transform:rotate(0)}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg)}}',
                '@-webkit-keyframes j_audio{0%{transform:rotate(0);-webkit-transform:rotate(0)}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg)}}'
            ];
            $('head').append('<style class="juan-H5Music-style">' + base_css.join('') + '</style>');

            $('body').prepend('<div class="c_audio stop"> <audio src="' + _param.musicSrc + '"></audio></div>').on('click', '.c_audio', function (e) {
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
        },
        DomScrollTo: function (param) {
            /*param={
                $clickEle:'',点击的元素,jq对象
                $scrollEle:'',滚动的元素，jq对象
                targetScrollTop:'',//顶部是0，正方向向下
                allTime:''//滚动总时间
            }*/

            //匀速滚动,每次移动15像素

            var timer = null;

            var isFn = '';
            if (typeof (param.targetScrollTop) == 'function') {
                isFn = param.targetScrollTop.bind(null);
            }

            param.$clickEle.on('click', function () {

                //做个判断：
                // targetScrollTop直接用param.targetScrollTop还是调用param.targetScrollTop()的返回值。
                var targetScrollTop;
                if (isFn) {
                    targetScrollTop = isFn(this);
                } else {
                    targetScrollTop = param.targetScrollTop;
                }
                //点击时元素相对于滚动条向下滚动的像素值，是一个正数
                var curScrollTop = param.$scrollEle.scrollTop();
                // 基础的Step
                var basicStep = Math.abs(targetScrollTop - curScrollTop) > 3000 ? 100 : 15;
                //本次点击移动的方向
                var dir = curScrollTop < targetScrollTop ? 1 : -1;
                //本次点击的interval
                var interval = param.allTime / (Math.abs(targetScrollTop - curScrollTop) / basicStep);
                // var step;

                if (timer === null) {
                    timer = setInterval(function () {

                        var _step = Math.abs(targetScrollTop - curScrollTop) < 15 ? 1 : basicStep;

                        if ((dir > 0 && curScrollTop > targetScrollTop) || (dir < 0 && curScrollTop < targetScrollTop)) {
                            window.clearInterval(timer);
                            timer = null;
                        } else {
                            curScrollTop += dir * _step;
                            param.$scrollEle.scrollTop(curScrollTop);
                        }

                    }, interval);
                }
               
            });
        },
        /**
         * 没有递归，只有两级，不够。
         */
        transArray2Object: function(params) {
            var arr = params.arr;
            var index = params.index;
            var parentField= params.parentField;
            var childField = params.childField || 'child';
            // 
            var res = {};
            var len =arr.length,i, tempItem;
            
            var findParentPos_arr = function(pid, obj) {
                var pos = [];
                var targetId = pid;
                var key01,key02;
                var digui = function(obj22,id) {
                    if (obj22 && obj22[childField]) {
                        for (var key in obj22[childField]) {
                            if (obj22[childField].hasOwnProperty(key)) {
                                if (key == id) {
                                    pos.push(key);
                                } else {
                                    digui(obj22[key],id);
                                }
                            }
                        }
                    }
                    return '';
                }
                for (key01 in  obj) {
                    if ( obj.hasOwnProperty(key01)) {
                        if ( key01 == targetId) {
                            pos.push(key01);
                            return ;
                        } else  {
                            // 
                            digui(obj[key01],targetId);  
                            if (pos.lenght > 0) {
                                pos.unshift(key01);
                            }
                        }
                    }
                }
                return pos;
            }
            for (i = 0 ; i< len; i++) {
                tempItem = arr[i];
                tempItem[childField] = {};
                var _index = tempItem[index];
                // 
                if (tempItem[parentField] === 0) {
                    res[_index] = tempItem;

                } else {
                    var _parentPos_arr =  findParentPos_arr(tempItem[parentField], res);
                
                    if (_parentPos_arr.length > 0) {
                        console.log(_parentPos_arr);
                        var pos = res[_parentPos_arr[0]][childField];
                        if (_parentPos_arr.length  < 1) {
                            return;
                        }
                        
                        for (var j = 1 ;j < _parentPos_arr.length ; j ++) {
                            pos = pos[_parentPos_arr[j]][childField];
                        }
                        pos[_index] = tempItem;
                    }
                    
                }
            }

            return res;
        }
    }


    // -----------------------------------------------------------


    obj_extend_to_fn = {
        /**
         * 获取元素相对于屏幕的位置
         * @param element 非jq实例
         * @return Object
         */
        getPosRelativeToScreen: function () {
            return this.get(0).getBoundingClientRect();
        },
        /**
         * 去掉html字符串中的空元素
         * @return string
         */
        cutEmptyEleFromInnerhtml: function () {
            var htmlStr = $(this).html();
            if (!htmlStr) {
                return '';
            }
            // 去掉空格
            htmlStr = htmlStr.replace(/\s+/ig, '');

            var reg = /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?(<\/?br>)*?(&nbsp;)*?(\n)*?<\/\1>/ig;
            while (reg.test(htmlStr)) {
                htmlStr = htmlStr.replace(reg, '');
            }

            return htmlStr;

        },
        /**
         * @param: {
         *  url: string,
         *  callback: function,
         *  fileAlias: string,
         *  addedInfo: object
         * }
         */
        inputFileUpload: function (params) {
            //url, callback, fileAlias
            var url = params.url;
            var callback = params.callback;
            var fileAlias = params.fileAlias;
            var addedInfo = params.addedInfo || null; // {}


            // 是否需要限制类型

            // 创建FormData对象
            var data = new FormData();
            // 为FormData对象添加数据
            $.each(this.files, function (i, file) {
                data.append(fileAlias, file);
            });
            // 额外的信息
            if (addedInfo) {
                for (var key in addedInfo) {
                    if (addedInfo.hasOwnProperty(key)) {
                        data.append(key, addedInfo[key]);
                    }
                }
            }
            // 发送
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function (data) {
                    callback(data);
                },
                error: function () {
                    console.dir(arguments);
                }
            });
        },
        videoPlay: function () {
            !!this[0].paused && (this[0].play())
        },
        videoPause: function () {
            !this[0].paused && (this[0].pause())
        }
    }


    // ---------------------------------------------------
    _uniqueExtend(obj_extend_to_$, '$');
    _uniqueExtend(obj_extend_to_fn, '');

})(jQuery || Zepto);