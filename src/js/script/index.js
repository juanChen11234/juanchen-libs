/**
 * Created by JuAn chen.
 * QQ 528159689
 */
/*
 ['require-config']的路径相对于本文件的路径
 ['juanchen']是require.config配置的
* */
require(['../require-config'],function(){
    require(['juan','rgbaster','iphone-inline-video'],function(juanchen,RGBaster,enableInlineVideo){

        var video=document.querySelector('video');


        //测试---------dom------
        //音乐
        juanchen.dom.H5_music({
            musicSrc:'res/1.mp3',
            bgPlay:"imgs/musicPlay.png",
            bgStop:'imgs/musicStop.png',
            top:'5%',
            right:'5%'
        });


        //-----------测试-Factory------
        //Loading
        (function () {
            //1需要加载的资源
            var needLoad = function () {
                var arr = [];
                $('img').each(function (index, dom) {
                    if ($(dom).attr('src')) {
                        arr.push({"type": "img", "src": $(dom).attr('src'), "weight": 1});
                    }
                });
                return arr;
            };
            //2实例化一个Loading
            var load_instace = new juanchen.Factory('Loading', {
                id:'#c_loading',//容器的id
                needLoad: needLoad(),//需要加载的数组
                callback: function () {//加载完成执行的回调函数
                    console.log('加载完成');
                }
            });
            //3调用实例的方法
            load_instace.init();
        }());
        //Alert
        (function () {
            //2个实例
            var myAlert01 = juanchen.Factory('Alert');
            var myAlert02 = juanchen.Factory('Alert');
            myAlert01.initCSS();
            //调用实例的方法
            myAlert02.alert({
                content: 'imgs/good.jpg',
                btn_sure: "确定",
                btn_cancel: "取消",
                callback_sure: function () {
                    //myAlert01.alert('点击了确定');
                },
                callback_cancel: function () {
                    //myAlert01.alert('点击了取消');
                }
            });
        }());
        //碰撞
        (function () {
            //1移动的对象
            var moveObjArr = [
                {type: "img", src: "imgs/moveBallRed.png"},
                {type: "img", src: "imgs/moveBallRed.png"},
                {type: "img", src: "imgs/moveBallGreen.png"},
                {type: "img", src: "imgs/moveBallRed.png"},
                {type: "img", src: "imgs/moveBallGreen.png"},
                {type: "rect", option: {width: 30, height: 30}}
            ];
            //2 实例
            var collisionInstance = new juanchen.Factory('Collide',{selector:".collide canvas", moveObjArr:moveObjArr});
            //3、调用实例的方法
            setTimeout(function () {
                //collisionInstance.init();
            }, 100);
        })();


        //-----------测试-tools-----------
        //图片播放
        juanchen.tools.playImg.play('a01', '.playimgIns', 300, true);

        //停止图片播放
        //juanchen.tools.playImg.stop('a01');


        //点击某个东西滚动到的某个位置
        juanchen.tools.DomScrollTo({
            $clickEle:$('#tool-toTop'),
            $scrollEle:juanchen.CONST.get('$body'),
            targetScrollTop:-20,
            allTime:200
        });
        juanchen.tools.DomScrollTo({
            $clickEle:$('.test-scrollTo button'),
            $scrollEle:$('.test-scrollTo'),
            targetScrollTop:function(ele){
                return $(ele).attr('data-where')-0;
            },
            allTime:200
        });


        //whenWindowScroll 给那个按钮做个滚动隐藏显示的动效
        //计算文档滚动了多少，
        juanchen.tools.whenWindowScroll({
            type:"calcDocScroll",
            offsetTopCritical:1000,//文档滚动临界点1000
            callback_in:function(){
                $('#tool-toTop').removeClass('active');
            },
            callback_out:function(){
                $('#tool-toTop').addClass('active');

            }
        });

        //whenWindowScroll 视频播放与暂停
        //计算元素相对于屏幕的位置。
        juanchen.tools.whenWindowScroll({
            type:'calcDomRToScreen',
            dom:document.querySelector('video'),
            offsetTopMin:window.innerHeight*0.3,
            offsetTopMax:window.innerHeight*0.7,
            callback_in:function(){
                juanchen.tools.playVideo(video);
            },
            callback_out:function(){
                juanchen.tools.pauseVideo(video);
            }
        });

        //-----------测试-dores-----------
        juanchen.dores.config(['inputWithCheck','tab']);

        //是不是ie
        //alert('IE? '+juanchen.tools.isIE());

        //第三方插件，RGBaster
        var imgDom=$('.playimgIns img:first-child')[0];
        RGBaster.colors(imgDom,{
            exclude: [ 'rgb(255,255,255)' ],  // 不包括白色
            success:function(payload){
                // payload.dominant  主色，RGB形式表示
                // payload.secondary 次色，RGB形式表示
                // payload.palette   调色板，含多个主要颜色，数组
                $('.playimgIns').css('border','2px solid '+payload.dominant);
            }
        });

        // 第三方插件，enableInlineVideo
        enableInlineVideo(video);


    });
});

