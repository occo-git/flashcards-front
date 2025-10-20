import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '@config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.IMAGES;
  
  constructor(private http: HttpClient) {}

  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }
}