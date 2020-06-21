import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  requesting;

  profileForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private service: DataService,
    private toastr: ToastrService,
    private route_: ActivatedRoute
  ) {
    this.requesting = false;
    if (localStorage.getItem('loginToken')) {
      this._router.navigate(['/home']);
    }
    this.profileForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),

      pass: this.fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.route_.snapshot.params['key']) {
      this.verifyMail();
    }
  }
  login() {
    this.requesting = true;
    this.service.login(this.mapVals(this.profileForm.value)).subscribe(
      (responce) => {
        console.log(responce);
        this.requesting = false;
        window.localStorage.setItem('loginToken', responce['token']);
        this._router.navigate(['/home']);
        // this.toastr.success(responce['message']);
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

  mapVals(obj) {
    return {
      email: obj['email'],
      password: obj['pass'],
    };
  }

  verifyMail() {
    let bodydata = {
      jwt: this.route_.snapshot.params['key'],
    };
    this.service.verifyEmail(bodydata).subscribe(
      (responce) => {
        this.requesting = false;
        console.log(responce);
        this.toastr.success(responce['message']);
        this._router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
        if (!error['error']['message']) {
          this.toastr.error('Network Error!');
        } else {
          console.log(error['error']['message']);
          this.toastr.error(error['error']['message']);
        }
        this._router.navigate(['/login']);
      }
    );
  }

  resetPassMail() {
    this.requesting = true;
    let mail = this.profileForm.get('email');
    if (!mail.valid) {
      this.toastr.warning('enter valid email');
      this.requesting = false;
      return;
    } else {
      this.service.resetPassLink({ email: mail.value }).subscribe(
        (responce) => {
          this.toastr.success(responce['message']);
          this.requesting = false;
        },
        (error) => {
          this.toastr.error(error['error']['message']);
          this.requesting = false;
        }
      );
    }
  }
}
