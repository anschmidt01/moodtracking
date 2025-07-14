import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
