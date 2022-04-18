import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callback'
})
export class CallbackPipe implements PipeTransform {

  // this pipe takes a callback
  // the callback decides for each item whether T/F
  // also, all parameters are passed to the callback if possible
  transform(items: any[], callback: (item: any, ...args) => boolean, ...args): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter(item => callback(item, ...args));
  }

}
