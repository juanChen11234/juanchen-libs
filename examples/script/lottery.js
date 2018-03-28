/**
 * Created by JuAn chen.
 * QQ 528159689
 */
require(['../../src/js/require-config'],function(){
    require(['Lottery'],function(Lottery){

        var lottery = new Lottery('lotteryContainer', 'imgs/lottery_mask.png', 'image', 400, 300, drawPercent);
        lottery.init('imgs/lottery.jpg', 'image');

        function drawPercent(percent) {
            var drawPercentNode = document.getElementById('drawPercent');
            drawPercentNode.innerHTML = percent + '%';
        }

        document.getElementById('freshBtn').onclick = function() {
            drawPercent(0);
            lottery.init('imgs/lottery.jpg', 'image');
        };

    });
});