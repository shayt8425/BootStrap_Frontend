//RTU.DEFINE(function (require, exports) {
/////**
//// * 模块名：股道等后台切图
//// * name：
//// * date:2015-2-12
//// * version:1.0 
//// */
//	require("app/home/app-map.js");
////
//    window.gudaoLayer = null; //股道图层
//    window.gudaoDisLayer = null; //省份边界图层
//    window.daochaLayer = null; //道岔图层
//    window.telesemeLayer = null; //信号机图层
//    window.telesemeNameLayer = null; //信号机名称图层
//    window.railWayElectronicfence=null;  //电子围栏图层
////
////    //股道控制模块
////
////    //加载铁路数据的地图
////    RTU.register("map.addLayer", function () {
////        return function (data) {
////            setTimeout(function () {
////                if (!data || !data.url) {
////                    Map.addLayer("../railWay/railWay?r=" + new Date().getTime() + "path=");
////                } else {
////                    Map.addLayer(data.url);
////                }
////            }, 25);
////        };
////    });
////    //--------------------添加各种图层---------------------------------------------------------------------------------- 
//    //添加股道图层
//    RTU.register("map.GuDao", function () {
//        return function () {
//            setTimeout(function () {
//                //            	ToolManager.addScale(10, null, null, 23);
//                var url = "";
//
//                url = "../railWay/railWay?r=" + new Date().getTime() + "&path=";
//                if (window.gudaoLayer) {
//                    Map.removeLayer(window.gudaoLayer);
//                }
//                window.gudaoLayer = Map.addLayer(url);
//                window.gudaoLayer.Div.div.style.zIndex = -1;
//            }, 25);
//        };
//    });
////
//    //添加省份边界图层
//    RTU.register("map.GuDaoDis", function () {
//        return function () {
//            setTimeout(function () {
//                if (window.gudaoDisLayer) {
//                    Map.removeLayer(window.gudaoDisLayer);
//                }
//                window.gudaoDisLayer = Map.addLayer("../railWay/railWayDis?r=" + new Date().getTime() + "&path=");
//                window.gudaoDisLayer.Div.div.style.zIndex = -100;
//            }, 25);
//        };
//    });
////
////    //添加车站图层
////    RTU.register("map.railwayStations", function () {
////        return function () {
////            setTimeout(function () {
////                var url = "../railWay/railWayStation?r=" + new Date().getTime() + "&setMapShowModel=" + window.userData["SetMapShowModel"] + "&path=";
////                if (window.stationLayer) {
////                    Map.removeLayer(window.stationLayer);
////                    window.stationLayer = null;
////                }
////                window.stationLayer = Map.addLayer(url);
////                window.stationLayer.Div.div.style.zIndex = 30;
////            }, 25);
////        };
////    });
////
////    RTU.invoke("map.railwayStations");
////    
////    
////  //添加电子围栏股道图层
////    RTU.register("map.railWayElectronicfence", function () {
////        return function () {
////        	var NowMapLevel = RTU.invoke("map.getNowMapLevel");
////        	if(NowMapLevel>8){
////	            setTimeout(function () {
////	                var url = "../railWay/railWayElectronicfence?r=" + new Date().getTime() + "&path=";
////	                if (window.railWayElectronicfence) {
////	                    Map.removeLayer(window.railWayElectronicfence);
////	                    window.railWayElectronicfence = null;
////	                }
////	                window.railWayElectronicfence = Map.addLayer(url);
////	                window.railWayElectronicfence.Div.div.style.zIndex = 300;
////	            }, 100);
////        	}
////
////        };
////    });
////
//////    RTU.invoke("map.railWayElectronicfence");
////
////    //添加信号机图层
////    RTU.register("map.railWaySign", function () {
////        return function () {
////            setTimeout(function () {
////                if (window.telesemeLayer) {
////                    Map.removeLayer(window.telesemeLayer);
////                    window.telesemeLayer = null;
////                }
////                window.telesemeLayer = Map.addLayer("../railWay/railWaySign?r=" + new Date().getTime() + "&path=");
////                window.telesemeLayer.Div.div.style.zIndex = 20;
////            }, 25);
////        };
////    });
////    //添加信号机名图层
////    RTU.register("map.railWaySignName", function () {
////        return function () {
////            setTimeout(function () {
////                if (window.telesemeNameLayer) {
////                    Map.removeLayer(window.telesemeNameLayer);
////                    window.telesemeNameLayer = null;
////                }
////                window.telesemeNameLayer = Map.addLayer("../railWay/railWaySignName?r=" + new Date().getTime() + "&path=");
////                window.telesemeNameLayer.Div.div.style.zIndex = 20;
////            }, 25);
////        };
////    });
////
////
////    //添加道岔图层
////    RTU.register("map.railWayPoi", function () {
////        return function () {
////            setTimeout(function () {
////                if (window.daochaLayer) {
////                    Map.removeLayer(window.daochaLayer);
////                    window.daochaLayer = null;
////                }
////                window.daochaLayer = Map.addLayer("../railWay/railWayPoi?r=" + new Date().getTime() + "&path=");
////                window.daochaLayer.Div.div.style.zIndex = 10;
////            }, 25);
////        };
////    });
////
////    //--------------------移除各种图层----------------------------------------------------------------------------------     
////    //移除省份边界
//    RTU.register("map.removeLayer.gudaoDis", function () {
//        return function () {
//            Map.removeLayer(window.gudaoDisLayer);
//            window.gudaoDisLayer = null;
//        };
//    });
////    //移除信号机名图层
////    RTU.register("map.remove.railWaySignName", function () {
////        return function () {
////            setTimeout(function () {
////                //           ToolManager.addScale(10, null, null, 23);
////                if (window.telesemeNameLayer) {
////                    Map.removeLayer(window.telesemeNameLayer);
////                    window.telesemeNameLayer = null;
////                }
////            }, 25);
////        };
////    });
////
////    //移除信号机图层
////    RTU.register("map.remove.railWaySign", function () {
////        return function () {
////            setTimeout(function () {
////                if (window.telesemeLayer) {
////                    Map.removeLayer(window.telesemeLayer);
////                    window.telesemeLayer = null;
////                }
////            }, 25);
////        };
////    });
////
////    //移除道岔图层
////    RTU.register("map.remove.railWayPoi", function () {
////        return function () {
////            setTimeout(function () {
////                if (window.daochaLayer) {
////                    Map.removeLayer(window.daochaLayer);
////                    window.daochaLayer = null;
////                }
////            }, 25);
////        };
////    });
////    //--------------------移除各种图层----------------------------------------------------------------------------------     
////
////    /***股道编号**begin************************************************************************************************************/
////    /*股道编号*/
////    {
////        //股道编号的数据
////        function guDaoNumberData() {
////            var guDaoNumber = [{ initLng: 116.00478906250001, initLat: 29.703138671874996, name: "1" }, { initLng: 116.00466015625001, initLat: 29.702974609374998, name: "2" }, { initLng: 116.00459765625001, initLat: 29.702755859374996, name: "Ⅲ" },
////  	    	                 { initLng: 116.00467968750002, initLat: 29.702748046874998, name: "Ⅳ" }, { initLng: 116.00464062500001, initLat: 29.702662109374998, name: "Ⅴ" }, { initLng: 116.00451953125001, initLat: 29.702505859374998, name: "6" },
////  	    	                 { initLng: 116.00458359375002, initLat: 29.702447265624997, name: "7" }, { initLng: 116.00473828125001, initLat: 29.702423828124996, name: "8" }, { initLng: 116.00465234375001, initLat: 29.702185546874997, name: "9" },
////  	    	                 { initLng: 116.00466406250001, initLat: 29.702126953124996, name: "10" }, { initLng: 116.00460937500002, initLat: 29.701935546874996, name: "Ⅺ" }, { initLng: 116.00452343750001, initLat: 29.701818359374997, name: "Ⅻ" }, //九江火车站
////  	    	                 {initLng: 115.91919531250002, initLat: 28.663068359374993, name: "1" }, { initLng: 115.91924218750002, initLat: 28.662876953124993, name: "Ⅱ" }, { initLng: 115.91929296875001, initLat: 28.662806640624993, name: "3" },
////  	    	                 { initLng: 115.91941796875001, initLat: 28.662634765624993, name: "4" }, { initLng: 115.91946875000002, initLat: 28.662595703124992, name: "5" }, { initLng: 115.91951562500002, initLat: 28.662513671874994, name: "6" },
////  	    	                 { initLng: 115.91962109375002, initLat: 28.662525390624992, name: "7" }, { initLng: 115.91968750000002, initLat: 28.662318359374993, name: "8" }, { initLng: 115.91982812500002, initLat: 28.662302734374993, name: "9" },
////  	    	                 { initLng: 115.91987890625002, initLat: 28.662123046874996, name: "Ⅹ" }, { initLng: 115.91914062500001, initLat: 28.664259765624994, name: "11" }, { initLng: 115.91908593750001, initLat: 28.664494140624996, name: "12" },
////  	    	                 { initLng: 115.91901562500001, initLat: 28.664583984374993, name: "13" }, { initLng: 115.91895312500002, initLat: 28.664650390624995, name: "14" }, { initLng: 115.91895703125002, initLat: 28.666080078124995, name: "15" },
////  	    	                 { initLng: 115.91977343950001, initLat: 28.664896484374992, name: "检1" }, { initLng: 115.91986328125, initLat: 28.665185546874994, name: "检2" }, { initLng: 115.9199375, initLat: 28.665267578124993, name: "检3" },
////  	    	                 { initLng: 115.92003125000001, initLat: 28.665306640624994, name: "检4" }, { initLng: 115.92013281250001, initLat: 28.66548632812499, name: "检5" }, //南昌火车站
////  	    	                 {initLng: 115.91887812499999, initLat: 28.650236328124986, name: "2" }, { initLng: 115.91893281249999, initLat: 28.650244140624988, name: "3" }, { initLng: 115.91901093749999, initLat: 28.650244140624988, name: "4" },
////  	    	                 { initLng: 115.91906853124999, initLat: 28.65030273437499, name: "5" }, { initLng: 115.91916328125, initLat: 28.65045898437499, name: "6" }, { initLng: 115.91887812499999, initLat: 28.647951171874986, name: "7" },
////  	    	                 { initLng: 115.91891328125, initLat: 28.647826171874986, name: "8" }, { initLng: 115.91927656249999, initLat: 28.64706445312987, name: "9" }, { initLng: 115.91933125, initLat: 28.64702145437499, name: "10" },
////  	    	                 { initLng: 115.91939375, initLat: 28.64705664062499, name: "11" }, { initLng: 115.91947578125, initLat: 28.64736914061599, name: "12" }, { initLng: 115.91989765625, initLat: 28.650470703124988, name: "13" },
////  	    	                 { initLng: 115.91993671875, initLat: 28.650560546874985, name: "14" }, { initLng: 115.91835859375, initLat: 28.647130859374986, name: "15" }, { initLng: 115.91843671875, initLat: 28.647177734374985, name: "16" },
////  	    	                 { initLng: 115.91855390625, initLat: 28.647205078124987, name: "17" }, { initLng: 115.9186203125, initLat: 28.647275390624984, name: "18" }, { initLng: 115.91867109374999, initLat: 28.647314453124984, name: "19" },
////  	    	                 { initLng: 115.91871015625, initLat: 28.647396484374987, name: "20" }, { initLng: 115.9187609375, initLat: 28.647416015624984, name: "21" }, { initLng: 115.91883125, initLat: 28.647927734374985, name: "22" },
////  	    	                 { initLng: 115.9188484375, initLat: 28.645256640624993, name: "23" }, { initLng: 115.91887968750001, initLat: 28.645518359374993, name: "24" }, { initLng: 115.91893528125, initLat: 28.64505742187499, name: "25" },
////  	    	                 { initLng: 115.91868437500001, initLat: 28.64430742187499, name: "26" }, { initLng: 115.91884453125002, initLat: 28.644295703124993, name: "27" }, { initLng: 115.91879375, initLat: 28.64524492187499, name: "28" },
////  	    	                 { initLng: 115.91954375, initLat: 28.64598320312499, name: "29" }, { initLng: 115.919621875, initLat: 28.64574492187499, name: "30" }, { initLng: 115.919676765625, initLat: 28.64551835937499, name: "31" },
////  	    	                 { initLng: 115.91965703125001, initLat: 28.64529179687499, name: "32" }, { initLng: 115.91956718750001, initLat: 28.64490117187499, name: "33" }, { initLng: 115.91894921875, initLat: 28.644170312499988, name: "34" },
////  	    	                 { initLng: 115.91892421875, initLat: 28.64418906249999, name: "35" }, { initLng: 115.91932734374998, initLat: 28.65187695312499, name: "36" }, { initLng: 115.91955781249999, initLat: 28.65084960937499, name: "37" },
////  	    	                 { initLng: 115.91921406249999, initLat: 28.647158203124988, name: "38" }, { initLng: 115.91932890625, initLat: 28.64549882812499, name: "39" }, { initLng: 115.91831328125001, initLat: 28.64323710937499, name: "40"}]; //南昌机务段
////            return guDaoNumber;
////        }
////        //在地图上添加股道编号
////        RTU.register("map.showGuDaoNumberData", function () {
////            return function () {
////                var guDaoNumArr = guDaoNumberData();
////                for (var i = 0; i < guDaoNumArr.length; i++) {
////                    RTU.invoke("map.marker.addMarker", {
////                        isSetCenter: true,
////                        TIPSID: "id",
////                        tabHeight: 600,
////                        iconWidth: 1,
////                        iconHeight: 1,
////                        pointType: "guDaoNumber",
////                        tabHtml: "<div style='width:200px'>12</div>",
////                        pointData: { longitude: guDaoNumArr[i].initLng, latitude: guDaoNumArr[i].initLat, id: guDaoNumArr[i].name },
////                        setDataSeft: false,
////                        closeFn: function () {
////                        },
////                        rightHand: function (obj) {
////                        }
////                    });
////                }
////            };
////        });
////        //股道编号的div
////        RTU.register("app.addGuDaoNumber", function () {
////            return function (point) {
////                $(point.Icon).before('<div class="guDaoNumberDiv"  >' + point.obj.pointData.id + '</div>');
////            };
////        });
////        //控制股道编号的显示
////        var tagsetGuDaoNumberDiv = true;
////        RTU.register("map.setGuDaoNumberDiv", function () {
////            return function (data) {
////                if (Map.Level >= 14 && tagsetGuDaoNumberDiv == true) {
////                    tagsetGuDaoNumberDiv = false;
////                    $(".guDaoNumberDiv").show();
////                } else if (Map.Level < 14 && tagsetGuDaoNumberDiv == false) {
////                    tagsetGuDaoNumberDiv = true;
////                    $(".guDaoNumberDiv").hide();
////                }
////            };
////        });
////    }
////    /***股道编号**end************************************************************************************************************/
////
////    /******股道和省份边界显示设置**begin***************************************************************/
////    //在进入系统时，显示股道，并判断是否显示省份边界图层
//    RTU.register("app.firstLoad.show", function () {
//        return function (data) {
//            if (!data) {
//                data = window.userData["SetMapShowModel"];
//            }
//            var notMapShowModelArr = "";
//            if (window.userData["SetNotMapShowModel"]) {
//                notMapShowModelArr = window.userData["SetNotMapShowModel"].split(",");
//            }
//            var notMapshowGudaoDis = false;
//            var MapshowGudaoDis = false;
//            $.each(notMapShowModelArr, function (i, n) {
//                if (n == "0") {
//                    notMapshowGudaoDis = true; //在股道地图时，显示省份边界
//                }
//                if (n == "1") {
//                    MapshowGudaoDis = true; //在正常地图时，显示省份边界
//                }
//            });
//          
//            if (data == "1") {//在股道地图时
//             RTU.invoke("map.GuDao", {});
//                if (!notMapshowGudaoDis) {
//                    RTU.invoke("map.removeLayer.gudaoDis");
//                } else {
//                    if (!window.gudaoDisLayer) {
//                        RTU.invoke("map.GuDaoDis");
//                    }
//                }
//            } else {//在正常地图时
//            	 if (window.gudaoLayer) {
//                     Map.removeLayer(window.gudaoLayer);
//                 }
//                if (!MapshowGudaoDis) {
//                    RTU.invoke("map.removeLayer.gudaoDis");
//                } else {
//                    if (!window.gudaoDisLayer) {
//                        RTU.invoke("map.GuDaoDis");
//                    }
//                }
//            }
//        };
//    });
////    // map.marker.removeMarker
//    RTU.invoke("app.firstLoad.show");
////    /******股道和省份边界显示设置**end***************************************************************/
////
////    /******信号机和道岔显示设置**begin***************************************************************/
////    //判断是否显示信号机图层
////    RTU.register("app.firstLoad.showTeleseme", function () {
////        return function () {
////            if (window.userData["telesemeIconDefault"] == "show" && Map.Level >= window.publicData["Signal"]) {
////                RTU.invoke("map.railWaySign");
////                if (window.userData["telesemeNameDefault"] == "show") {
////                    RTU.invoke("map.railWaySignName");
////                } else {
////                    RTU.invoke("map.remove.railWaySignName");
////                }
////            } else {
////                RTU.invoke("map.remove.railWaySign");
////                RTU.invoke("map.remove.railWaySignName");
////            }
////        };
////    });
////
////    //判断是否显示道岔图层
////    RTU.register("app.firstLoad.showDaocha", function () {
////        return function () {
////            if (window.userData["turnoutIconDefault"] == "show" && Map.Level >= window.publicData["DaoCha"]) {
////                RTU.invoke("map.railWayPoi");
////            } else {
////                RTU.invoke("map.remove.railWayPoi");
////            }
////        };
////    });
////    RTU.invoke("app.firstLoad.showTeleseme");
////    RTU.invoke("app.firstLoad.showDaocha");
////    RTU.invoke("map.railwayStations");
////    /******信号机和道岔显示设置**end***************************************************************/
////
////    /**************每五秒判断各种版本号是否改变，是否需要刷新图层***begin**************************/
////    var gudaoParmChangeFn = function () {
////
////        var GuDaoVersion = window.loadData["GuDaoVersion"];
////        var StationVersion = window.loadData["StationVersion"];
////        var DisVersion = window.loadData["DisVersion"];
////        var SignVersion = window.loadData["SignVersion"];
////        var PoiVersion = window.loadData["PoiVersion"];
////        var ElectronicVersion = window.loadData["ElectronicVersion"];
////        function GuDaoVersionFn(GuDaoVersionT, Fn) {
////            if (GuDaoVersion != GuDaoVersionT) {
////                GuDaoVersion = GuDaoVersionT;
////                if (Fn) {
////                    Fn();
////                };
////            };
////        }
////        function StationVersionFn(StationVersionT, Fn) {
////            if (StationVersion != StationVersionT) {
////                StationVersion = StationVersionT;
////                if (Fn) {
////                    Fn();
////                };
////            };
////        }
////        function DisVersionFn(DisVersionT, Fn) {
////            if (DisVersion != DisVersionT) {
////                DisVersion = DisVersionT;
////                if (Fn) {
////                    Fn();
////                };
////            };
////        }
////        function SignVersionFn(SignVersionT, Fn) {
////            if (SignVersion != SignVersionT) {
////                SignVersion = SignVersionT;
////                if (Fn) {
////                    Fn();
////                };
////            };
////        }
////        function PoiVersionFn(PoiVersionT, Fn) {
////            if (PoiVersion != PoiVersionT) {
////                PoiVersion = PoiVersionT;
////                if (Fn) {
////                    Fn();
////                };
////            };
////        }
////        function ElectronicVersionFn(ElectronicVersionT, Fn) {
////            if (ElectronicVersion != ElectronicVersionT) {
////            	ElectronicVersion = ElectronicVersionT;
////                if (Fn) {
////                    Fn();
////                };
////            };
////        }
////        return {
////            GuDaoVersionFn: GuDaoVersionFn,
////            StationVersionFn: StationVersionFn,
////            DisVersionFn: DisVersionFn,
////            SignVersionFn: SignVersionFn,
////            PoiVersionFn: PoiVersionFn,
////            ElectronicVersionFn:ElectronicVersionFn
////        };
////    };
////    var gparamchange = new gudaoParmChangeFn();
////    psModel.subscribe("refreshData", function (t, data, TotalData) {
////        gparamchange.GuDaoVersionFn(TotalData.version.GuDaoVersion, function () {
////            RTU.invoke("map.GuDao");
////            RTU.invoke("app.railwaydissertationdata.query.initData");
////            RTU.invoke("app.railwaydissertationdata.query.initAllData");
////        });
////        //刷新省份边界
////        gparamchange.DisVersionFn(TotalData.version.DisVersion, function () {
////            RTU.invoke("map.GuDaoDis");
////            RTU.invoke("app.railwaydissertationdata.query.initData");
////            RTU.invoke("app.railwaydissertationdata.query.initAllData");
////        });
////        gparamchange.StationVersionFn(TotalData.version.StationVersion, function () {
////            RTU.invoke("map.railwayStations");
////            RTU.invoke("app.railwaydissertationdata.query.initData");
////            RTU.invoke("app.railwaydissertationdata.query.initAllData");
////        });
////        gparamchange.DisVersionFn(TotalData.version.DisVersion, function () {
////            RTU.invoke("app.firstLoad.show");
////            RTU.invoke("app.railwaydissertationdata.query.initData");
////            RTU.invoke("app.railwaydissertationdata.query.initAllData");
////        });
////        gparamchange.SignVersionFn(TotalData.version.SignVersion, function () {
////            RTU.invoke("app.firstLoad.showTeleseme");
////            RTU.invoke("app.railwaydissertationdata.query.initData");
////            RTU.invoke("app.railwaydissertationdata.query.initAllData");
////        });
////        gparamchange.PoiVersionFn(TotalData.version.PoiVersion, function () {
////            RTU.invoke("app.firstLoad.showDaocha");
////            RTU.invoke("app.railwaydissertationdata.query.initData");
////            RTU.invoke("app.railwaydissertationdata.query.initAllData");
////        });        
////        gparamchange.ElectronicVersionFn(TotalData.version.ElectronicVersion, function () {
////            RTU.invoke("map.railWayElectronicfence");
////            RTU.invoke("app.railwaydissertationdata.query.initData");
////            RTU.invoke("app.railwaydissertationdata.query.initAllData");
////        });
////    });
////    /*****************每五秒判断各种版本号是否改变，是否需要刷新图层***end********************************/
//});