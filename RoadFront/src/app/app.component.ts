import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { SearchSideComponent } from './components/search-side/search-side.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Maps';
  @ViewChild('map') private map: MapComponent;
  @ViewChild('search') private search: SearchSideComponent;

  emittedDataByMap(data: string) {
    this.search.processCommand(data);
  }

  emittedDataBySearch(data: string) {
    this.map.processCommand(data);
  }
}
