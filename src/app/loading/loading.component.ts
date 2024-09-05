import { ApplicationConfig, Component } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { provideLottieOptions } from 'ngx-lottie';
import { CommonModule, NgIf } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],
};
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [LottieComponent,CommonModule,NgIf],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  loading: boolean = true;
  options: AnimationOptions = {
    path: '/assets/Loading.json',
  };


  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }


}
