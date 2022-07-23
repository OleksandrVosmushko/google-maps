import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { Marker } from '../../models/Marker';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'search-side',
  templateUrl: './search-side.component.html',
  styleUrls: ['./search-side.component.css'],
})

export class SearchSideComponent implements OnInit {
  private buttons: Array<Button>;
  private points: Array<Marker>;
  private previousSearches: Array<Array<Marker>>;
  @Output() emitData = new EventEmitter<string>();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  searchOnMap: string;
  currentMode: number;
  isHidden: boolean;
  isClosed: boolean;
  resultExists: boolean;

  constructor(private renderer: Renderer2, private httpClient: HttpClient) {
    this.buttons = Array<Button>();
    this.points = Array<Marker>();
    this.previousSearches = Array<Array<Marker>>();
    this.currentMode = 1;
    this.isHidden = false;
    this.isClosed = false;
    this.searchOnMap = '';
    this.resultExists = false;
  }

  getPoints(): Array<Marker>{
    return this.points;
  }

  searchByName() {
    return this.httpClient.post<number>(
      `${environment.apiUrl}/api/users`,
      this.searchOnMap,
      this.httpOptions
    );
  }

  getButtons(): Array<Button> {
    return this.buttons;
  }

  getPreviousSearches(): Array<Array<Marker>> {
    return this.previousSearches;
  }

  getPreviousSearchString(index: number) {
    let result = '';
    const prevSearch: Array<Marker> = this.previousSearches[index];
    for (const item of prevSearch) {
      result += `${item.label}-`;
    }
    return result.slice(0, -1);
  }

  newSearch() {
    this.clearEmptyPoints();
    if (this.points.length > 0)
      this.previousSearches.push(this.points);
    this.setDummyPoints();
  }

  clearEmptyPoints() {
    const newArr = [];
    for (const item of this.points) {
      if (item.label)
        newArr.push(item);
    }
    this.points = newArr;
  }

  searchNewItem() {

  }

  sendData(marker: Marker) {
    this.emitData.emit(JSON.stringify(marker));
  }

  addNewItem(lat: number = 0, lng: number = 0, lbl: string = '') {
    this.points.push({
      label: lbl,
      latitude: lat,
      longitude: lng
    });
  }

  setDummyPoints() {
    for (let i = 0; i < 2; ++i) {
      this.addNewItem();
      }
  }

  setValue(idx: number, event: any) {
    this.points[idx].label = event.target.value;
    console.log(this.points);
  }

  clickOnHide() {
    this.isHidden = !this.isHidden;
    const image = document.getElementById('hide-elem');
    let degree = 0;
    if (this.isHidden)
      degree = 180;
    this.renderer.setStyle(
      image,
      'transform',
      `rotate(${degree}deg)`
    )
  }

  clearSearches() {
    this.previousSearches = [];
  }

  removeElement(idx: number) {
    this.points.splice(idx, 1);
  }

  reverseElements() {
    this.points.reverse();
  }

  clickOnClose() {
    this.isClosed = !this.isClosed;
  }

  setMethod(idx: number) {
    this.currentMode = idx + 1;
  }

  ngOnInit() {

    this.buttons = environment.buttons;
    this.setDummyPoints();
  }

  loadFromHistory(idx: number) {
    this.newSearch();
    this.points = this.previousSearches[idx];
  }

  setValueFromApp(str: string) {
    console.log(str);
    console.log('test');
    const marker: Marker = JSON.parse(str);
    let added: boolean = false;
    for (let i = 0; i < this.points.length; ++i) {
      if (this.points[i].label.length === 0) {
        this.points[i] = marker;
        added = true;
        break;
      }
    }
    if (!added)
      this.addNewItem(marker.latitude, marker.longitude, marker.label);
  }

}

interface Button {
  mode: number;
  icon: string;
}

enum TravelMode {
  Recommended = 1,
  Car,
  PublicTransport,
  OnFoot,
  Bicycle
}
