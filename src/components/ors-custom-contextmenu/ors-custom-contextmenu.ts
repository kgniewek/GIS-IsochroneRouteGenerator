import "@vaadin/button";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import markerIconGreen from "../ors-map/assets/img/marker-icon-green.png";
import markerIconRed from "../ors-map/assets/img/marker-icon-red.png";

import eventBus from "../../event/eventBus";

@customElement("ors-custom-contextmenu")
export class OrsCustomContextmenu extends LitElement {
  @property({ type: Number }) currentTabIdx: number = 0;

  routeContextMenu = () => html`
    <vaadin-button @click=${(e: Event) => eventBus.dispatch("add-marker", { type: "start" })}>
      <div class="context-button">
        <img src=${markerIconGreen} height="22" />
        <span class="context-button-text">Set Start Point</span>
      </div>
    </vaadin-button>
    <vaadin-button @click=${(e: Event) => eventBus.dispatch("add-marker", { type: "end" })}>
      <div class="context-button">
        <img src=${markerIconRed} height="22" />
        <span class="context-button-text">Set End Point</span>
      </div>
    </vaadin-button>`;

    isochroneContextMenu = () => html`
    <vaadin-button @click=${(e: Event) => eventBus.dispatch("set-isochrone-center", {})}>
      <div class="context-button">
        <span class="context-button-text">Set as Isochrone Center</span>
      </div>
    </vaadin-button>`;
  

  render() {
    switch (this.currentTabIdx) {
      case 0:
        return html`<p>Search Tab Context Menu</p>`;
      case 1:
        return this.routeContextMenu();
      case 2:
        return this.isochroneContextMenu();
      default:
        return html``;
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      padding: 10px;
      width: 230px;
    }

    vaadin-button {
      width: 100%;
    }

    .context-button {
      display: flex;
      align-items: center;
    }

    .context-button-text {
      margin-left: 10px;
    }
  `;
}
