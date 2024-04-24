import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/text-field";
import "@vaadin/tabsheet";
import "@vaadin/tabs";
import "@vaadin/list-box";
import "@vaadin/item";
import L from "leaflet";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { OrsApi } from "../../ors-api/ors-api";
import eventBus from "../../event/eventBus";

@customElement("ors-search")
export class OrsSearchTab extends LitElement {
  @property({ type: String }) searchTerm = "";
  @property({type: String }) id: string = ""
  @property({type: String}) label: string = "Wpisz adres:"
  @property({type: String}) placeholder: string = "Konstantynów 1A-1E, Lublin,LU,Polska"
  @property({ type: Array }) suggestions: any[] = [];
  @property({type: String}) type: string = ""
  @state() orsApi: OrsApi = new OrsApi();
  @state() inputTimeout: NodeJS.Timeout | null = null;

  firstUpdated(props: any) {
    super.firstUpdated(props);
  }

  handleSuggestionClick(suggestion: string, coordinates: [number, number]) {
    this.searchTerm = suggestion;
    this.suggestions = []; // Clear suggestions
    eventBus.dispatch("add-marker-geocode", {
      coords: coordinates,
      type: this.type,
      label: suggestion
    });
  }

  render() {
    return html`<vaadin-text-field
        id=${this.id}
        theme="small"
        clear-button-visible
        placeholder=${this.placeholder}
        label=${this.label}
        value=${this.searchTerm}
        @value-changed=${(e) => {
          const searchTerm = e.detail.value;
          
          if(searchTerm === "") {
            this.searchTerm = "";
            eventBus.dispatch("hide-marker", {type: this.type})
          }

          if (this.searchTerm === searchTerm) return;

          if (this.inputTimeout) {
            clearTimeout(this.inputTimeout);
          }
          if (searchTerm === "") {
            this.suggestions = [];
            return;
          }
          this.inputTimeout = setTimeout(async () => {
            const suggestions = await this.orsApi.geocode(searchTerm);
            this.suggestions = suggestions;
          }, 500);
        }}
      >
        <vaadin-icon
          icon="vaadin:search"
          slot="suffix"
          @click=${(e) => {
            console.log("klik");
          }}
        ></vaadin-icon>
      </vaadin-text-field>
      <vaadin-list-box ?hidden=${!(this.suggestions.length > 0)}>
        ${this.suggestions.map(
          (suggestion) =>
            html`<vaadin-item
            @click=${() => {
              this.handleSuggestionClick(
                suggestion.properties.label,
                suggestion.geometry.coordinates
              );
            }}
            >${suggestion.properties.label}</vaadin-item
          >`
        )}
      </vaadin-list-box> `;
  }

  static styles? = css`
    vaadin-text-field {
      width: 100%;
    }

    vaadin-list-box {
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid #ccc;
      /* position: absolute;
      top:10; */
      background-color: white;
      z-index: 1;
      position: absolute;
      margin-right: var(--lumo-space-m);
    }

    vaadin-item {
      /* padding: 8px; */
      cursor: pointer;
    }

    vaadin-item:hover {
      background-color: #f4f4f4;
    }
  `;
}
