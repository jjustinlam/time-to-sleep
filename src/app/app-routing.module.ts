import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/setup',
    // redirectTo: 'pages/my-schedule',
    pathMatch: 'full',
  },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },
  {
    path: 'pages/my-schedule',
    loadChildren: () => import('./pages/my-schedule/my-schedule.module').then( m => m.MySchedulePageModule)
  },
  {
    path: 'pages/overnight-sleep',
    loadChildren: () => import('./pages/overnight-sleep/overnight-sleep.module').then( m => m.OvernightSleepPageModule)
  },
  {
    path: 'pages/sleepiness',
    loadChildren: () => import('./pages/sleepiness/sleepiness.module').then( m => m.SleepinessPageModule)
  },
  {
    path: 'pages/settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'pages/setup',
    loadChildren: () => import('./pages/setup/setup.module').then( m => m.SetupPageModule)
  },
  {
    path: 'pages/coffee',
    loadChildren: () => import('./pages/coffee/coffee.module').then( m => m.CoffeePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
