import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/text-field";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../ors-search"; // Import the ors-search component
import eventBus from "../../event/eventBus";
import '@vaadin/combo-box';

@customElement("ors-isochrone-tab")
export class OrsIsochroneTab extends LitElement {
  @property({ type: String }) isochroneCenterLabel: string = "";
  @property({ type: Number }) maxRange = 15; // Default value for maxRange
  @property({ type: Number }) interval = 3; // Default value for interval
  @property({ type: Array }) maxRangeOptions = Array.from({length: 14}, (_, i) => i + 2); // Options from 2km to 15km
  @property({ type: Array }) intervalOptions = Array.from({length: 10}, (_, i) => i + 1); // Options from 1km to 10km

  firstUpdated(props: any) {
    super.firstUpdated(props);
    eventBus.on("update-isochrone-center", (data) => {
      this.isochroneCenterLabel = data.label;
      // Force update to reflect changes in the DOM
      this.requestUpdate();
    });
  }

  onMaxRangeChange(event) {
    this.maxRange = Number(event.target.value);
    eventBus.dispatch('max-range-changed', { maxRange: this.maxRange });
  }

  onIntervalChange(event) {
    this.interval = Number(event.target.value);
    eventBus.dispatch('interval-changed', { interval: this.interval });
  }

  render() {
    return html`
      <ors-search
        id="searchIsochroneCenter"
        .searchTerm=${this.isochroneCenterLabel}
        .type=${"isochroneCenter"}
        .label=${"Isochrone Center:"}
      ></ors-search>
      <vaadin-combo-box label="Max Range (km)" .items=${this.maxRangeOptions} .value=${this.maxRange.toString()} @change=${this.onMaxRangeChange}></vaadin-combo-box>
      <vaadin-combo-box label="Interval (km)" .items=${this.intervalOptions} .value=${this.interval.toString()} @change=${this.onIntervalChange}></vaadin-combo-box>
      <!-- Additional controls here -->
    `;
  }
}
