import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'newLineAsEnter',
})
export class newLineAsEnterPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const transformedText = value.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(transformedText);
  }
}
