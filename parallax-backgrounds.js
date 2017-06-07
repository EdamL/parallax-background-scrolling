/*
* parallaxBackgrounds - jQuery plugin
* Copyright (c) 2017 Adam Lafene
*
* Licensed under the terms of the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/
(function($){
    $.fn.parallaxBackgrounds = function(fixedHeader) {
        var $this = this, 
            header = fixedHeader || '', 
            objectMetrics = new Array(), 
            headerHeight, 
            windowHeight,
            getObjectMetrics = function () {
                headerHeight = (header.length > 0) ? header.outerHeight() : 0;
                windowHeight = window.innerHeight - headerHeight;
                $this.each(function (i) {
                    var $this = $(this);
                    objectMetrics[i] = {
                        height: parseInt($this.outerHeight()),
                        top: parseInt($this.offset().top)
                    };
                });
            },
            setScrollPosition = function () {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                $this.each(function (i) {
                    if (!objectMetrics[i])
                        return;
                    var objHeight = objectMetrics[i].height, 
                        objTop = objectMetrics[i].top, 
                        scrollArea = (objTop - headerHeight > windowHeight) ? windowHeight + objHeight : (objTop - headerHeight) + objHeight, 
                        scrollPosition = (objTop - scrollTop - headerHeight) + objHeight, 
                        percentage = Math.round(scrollPosition / (scrollArea / 100));

                    percentage = (percentage > 100) ? 100 : 
                                 ((percentage < 0) ? 0 : percentage);

                    $(this).css('background-position', '50% ' + percentage + '%');
                });
            };

        this.update = function () {
            getObjectMetrics();
            setScrollPosition();
        };

        if ($this.length < 1) 
            return 0;

        $(document).ready(function () {
            $this.update();
        });
        $(window).scroll(function () {
            setScrollPosition();
        });
        return (this);
    };
})(jQuery);