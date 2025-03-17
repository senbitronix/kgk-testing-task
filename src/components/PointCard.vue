<template>
  <q-card :class="['card', { 'card__is-active': isActive }]" flat bordered>
    <q-card-section>
      <div class="row items-center">
        <q-checkbox v-model="selected" color="accent" keep-color @update:model-value="onSelect" />
        <div class="col-auto text-subtitle1 q-mr-sm">Точка №{{ point.id }}</div>
        <div class="col">
          <div class="text-caption">Код: {{ point.code }}</div>
        </div>
        <q-space />
        <q-btn flat round icon="more_vert" class="col-auto" color="accent" />
      </div>
      <div class="row items-center q-pl-xs">
        <q-icon name="place" size="sm" class="q-mr-sm place" />
        <div class="text-caption">{{ point.address }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Point } from 'src/models/point';
import { defineProps, ref, defineEmits, onMounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    point: Point;
    isSelected?: boolean;
    isActive?: boolean;
  }>(),
  {
    isSelected: false,
    isActive: false,
  },
);

const emit = defineEmits(['select', 'activate']);

const selected = ref(props.isSelected);

const onSelect = (value: boolean) => {
  emit('select', value);
};

watch(
  () => props.isSelected,
  () => {
    selected.value = props.isSelected;
  },
);

onMounted(() => {
  selected.value = props.isSelected;
});
</script>

<style scoped lang="scss">
.card {
  opacity: 0.6;

  .text-caption,
  .place {
    color: $accent;
  }

  // opacity: 0.5;
  &.card__is-active {
    border: 1px solid $accent;
    opacity: 1;
  }
}
</style>
