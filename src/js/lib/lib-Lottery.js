//http://www.cnblogs.com/jscode/p/3580878.html
//稍有改动。
define(function(){

    function Lottery(id, cover, coverType, width, height, drawPercentCallback) {
        this.conId = id;//刮奖容器的id
        this.conNode = document.getElementById(this.conId);
        this.cover = cover;//涂层内容，可以为图片地址或颜色值，可空，默认为 #ccc
        this.coverType = coverType;//涂层类型，值为 image 或 color，可空，默认为 color
        this.background = null;
        this.backCtx = null;
        this.mask = null;
        this.maskCtx = null;
        this.lottery = null;
        this.lotteryType = 'image';
        this.width = width || 300;//默认为300px，可空
        this.height = height || 100;//刮奖区域高度，默认为100px，可空

        this.clientRect = null;
        this.drawPercentCallback = drawPercentCallback;//刮开的区域百分比回调，可空


        //把给的参数width height设置成容器div的宽和高,
        this.conNode.style.width=this.width+"px";
        this.conNode.style.height=this.height+"px";

        var _this=this;
        //静态定位 -> 相对定位
        if(getStyle(this.conNode,'position')=='static'){
            window.requestAnimationFrame(function(){
                _this.conNode.style.position='relative';
            })
        }
    }

    Lottery.prototype = {
        createElement: function (tagName, attributes) {
            var ele = document.createElement(tagName);
            for (var key in attributes) {
                ele.setAttribute(key, attributes[key]);
            }
            return ele;
        },
        getTransparentPercent: function (ctx, width, height) {
            var imgData = ctx.getImageData(0, 0, width, height),
                pixles = imgData.data,
                transPixs = [];
            for (var i = 0, j = pixles.length; i < j; i += 4) {
                var a = pixles[i + 3];
                if (a < 128) {
                    transPixs.push(i);
                }
            }
            return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
        },
        resizeCanvas: function (canvas, width, height) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').clearRect(0, 0, width, height);
        },
        drawPoint: function (x, y) {
            this.maskCtx.beginPath();
            var radgrad = this.maskCtx.createRadialGradient(x, y, 0, x, y, 30);
            radgrad.addColorStop(0, 'rgba(0,0,0,0.6)');
            radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.maskCtx.fillStyle = radgrad;
            this.maskCtx.arc(x, y, 30, 0, Math.PI * 2, true);
            this.maskCtx.fill();
            if (this.drawPercentCallback) {
                this.drawPercentCallback.call(null, this.getTransparentPercent(this.maskCtx, this.width, this.height));
            }
        },
        bindEvent: function () {
            var _this = this;
            var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
            var clickEvtName = device ? 'touchstart' : 'mousedown';
            var moveEvtName = device ? 'touchmove' : 'mousemove';
            var con = document.getElementById(this.conId);
            if (!device) {
                var isMouseDown = false;

                con.addEventListener('mouseup', function (e) {
                    isMouseDown = false;
                }, false);
            } else {
                con.addEventListener("touchmove", function (e) {
                    if (isMouseDown) {
                        e.preventDefault();
                    }
                }, false);
                con.addEventListener('touchend', function (e) {
                    isMouseDown = false;
                }, false);
            }
            this.mask.addEventListener(clickEvtName, function (e) {
                isMouseDown = true;
                var docEle = document.documentElement;
                if (!_this.clientRect) {
                    _this.clientRect = {
                        left: 0,
                        top: 0
                    };
                }
                var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
                var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
                _this.drawPoint(x, y);
            }, false);

            this.mask.addEventListener(moveEvtName, function (e) {
                if (!device && !isMouseDown) {
                    return false;
                }
                var docEle = document.documentElement;
                if (!_this.clientRect) {
                    _this.clientRect = {
                        left: 0,
                        top: 0
                    };
                }
                var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
                var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
                _this.drawPoint(x, y);
            }, false);
        },
        drawLottery: function () {
            this.background = this.background || this.createElement('canvas', {
                    style: 'position:absolute;left:0;top:0;'
                });
            this.mask = this.mask || this.createElement('canvas', {
                    style: 'position:absolute;left:0;top:0;'
                });

            if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
                this.conNode.appendChild(this.background);
                this.conNode.appendChild(this.mask);
                this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null;
                this.bindEvent();
            }

            this.backCtx = this.backCtx || this.background.getContext('2d');
            this.maskCtx = this.maskCtx || this.mask.getContext('2d');

            if (this.lotteryType == 'image') {
                var image = new Image(),
                    _this = this;
                image.onload = function () {
                    //_this.width = this.width;//Lottery.width=img.width;
                    //_this.height = this.height;
                    _this.resizeCanvas(_this.background,  _this.width,  _this.height);
                    _this.backCtx.drawImage(this, 0, 0);
                    _this.drawMask();
                };
                image.src = this.lottery;
            } else if (this.lotteryType == 'text') {
                //this.width = this.width;
                //this.height = this.height;
                this.resizeCanvas(this.background, this.width, this.height);
                this.backCtx.save();
                this.backCtx.fillStyle = '#FFF';
                this.backCtx.fillRect(0, 0, this.width, this.height);
                this.backCtx.restore();
                this.backCtx.save();
                var fontSize = 30;
                this.backCtx.font = 'Bold ' + fontSize + 'px Arial';
                this.backCtx.textAlign = 'center';
                this.backCtx.fillStyle = '#F60';
                this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2);
                this.backCtx.restore();
                this.drawMask();
            }
        },
        drawMask: function () {
            this.resizeCanvas(this.mask, this.width, this.height);
            if (this.coverType == 'color') {
                this.maskCtx.fillStyle = this.cover;
                this.maskCtx.fillRect(0, 0, this.width, this.height);
                this.maskCtx.globalCompositeOperation = 'destination-out';
            } else if (this.coverType == 'image') {
                var image = new Image(),
                    _this = this;
                image.onload = function () {
                    _this.maskCtx.drawImage(this, 0, 0);
                    _this.maskCtx.globalCompositeOperation = 'destination-out';
                }
                image.src = this.cover;
            }
        },
        init: function (lottery, lotteryType) {
            this.lottery = lottery;
            this.lotteryType = lotteryType || 'image';
            this.drawLottery();
        }
    };


    function getStyle(obj,attr){
        if(window.getComputedStyle){
            return window.getComputedStyle(obj,null)[attr];
        }else{
            return obj.currentStyle[attr];
        }
    }

    return Lottery;
});

/*
* 用法：
*
* 容器是一个div:<div id="lotteryContainer"></div>

 var lottery = new Lottery('lotteryContainer', 'imgs/lottery_mask.png', 'image', 300, 100, drawPercent);
 lottery.init('imgs/lottery.png', 'image');

 function drawPercent(percent) {
     var drawPercentNode = document.getElementById('drawPercent');
     drawPercentNode.innerHTML = percent + '%';
 }

 document.getElementById('freshBtn').onclick = function() {
     drawPercent(0);
     lottery.init('imgs/lottery.png', 'image');
 };
* */





