<template>
  <div className="mapContainer">
    <div id="map"></div>
    <div className="pannel">
      <a-input-search
        v-model:value="address"
        placeholder="请输入地址"
        style="width: 200px;"
        @search="onSearch"
      />
    </div>
  </div>
</template>

<script>
import {reactive, ref, getCurrentInstance, onMounted, onUnmounted} from 'vue';

export default {
  setup(props, {emit}) {
    const mapRef = ref(null);
    const marketsRef = ref(null);
    const address = ref('');

    const initMap = (lat = 0.0, lng = 0.0) => {
      // 定义地图中心点坐标-
      const center = new TMap.LatLng(lat, lng);
      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      const map = new TMap.Map(document.getElementById('map'), {
        center, // 设置地图中心点坐标
        zoom: 15, // 设置地图缩放级别
        viewMode: '2D',
      });
      const markets = new TMap.MultiMarker({
        map,
        geometries: [],
      });
      // 绑定点击事件
      map.on('click', (evt) => {
        const location = new TMap.LatLng(evt.latLng.lat, evt.latLng.lng);
        map.setCenter(location);
        markets.setGeometries([]);
        geocoder.getAddress({location}).then((res) => {
          const result = res.result;
          markets.updateGeometries([
            {
              id: 'main',
              position: location,
            },
          ]);
          choose({
            latitude: location.lat,
            longitude: location.lng,
            ...result.address_component,
            address: result.address,
          });
        });
      });
      mapRef.value = map;
      marketsRef.value = markets;
    };

    const geocoder = new TMap.service.Geocoder(); // 新建一个正逆地址解析类

    onMounted(() => {
      initMap(39.916527, 116.397128);
    });
    onUnmounted(() => {
      mapRef.value.destroy()
    })

    const onSearch = (searchValue) => {
      console.log(searchValue);
      marketsRef.value.setGeometries([]);
      geocoder.getLocation({address: searchValue}).then((res) => {
        const result = res.result;
        marketsRef.value.updateGeometries([
          {
            id: 'main',
            position: result.location,
          },
        ]);
        mapRef.value.setCenter(result.location);
        choose({
          latitude: result.location.lat,
          longitude: result.location.lng,
          ...result.address_components,
          address: searchValue,
        });
      });
    };

    const choose = (obj) => {
      emit('finish', obj);
    };

    return {
      mapRef,
      marketsRef,
      address,
      onSearch,
    };
  },
};
</script>

<style lang="less" scoped>
#map {
  width: 100%;
  height: 300px;
}

.mapContainer {
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 25px;
  width: 80%;
  position: relative;
}

.pannel {
  position: absolute;
  background-color: #fff;
  padding: 10px;
  z-index: 10086;
  left: 20px;
  top: 20px;
}
</style>
