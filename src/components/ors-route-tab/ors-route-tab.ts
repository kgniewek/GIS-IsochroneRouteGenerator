import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/tabs";
import "@vaadin/tabsheet";
import "@vaadin/text-field";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ors-route-tab")
export class OrsRouteTab extends LitElement {
  @property({ type: String }) routeStartLabel: string = "";
  @property({ type: String }) routeStopLabel: string = "";

  firstUpdated(props: any) {
    super.firstUpdated(props);
  }

  render() {
    return html`
      <ors-search
        id=${"searchRouteStart"}
        .searchTerm=${this.routeStartLabel}
        .type=${"start"}
        .label=${"Punkt początkowy:"}
      ></ors-search>
      <ors-search
        id=${"searchRouteStop"}
        .searchTerm=${this.routeStopLabel}
        .type=${"end"}
        .label=${"Punkt końcowy:"}
      ></ors-search>
      <ors-route-selector></ors-route-selector>
    `;


  }

  static styles? = css`
    :host {
      height: 100%;
    }
    vaadin-text-field {
      width: 100%;
    }
  `;
}
