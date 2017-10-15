define(function(){"use strict";var t=function(t){var e,n;e=Array.prototype.forEach,n=Array.prototype.map,this.each=function(t,n,r){if(null!==t)if(e&&t.forEach===e)t.forEach(n,r);else if(t.length===+t.length){for(var i=0,a=t.length;i<a;i++)if(n.call(r,t[i],i,t)==={})return}else for(var o in t)if(t.hasOwnProperty(o)&&n.call(r,t[o],o,t)==={})return},this.map=function(t,e,r){var i=[];return null==t?i:n&&t.map===n?t.map(e,r):(this.each(t,function(t,n,a){i[i.length]=e.call(r,t,n,a)}),i)},"object"==typeof t?(this.hasher=t.hasher,this.screen_resolution=t.screen_resolution,this.screen_orientation=t.screen_orientation,this.canvas=t.canvas,this.ie_activex=t.ie_activex):"function"==typeof t&&(this.hasher=t)};return t.prototype={get:function(){var t=[];if(t.push(navigator.userAgent),t.push(navigator.language),t.push(screen.colorDepth),this.screen_resolution){var e=this.getScreenResolution();void 0!==e&&t.push(e.join("x"))}return t.push((new Date).getTimezoneOffset()),t.push(this.hasSessionStorage()),t.push(this.hasLocalStorage()),t.push(!!window.indexedDB),document.body?t.push(typeof document.body.addBehavior):t.push("undefined"),t.push(typeof window.openDatabase),t.push(navigator.cpuClass),t.push(navigator.platform),t.push(navigator.doNotTrack),t.push(this.getPluginsString()),this.canvas&&this.isCanvasSupported()&&t.push(this.getCanvasFingerprint()),this.hasher?this.hasher(t.join("###"),31):this.murmurhash3_32_gc(t.join("###"),31)},murmurhash3_32_gc:function(t,e){var n,r,i,a,o,s,h,c;for(n=3&t.length,r=t.length-n,i=e,o=3432918353,s=461845907,c=0;c<r;)h=255&t.charCodeAt(c)|(255&t.charCodeAt(++c))<<8|(255&t.charCodeAt(++c))<<16|(255&t.charCodeAt(++c))<<24,++c,i=27492+(65535&(a=5*(65535&(i=(i^=h=(65535&(h=(h=(65535&h)*o+(((h>>>16)*o&65535)<<16)&4294967295)<<15|h>>>17))*s+(((h>>>16)*s&65535)<<16)&4294967295)<<13|i>>>19))+((5*(i>>>16)&65535)<<16)&4294967295))+((58964+(a>>>16)&65535)<<16);switch(h=0,n){case 3:h^=(255&t.charCodeAt(c+2))<<16;case 2:h^=(255&t.charCodeAt(c+1))<<8;case 1:i^=h=(65535&(h=(h=(65535&(h^=255&t.charCodeAt(c)))*o+(((h>>>16)*o&65535)<<16)&4294967295)<<15|h>>>17))*s+(((h>>>16)*s&65535)<<16)&4294967295}return i^=t.length,i^=i>>>16,i=2246822507*(65535&i)+((2246822507*(i>>>16)&65535)<<16)&4294967295,i^=i>>>13,i=3266489909*(65535&i)+((3266489909*(i>>>16)&65535)<<16)&4294967295,(i^=i>>>16)>>>0},hasLocalStorage:function(){try{return!!window.localStorage}catch(t){return!0}},hasSessionStorage:function(){try{return!!window.sessionStorage}catch(t){return!0}},isCanvasSupported:function(){var t=document.createElement("canvas");return!(!t.getContext||!t.getContext("2d"))},isIE:function(){return"Microsoft Internet Explorer"===navigator.appName||!("Netscape"!==navigator.appName||!/Trident/.test(navigator.userAgent))},getPluginsString:function(){return this.isIE()&&this.ie_activex?this.getIEPluginsString():this.getRegularPluginsString()},getRegularPluginsString:function(){return this.map(navigator.plugins,function(t){var e=this.map(t,function(t){return[t.type,t.suffixes].join("~")}).join(",");return[t.name,t.description,e].join("::")},this).join(";")},getIEPluginsString:function(){if(window.ActiveXObject){var t=["ShockwaveFlash.ShockwaveFlash","AcroPDF.PDF","PDF.PdfCtrl","QuickTime.QuickTime","rmocx.RealPlayer G2 Control","rmocx.RealPlayer G2 Control.1","RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)","RealVideo.RealVideo(tm) ActiveX Control (32-bit)","RealPlayer","SWCtl.SWCtl","WMPlayer.OCX","AgControl.AgControl","Skype.Detection"];return this.map(t,function(t){try{return new ActiveXObject(t),t}catch(t){return null}}).join(";")}return""},getScreenResolution:function(){return this.screen_orientation?screen.height>screen.width?[screen.height,screen.width]:[screen.width,screen.height]:[screen.height,screen.width]},getCanvasFingerprint:function(){var t=document.createElement("canvas"),e=t.getContext("2d"),n="http://valve.github.io";return e.textBaseline="top",e.font="14px 'Arial'",e.textBaseline="alphabetic",e.fillStyle="#f60",e.fillRect(125,1,62,20),e.fillStyle="#069",e.fillText(n,2,15),e.fillStyle="rgba(102, 204, 0, 0.7)",e.fillText(n,4,17),t.toDataURL()}},t});