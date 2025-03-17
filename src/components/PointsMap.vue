<template>
  <div id="map" style="height: 100%; width: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { usePointStore } from 'src/stores/pointStore';
import 'leaflet/dist/leaflet.css';
import type { Point } from 'src/models/point';
import { LeafletMap } from 'src/models/map';
import { storeToRefs } from 'pinia';

let leafletMap: LeafletMap | null = null;
const mapId = 'map';
const tileLayerUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const initialLatitude = 63.25;
const initialLongitude = 72.15;
const initialZoom = 6;

const pointStore = usePointStore();
const { currentPoint } = storeToRefs(pointStore);

const getTooltipContent = (point: Point) => {
  return `
    <div class="tool-tip">
      <div class="tool-tip__block">
        <img class="tool-tip__icon" src="map-marker-radius.svg" width="16" height="16"/>
        Точка №${point.id} (${point.code})
      </div>      
      <div class="tool-tip__block">
        <img class="tool-tip__icon" src="map-marker.svg" width="16" height="16"/>
        ${point.address}
      </div>
      <div class="tool-tip__block">
        <img class="tool-tip__icon" src="office-building.svg" width="16" height="16"/>
        ${point.company}
      </div>
    </div>
  `;
};

watch([() => pointStore.filteredPoints, currentPoint], () => {
  if (leafletMap?.map) {
    leafletMap.updateMarkers(pointStore.filteredPoints, currentPoint, getTooltipContent);

    if (currentPoint.value) {
      if (currentPoint.value?.calledFromList) {
        currentPoint.value.calledFromList = false;
        leafletMap?.map.panTo([currentPoint.value.x, currentPoint.value.y]);
      }
    }
  }
});

onMounted(() => {
  leafletMap = new LeafletMap(mapId, tileLayerUrl, attribution);

  leafletMap.initMap(
    currentPoint.value?.x ?? initialLatitude,
    currentPoint.value?.y ?? initialLongitude,
    initialZoom,
  );
  leafletMap.updateMarkers(pointStore.filteredPoints, currentPoint, getTooltipContent);
});
</script>

<style lang="scss">
.tool-tip__block {
  display: flex;
  align-items: center;
  gap: 3px;
  line-height: 1.8;
}
</style>
