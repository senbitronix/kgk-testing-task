import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Point } from 'src/models/point';
import type { Ref } from 'vue';

export class LeafletMap {
  readonly map: L.Map;
  private readonly id: string;
  private readonly tileLayerUrl: string;
  private readonly attribution: string;

  private readonly markerColor = '#9C27B0';
  private readonly markerActiveColor = 'red';
  private readonly markerFillColor = 'white';

  selectedMarker: L.CircleMarker | null = null;

  constructor(id: string, tileLayerUrl: string, attribution: string) {
    this.id = id;
    this.map = L.map('map', {
      preferCanvas: true,
    });
    this.tileLayerUrl = tileLayerUrl;
    this.attribution = attribution;
  }

  initMap(latitude: number, longitude: number, zoom: number): void {
    this.map.setView([latitude, longitude], zoom);

    L.tileLayer(this.tileLayerUrl, {
      attribution: this.attribution,
    }).addTo(this.map);
  }

  private resetMarkerStyle(marker: L.CircleMarker): void {
    marker.setStyle({
      color: this.markerColor,
    });
  }

  updateMarkers(
    points: Point[],
    currentPoint: Ref<Point | null>,
    getTooltipContent: (point: Point) => string,
  ): void {
    if (!this.map) {
      return;
    }

    this.map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        this.map?.removeLayer(layer);
      }
    });

    points.forEach((point: Point) => {
      if (this.map) {
        const marker = L.circleMarker([point.x, point.y], {
          radius: 5,
          color: this.markerColor,
          weight: 6,
          fillColor: this.markerFillColor,
        }).addTo(this.map);

        const tooltipOptions: L.TooltipOptions = {
          direction: 'top',
          offset: [0, -20],
          permanent: false,
          interactive: false,
        };

        marker.bindPopup(getTooltipContent(point), tooltipOptions);

        marker.on('click', () => {
          if (this.selectedMarker) {
            this.resetMarkerStyle(this.selectedMarker);
          }

          this.selectedMarker = marker;
          if (currentPoint) {
            currentPoint.value = { ...point, calledFromMap: true };
          }
        });

        if (currentPoint.value?.id === point.id) {
          this.selectedMarker = marker;
        }
      }
    });

    if (this.selectedMarker && points.length) {
      this.map.removeLayer(this.selectedMarker);
      this.selectedMarker.addTo(this.map);
      this.selectedMarker.setStyle({
        color: this.markerActiveColor,
      });

      this.selectedMarker.openPopup();
    }
  }
}
