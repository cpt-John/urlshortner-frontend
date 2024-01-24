import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  requesting;
  profileForm: FormGroup;
  userData = {};
  data = [];
  filteredData = [];
  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private service: DataService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      url: this.fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.verifyLogin();
  }
  logout() {
    window.localStorage.removeItem('loginToken');
    this._router.navigate(['/login']);
    this.toastr.warning('Logged Out!');
  }
  verifyLogin() {
    let jwt = window.localStorage.getItem('loginToken');
    this.requesting = true;
    this.service.verifyLogin({ jwt }).subscribe(
      (responce) => {
        this.requesting = false;
        console.log(responce);
        this.toastr.success(responce['message']);
        this.getData();
        this.userData = responce['result'];
      },
      (error) => {
        console.log(error);
        this.requesting = false;
        if (!error['error']['message']) {
          this.toastr.error('Network Error!');
          this.logout();
          return;
        }
        console.log(error['error']['message']);
        this.toastr.error(error['error']['message']);
        this.logout();
      }
    );
  }
  setData() {
    let jwt = window.localStorage.getItem('loginToken');
    this.requesting = true;
    let bodyData = {
      jwt,
      name: this.profileForm.get('name').value,
      url: this.profileForm.get('url').value,
    };
    this.service.setData(bodyData).subscribe(
      (responce) => {
        this.requesting = false;
        console.log(responce);
        this.toastr.success(responce['message']);
        this.getData();
      },
      (error) => {
        console.log(error);
        this.requesting = false;
        if (!error['error']['message']) {
          this.toastr.error('Network Error!');
          return;
        }
        console.log(error['error']['message']);
        this.toastr.error(error['error']['message']);
      }
    );
  }
  getData() {
    let jwt = window.localStorage.getItem('loginToken');
    this.service.getData({ jwt }).subscribe(
      (responce) => {
        this.requesting = false;
        console.log(responce);
        this.data = responce['data'];
        this.filteredData = this.data;
      },
      (error) => {
        console.log(error);
        if (!error['error']['message']) {
          this.toastr.error('Network Error!');
          return;
        }
        console.log(error['error']['message']);
        this.toastr.error(error['error']['message']);
        this.verifyLogin();
      }
    );
  }
  deleteData(value: string) {
    let jwt = window.localStorage.getItem('loginToken');
    let bodyData = {
      jwt,
      url_short: value,
    };
    console.log(bodyData);
    this.service.deleteData(bodyData).subscribe(
      (responce) => {
        this.requesting = false;
        console.log(responce);
        this.toastr.warning('deleated');
        this.getData();
      },
      (error) => {
        console.log(error);
        if (!error['error']['message']) {
          this.toastr.error('Network Error!');
          return;
        }
        console.log(error['error']['message']);
        this.toastr.error(error['error']['message']);
        this.verifyLogin();
      }
    );
  }

  copyLink(value) {
    let helper = <HTMLInputElement>document.getElementById('copy-temp');
    helper.type = 'text';
    helper.value = value;
    helper.select();
    document.execCommand('copy');
    helper.type = 'hidden';
    this.toastr.success('Copied!');
  }
  filter() {
    let filterVal = (<HTMLInputElement>document.getElementById('search')).value;
    if (!filterVal) {
      this.filteredData = this.data;
      return;
    }
    let regex = new RegExp('^' + filterVal, 'i');
    this.filteredData = this.data.filter((item) => {
      return regex.test(item['name']);
    });
  }
}
