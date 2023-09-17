import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGravatarService } from 'ngx-gravatar';
import { lastValueFrom } from 'rxjs';
import { IntersectionObserverService } from 'src/app/services/IntersectionObserver/intersection-observer-service.service';
import { UserService } from 'src/app/components/user/user.service';
import { Location } from '@angular/common';
import { faCancel, faEdit, faPencil, faPlus, faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [IntersectionObserverService]
})
export class UserComponent implements OnInit {
  editIcon: any = faPencil;
  changeIcon: any = faEdit;
  saveIcon: any = faSave;
  cancelIcon: any = faCancel;
  xIcon: any = faXmark;
  newIcon: any = faPlus;

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
    private toastService: ToastService,
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
    this.profilePicture = this.userService.GetCurrentUserProfilePictureUrl();
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
    try {
      const editUserResult = await lastValueFrom<any>(this.userService.EditUser({ EditedUserUsername: this.userService.CurrentUser.Username, FullName: this.fullName.value, Bio: this.bio.value }));
      this.toastService.showFromMessageType(editUserResult.messageType, editUserResult.message);

      if (this.shouldDeleteProfilePicture){
        const deleteProfilePictureResult = await lastValueFrom<any>(this.userService.DeleteProfilePicture());
        if (deleteProfilePictureResult.messageType !== "Success")
          this.toastService.showFromMessageType(deleteProfilePictureResult.messageType, deleteProfilePictureResult.message);
      }
        
      if (this.selectedProfilePictureFile){
        const changeProfilePictureResult = await lastValueFrom<any>(this.userService.ChangeProfilePicture(this.selectedProfilePictureFile));
        if (changeProfilePictureResult.messageType !== "Success")
          this.toastService.showFromMessageType(changeProfilePictureResult.messageType, changeProfilePictureResult.message);
      }
        

    } catch (error: any) {
      this.toastService.showFromCode(error.code, error.message);
      console.error(error);
    }







    //this.selectedImage = undefined;
    this.selectedProfilePictureFile = undefined;
    await this.userService.GetCurrentUser(this.userService.LoggedInUser.Username);
    await this.userService.GetLoggedInUser();
    this.profilePicture = this.userService.GetCurrentUserProfilePictureUrl();

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
    }
  }

  async onDeleteProfilePicture() {
    await lastValueFrom(this.userService.DeleteProfilePicture());
  }
}
