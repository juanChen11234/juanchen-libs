define(function(){var t=function(t){this.speak_line=t.speak_line,this.$speak_con=t.$speak_con,this.$btn_con=t.$btn_con,this.interval=t.interval,this.chooseLine=[],this._nextBtnArr=[],this._nextQuestion=""};return t.prototype={init:function(){this.start(),this.bindEvent()},start:function(){for(var t=[],n=0;n<this.speak_line.answers.length;n++)t.push(this.speak_line.answers[n].choose);var e=this.speak_line.question;this.updateSpeakCon("问："+e),setTimeout(function(){this.updateBtns(t)}.bind(this),this.interval)},updateBtns:function(t){for(var n=[],e=0;e<t.length;e++)n.push("<button data-line='"+e+"' type='button'>"+t[e]+"</button>");this.$btn_con.html(n.join(""))},updateSpeakCon:function(t,n){this.$speak_con.append("<p>"+t+"</p>")},updateLine:function(t){this.chooseLine.push(t);for(var n=[],e="",i=this.speak_line.answers[this.chooseLine[0]],s=1;s<this.chooseLine.length;s++)i=i.answers[this.chooseLine[s]];if(e=i.question)for(var o=0;o<i.answers.length;o++)n.push(i.answers[o].choose);this._nextBtnArr=n,this._nextQuestion=e},bindEvent:function(){this.$btn_con.on("click","button",function(t){var n=this,e=$(t.currentTarget),i=e.html();this.updateLine(e.attr("data-line")-0),this.updateSpeakCon("回答："+i),n.$btn_con.html(""),n._nextQuestion?(setTimeout(function(){n.updateSpeakCon("回："+n._nextQuestion)},n.interval-200),setTimeout(function(){n.updateBtns(n._nextBtnArr)},n.interval)):console.log("说完了")}.bind(this))}},t});