import { Component, ElementRef, OnChanges, OnInit, OnDestroy, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, lastValueFrom, firstValueFrom, Subscription, forkJoin, subscribeOn, timeout } from 'rxjs';
import { UploadService } from 'src/app/services/upload/upload.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { ProjectPOST } from 'src/app/types';

import { GalleryItem, ImageItem, Gallery, ImageSize, ThumbnailsPosition, GalleryRef } from 'ng-gallery';
import { Lightbox } from "ng-gallery/lightbox";
import { NgxMasonryOptions } from 'ngx-masonry';


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ProjectId: string;
  Project$: Observable<any>;
  Project: any;

  filesToAdd: File[] = [];
  uploadProgresses: { [key: string]: number } = {};
  uploadSubscriptions: Subscription[] = [];

  galleryItems: GalleryItem[] = [];
  galleryRef: GalleryRef;
  masonryOptions: NgxMasonryOptions = {
    itemSelector: '.masonry-item',
    horizontalOrder: true,
    gutter: 10,
    columnWidth: 200,
  }
  update: boolean;

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,

    private fb: FormBuilder,
    protected projectService: ProjectService,
    private route: ActivatedRoute,
    protected uploadService: UploadService,
    private router: Router,
    private elementRef: ElementRef,
  ) {
    this.form = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectConcept: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]]
    });


  }

  get projectName() {
    return this.form.get('projectName') as FormControl;
  }

  get projectConcept() {
    return this.form.get('projectConcept') as FormControl;
  }

  async ngOnInit(): Promise<void> {
    this.ProjectId = await this.getId();

    await this.getProject();

    this.galleryInit();



    this.setForm();
  }

  galleryInit(): void {
    this.galleryRef = this.gallery.ref('lightbox');

    this.galleryRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom,
      loadingStrategy: 'lazy',

    });

    this.lightbox.setConfig({
      panelClass: 'fullscreen',
    });

    this.addImages();
  }

  @ViewChildren('gallery-item') galleryItemElements: QueryList<any>;

  async ngAfterViewInit() {
    this.galleryItemElements.changes.subscribe(element => {
      element.forEach((e: any) => this.test(e.nativeElement))
    })

    setTimeout(() => {
      this.update = !this.update;
    }, 1000);


  }

  test2() {
    //console.log(this.galleryItemElements)
    this.update = !this.update;
  }

  test(elm: any) {
    console.log(elm);
  }

  private addImages() {
    this.galleryItems = this.Project.UploadIds.map((uploadId: any) => {
      const item = new ImageItem({ src: this.uploadService.UploadUrl + uploadId, thumb: this.uploadService.ThumbnailUrl + uploadId })
      //const item = new ImageItem({ src: '/api/upload/' + thumbnail.UploadId, thumb: '/api/thumbnail/' + thumbnail.UploadId })
      return item;
    });

    this.galleryRef.load(this.galleryItems);

  }

  async HighlightUpload(uploadId: string) {
    await lastValueFrom(this.projectService.HighlightUpload(uploadId));
  }

  private async getId() {
    let id = ""
    try {
      const params = await firstValueFrom(this.route.paramMap);
      id = params.get('id') ?? "";

    } catch (error) {
      console.error(error);
    }
    return id;
  }

  private async getProject() {
    this.Project$ = this.projectService.GetProject(this.ProjectId);
    this.Project = await lastValueFrom(this.Project$);
  }

  private async getThumbnails() {
    //this.Thumbnails = await lastValueFrom(this.filesService.GetThumbnails(this.ProjectId));
  }

  private async setForm() {
    this.projectName.setValue(this.Project.Name);
    this.projectConcept.setValue(this.Project.Concept);
  }

  protected Edit() {
    this.setForm();
    this.projectService.setIsEditing(true);
  }

  protected async onSubmit() {
    const projectName = this.form.value.projectName;
    const projectConcept = this.form.value.projectConcept;

    const project: ProjectPOST = {
      Name: projectName,
      Concept: projectConcept
    };

    try {
      const editResponse = await firstValueFrom(this.projectService.EditProject(this.ProjectId, project));

      const uploadResponses$ = this.uploadService.UploadProjectFiles(this.ProjectId, this.filesToAdd);

      const uploadPromises = uploadResponses$.map(([fileName, response$]) => {
        return new Promise<void>((resolve, reject) => {
          const uploadSubscription = response$.subscribe({
            next: event => {
              if (event.type === HttpEventType.UploadProgress && event.total !== undefined) {
                this.uploadProgresses[fileName] = Math.round((100 * event.loaded) / event.total);
              } else if (event.type === HttpEventType.Response) {
                delete this.uploadProgresses[fileName];
                console.log(fileName, event.body);
                resolve(); // Resolve the promise on successful upload
              }
            },
            error: (error: any) => {
              reject(error); // Reject the promise on upload error
            }
          });

          this.uploadSubscriptions.push(uploadSubscription);
        });
      });

      await Promise.all(uploadPromises); // Wait for all uploads to complete

    } catch (error) {
      console.error(error);
      // Handle error, provide feedback to the user, etc.
    }

    // Cleanup upload subscriptions
    for (const subscription of this.uploadSubscriptions) {
      subscription.unsubscribe();
    }

    try {

      await this.getProject();
      await this.getThumbnails();
      this.addImages();

    } catch (error) {
      console.error(error);
      // Handle error while getting project or thumbnails
    }

    this.filesToAdd = [];
    this.projectService.setIsEditing(false);
  }

  onSelect(event: any) {
    this.filesToAdd.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.filesToAdd.splice(this.filesToAdd.indexOf(event), 1);
  }

  protected async Delete() {
    const result = await firstValueFrom(this.projectService.DeleteProject(this.ProjectId));
    this.router.navigate(['/']); // TEMP!!!
  }

  protected async DeleteUpload(uploadId: string) {
    const deleteResponse = await lastValueFrom(this.uploadService.DeleteUpload(uploadId));

    //await this.getThumbnails();
    await this.getProject();
    this.addImages();
  }

  ngOnDestroy(): void {
    this.galleryRef.destroy();
  }
}
