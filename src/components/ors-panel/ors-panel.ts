import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/text-field";
import "@vaadin/tabsheet";
import "@vaadin/tabs";
import L from "leaflet";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../ors-search";
import "../ors-route-tab";
import "../ors-route-selector";
import "../ors-isochrone-tab";
import "../../event/eventBus";


@customElement("ors-panel")
export class OrsPanel extends LitElement {
  @property({ type: Object }) map?: L.Map;
  @property({ type: String }) routeStartLabel: string = "";
  @property({ type: String }) routeStopLabel: string = "";
  @property({ type: String }) searchLabel: string = "";
  @property({ type: String }) isochroneCenterLabel: string = ""; 
  @property({ type: Number }) currentTabIdx: number = 0;

	firstUpdated(props: any) {
		super.firstUpdated(props);
	}

	searchTab = () => {
		return html`<vaadin-text-field
			id="searchAddress"
			theme="small"
			clear-button-visible
			placeholder="Konstantynów 1A-1E, Lublin,LU,Polska"
			label="Wpisz adres:"
		>
			<vaadin-icon
				icon="vaadin:search"
				slot="suffix"
				@click=${e => {
					console.log("klik");
				}}
			></vaadin-icon>
		</vaadin-text-field>`;
	};

	routeTab = () => {
		return;
	};

	render() {
		return html`
			<h4>Open Route Service - sample</h4>
			<vaadin-tabsheet>
				<vaadin-tabs
					slot="tabs"
					@selected-changed=${e => {
						const { value } = e.detail;
						this.currentTabIdx = value;
						this.dispatchEvent(
							new CustomEvent("tab-index-changed", {
								detail: {
									idx: value,
								},
							})
						);
					}}
				>
					<vaadin-tab id="find-tab">Wyszukaj</vaadin-tab>
					<vaadin-tab id="route-tab">Trasa</vaadin-tab>
					<vaadin-tab id="reach-tab">Izochrony</vaadin-tab>
					
				</vaadin-tabs>

				<div tab="find-tab">
					<ors-search .type=${"search"} .searchTerm=${this.searchLabel}>
					</ors-search>
				</div>
				<div tab="route-tab">
					<ors-route-tab
						.routeStartLabel=${this.routeStartLabel}
						routeStopLabel=${this.routeStopLabel}
					></ors-route-tab>
				</div>
				<div tab="reach-tab">
				<ors-isochrone-tab
				  .isochroneCenterLabel=${this.isochroneCenterLabel}
				></ors-isochrone-tab>
			  </div>
			</vaadin-tabsheet>
		`;
	}

	static styles? = css`
		:host {
			position: absolute;
			top: 10px;
			right: 10px;
			padding: 10px;
			background-color: rgba(255, 255, 255, 0.9);
			width: 400px;
			height: 94%;
			overflow: auto;
		}

		h4 {
			text-align: center;
		}
		vaadin-text-field {
			width: 100%;
		}
		vaadin-tabsheet {
			height: 93%;
		}
	`;
}
