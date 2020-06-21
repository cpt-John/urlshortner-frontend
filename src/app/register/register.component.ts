import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  requesting;
  profileForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private service: DataService,
    private toastr: ToastrService
  ) {
    this.requesting = false;
    this.profileForm = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,}'),
      ]),
      number: this.fb.control('', [Validators.pattern('[0-9+-]{8,13}')]),
      email: this.fb.control('', [Validators.required, Validators.email]),

      pass: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      rpass: this.fb.control('', Validators.required),
    });
  }

  ngOnInit(): void {}

  updatePatt() {
    this.profileForm
      .get('rpass')
      .setValidators([
        Validators.required,
        Validators.pattern(this.profileForm.get('pass').value),
      ]);
    this.profileForm
      .get('rpass')
      .updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  register() {
    this.requesting = true;
    this.service.register(this.mapVals(this.profileForm.value)).subscribe(
      (responce) => {
        console.log(responce);
        this._router.navigate(['/login']);
        this.toastr.success(responce['message']);
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
      name: obj['name'],
      number: obj['number'],
      email: obj['email'],
      password: obj['pass'],
    };
  }
}
