import "@vaadin/progress-bar";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("progress-bar-request")
export class ProgressBarRequest extends LitElement {
  async firstUpdated(props: any) {
    super.firstUpdated(props);
    await new Promise((r) => setTimeout(r, 0));
  }

  render() {
    return html` <div id="overlay">
      <div id="progressbar">
        <div style="color:var(--lumo-secondary-text-color)">
          <div>Trwa wyszukiwanie...</div>
          <vaadin-progress-bar indeterminate></vaadin-progress-bar>
        </div>
      </div>
    </div>`;
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      background-color: black;
    }

    #progressbar {
      position: absolute;
      top: 40%;
      left: 38%;
      padding: 1rem;
      width: 270px;
      background-color: white;
      border: 1px solid rgb(22, 118, 243);
    }

    #overlay {
      position: fixed;
      display: block;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }
  `;
}
