import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function CtrlScrollZoomHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    function handleWheel(event: WheelEvent) {
      if (!event.ctrlKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (event.deltaY < 0) {
        map.zoomIn();
        return;
      }

      if (event.deltaY > 0) {
        map.zoomOut();
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
}
