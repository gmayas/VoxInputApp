import { Injectable } from '@angular/core';

declare const webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {

  // Inicializar la API de reconocimiento de voz
  private recognition: any = new webkitSpeechRecognition();
  // Variable para almacenar la transcripción del reconocimiento de voz
  transcript: any;

  constructor() { }

  public init(): void {
    // Configurar la API de reconocimiento de voz
    // La API de reconocimiento de voz está disponible
    if (!('webkitSpeechRecognition' in window)) {
      console.error('La API de reconocimiento de voz no está disponible en este navegador.');
      return;
    }
    console.log('API de reconocimiento de voz disponible');
    this.recognition.continuous = false; // Continuar reconociendo después de una pausa
    this.recognition.lang = 'es-MX'; // Establecer el idioma a español de México
    this.recognition.interimResults = false; // No mostrar resultados intermedios

    // Manejar el evento de inicio del reconocimiento de voz
    this.recognition.onresult = (event: any) => {
      event.preventDefault();
      // Obtener la transcripción del reconocimiento de voz
      this.transcript = event.results[event.results.length - 1][0].transcript;
      console.log('Transcripción:', this.transcript); // Mensaje de depuración
      // Actualizar el campo de entrada con la transcripción
      if (this.validateTranscrip(this.transcript)) {
        return
      }
    };
    // Manejar el evento de error del reconocimiento de voz
    this.recognition.onerror = (event: any) => {
      event.preventDefault();
      console.error('Error en el reconocimiento de voz:', event.error); // Mensaje de error
      this.transcript = ''; // Limpiar la transcripción en caso de error    
      if (this.validateTranscrip(this.transcript)) {
        return
      }
    };
  }

  // Método para iniciar el reconocimiento de voz
  public start(): void {
    // Iniciar el reconocimiento de voz
    this.recognition.start();
  }

  // Método para detener el reconocimiento de voz
  public stop(): void {
    // Detener el reconocimiento de voz
    this.recognition.stop();
  }

  validateTranscrip(transcript: string): boolean {
    let errorMsg: string = ''; // Variable para almacenar el mensaje de error
    const inputMsg = document.getElementById('inputMsg') as HTMLInputElement;
    const inputHelp = document.getElementById('inputHelp') as HTMLElement; // Obtener el elemento de ayuda
    console.log('Validando transcripción:', transcript); // Mensaje de depuración
    // Eliminar espacios en blanco y convertir a minúsculas
    transcript = transcript.replace(/\s+/g, '').toLowerCase().trim();
    inputMsg.value = transcript; // Actualizar el valor del campo de entrada
    inputHelp.textContent = ''; // Limpiar el campo de ayuda
    // Validar la transcripción si es nula o vacía
    if (!transcript || transcript.trim() === '') {
      errorMsg = 'Transcripción vacía o no válida'; // Mensaje de error
      console.log(errorMsg);// Mensaje de depuración
      if (inputHelp) {
        inputHelp.textContent = errorMsg; // Mostrar mensaje de error en el campo de ayuda
        inputHelp.classList.add('text-danger'); // Agregar clase de error
      }
      this.readTranscript(errorMsg); // Leer mensaje de error
      return false; // Retornar falso si la transcripción es inválida
    }
    // Validar la transcripción si es demasiado corta
    if (transcript.length <= 3) {
      errorMsg = 'Transcripción demasiado corta'; // Mensaje de error
      console.log(errorMsg); // Mensaje de depuración
      if (inputHelp) {
        inputHelp.textContent = errorMsg; // Mostrar mensaje de error en el campo de ayuda
        inputHelp.classList.add('text-danger'); // Agregar clase de error
      }
      this.readTranscript(errorMsg); // Leer mensaje de error
      return false; // Retornar falso si la transcripción es inválida
    }
    // Validar la transcripción si contiene caracteres permitidos
    // caracteres permitidos: letras, números y acentos
    const validChars = /^[a-z0-9áéíóúñÁÉÍÓÚÑüÜ\s]+$/;
    if (!validChars.test(transcript)) {
      errorMsg = 'Transcripción contiene caracteres no permitidos'; // Mensaje de error
      console.log(errorMsg); // Mensaje de depuración
      inputHelp!.textContent = errorMsg; // Mostrar mensaje de error en el campo de ayuda
      inputHelp!.classList.add('text-danger'); // Agregar clase de error
      this.readTranscript(errorMsg); // Leer mensaje de error
      return false; // Retornar falso si la transcripción es inválida
    }

    // Validar la transcripción si es demasiado larga   
    if (transcript.length > 15) {
      errorMsg = 'Transcripción demasiado larga no mayor a 15 caracteres'; // Mensaje de error
      console.log(errorMsg); // Mensaje de depuración
      inputHelp!.textContent = errorMsg; // Mostrar mensaje de error en el campo de ayuda
      inputHelp!.classList.add('text-danger'); // Agregar clase de error
      this.readTranscript(errorMsg); // Leer mensaje de error
      return false; // Retornar falso si la transcripción es inválida
    }

    // Mostrar la transcripción en el campo de entrada
    this.readTranscript(transcript); // Leer el texto transcrito
    inputHelp!.textContent = 'Transcripción válida'; // Mostrar mensaje de éxito en el campo de ayuda
    inputHelp!.classList.remove('text-danger'); // Eliminar clase de error
    return true; // Retornar verdadero si la transcripción es válida
  }

  readTranscript(transcript: string): void {
    console.log('Leyendo texto:', transcript); // Mensaje de depuración
    const speech = new SpeechSynthesisUtterance(transcript);
    speech.volume = 1; // Volumen (0 a 1)
    speech.rate = 1; // Velocidad (0.1 a 10)
    speech.pitch = 1; // Tono (0 a 2)  
    speech.lang = 'es-MX'; // Establecer el idioma a español de México
    window.speechSynthesis.speak(speech); // Reproducir el texto
    speech.onend = () => {
      console.log('Lectura finalizada'); // Mensaje de depuración
    };
  }

}
