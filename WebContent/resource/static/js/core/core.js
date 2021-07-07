
/**
 * @author joe 2014.04.21
 * @version 1.1
 */

if(!RTU){var RTU=function(){var e={},d="core";e[d]={};var f=e[d];f.register=function(m,l){if(typeof m!="string"){return !1}var k=m.split("."),b=null;h=e;while(b=k.shift()){if(k.length){h[b]===undefined&&(h[b]={});h=h[b]}else{try{h[b]=l();return !0}catch(a){console.log(a)}}}return !1};f.unRegister=function(j){var i=j.split("."),b=e,a=null;while(a=i.shift()){if(i.length){if(b[a]===undefined){return !1}b=b[a]}else{if(b[a]!==undefined){delete b[a];return !0}}}return !1};f.invoke=function(l,k){var b=e,i=l.split(".");while(h=i.shift()){if(i.length){if(b[h]===undefined){return !1}b=b[h]}else{if(b[h]!==undefined){try{return b[h](k)}catch(a){console.log(a)}}}}return !1};return f}()}RTU.register("core.utils.log",function(){return function(a){console.log(a)}});RTU.DEFINE=define;RTU.USE=seajs.use;






