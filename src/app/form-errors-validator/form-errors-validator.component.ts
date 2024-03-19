import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-form-errors-validator',
  templateUrl: './form-errors-validator.component.html',
  styleUrls: ['./form-errors-validator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormErrorsValidatorComponent {
  @Input() errors!: string[] | undefined;
}
