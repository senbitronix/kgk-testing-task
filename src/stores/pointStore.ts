import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import type { Point } from 'src/models/point';
import { generatePoints } from 'src/utils/generator';

export const usePointStore = defineStore('point', () => {
  const points = ref<Point[]>([...generatePoints(10000)]);

  const currentPoint = ref<Point | null>(
    points.value.length > 0 ? (points.value[0] ?? null) : null,
  );
  const selectedPointIds = ref<Set<number>>(new Set());

  const searchText = ref<string>('');

  const filteredPoints = computed(() => {
    if (!searchText.value) {
      return points.value;
    }
    const searchTerm = searchText.value.toLowerCase();
    return points.value.filter((point) => {
      return (
        point.code.toLowerCase().includes(searchTerm) ||
        point.address.toLowerCase().includes(searchTerm)
      );
    });
  });

  const renderedPoints = ref<Point[]>([]);

  const areAllPointsSelected = computed(() => {
    return filteredPoints.value.length <= selectedPointIds.value.size;
  });

  const setCurrentPointToActive = (point: Point) => {
    currentPoint.value = point;
  };

  const togglePointSelection = (pointId: number) => {
    if (selectedPointIds.value.has(pointId)) {
      selectedPointIds.value.delete(pointId);
    } else {
      selectedPointIds.value.add(pointId);
    }
  };

  const isPointSelected = (pointId: number): boolean => {
    return selectedPointIds.value.has(pointId);
  };

  const selectAllPoints = () => {
    selectedPointIds.value = new Set(filteredPoints.value.map((point) => point.id));
  };

  const clearAllPoints = () => {
    // selectedPointIds.value.clear();
    const filteredPointIds = filteredPoints.value.map((point) => point.id);

    const newSelectedPointIds = new Set(
      Array.from(selectedPointIds.value).filter((id) => !filteredPointIds.includes(id)),
    );

    selectedPointIds.value = newSelectedPointIds;
  };

  return {
    points,
    currentPoint,
    selectedPointIds,
    searchText,
    filteredPoints,
    renderedPoints,
    areAllPointsSelected,
    setCurrentPointToActive,
    togglePointSelection,
    isPointSelected,
    selectAllPoints,
    clearAllPoints,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePointStore, import.meta.hot));
}
