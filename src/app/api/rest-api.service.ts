import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {
  
  // Define API
  apiURL = 'http://localhost:5000';
  userID: string = '';
  

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  // HttpClient API get() method => Fetch employees list
  getUserCatalogs() {
    return this.http.post<any[]>(this.apiURL + '/user-catalogs', JSON.stringify({"user_id": this.userID}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }
  
  uploadCatalogFiles(formData: any) {
    return this.http.post<any[]>(this.apiURL + '/upload-catalog-resumes', formData)
    .pipe(
      catchError(this.handleError)
    )  
  }

  catalogQualifications(catalogId: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-qualification', 
      JSON.stringify({"user_id": this.userID, "catalog_id": catalogId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  catalogSkills(catalogId: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-skills', 
      JSON.stringify({"user_id": this.userID, "catalog_id": catalogId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }
  
  catalogFiles(catalogId: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-files', 
      JSON.stringify({"user_id": this.userID, "catalog_id": catalogId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  catalogMatchedProfiles(catalogId: string, minExp: number, maxExp: number, qualifications: any[], 
    req_skills: any[], opt_skills: any[]) {
    return this.http.post<any[]>(this.apiURL + '/short-list-profiles', 
      JSON.stringify({"user_id": this.userID, "catalog_id": catalogId, "min_exp": minExp, "max_exp": maxExp, 
      "req_skills": req_skills, "opt_skills": opt_skills, "qualifications": qualifications}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  extractFileData(catalogId: string) {
    return this.http.post<any[]>(this.apiURL + '/extract-catalog-resumes-data', 
      JSON.stringify({"user_id": this.userID, "catalog_id": catalogId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  getUserCatalogDetails() {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-details', JSON.stringify({"user_id": this.userID}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  deleteCatalog(catalogId: string) {
    return this.http.post<any[]>(this.apiURL + '/delete-catalog', JSON.stringify({"user_id": this.userID, "catalog_id": catalogId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  deleteCatalogFile(catalogId: string, fileId: string) {
    return this.http.post<any[]>(this.apiURL + '/delete-catalog-file', JSON.stringify({"user_id": this.userID, 
    "catalog_id": catalogId, "file_id": fileId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  updateCatalogFileData(fileId: string, name: string, email: any[], mobile: any[], skills: any[], 
    qualifications: any[], is_active: boolean) {
    return this.http.post<any[]>(this.apiURL + '/update-file-data', JSON.stringify({"user_id": this.userID, 
      "file_id": fileId, "name": name, "email": email, "mobile": mobile, "skills": skills, "qualifications": qualifications, 
      "is_active": is_active}), 
      this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  login(userName: string, password: string) {
    return this.http.post<any[]>(this.apiURL + '/login', JSON.stringify({"username": userName, "password": password}), 
      this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }
   
  // Error handling 
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}