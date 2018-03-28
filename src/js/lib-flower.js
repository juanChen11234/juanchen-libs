//使用方法
/*new FallingLeaves(10,"flowerJs_con_01",
     [
     "imgs/f1.png",
     "imgs/f2.png",
     "imgs/f3.png",
     "imgs/f4.png"
 ]);*/

define(function() {
    var doc=document;
    var FallingLeaves = function(num,id,imgSrcArr) {
        this.body = doc.body;
        this.support = false;
        this.container = id ? doc.getElementById(id) : this.body;
        //this.container.className+="flowerJs_con ";
        this.num = num ? num : 6;
        this.init(imgSrcArr);
    };
    FallingLeaves.prototype = {
        init: function(imgSrcArr) {
            this.supportNot();
            if (this.support != false) {
                for (var i = 0; i < this.num; i++) {
                    //这个地方做花瓣的随机
                    var imgSrc=getRandomSrc();
                    this.container.appendChild(this.createLeaf(imgSrc))
                }
                function getRandomSrc(){
                    var index=Math.floor(Math.random()*(imgSrcArr.length-2+1+1));
                    return imgSrcArr[index];
                }
            }

        },
        supportNot: function() {
            var domPrefixes = 'Webkit Moz O ms a'.split(' ');
            for (var i = 0; i < domPrefixes.length; i++) {
                if (this.container.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                    this.support = domPrefixes[i];
                    //console.log(this.support); //Webkit
                    break
                }
                if (domPrefixes[i] == "a") {
                    if (this.container.style.animationName !== undefined) {
                        this.support = domPrefixes[i];
                        console.log(this.support);
                        break
                    }
                }
            }
        },
        randomInteger: function(low, high) {
            return low + Math.floor(Math.random() * (high - low))
        },
        randomFloat: function(low, high) {
            return low + Math.random() * (high - low)
        },
        pixelValue: function(value) {
            return value + 'px'
        },
        durationValue: function(value) {
            return value + 's'
        },
        createLeaf: function(imgSrc) {
            var self = this,
                leafDiv = doc.createElement('div'),
                image = doc.createElement('img'),
                spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpinAndFlip',
                fadeAndDropDuration = self.durationValue(self.randomFloat(10, 20)),
                spinDuration = self.durationValue(self.randomFloat(8, 15)),
                leafDelay = self.durationValue(self.randomFloat(0, 0.1));
            leafDiv.className = "leave";

            $('.leave').css("z-index","888");

            image.src =imgSrc;
            //leafDiv.style.top = self.pixelValue(self.randomInteger(0,-50));
            leafDiv.style.top ="0px";
            leafDiv.style.right = self.pixelValue(self.randomInteger(0, 300));
            if (self.container.style[self.support + 'AnimationName'] !== undefined) {
                image.style[self.support + 'AnimationName'] = spinAnimationName;
                image.style[self.support + 'AnimationDuration'] = spinDuration;
                leafDiv.style[self.support + 'AnimationName'] = 'fade, drop';
                leafDiv.style[self.support + 'AnimationDelay'] = leafDelay + ', ' + leafDelay;
                leafDiv.style[self.support + 'AnimationDuration'] = fadeAndDropDuration + ', ' + fadeAndDropDuration
            }
            if (this.support == "a") {
                image.style.animationName = spinAnimationName;
                image.style.animationDuration = spinDuration;
                leafDiv.style.animationName = 'fade, drop';
                leafDiv.style.animationDelay = leafDelay + ', ' + leafDelay;
                leafDiv.style.animationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration
            }
            leafDiv.appendChild(image);
            return leafDiv
        }
    };
    return FallingLeaves;
});