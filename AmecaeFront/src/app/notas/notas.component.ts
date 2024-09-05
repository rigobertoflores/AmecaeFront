import { Component, ElementRef, EventEmitter, Input, OnInit, Output,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { CommonModule } from '@angular/common';
import { Service } from './../Services/Service';
import { nota } from '../interface/nota';
@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CKEditorModule,FormsModule,CommonModule],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.css'
})
export class NotasComponent implements OnInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() notas: nota[];
  @Input() clave: string;
  @Input() fechaActual: string ;

  public model = {
    editorData: '<p>Hello, world!</p>'
};
  data: string="";

  constructor(private el: ElementRef,private Service: Service,) { }
  
  ngOnInit(): void {
   
  }

  saveText() {    
  // const datos = { id: this.id, data: this.data };
  // this.datosDisponibles.emit(datos);    
  }
  



 onChange( {editor} : ChangeEvent  ) {
      const data = editor.getData();
      // const dataactualiza={id:this.id,data:data}
      // this.testeditordata.emit("sdfsdfsdfsdf");  
  }

  printDocument(): void {
    window.print();
  }

  // GuardarReceta(receta:any) {  
  // }

  guardarEditarreceta(data:[id:number,data:string]) {
      if(data[1]!=null){
        const receta : nota={clave:Number(this.clave),notas:data[1],fecha: this.fechaActual,id:data[0]}
        this.Service.postData('PostNotas',receta).subscribe(
          (result:nota[])=>{
            this.data="";
           this.notas=result;
           console.log(result);
          }
        )
      }
    };
  
    borrarreceta(data:[id:number,data:string]) {
      if(data[1]!=null){
        const receta : nota={clave:Number(this.clave) || 0,notas:data[1],fecha: this.fechaActual,id:data[0]}
        this.Service.postData('PostDeleteNotas',receta).subscribe(
          (result:nota[])=>{
            this.data="";
           this.notas=result;
           console.log(result);
          }
        )
      }
    };

    printContent(notas:any) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if(printWindow){
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write(notas);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
    }
}



