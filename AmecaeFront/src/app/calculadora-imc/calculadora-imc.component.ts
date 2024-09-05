import { Component } from '@angular/core';
import {  CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { MenuComponent } from "../components/menu/menu.component";

@Component({
    selector: 'app-calculadora-imc',
    standalone: true,
    templateUrl: './calculadora-imc.component.html',
    styleUrl: './calculadora-imc.component.css',
    imports: [CommonModule, FormsModule, SidebarComponent, MenuComponent]
})
export class CalculadoraIMCComponent {
  peso: number = 0;
  altura: number = 0;
  imc: number | undefined;

  calcularIMC(): void {
    if (this.altura > 0) {
      let alturaEnMetros = this.altura / 100;
      this.imc = this.peso / (alturaEnMetros * alturaEnMetros);
    }
  }
}
