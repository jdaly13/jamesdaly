(function (w, d) {
    'use strict';
    var timer = null,
        main,
        slice = Array.prototype.slice;
    function Main() {
        this.sections = d.querySelectorAll('.main');
        this.triggers = d.querySelectorAll('.luminous');
        this.slides = d.querySelectorAll('.slide');
        this.prevArrow = d.getElementsByClassName('slideshow-left-control')[0];
        this.nextArrow = d.getElementsByClassName('slideshow-right-control')[0];
        this.closeButton = d.querySelector('.overlay-close');
        this.overlay = d.querySelector('.overlay');
        this.triggered = false;
        this.overlayContainer = d.querySelector('.container');
        this.navElements = d.querySelectorAll('nav.content li a');
        this.slideShowHeader = d.querySelector('.overlay h1');
        this.workSlidesLength = d.querySelectorAll('#work .luminous').length;
        this.headerHeight = parseInt(w.getComputedStyle(d.querySelector('header')).height);
    }

    Main.prototype.removeClass = function(elements, cssClass, attr) {
        var i;
        if (!elements.length) {
            elements.classList.remove(cssClass);
        } else {
            for (i = 0; i < elements.length; i = i + 1) {
                elements[i].classList.remove(cssClass);
                if (attr) {
                    elements[i].removeAttribute(attr);
                }
            } 
        }
        
        return this;

    };
    
    Main.prototype.addClass = function(elements, cssClass, attr, attrValue) {
        var i;
        if (!elements.length) {
            elements.classList.add(cssClass);
        } else {          
            for (i = 0; i < elements.length; i = i + 1) {
                elements[i].classList.add(cssClass);
                if (attr) {
                    elements[i].setAttribute(attr, attrValue);
                }
            }
        }
        
        return this;
    };
    
    
    Main.prototype.isScrolledIntoView = function(el) {
        var elemTop = el.getBoundingClientRect().top,
            elemBottom = el.getBoundingClientRect().bottom;
        if (elemTop < w.innerHeight && elemBottom >= 0) { //elemTop >=0 && w.innerHeight > elemTop
            return el;
        } else {
            return false;
        }
    };

    Main.prototype.navigation = function () {
        var that = this;
        var navElements = this.navElements;
        slice.call(navElements).forEach(function (ele) {
            ele.addEventListener('click', function (e) {
                var id = this.getAttribute('href'),
                    section = d.querySelector('#' + id),
                    top = section.getBoundingClientRect().top + w.pageYOffset,
                    whereToGo = (top < that.headerHeight) ? 0 : top - that.headerHeight;
                Velocity(d.documentElement, 'scroll', { offset: whereToGo+'px', duration:700, mobileHA: false });    
                e.preventDefault();
            }, false);
        });
        
        w.addEventListener('scroll', function (e) {
            if(timer !== null) {
                w.clearTimeout(timer);        
            }
            timer = w.setTimeout(function() {
                slice.call(that.sections).forEach(function (ele) {
                    var elementReturned = that.isScrolledIntoView(ele),
                        id,
                        navElement;
                    if(elementReturned) {
                        that.removeClass(navElements, 'active');
                        id = elementReturned.getAttribute('id');
                        navElement = d.querySelector("[href="+id+"]");
                        navElement.classList.add('active');
                    }
                });
            }, 85);
        });
    };
    
    Main.prototype.slideShow = function () {
        var that = this,
            running = false,
            currentSlideIndex,
            currentSlide = null,
            newSlide = null,
            newSlideIndex = null,
            mode = null,
            slides = that.slides,
            numSlides = slides.length;
            
        function animateSlides (newMode) {
            if (running) {
                return false;
            }
            running = true;
            mode = newMode;
            setTargets(newMode);
            
            //set staging position
            newSlide.style.left = mode === 'prev' ? '-100%' : '100%';
            currentSlide.style.left = '0%';
            newSlide.classList.remove("inactive");

            //begins both animations
            animate(newSlide);
            animate(currentSlide);
	   }
        
        function setTargets() {
		// get the index of the next slide. hard reset to 0 or numSlides (-1) so slideshow can loop back
            if (mode === "prev") {
                newSlideIndex = slides[currentSlideIndex - 1] === undefined ? (numSlides - 1) : currentSlideIndex - 1;
            } else {
                newSlideIndex = slides[currentSlideIndex + 1] === undefined ? 0 : currentSlideIndex + 1;
            }
            
            that.slideShowHeader.innerHTML = (newSlideIndex >= that.workSlidesLength) ? "Projects" : "Work";
            currentSlide = slides[currentSlideIndex];
            newSlide = slides[newSlideIndex];
	   }
        
        function animate(slide) {
            var left = parseInt(slide.style.left);
            var duration = 500,  
                end = Date.now() + duration,
                draw = function (time) {
                    var current = Date.now(),
                        remaining = end - current;
                    
                    if(remaining < 0) {
                        currentSlide.classList.add('inactive');
                        newSlide.style.left = '0%';
                        currentSlideIndex = newSlideIndex;	
                        running = false;
                        return;
                    } else {
                      var rate = 1 - remaining/duration;
                      slide.style.left = mode === 'prev' ? left + (rate * 100 )  + "%"  : left - (rate * 100 )  + "%";
                    }

                    w.requestAnimationFrame(draw);            
                };
            draw();
       }
        
        function addRemoveClasses (index) {
           currentSlideIndex = index;
           that.slideShowHeader.innerHTML = (index > 7 ) ? "Projects" : "Work";
           that.addClass(slides, 'inactive');
           that.removeClass(slides[index], 'inactive');
           that.addClass(that.overlay, 'open');
           that.removeClass(that.overlayContainer, 'hide').removeClass(that.closeButton, 'hide');
        }
        
        slice.call(this.triggers).forEach(function (trigger) {
           var index;
           trigger.addEventListener('click', function (e) {
               index = Array.prototype.indexOf.call(that.triggers,e.target);
               addRemoveClasses(index);
               if (!that.triggered) {
                    that.triggered = true;
                    that.prevArrow.addEventListener('click', function () {
                        animateSlides('prev');
                    });
                    that.nextArrow.addEventListener('click', function () {
                        animateSlides('next');
                    });
               }
               e.preventDefault();
           }, false); 
        }); 
            
    };
    
    Main.prototype.close = function () {
        var that = this;
        this.closeButton.addEventListener('click', function () {
            that.removeClass(that.overlay, 'open').removeClass(that.slides, 'inactive', 'style');
            that.addClass(that.overlayContainer, 'hide').addClass(this, 'hide');
        }, false);
    };
    
    main = new Main();
    main.navigation();
    main.slideShow();
    main.close();
        
}(window, document));