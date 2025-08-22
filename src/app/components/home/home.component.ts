import { Component } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Elementos del DOM
  inputMsg: HTMLElement | null = null;
  inputHelp: HTMLElement | null = null;

  constructor(public speech: SpeechRecognitionService, private messagesService: MessagesService) {
    this.speech.init();
  }

  ngOnInit(): void {
    //this.speech.init();
    this.inputMsg = document.getElementById('inputMsg');
    this.inputHelp = document.getElementById('inputHelp');
  }

  // Método para iniciar el reconocimiento de voz
  startRecognition(): void {
    (this.inputMsg as HTMLInputElement).value = ''; // Limpiar el campo de entrada
    this.speech.start(); // Iniciar el reconocimiento de voz
    console.log('Botón de grabación presionado'); // Mensaje de depuración
  }

  async sendMessage() {
    const inputMsg = document.getElementById('inputMsg') as HTMLInputElement;
    if (this.speech.validateTranscrip(inputMsg.value)) {
      console.log('Mensaje enviado:', inputMsg.value); // Mensaje de depuración
      let resMsg = await this.messagesService.sendMessage(inputMsg.value);
      let dataRes = await resMsg.json()
      console.log('Respuesta del servidor:', dataRes); // Mostrar la respuesta del servidor
      this.speech.readTranscript("mensaje enviado"); // Leer el mensaje enviado
    } else {
      console.error('Mensaje no válido'); // Mensaje de error
      this.speech.readTranscript("Mensaje no válido, intente nuevamente"); // Leer mensaje de error
      return; // Salir si el mensaje no es válido
    }
    inputMsg.value = ''; // Limpiar el campo de entrada después de enviar el mensaje
    if (this.inputHelp) {
      this.inputHelp.textContent = 'No mayor a 15 caractes.'; // Mostrar mensaje de éxito en el campo de ayuda
      this.inputHelp.classList.remove('text-danger'); // Eliminar clase de error
    }
  }
}
