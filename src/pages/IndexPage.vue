<template>
  <q-page padding>
    <div class="row" style="height: 80vh">
      <div class="col-xs-12 col-sm-3">
        <q-card style="height: 100%">
          <q-card-section style="height: 100%">
            <PointList />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-9">
        <q-card style="height: 100%">
          <q-card-section style="height: 100%">
            <PointsMap />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PointList from 'src/components/PointList.vue';
import PointsMap from '../components/PointsMap.vue';
</script>
