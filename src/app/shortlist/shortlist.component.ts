import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../api/rest-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-shortlist',
  templateUrl: './shortlist.component.html',
  styleUrls: ['./shortlist.component.css']
})
export class ShortlistComponent implements OnInit {

  public submitting: boolean = false;

  matchedProfiles: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  minExperience = null;
  maxExperience = null;

  userCatalogs = [];
  selectedCatalog = [];
  catalogSettings = { 
    singleSelection: true, 
    text:"Select Catalog",
    enableSearchFilter: true,
    searchPlaceholderText: "Search Catalog",
    classes: "myclass custom-class"
  };

  qualifications = [];
  selectedQualifications = [];
  qualificationsSettings = {
    singleSelection: false, 
    text:"Select Qualifications",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    searchPlaceholderText: "Search Qualification",
    badgeShowLimit:3,
    classes: "myclass custom-class"
  };

  requiredSkills = [];
  selectedReqSkills = [];
  requiredSkillsSettings = {
    singleSelection: false, 
    text:"Select Required Skills",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    searchPlaceholderText: "Search Skill",
    badgeShowLimit:6
  };

  optionalSkills = [];
  selectedOptionalSkills = [];
  optionalSkillsSettings = {
    singleSelection: false, 
    text:"Select Optional Skills",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    searchPlaceholderText: "Search Skill",
    badgeShowLimit:5
  };
  
  constructor(private apiService: RestApiService, private toastr: ToastrService, public router: Router) {  }

  ngOnInit() {
    this.getUserCatalogNames();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      scrollY: '300',
      scrollX: true
    };
  }

  public getUserCatalogNames(){
    this.apiService.getUserCatalogs(this.apiService.userID).subscribe((response)=>{
      if(response["status"] == "success"){
        for(let cat_index in response["data"]){
          this.userCatalogs.push({"id": cat_index + 2, "itemName": response["data"][cat_index]});
        }
      }else if(response["status"] == "error"){
        this.toastr.error("Unable to get catalog names", '', {
          timeOut: 1500,
          progressBar: true,
          closeButton: true
        });
        this.router.navigate(['']);
      }
    });
  }

  onCatalogSelect(name:any){
    this.getCatalogQualifications();
    this.getCatalogSkills();
  }

  onCatalogDeSelect(name:any){
    this.getCatalogQualifications();
    this.getCatalogSkills();
  }

  onCatalogDeSelectAll(name:any){
    this.selectedCatalog = [];
    this.getCatalogQualifications();
    this.getCatalogSkills();
  }

  getCatalogQualifications(){
    this.qualifications = [];
    this.requiredSkills= [];
    this.optionalSkills = [];
    this.selectedQualifications = [];
    this.selectedReqSkills = [];
    this.selectedOptionalSkills = [];
    if(this.selectedCatalog.length){
      this.apiService.catalogQualifications(this.apiService.userID, this.selectedCatalog[0]["itemName"])
        .subscribe((response)=>{
          if(response["status"] == "success"){
            for(let q_index in response["qualifications"]){
              this.qualifications.push({"id": q_index + 2, "itemName": response["qualifications"][q_index]});
            }
          }else if(response["status"] == "error"){
            this.toastr.error("Unable to get catalog qualifications", '', {
              timeOut: 1500,
              progressBar: true,
              closeButton: true
            });
          }
        });
    }
  }

  getCatalogSkills(){
    this.qualifications = [];
    this.requiredSkills= [];
    this.optionalSkills = [];
    this.selectedQualifications = [];
    this.selectedReqSkills = [];
    this.selectedOptionalSkills = [];
    if(this.selectedCatalog.length){
      this.apiService.catalogSkills(this.apiService.userID, this.selectedCatalog[0]["itemName"])
        .subscribe((response)=>{
          if(response["status"] == "success"){
            for(let sk_index in response["skills"]){
              this.requiredSkills.push({"id": sk_index+2, "itemName": response["skills"][sk_index]});
              this.optionalSkills.push({"id": sk_index+2, "itemName": response["skills"][sk_index]});
            }
          }else if(response["status"] == "error"){
            this.toastr.error("Unable to get catalog skills", '', {
              timeOut: 1500,
              progressBar: true,
              closeButton: true
            });            
          }
        });
    }
  }

  getMatchedProfiles(){
    this.matchedProfiles = [];
    var selQualifications = [];
    var selReqSkills = [];
    var selOptSkills = [];
    var catalog = this.selectedCatalog[0]["itemName"];
    if(this.minExperience == 0 || this.minExperience == null){
      this.minExperience = null;
    }
    if(this.maxExperience == 0 || this.maxExperience == null){
      this.maxExperience = null;
    }
    for (var ql of this.selectedQualifications) {
      selQualifications.push(ql['itemName']);
    }
    for (var rs of this.selectedReqSkills) {
      selReqSkills.push(rs['itemName']);
    }
    for (var os of this.selectedOptionalSkills) {
      selOptSkills.push(os['itemName']);
    }
    if(this.submitting===false){
      this.submitting = true;
      this.apiService.catalogMatchedProfiles(this.apiService.userID, catalog, this.minExperience,  this.maxExperience, 
        selQualifications, selReqSkills, selOptSkills)
        .subscribe((response)=>{
          if(response["status"] === "success"){
            if(!response["files"].length){
              this.toastr.info("No matching profiles found.", 'Results', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
              });  
            }
            this.matchedProfiles = response["files"];
          }else if(response["status"] === "error"){
            this.toastr.error("Unable to get catalog matched files", '', {
              timeOut: 3000,
              progressBar: true,
              closeButton: true
            });
          }
          this.submitting = false;
        });
        this.dtTrigger.next();
    }
  }
}