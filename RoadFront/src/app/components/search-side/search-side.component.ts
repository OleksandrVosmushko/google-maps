import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { Marker } from '../../models/Marker';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Command, CommandData } from '../../models/Command';

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
  route: Array<any>;

  constructor(private renderer: Renderer2, private httpClient: HttpClient) {
    this.buttons = Array<Button>();
    this.points = Array<Marker>();
    this.previousSearches = Array<Array<Marker>>();
    this.currentMode = 1;
    this.isHidden = false;
    this.isClosed = false;
    this.searchOnMap = '';
    this.resultExists = false;
    this.route = [];
  }

  getPoints(): Array<Marker>{
    return this.points;
  }

  searchByName() {
    return this.httpClient.post<number>(
      `${environment.apiUrl}/direction`,
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

 async searchNewItem() {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*'
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const directions = []
    if (this.points.length > 0) {
    let start = this.points[0];
      let end = start;
      for (let idx = 1; idx < this.points.length; ++idx) {
        end = this.points[idx];
        const smth = await this.httpClient.get(
          `${environment.apiUrl}directions?Origin=${start.latitude},${start.longitude}&Destination=${end.latitude},${end.longitude}`,
          requestOptions
        ).toPromise();//.subscribe((data: any) => { directions.push(data); console.log(data); });
        directions.push(smth);
        start = end;
      }
      this.sendData({ command: Command.Search, data: directions });

    }
  }

  sendData(data: CommandData) {
    this.emitData.emit(JSON.stringify(data));
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
    this.sendData({ command: Command.Remove, data: idx })
    if (this.points.length === 0)
      this.sendData({ command: Command.ClearAll, data: null})
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

  processCommand(str: string) {
    const commandData: CommandData = JSON.parse(str);
    if (commandData.command === Command.Add) {
      this.addPointToSearch(commandData.data);
    }
    else if (commandData.command === Command.Remove) {
      this.removeElement(commandData.data)
    }
    else {
      this.points = [];
    }
    
  }

  private addPointToSearch(marker: Marker) {
    let added = false;
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
