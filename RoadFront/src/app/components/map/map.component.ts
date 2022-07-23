/// <reference types="@types/googlemaps" />
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
        address = address.substring(address.indexOf(' ') + 1);
        if (push) {
          const marker = {
            latitude: lat,
            longitude: lng,
            label: address
            };
          this.location.markers.push(marker);
          this.sendData(marker);
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
          label: this.getReverseGeocodingData(lat, long)
        }
      ]
    };
  }

  addMarker(event: any) {
    this.getReverseGeocodingData(event.coords.lat, event.coords.lng, true);
  }

  selectMarker(event: any) {
    this.selectedMarker = {
      latitude: event.latitude,
      longitude: event.longitude,
      label: ""
    }
  }

  sendData(marker: Marker) {
    this.emitData.emit(JSON.stringify(marker));
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
