import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = 'https://john-url-shortner.herokuapp.com/';
  constructor(private http: HttpClient) {}
  login(bodyData): Observable<any> {
    return this.http.post(this.baseUrl + 'login', bodyData);
  }
  register(bodyData): Observable<any> {
    return this.http.post(this.baseUrl + 'register', bodyData);
  }
  verifyEmail(bodyData) {
    return this.http.post(this.baseUrl + 'verifyEmail', bodyData);
  }
  resetPassLink(bodyData) {
    return this.http.post(this.baseUrl + 'resetPassLink', bodyData);
  }
  resetPass(bodyData) {
    return this.http.post(this.baseUrl + 'resetPass', bodyData);
  }
  verifyLogin(bodyData) {
    return this.http.post(this.baseUrl + 'verifyLogin', bodyData);
  }
  setData(bodyData) {
    return this.http.post(this.baseUrl + 'setUrl', bodyData);
  }
  getData(bodyData) {
    return this.http.post(this.baseUrl + 'getUrls', bodyData);
  }
  deleteData(bodyData) {
    return this.http.post(this.baseUrl + 'deleteUrl', bodyData);
  }
}
