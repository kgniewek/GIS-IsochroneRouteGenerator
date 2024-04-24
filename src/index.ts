import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { OrsMap } from "./components/ors-map";
import "./components/ors-panel";

@customElement("ors-renderer")
export class OrsRenderer extends OrsMap {
  render() {
    return html`<ors-panel
      .map=${this.map}
      .routeStartLabel=${this.routeStartLabel}
      .routeStopLabel=${this.routeStopLabel}
      .searchLabel=${this.searchLabel}
      @tab-index-changed=${(e)=> {
        this.currentTabIdx = e.detail.idx
      }}
    ></ors-panel>`;
  }
}
