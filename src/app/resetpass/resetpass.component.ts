import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css'],
})
export class ResetpassComponent implements OnInit {
  requesting = false;
  profileForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private service: DataService,
    private toastr: ToastrService,
    private route_: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
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
  resetPass() {
    this.requesting = true;
    let bodydata = {
      password: this.profileForm.get('pass').value,
      jwt: this.route_.snapshot.params['key'],
    };
    this.service.resetPass(bodydata).subscribe(
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
}
