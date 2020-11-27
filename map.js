wms_service='https://geo.dothanhlong.org/geoserver/thuadat/wms?';

//Kieu tile map
//Cach 1 - kieu tile map mac dinh cua geoserver
wmts_service='https://geo.dothanhlong.org/geoserver/gwc/service/wmts?layer=thuadat:view_duynghia_4326&style=&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}';
//Cach 2 - format kieu slippy map tilenames
wmts_service_v2='https://geo.dothanhlong.org/geoserver/gwc/service/tms/1.0.0/thuadat:view_duynghia_4326@EPSG:900913@png/{z}/{x}/{-y}.png';

//Khai bao ban do nen
mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var mbAttr='basemap &copy; mapbox';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

var streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

var topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
	layers: 'TOPO-OSM-WMS'
});	


//Them ban do thua dat dang tiles map
//Cach 1
var duynghia_quangnam = new L.TileLayer(wmts_service, {
  continuousWorld: true,
  attribution: 'tiles &copy; <a href="https://dothanhlong.org">dothanhlong.org</a>',
});
//Cach 2
var duynghia_quangnam_v2 = new L.TileLayer(wmts_service_v2, {
  continuousWorld: true,
  attribution: 'tiles &copy; <a href="https://dothanhlong.org">dothanhlong.org</a>',
});

L.GridLayer.GridDebug = L.GridLayer.extend({
  createTile: function (coords) {
    const tile = document.createElement('div');
    tile.style.outline = '1px solid green';
    tile.style.fontWeight = 'bold';
    tile.style.fontSize = '14pt';
    tile.innerHTML = [coords.z, coords.x, coords.y].join('/');
	
    return tile;
  },
});

t1 = function (opts) {
  return new L.GridLayer.GridDebug(opts);
};

//map.addLayer(L.gridLayer.gridDebug());



//https://www.google.com/maps/@15.841183,108.3778039,14z
var map = L.map('map', {
	center: [15.841183, 108.3778039],
	zoom: 14,
	layers: [grayscale, duynghia_quangnam]
});

//Khai bao control layer
//Ban do nen
var baseLayers = {
	"Bản đồ Grayscale": grayscale,
	"Bản đồ Streets": streets
};

//Ban do chuyen de
var overlays = {		
	"Bản đồ Topo": topo,
	"Thửa đất (tiles type 1)": duynghia_quangnam,
	"Thửa đất (tiles type 2)": duynghia_quangnam_v2,
	"GIRD": t1()
};

L.control.layers(baseLayers, overlays).addTo(map);

//Thêm chức năng getinfo
map.on('click', function(e){
	getFeatureInfo(e);
	//var popLocation= e.latlng;
	//var popup = L.popup()
	//.setLatLng(popLocation)
	//.setContent('<p>Hello world!<br />This is a nice popup.</p>')
	//.openOn(map);
});



