import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePointStore } from 'src/stores/pointStore';
import PointList from 'src/components/PointList.vue';
import { createTestingPinia } from '@pinia/testing';
import { QVirtualScroll } from 'quasar';
import PointCard from 'src/components/PointCard.vue';
import GlobalComponent from './demo/GlobalComponent.vue';
import PointsMap from 'src/components/PointsMap.vue';

installQuasarPlugin();

vi.mock('quasar', async () => {
  const actual = await vi.importActual('quasar');
  return {
    ...actual,
    QVirtualScroll: {
      template: `
        <div>
          <slot v-for="item in items" :item="item" />
          <slot name="after" />
        </div>
      `,
      props: ['items'],
    },
  };
});

const mockPanTo = vi.fn();

vi.mock('src/models/map', () => ({
  LeafletMap: vi.fn().mockImplementation(() => ({
    map: {
      setView: vi.fn(),
      panTo: mockPanTo,
      remove: vi.fn(),
    },
    initMap: vi.fn(),
    updateMarkers: vi.fn(),
  })),
}));

describe('list and point card test', () => {
  let pinia;
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it.only('should detect click on point card', async () => {
    const pointStore = usePointStore();

    const wrapper = mount(PointList);

    const div = document.createElement('div');
    div.id = 'map';
    document.body.appendChild(div);
    const wrapper2 = mount(PointsMap);

    const pointCards = wrapper.findAllComponents(PointCard);
    await pointCards[2].trigger('click');

    expect(mockPanTo).toHaveBeenCalled();
  });
});

// {
//           PointCard: {
//             template: '<div class="mock-point-card" @click="$emit(\'click\', $event)"></div>',
//           }
//         }
