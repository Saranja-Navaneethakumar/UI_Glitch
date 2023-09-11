import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ZOOM } from "src/modules/models/public-web/enum";
import { BaseComponent } from "src/modules/shared/base.component";
import { ResetVenueMap, SetSelectedPackageForLocator, SwitchMapSeatView, SwitchMiniMap, SwitchZoomLevel } from "src/modules/store/booking-application/Configuration.action";
import { VenueMapConfiguration } from "src/modules/store/booking-application/configuration.reducer";
import * as fromConfiguration from "../../../../../store/booking-application/configuration.selector";
import * as d3 from "d3";

@Component({
  selector: "seat-table-toolbar",
  templateUrl: "./toolbar.component.html",
})
export class ToolBarComponent extends BaseComponent implements OnInit {
  noOfSelectedSeats = 0;
  isDisableReset = true;
  venueMapConfiguration: VenueMapConfiguration
  previousConfig: VenueMapConfiguration
  zoomValue: number;
  enableSeatView: boolean;
  initialTransform: string;
  constructor(
    private store: Store<any>,
  ) {
    super();
  }
  get ZOOM() {
    return ZOOM;
  }
  ngOnInit() {
    this.store.select(fromConfiguration.selectVenueMapConfiguration)
      .safeSubscribe(this, config => {
        this.venueMapConfiguration = config;
        // if(this.venueMapConfiguration.zoomValue !== this.zoomValue) {
        //   this.zoomValue = this.venueMapConfiguration.zoomValue
        // }
        // if(this.venueMapConfiguration.enableSeatView !== this.enableSeatView) {
        //   this.enableSeatView = this.venueMapConfiguration.enableSeatView
        // }
        let root = d3.select('#root');
        if (!root.empty()) {
          const transform = d3.select('#root').attr('transform');
          if (transform) {
            if (transform === this.venueMapConfiguration.initialTransform && this.venueMapConfiguration.zoomValue == 1) {
            // if(this.venueMapConfiguration.initialTransform != this.initialTransform) {
            //   this.initialTransform = this.venueMapConfiguration.initialTransform
            // }
            // if (transform === this.initialTransform && this.zoomValue == 1) {
              this.isDisableReset = true;
            } else {
              this.isDisableReset = false;
            }
          }
        }
        // if (!this.areConfigsEqual(this.previousConfig, config)) {
        //   this.venueMapConfiguration = config;
        //   let root = d3.select('#root');
        //   if (!root.empty()) {
        //     const transform = d3.select('#root').attr('transform');
        //     if (transform) {
        //       if (transform === this.venueMapConfiguration.initialTransform && this.venueMapConfiguration.zoomValue == 1) {
        //         this.isDisableReset = true;
        //       } else {
        //         this.isDisableReset = false;
        //       }
        //     }
        //   }
        //   this.previousConfig = config;
        // }
      });

    this.store
      .select(fromConfiguration.selectSelectedSeats)
      .safeSubscribe(this, (data) => {
        this.noOfSelectedSeats = data?.length;
      });
  }
  onEnableMiniMap() {
    this.store.dispatch(new SwitchMiniMap(!this.venueMapConfiguration.enableMiniMap))
  }
  onEnableSeatView() {
    this.store.dispatch(new SwitchMapSeatView(!this.venueMapConfiguration.enableSeatView))
    this.store.dispatch(new SetSelectedPackageForLocator(null));
  }
  onZoom(type: ZOOM) {
    this.store.dispatch(new SwitchZoomLevel(type))
    this.store.dispatch(new SwitchZoomLevel(ZOOM.NEUTRAL))
  }
  reset(){
    this.store.dispatch(new ResetVenueMap(!this.venueMapConfiguration.reset))
  }

  private areConfigsEqual(config1: any, config2: any): boolean {
    return JSON.stringify(config1) === JSON.stringify(config2);
  }

}
