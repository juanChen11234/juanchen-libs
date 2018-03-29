require(['../../src/js/require-config'], function() {
    // 
    require(['jquery'],function() {
        require(['juanchen-jquery-plugin'],function() {
            // $.isIE()
            $('#isIE').html($.isIE() + '');
            $('#os').html($.detectOS());
            
            // $.fn.getPosRelativeToScreen()
            $('#showPosRelToScreen').html(JSON.stringify($('#dd').getPosRelativeToScreen()));
            
            // $.fn.inputFileUpload()
            $('#upload').on('change',function() {
               
                if (this.files.length < 1) {
                    return;
                }

                $(this).inputFileUpload({
                    url: 'http://39.104.72.155:3389/facepic/loadFaceTmp',
                    fileAlias: 'file',
                    callback: function(txt) {

                    },
                    addedInfo: {
                        userIDCode: 'zhiwen123456'
                    }
                });
            });
            
            // $.fn.videoPause(); $.fn.videoPlay();
            $('#btn-pauseVideo').click(function() {
                $('#video').videoPause();
            });
            $('#btn-palyVideo').click(function() {
                $('#video').videoPlay();
            });
            
            //$.beautifyJsonString()   $.getQueryObjFromHref()
            $('#hrefToObj').find('textarea').val($.beautifyJsonString(
                JSON.stringify(
                    $.getQueryObjFromHref($('#hrefToObj').find('p').html())
                )
            ));
            // $.preLoadSource();
            $.preLoadSource({
                animateContainerId: '#loading',
                needLoad:[
                    {type: 'img', weight: 100,src: './assets/imgs/loading.gif'}
                ],
                callback: function() {
                    console.log('加载完成');
                }
            });

            // $.Alert()
            $('#btn-simple-alert').click(function() {
                $.Alert({
                    html:'<h1>好好学习，天天向上</h1>',
                    btn_sure_txt:"get it",
                    btn_cancle_txt:"no",
                    callback_sure: function() {

                    },
                    callback_cancel: function() {

                    }
                });
            });

            //  $.add_H5_music()
            $('#btn-add-music').click(function() {
                $.add_H5_music({
                    musicSrc:'./assets/1.mp3',
                    bgPlay:"./assets/imgs/musicPlay.png",
                    bgStop:'./assets/imgs/musicStop.png',
                    top:'1%',
                    right:'2%'
                });
            });

            //
            $.DomScrollTo({
                $clickEle:$('#btn-to-top'), //点击的元素,jq对象
                $scrollEle:$(window),       // 滚动的元素，jq对象
                targetScrollTop: 0,         //顶部是0，正方向向下
                allTime:200                 //滚动总时间   
            });
           

        });
    });
});