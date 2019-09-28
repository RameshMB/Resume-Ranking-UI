import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../api/rest-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(private apiService: RestApiService, private toastr: ToastrService, public router: Router) { }

    ngOnInit() {
      if(this.apiService.userID){
        this.router.navigate(['dashboard']);
      }
    }
  
  public userLogin() {
    if(!this.loading){
      this.loading = true;
      this.apiService.login(this.username, this.password)
      .subscribe((response)=>{
        if(response["status"] === "success"){
          this.apiService.userID = response["user_id"];
          this.loading = false;
          this.router.navigate(['dashboard']);
        }else if(response["status"] === "error"){
          this.loading = false;
          this.toastr.error(response["message"], '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        }
      });
    }
  }
}
