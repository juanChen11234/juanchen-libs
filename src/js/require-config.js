
/*
先用相对路径引入 require-config
然后就可以。。。
require(['../require-config'],function(){
    require(['juan','rgbaster','iphone-inline-video'],function() {

    })
);
*/

define(function(){
    //"http://libs.baidu.com/jquery/2.0.3/jquery",
    require.config({
        baseUrl:'../src/js',
        paths: {
            "jquery": "jquery-3.2.0.min",
            'zepto':'lib-zepto.min',
            "juan": "lib-juanchen-0.0.2",
            'rgbaster':'lib-rgbaster.min',
            'Juan-2speak':'lib-Juan-2speak',
            'Lottery':'lib-Lottery',
            'fastClick':'lib-fastClick',
            'zhiwen':'lib-zhiwen',
            'iphone-inline-video':'lib-iphone-inline-video.min',
            'juanchen-jquery-plugin':'lib-juanchen-jquery-plugin'
        },
        shim:{
            'rgbaster':{
                exports:"RGBaster"
            },
            'zepto':{
                exports:"Zepto"
            }

        }
    });
});


