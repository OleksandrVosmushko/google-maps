/// <reference types="@types/googlemaps" />
import { PolylineManager } from '@agm/core';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Command, CommandData } from '../../models/Command';
import { Marker } from '../../models/Marker';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit, OnDestroy {
  location: Location
  @Output() emitData = new EventEmitter<string>();
  selectedMarker: Marker
  private defaultLatitude: number;
  private defaultLongitude: number;
  searchResult: Array<any>;

  constructor() {
    this.defaultLatitude = 50.450001;
    this.defaultLongitude = 30.523333;
    this.location = {
      latitude: this.defaultLatitude,
      longitude: this.defaultLongitude,
      mapType: "'SATELLITE'",
      zoom: 11,
      markers: []
    }
  }

  ngOnInit() {
    this.setCurrentPosition();
  }

  getReverseGeocodingData(lat: number, lng: number, push: boolean = false): string {
    const latlng = new google.maps.LatLng(lat, lng);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status);
      }
      if (status === google.maps.GeocoderStatus.OK) {
        let address = results[0].formatted_address;
        //address = address.substring(address.indexOf(' ') + 1);
        if (push) {
          const marker = {
            latitude: lat,
            longitude: lng,
            label: address
            };
          this.location.markers.push(marker);
          this.sendData(marker, Command.Add);
        }
        return address;
      }
    });
    return '';
  }

  setCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.prepareDefaultLocation(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser, please use google chrome.");
      this.prepareDefaultLocation(this.defaultLatitude, this.defaultLongitude)
    }
  }

  prepareDefaultLocation(lat: number, long: number) {
    return this.location = {
      latitude: lat,
      longitude: long,
      mapType: "satelite",
      zoom: 14,
      markers: [
        {
          latitude: lat,
          longitude: long,
          label: this.getReverseGeocodingData(lat, long, true)
        }
      ]
    };
  }

  addMarker(event: any) {
    this.getReverseGeocodingData(event.coords.lat, event.coords.lng, true);
  }

  selectMarker(event: any) {
    this.getReverseGeocodingData(event.latitude, event.longitude, true);
    this.selectedMarker = {
      latitude: event.latitude,
      longitude: event.longitude,
      label: ""
    }
    
  }

  processCommand(str: string) {
    const command: CommandData = JSON.parse(str);
    console.log(command);
    if (command.command === Command.Remove) {
      this.location.markers.splice(command.data, 1);
      console.log(this.location.markers);
    }
    else if (command.command === Command.ClearAll) {
      this.location.markers = [];
    }
    else if (command.command === Command.Search) {
      this.searchResult = command.data;
      console.log(this.getStepsFromSearchResult());
    }
  }

  getStepsFromSearchResult() {
    if (this.searchResult.length > 0)
      return this.searchResult[0].routes[0].legs[0].steps;
    return [];
  }

  sendData(marker: Marker, command: Command) {
    this.emitData.emit(JSON.stringify({ command: command, data: marker }));
  }

  public ngOnDestroy(): void {
    
  }
}



interface Location {
  latitude: number;
  longitude: number;
  zoom: number;
  mapType: string;
  markers: Array<Marker>;
}
