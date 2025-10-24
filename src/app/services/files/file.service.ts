import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONST_API_PATHS } from '@services/api.constants';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  constructor(private http: HttpClient) {}

  getImage(id: number): Observable<Blob> {
    return this.http.get(`${CONST_API_PATHS.IMAGES}/${id}`, { responseType: 'blob' });
  }
}