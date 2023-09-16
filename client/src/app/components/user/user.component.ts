import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGravatarService } from 'ngx-gravatar';
import { lastValueFrom } from 'rxjs';
import { IntersectionObserverService } from 'src/app/services/IntersectionObserver/intersection-observer-service.service';
import { UserService } from 'src/app/components/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [IntersectionObserverService]
})
export class UserComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  //selectedImage: string | undefined;
  selectedProfilePictureFile: File | undefined;
  shouldDeleteProfilePicture: boolean;
  profilePicture: string;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected location: Location,
    protected activatedRoute: ActivatedRoute,
    protected userService: UserService,
    private gravatarService: NgxGravatarService,
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]]
    });

    /*activatedRoute.params.subscribe(async val => {
      console.log("init")

      this.userService.setIsEditing(false);
      await this.getUser();
    });*/
  }

  get fullName() {
    return this.form.get('fullName') as FormControl;
  }

  get bio() {
    return this.form.get('bio') as FormControl;
  }

  async ngOnInit() {
      console.log("init")

      this.userService.setIsEditing(false);
      this.userService.GetCurrentUser(this.activatedRoute.snapshot.params['username']);

      this.profilePicture = this.userService.GetCurrentUserProfilePictureUrl();
  }

  setForm() {

    this.fullName.setValue(this.userService.LoggedInUser.FullName);
    this.bio.setValue(this.userService.LoggedInUser.Bio);
  }

  protected Edit() {
    this.setForm();
    this.userService.setIsEditing(true);

    this.shouldDeleteProfilePicture = false;
  }

  protected CancelEditing() {
    //this.selectedImage = undefined;
    this.selectedProfilePictureFile = undefined;
    this.userService.setIsEditing(false);

    this.shouldDeleteProfilePicture = false;
  }

  protected async ClearProfilePicture() {
    this.userService.ClearProfilePicture();
    //this.selectedImage = undefined;
    this.selectedProfilePictureFile = undefined;
    this.fileInput.nativeElement.value = '';

    this.profilePicture = '';

    if (this.userService.LoggedInUser.ProfilePictureId) {
      this.shouldDeleteProfilePicture = true;
    }
  }

  async onSubmit() {
    await lastValueFrom(this.userService.EditUser({ EditedUserUsername: this.userService.CurrentUser.Username, FullName: this.fullName.value, Bio: this.bio.value }));
    
    if (this.shouldDeleteProfilePicture)
      await lastValueFrom(this.userService.DeleteProfilePicture());

    if (this.selectedProfilePictureFile)
      await lastValueFrom(this.userService.ChangeProfilePicture(this.selectedProfilePictureFile));


    

      

    //this.selectedImage = undefined;
    this.selectedProfilePictureFile = undefined;
    await this.userService.GetCurrentUser(this.userService.LoggedInUser.Username);
    await this.userService.GetLoggedInUser();
    this.profilePicture = this.userService.GetCurrentUserProfilePictureUrl();

    console.log(this.userService.LoggedInUser.ProfilePictureId)

    this.userService.setIsEditing(false);
  }

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {

      this.selectedProfilePictureFile = fileInput.files[0];
      this.profilePicture = URL.createObjectURL(this.selectedProfilePictureFile);

      // You can also update the Gravatar URL here
      // For demonstration purposes, let's assume you have the URL here.
      //const newImageUrl = 'URL_TO_NEW_IMAGE'; // Replace with the actual URL

      //this.profileImageUrl = this.gravatarService.generateGravatarUrl(newImageUrl);
    }
  }

  async onDeleteProfilePicture() {
    await lastValueFrom(this.userService.DeleteProfilePicture()); 
  }
}
