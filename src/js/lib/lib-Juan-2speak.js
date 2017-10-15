/**
 * Created by JuAn.
 * QQ 528159689
 */

define(function(){
    var TwoPeopleSpeak = function (obj) {
        this.speak_line=obj.speak_line;
        this.$speak_con= obj.$speak_con;
        this.$btn_con= obj.$btn_con;
        this.interval= obj.interval;
        this.chooseLine= [];
        this._nextBtnArr= [];
        this._nextQuestion= "";
    };
    TwoPeopleSpeak.prototype={
        init: function () {
            this.start();
            this.bindEvent();
        },
        start: function () {

            var curBtnTxt = [];
            for (var i = 0; i < this.speak_line["answers"].length; i++) {
                curBtnTxt.push(this.speak_line["answers"][i]["choose"]);
            }
            var conTxt = this.speak_line["question"];

            this.updateSpeakCon("问：" + conTxt);
            setTimeout(function () {
                this.updateBtns(curBtnTxt);
            }.bind(this), this.interval)
        },
        updateBtns: function (btnTxtArr) {
            var html = [];
            for (var i = 0; i < btnTxtArr.length; i++) {
                html.push("<button data-line=\'" + i + "\' type='button'>" + btnTxtArr[i] + "</button>");
            }
            this.$btn_con.html(html.join(""));
        },
        updateSpeakCon: function (txt,who) {
            this.$speak_con.append("<p>" + txt + "</p>");
        },
        updateLine: function (num) {
            //更新线条记录
            this.chooseLine.push(num);
            //
            var nextBtnArr = [];
            var nextQuestion = "";
            var _nextSpeakObj = this.speak_line["answers"][this.chooseLine[0]];

            //下次的对象
            for (var i = 1; i < this.chooseLine.length; i++) {
                _nextSpeakObj = _nextSpeakObj["answers"][this.chooseLine[i]];
            }

            //下次的问题
            nextQuestion = _nextSpeakObj["question"];

            //下次按钮的内容
            if (nextQuestion) {
                for (var j = 0; j < _nextSpeakObj["answers"].length; j++) {
                    nextBtnArr.push(_nextSpeakObj["answers"][j]['choose']);
                }
            }

            this._nextBtnArr = nextBtnArr;
            this._nextQuestion = nextQuestion;
        },
        bindEvent: function () {
            this.$btn_con.on("click", "button", function (e) {
                var self = this,
                    $btn = $(e.currentTarget),
                    speak_txt = $btn.html();
                this.updateLine($btn.attr("data-line") - 0);

                //更新说话内容
                this.updateSpeakCon("回答：" + speak_txt);
                //清除按钮
                self.$btn_con.html("");

                if (self._nextQuestion) {
                    shouldContinue();
                }
                else {
                    shouldEnd();
                }

                function shouldContinue() {
                    //继续问
                    setTimeout(function () {
                        self.updateSpeakCon("回：" + self._nextQuestion);
                    }, self.interval - 200);
                    //出现按钮
                    setTimeout(function () {
                        self.updateBtns(self._nextBtnArr);
                    }, self.interval);
                }

                function shouldEnd() {
                    console.log("说完了");
                }


            }.bind(this));
        }
    };
    return TwoPeopleSpeak;
});

//<div class="speak_container"></div>
//<div class="btn_container"></div>
//var speak_ins=new speak(obj);
//speak_ins.init();
//数据格式
/*var obj={
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
                        'choose': "哎，老板又说什么了。拜拜"
                    }

                ]
            }
        ]
    },
    $speak_con:$(".speak_container"),
    $btn_con: $(".btn_container"),
    interval:800
};

*/






