<template>
  <q-toolbar>
    <q-toolbar-title>Точки</q-toolbar-title>
    <q-space />

    <q-btn
      icon="search"
      @click="showSearch = !showSearch"
      :color="showSearch ? 'primary' : 'grey'"
      round
      flat
    />
  </q-toolbar>

  <q-input v-if="showSearch" v-model="searchText" outlined label="Поиск точек" class="q-mb-md" />

  <div class="row items-center justify-between q-px-md">
    <div class="row items-center">
      <q-checkbox
        v-model="allPointsSelected"
        color="accent"
        keep-color
        :disable="!filteredPoints.length"
        @update:model-value="toggleSelectAll"
      >
        <div class="text-accent">Выбрать все</div>
      </q-checkbox>
      <span class="text-accent">({{ filteredPoints.length }})</span>
    </div>

    <div>
      <q-btn icon="mdi-brush-outline" flat round class="q-mr-sm" />
      <q-btn icon="mdi-map-marker-radius" flat round color="accent" />
    </div>
  </div>
  <q-list separator>
    <q-virtual-scroll ref="virtualScrollRef" :items="filteredPoints" style="height: 700px">
      <template v-slot="{ item }">
        <PointCard
          :point="item"
          :isSelected="pointStore.isPointSelected(item.id)"
          :isActive="currentPoint?.id === item.id"
          @select="pointStore.togglePointSelection(item.id)"
          @click="setCurrentPointToActive(item)"
        />
      </template>
      <template v-slot:after>
        <div v-if="filteredPoints.length === 0" class="q-pa-md text-center">
          Не найдено ни одной точки
        </div>
      </template>
    </q-virtual-scroll>
  </q-list>
</template>

<script setup lang="ts">
import PointCard from './PointCard.vue';
import { ref, watch } from 'vue';
import { usePointStore } from 'src/stores/pointStore';
import { storeToRefs } from 'pinia';
import { QVirtualScroll } from 'quasar';
import type { Point } from 'src/models/point';

const showSearch = ref(false);
const allPointsSelected = ref(false);
const virtualScrollRef = ref();

const pointStore = usePointStore();
const { filteredPoints, currentPoint, searchText, areAllPointsSelected } = storeToRefs(pointStore);

const toggleSelectAll = (value: boolean) => {
  if (value) {
    pointStore.selectAllPoints();
  } else {
    pointStore.clearAllPoints();
  }
};

const setCurrentPointToActive = (point: Point) => {
  point.calledFromList = true;
  pointStore.setCurrentPointToActive(point);
};

watch(areAllPointsSelected, () => {
  allPointsSelected.value = areAllPointsSelected.value;
});

watch(currentPoint, (v) => {
  if (v) {
    if (v.calledFromMap) {
      v.calledFromMap = false;
      virtualScrollRef.value.scrollTo(v.id - 1, 'center');
    }
  }
});
</script>
