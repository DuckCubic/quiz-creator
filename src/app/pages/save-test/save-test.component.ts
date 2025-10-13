import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-save-test',
  imports: [],
  templateUrl: './save-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SaveTestComponent implements OnInit {

  ngOnInit(): void { }

}
