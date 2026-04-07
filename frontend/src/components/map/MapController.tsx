import { useEffect } from "react";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import { useMap } from "react-leaflet";

type MapControllerProps = {
  center: LatLngTuple;
  zoom: number;
  maxBounds: LatLngBoundsExpression;
  focusBounds?: LatLngTuple[] | null;
};

export function MapController({
  center,
  zoom,
  maxBounds,
  focusBounds = null,
}: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(maxBounds);

    if (focusBounds && focusBounds.length > 0) {
      map.fitBounds(focusBounds, {
        padding: [24, 24],
        maxZoom: 14,
      });
      return;
    }

    map.setView(center, zoom);
  }, [center, zoom, maxBounds, focusBounds, map]);

  return null;
}
