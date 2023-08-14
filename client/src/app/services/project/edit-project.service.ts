import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditProjectService {
  private isEditing = false;

  setIsEditing(value: boolean) {
    this.isEditing = value;
  }

  getIsEditing() {
    return this.isEditing;
  }
}
