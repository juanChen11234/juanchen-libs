/**
 * Created by JuAn chen.
 * QQ 528159689
 */
require(['../../src/js/require-config'],function(){
    require(['Juan-2speak','jquery'],function(speak){
        var obj={
            speak_line:{
                'question': "我们去爬山怎么样",
                'answers': [
                    {
                        "choose": "好呀",
                        'question': "哪儿好",
                        'answers': [
                            {
                                'choose': "哪儿都好",
                                "question": "比如呢",
                                'answers': [
                                    {
                                        'choose': "健身"
                                    },
                                    {
                                        'choose': "减肥"
                                    }
                                ]
                            },
                            {
                                'choose': "我乱说的",
                                "question": "调皮，大屁屁",
                                'answers': [
                                    {
                                        'choose': "哈哈"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "choose": "不好",
                        'question': "哪儿不好",
                        'answers': [
                            {
                                'choose': "哪儿都不好",
                                "question": "举个例",
                                'answers': [
                                    {
                                        'choose': "有危险"
                                    },
                                    {
                                        'choose': "会晒黑的"
                                    }
                                ]
                            },
                            {
                                'choose': "太热了",
                                "question": "给你扇风",
                                'answers': [
                                    {
                                        'choose': "才不要你扇风呢"
                                    }

                                ]
                            }
                        ]
                    },
                    {
                        'choose': "你猜",
                        "question": "你猜我猜不猜",
                        'answers': [
                            {
                                'choose': "不好玩儿"
                            },
                            {
                                'choose': "哎，那个。。。。拜拜"
                            }

                        ]
                    }
                ]
            },
            $speak_con:$(".speak_container"),
            $btn_con: $(".btn_container"),
            interval:800
        };
        var speak_ins=new speak(obj);
        speak_ins.init();
    });
});