import { HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FilesService } from 'src/app/services/files/files.service';
import { UserService } from 'src/app/services/user/user.service';

@Pipe({
  name: 'secureImage',
})
export class SecureImagePipe implements PipeTransform {
  constructor(protected filesService: FilesService, protected userService: UserService) { }

  transform(id: string) {

    return new Observable<string>((observer) => {
      // This is a tiny blank image
      observer.next('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

      // The next and error callbacks from the observer
      const { next, error } = observer;

      this.filesService.GetImage(id)?.subscribe(response => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = function () {
          observer.next(reader.result?.toString());
        };
      });

      return { unsubscribe() { } };
    });
  }
}
