import * as L from "leaflet";
import "./SmoothWheelZoom";

describe("SmoothWheelZoom", () => {
  it("enables smooth wheel zoom without Leaflet's default wheel handler", () => {
    const map = L.map(document.createElement("div"), {
      center: [0, 0],
      zoom: 10,
      scrollWheelZoom: false,
      smoothWheelZoom: true,
      zoomSnap: 0,
    });

    expect(map.scrollWheelZoom.enabled()).toBe(false);
    expect((map as L.Map & { smoothWheelZoom: L.Handler }).smoothWheelZoom.enabled()).toBe(true);
    expect(map.options.zoomSnap).toBe(0);

    map.remove();
  });
});
