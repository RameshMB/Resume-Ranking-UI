import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { RestApiService } from '../api/rest-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  catalogDetails: any[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private apiService: RestApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      scrollY: '300',
      scrollX: true,
    };
    this.getUserCatalogDetails();
  }

  public getUserCatalogDetails(){
    this.apiService.getUserCatalogDetails(this.apiService.userID).subscribe((response)=>{
      if(response["status"] == "success"){
        this.catalogDetails = response['catalogs'];
      }else if(response["status"] == "error"){
        this.toastr.error("Unable to get catalog details", '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      }
    });
  }
}
