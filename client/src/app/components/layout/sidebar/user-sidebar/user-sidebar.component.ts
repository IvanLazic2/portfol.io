import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { NgxGravatarService } from 'ngx-gravatar';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedImage: string | undefined;
  selectedProfilePictureFile: File | undefined;
  shouldDeleteProfilePicture: boolean;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected location: Location,
    protected userService: UserService,
    private gravatarService: NgxGravatarService,
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]]
    });
  }

  get User() {
    return this.userService.User;
  }

  get ProfilePictureUrl() {
    return this.userService.ProfilePictureSrcUrl;
  }

  get fullName() {
    return this.form.get('fullName') as FormControl;
  }

  get bio() {
    return this.form.get('bio') as FormControl;
  }

  ngOnInit(): void {
      this.userService.setIsEditing(false);
  }

  setForm() {
    this.fullName.setValue(this.User.FullName);
    this.bio.setValue(this.User.Bio);
  }

  protected Edit() {
    this.setForm();
    this.userService.setIsEditing(true);
  }

  protected CancelEditing() {
    this.selectedImage = undefined;
    this.selectedProfilePictureFile = undefined;
    this.userService.setIsEditing(false);
  }

  protected async ClearProfilePicture() {
    this.userService.ClearProfilePicture();
    this.selectedImage = undefined;
    this.selectedProfilePictureFile = undefined;
    this.fileInput.nativeElement.value = '';
  }

  async onSubmit() {
    await lastValueFrom(this.userService.EditUser({ FullName: this.fullName.value, Bio: this.bio.value }));
    
    if (this.User.ProfilePictureId)
      await lastValueFrom(this.userService.DeleteProfilePicture());

    if (this.selectedProfilePictureFile)
      await lastValueFrom(this.userService.ChangeProfilePicture(this.selectedProfilePictureFile));


    

      

    this.selectedImage = undefined;
    this.selectedProfilePictureFile = undefined;
    await this.userService.GetUser();

    this.userService.setIsEditing(false);
  }

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {

      this.selectedProfilePictureFile = fileInput.files[0];
      this.selectedImage = URL.createObjectURL(this.selectedProfilePictureFile);

      // You can also update the Gravatar URL here
      // For demonstration purposes, let's assume you have the URL here.
      //const newImageUrl = 'URL_TO_NEW_IMAGE'; // Replace with the actual URL

      //this.profileImageUrl = this.gravatarService.generateGravatarUrl(newImageUrl);
    }
  }

  async onDeleteProfilePicture() {
    await lastValueFrom(this.userService.DeleteProfilePicture()); 
  }

  /*canShowNewProject(): boolean {
    return ["/user"].every((path) => this.location.path().startsWith(path));
  }*/
}
