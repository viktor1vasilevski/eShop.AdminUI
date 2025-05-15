import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private subcategoryAddedOrEditedSource = new BehaviorSubject<boolean>(false);
  subcategoryAddedOrEdited$ =
    this.subcategoryAddedOrEditedSource.asObservable();

  constructor(private _dataApiService: DataService) {}
}
