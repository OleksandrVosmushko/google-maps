import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from '../app/components/map/map.component';
import { AgmCoreModule, GoogleMapsAPIWrapper, PolylineManager } from '@agm/core';
import { environment } from '../environments/environment'
import { SearchSideComponent } from './components/search-side/search-side.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SearchSideComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.keys.gmap,
      libraries: ["places", "geometry"]
    })
  ],
  providers: [PolylineManager, GoogleMapsAPIWrapper ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
