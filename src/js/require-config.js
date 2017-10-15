define(function(){
    //"http://libs.baidu.com/jquery/2.0.3/jquery",
    require.config({
        baseUrl:'src/js',
        paths: {
            "jquery": "lib/jquery-3.2.0.min",
            'zepto':'lib/lib-zepto.min',
            "juan": "lib/lib-juanchen-0.0.2",
            'rgbaster':'lib/lib-rgbaster.min',
            'Juan-2speak':'lib/lib-Juan-2speak',
            'Lottery':'lib/lib-Lottery',
            'fastClick':'lib/lib-fastClick',
            'zhiwen':'lib/lib-zhiwen',
            'iphone-inline-video':'lib/lib-iphone-inline-video.min'
        },
        shim:{
            'rgbaster':{
                //deps���� ������ģ��������ԡ�
                exports:"RGBaster"//���ģ���ⲿ����ʱ������
            },
            'zepto':{
                exports:"Zepto"
            }

        }
    });
});

