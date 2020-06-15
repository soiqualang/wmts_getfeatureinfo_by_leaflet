function getFeatureInfo(evt) {
	console.log(evt);
	var url = getFeatureInfoUrl(evt);
	console.log(url);
	var showResults = L.Util.bind(this.showGetFeatureInfo, this);
	$.ajax({
		url: 'https://api.dothanhlong.org/proxy.php?url='+encodeURIComponent(url),
	  success: function (data, status, xhr) {
		var err = typeof data === 'string' ? null : data;
		showResults(err, evt.latlng, data);
	  },
	  error: function (xhr, status, error) {
		showResults(error);  
	  }
	});
}

function getFeatureInfoUrl(evt) {
	t3=evt;
	latlng=evt.latlng;
	var point = map.latLngToContainerPoint(latlng, map.getZoom());
	var size = map.getSize();
	var height=size.y;
	height=Math.round(size.y);
	var width=size.x;
	width=Math.round(width);
	
	//console.table(height,width);
	
	/* var params = {
	  VERSION: '1.0.0',
	  LAYER: 'thuadat:view_duynghia_4326',
	  STYLE: '',
	  TILEMATRIX: 'EPSG:900913:14',
	  TILEMATRIXSET: 'EPSG:900913',
	  SERVICE: 'WMTS',      
	  FORMAT: 'image/png',
	  REQUEST: 'GetFeatureInfo',
	  INFOFORMAT: 'application/json',
	  TileCol: tilecol,
	  TileRow: tilerow,	  
	  I: Math.round(width),
	  J: Math.round(height)
	};	 */
	
	var params = {
	  request: 'GetFeatureInfo',
	  service: 'WMS',
	  srs: 'EPSG:4326',
	  styles: '',
	  transparent: 'true',
	  version: '1.1.1',
	  format: 'image/png',
	  bbox: map.getBounds().toBBoxString(),
	  height: Math.round(height),
	  width: Math.round(width),
	  layers: 'thuadat:view_duynghia_4326',
	  query_layers: 'thuadat:view_duynghia_4326',
	  info_format: 'application/json'
	};
	
	params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
	
	return wms_service + L.Util.getParamString(params, wms_service, true);
}

function showGetFeatureInfo(err, latlng, content) {
	if (err) { console.log(err); return; } // do nothing if there's an error

	content=JSON.parse(content);
	console.log(content);
	t1=content;

	var diachi=t1.features[0].properties.diachi;
	var dientich=t1.features[0].properties.dientich;
	var loaidat=t1.features[0].properties.mdsd;
	var tenchu=t1.features[0].properties.tenchusdd;
	var soto=t1.features[0].properties.shbando;
	var sothua=t1.features[0].properties.shthua;
	var img_path=t1.features[0].properties.img_path;

	var noidung='';
	noidung+='<h2>Thông tin thửa đất</h2>';
	noidung+='<hr>';
	noidung+='<b>Số tờ</b>: '+soto+'<br>';
	noidung+='<b>Số thửa</b>: '+sothua+'<br>';
	noidung+='<b>Tên chủ</b>: '+tenchu+'<br>';
	noidung+='<b>Loại đất</b>: '+loaidat+'<br>';
	noidung+='<b>Địa chỉ</b>: '+diachi+'<br>';
	
	L.popup({ maxWidth: 800})
	  .setLatLng(latlng)
	  .setContent(noidung)
	  .openOn(map);
}