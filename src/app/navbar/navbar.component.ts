import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../api/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private apiService: RestApiService, private router: Router) { }

  ngOnInit() { }
  
  onLogout() {
    this.apiService.userID = '';
    this.router.navigate(['login']);
  }
}
