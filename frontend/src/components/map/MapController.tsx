import { useEffect } from "react";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useMap } from "react-leaflet";

type MapControllerProps = {
  center: LatLngExpression;
  zoom: number;
  maxBounds: LatLngBoundsExpression;
};

export function MapController({ center, zoom, maxBounds }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(maxBounds);
    map.flyTo(center, zoom, {
      duration: 0.8,
    });
  }, [center, map, maxBounds, zoom]);

  return null;
}
