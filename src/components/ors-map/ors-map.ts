import "@vaadin/notification";
import type { NotificationLitRenderer } from "@vaadin/notification/lit.js";
import { notificationRenderer } from "@vaadin/notification/lit.js";
import L, { LeafletMouseEvent } from "leaflet";
import { LitElement, css, html, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import eventBus from "../../event/eventBus";
import { OrsApi } from "../../ors-api/ors-api";
import "../ors-custom-contextmenu";
import "../ors-progress-bar";
import markerIconGreen from "./assets/img/marker-icon-green.png";
import markerIconRed from "./assets/img/marker-icon-red.png";
import "../ors-route-selector";
import '../ors-isochrone-tab'


@customElement("ors-map")
export class OrsMap extends LitElement {
  @state() isochroneLayer?: L.GeoJSON = new L.GeoJSON();
  @state() isochroneCenterLabel: string = "";
  @state() maxRange: number = 15000; 
  @state() interval: number = 3000; 
  @state() map?: L.Map;
  @state() contextMenu?: L.Popup;
  @state() markerGreen?: L.Marker = new L.Marker([0, 0], {
    opacity: 0,
    draggable: true,
  });
  @state() markerRed?: L.Marker = new L.Marker([0, 0], {
    opacity: 0,
    draggable: true,
  });
  @state() searchMarker: L.Marker = new L.Marker([0, 0], {
    opacity: 0,
  });
  @state() currentLatLng?: L.LatLng;
  @state() orsApi: OrsApi = new OrsApi();
  @state() routeStartLabel: string = "";
  @state() routeStopLabel: string = "";
  @state() searchLabel: string = "";
  @state() routeLayer?: L.GeoJSON = new L.GeoJSON();

  @state() selectedProfile: string = "driving-car";

  @property({ type: Number }) currentTabIdx: number = 0;

  @state() basemap: L.TileLayer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "OpenStreetMap",
    }
  );

  @state() startIcon = new L.Icon({
    iconUrl: markerIconGreen,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  @state() endIcon = new L.Icon({
    iconUrl: markerIconRed,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  @state() routeStyle = {
    color: "#ff7800",
    weight: 5,
    opacity: 0.65,
  };

  initMap = (): void => {
    this.map = new L.Map("map", {
      center: new L.LatLng(51.236525, 22.4998601),
      zoom: 18,
    });
  };

  renderer: NotificationLitRenderer = () => html`
    <vaadin-horizontal-layout theme="spacing" style="align-items: center;">
      <div>Odległość pomiędzy punktami jest większa niż 600km</div>
    </vaadin-horizontal-layout>
  `;

  renderNotification = () => {
    render(
      html`<vaadin-notification
        class="notification"
        theme="error"
        duration="3000"
        position="bottom-center"
        ?opened=${true}
        ${notificationRenderer(this.renderer, [])}
      ></vaadin-notification>`,
      document.body
    );
  };

  // connectionError: NotificationLitRenderer = (error) => ;

  renderConnectionNotification = (error) => {
    render(
      html`<vaadin-notification
        class="notification"
        theme="error"
        duration="3000"
        position="bottom-center"
        ?opened=${true}
        ${notificationRenderer(
          () => html`
            <vaadin-horizontal-layout
              theme="spacing"
              style="align-items: center;"
            >
              <div>${error}</div>
            </vaadin-horizontal-layout>
          `
        )}
      ></vaadin-notification>`,
      document.body
    );
  };

  routeService = async (type?): Promise<void> => {
    if (
      this.markerGreen!.options.opacity === 1 &&
      this.markerRed!.options.opacity === 1
    ) {
      if (
        this.markerGreen!.getLatLng().distanceTo(this.markerRed!.getLatLng()) <
        700000
      ) {
        try {
          const feature = await this.orsApi.route(
            this.markerGreen!.getLatLng(),
            this.markerRed!.getLatLng(),
            this.selectedProfile

          );
          if ((feature as any).error) {
            throw new Error((feature as any).error.message);
          }

          this.routeLayer!.clearLayers().addData(feature as any);
          render(html``, document.body);

const routeSummary = (feature as any).features[0]?.properties?.summary;

if (routeSummary) {
  const kmDistance = routeSummary.distance / 1000;
  const hoursDuration = routeSummary.duration / 3600;
  const minutesDuration = (routeSummary.duration % 3600) / 60;

  let displayDistance = `${kmDistance.toFixed(3)} km`;
  let displayTime;

  if (kmDistance < 1) {
    displayDistance = `${(kmDistance * 1000).toFixed(0)} m`;
  }

  if (hoursDuration >= 1) {
    displayTime = `${Math.floor(hoursDuration)} godziny ${minutesDuration.toFixed(0)} minut`;
  } else if (minutesDuration === 1) {
    displayTime = `${minutesDuration.toFixed(0)} minuta`;
  } else if (minutesDuration < 1) {
    const secondsDuration = routeSummary.duration;
    displayTime = `${secondsDuration.toFixed(0)} sekund`;
  } else {
    displayTime = `${minutesDuration.toFixed(0)} minut`;
  }
              
  const infoPopupContent = `
  <div style="margin: 10px 25px;">
  <p><strong>${displayTime}</strong> </p>
  <p>${displayDistance}</p></div>

`;

const startPoint = this.markerGreen!.getLatLng();
const endPoint = this.markerRed!.getLatLng();
const midpoint = L.latLng(
  (startPoint.lat + endPoint.lat) / 2,
  (startPoint.lng + endPoint.lng) / 2
);

const infoPopup = L.popup()
  .setLatLng(midpoint)
  .setContent(infoPopupContent);
this.map?.openPopup(infoPopup);

}

          

        } catch (e: any) {
          this.renderConnectionNotification(e);
        }
      } else if (
        this.markerGreen!.getLatLng().distanceTo(this.markerRed!.getLatLng()) >=
        700000
      ) {
        this.routeLayer!.clearLayers();
        this.renderNotification();
      }
    } else {
      render(html``, document.body);
    }
  };

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("currentTabIdx")) {
      if (this.currentLatLng) {
        this.updateContextMenu();
      }
      this.routeLayer?.clearLayers();
      this.routeStartLabel = ""
      this.routeStopLabel = "";
      this.searchLabel = ""
    }
    
  }
  setIsochroneCenter = async (): Promise<void> => {
    if (this.currentLatLng) {
      this.isochroneCenterLabel = await this.orsApi.reverseGeocode(this.currentLatLng);
      eventBus.dispatch("update-isochrone-center", { label: this.isochroneCenterLabel });
  
      try {
        const isochroneData = await this.orsApi.isochrone(this.currentLatLng, this.maxRange, this.interval);
        if (isochroneData) {
          this.isochroneLayer?.clearLayers(); 
          this.isochroneLayer?.addData(isochroneData); 
          this.isochroneLayer?.setStyle({
            color: '#ff7800',
            weight: 2,
            opacity: 0.65,
            fillOpacity: 0.6
          }).addTo(this.map!);
        }
      } catch (error) {
        console.error("Error fetching isochrone data:", error);
      }
    }
  };
  

  updateContextMenu = (): void => {
    let orsContextMenuContainer = document.createElement("div");

    render(
      html`<ors-custom-contextmenu
        .currentTabIdx=${this.currentTabIdx}
      ></ors-custom-contextmenu>`,
      orsContextMenuContainer
    );

    this.contextMenu
      ?.setLatLng(this.currentLatLng!)
      .bindPopup(orsContextMenuContainer, {
        closeButton: false,
        minWidth: 250,
      })
      .addTo(this.map!)
      .openPopup();
  };
  updateIsochrones = async () => {
    if (!this.currentLatLng) {
      return; 
    }
  
    try {
      const isochroneData = await this.orsApi.isochrone(this.currentLatLng, this.maxRange, this.interval);
      if (isochroneData) {
        this.isochroneLayer?.clearLayers(); 
        this.isochroneLayer?.addData(isochroneData); 
        this.isochroneLayer?.setStyle({
          color: '#ff7800',
          weight: 2,
          opacity: 0.65,
          fillOpacity: 0.6
        }).addTo(this.map!);
      }
    } catch (error) {
      console.error("Error fetching isochrone data:", error);
    }
  };
  
  addListeners = (): void => {
    this.map!.on("contextmenu", (e: LeafletMouseEvent) => {
      this.currentLatLng = e.latlng;
      this.updateContextMenu();
    });
    eventBus.on('max-range-changed', (data) => {
      this.maxRange = data.maxRange * 1000; 
      this.updateIsochrones(); 
    });
  
    eventBus.on('interval-changed', (data) => {
      this.interval = data.interval * 1000; 
      this.updateIsochrones();
    });
    this.markerGreen!.on("moveend", (e) => {
      this.currentLatLng = e.target.getLatLng();

      eventBus.dispatch("add-marker", { type: "start" });
      this.routeService();
    });

    this.markerRed!.on("moveend", (e) => {
      this.currentLatLng = e.target.getLatLng();
      eventBus.dispatch("add-marker", { type: "end" });
      this.routeService();
    });
    
    eventBus.on('max-range-changed', (data) => {
      this.maxRange = data.maxRange * 1000; 
      this.setIsochroneCenter(); 
    });
  
    eventBus.on('interval-changed', (data) => {
      this.interval = data.interval * 1000; 
      
    });

    eventBus.on("add-marker", async (data) => {
      render(
        html`<progress-bar-request></progress-bar-request>`,
        document.body
      );

      switch (data.type) {
        case "start":
          this.markerGreen?.setOpacity(0);

          this.routeStartLabel = await this.orsApi.reverseGeocode(
            this.currentLatLng!
          );

          this.markerGreen!.setLatLng(this.currentLatLng!).setOpacity(1);
          break;
        case "end":
          this.markerRed?.setOpacity(0);

          this.routeStopLabel = await this.orsApi.reverseGeocode(
            this.currentLatLng!
          );
          this.markerRed!.setLatLng(this.currentLatLng!).setOpacity(1);
          break;
        case "search":
          this.searchMarker?.setOpacity(0);
          this.searchLabel  = await this.orsApi.reverseGeocode(
            this.currentLatLng!
          );
          this.searchMarker!.setLatLng(this.currentLatLng!).setOpacity(1);
          break;
      }

      this.contextMenu?.close();
      // this.currentLatLng = undefined;
      this.routeService(data.type);
    });

    eventBus.on("add-marker-geocode", async (data) => {
      const coords = new L.LatLng(data.coords[1], data.coords[0])!;

      switch (data.type) {
        case "start":
          this.markerGreen!.setLatLng(coords).setOpacity(1);
          this.routeStartLabel = data.label
          break;
        case "end":
          this.markerRed!.setLatLng(coords).setOpacity(1);
          this.routeStopLabel = data.label
          break;
        case "search":
          this.searchMarker!.setLatLng(coords).setOpacity(1);
          this.searchLabel = data.label
          break;
      }
      this.contextMenu?.close();
      // this.currentLatLng = undefined;
      this.routeService(data.type);
    });

    eventBus.on("hide-marker", async (data) => {
      switch (data.type) {
        case "start":
          this.markerGreen!.setOpacity(0);
          break;
        case "end":
          this.markerRed!.setOpacity(0);
          break;
        case "search":
          this.searchMarker!.setOpacity(0);
          break;
      }
      this.contextMenu?.close();
      // this.currentLatLng = undefined;
      this.routeLayer!.clearLayers();
    });
    eventBus.on("profile-changed", (data) => {
      this.selectedProfile = data.profile;
      this.routeService();
    });

    
    eventBus.on("set-isochrone-center", async () => {
      this.setIsochroneCenter();
      if (this.currentLatLng) {
        try {
          const isochroneData = await this.orsApi.isochrone(this.currentLatLng);
          if (isochroneData) {
            this.isochroneLayer?.clearLayers();
            this.isochroneLayer?.addData(isochroneData); 
            this.isochroneLayer?.setStyle({
              color: '#ff7800',
              weight: 2,
              opacity: 0.65,
              fillOpacity: 0.6
            }).addTo(this.map!);
          }
        } catch (error) {
          console.error("Error fetching isochrone data:", error);
        }
      }
    });

  };

  firstUpdated(props: any) {
    super.firstUpdated(props);

    this.initMap();
    this.basemap?.addTo(this.map!);
    this.contextMenu = new L.Popup();
    this.routeLayer!.setStyle(this.routeStyle).addTo(this.map!);
    this.markerGreen?.addTo(this.map!).setIcon(this.startIcon);
    this.markerRed?.addTo(this.map!).setIcon(this.endIcon);
    this.searchMarker?.addTo(this.map!).setIcon(this.startIcon);
    this.isochroneLayer?.addTo(this.map!);
    this.addListeners();
  }

  static styles? = css`
    .notification {
      display: flex !important;
      align-items: center;
      justify-content: center;
      height: calc(100vh - var(--docs-space-l) * 2);
    }

  `;
}
