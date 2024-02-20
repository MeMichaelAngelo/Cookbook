import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[lettersOnly]',
})
export class LettersOnly {
  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const allowedCharacters = /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/;
    if (
      !allowedCharacters.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== 'Delete'
    ) {
      event.preventDefault();
    }
  }
}
