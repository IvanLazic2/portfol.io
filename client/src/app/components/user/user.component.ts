import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IntersectionObserverService } from 'src/app/services/IntersectionObserver/intersection-observer-service.service';
import { FilesService } from 'src/app/services/files/files.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [IntersectionObserverService]
})
export class UserComponent {
  //CurrentPage?: Page;
  //Action: string;
  //SortOrder: any = SortOrder;
  //_sortOrder: SortOrder = SortOrder.Default;
  SortDropdownLabel: string = "Default";

  /*PageTitles: { [id: string]: string } = 
  {
    "files": "Here you can find all your <b>files</b>",
    "shared": "Items you've <b>shared</b> with someone",
    "pinned": "You can easily access <b>pinned</b> items",
    "trash": "Items in <b>trash</b> will be removed after 15 days"
  }*/

  constructor(private router: Router, protected filesService: FilesService, protected userService: UserService) {
    //filesService.CurrentPage = router.routerState.snapshot.url.split('/').at(-1) as Page;
    //this.Action = "page_" + this.CurrentPage;
  }

  ngOnInit(): void {
    this.filesService.RefreshFiles();
  }

  SortFiles() {
    //this.filesService.SortOrder = this._sortOrder;
    this.filesService.SortFiles();
  }

}
