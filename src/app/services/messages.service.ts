import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private msgsApiUrl = 'https://msg-api-dpvt.vercel.app/api';

  constructor() { }

  // Method to fetch messages from the API
  getMessages() {
    return fetch(`${this.msgsApiUrl}/messages`);      
  }

  // Method to fetch a specific message by ID
  getMessageById(id: string) {
    const options = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({id}),
      };

    return fetch(`${this.msgsApiUrl}/messages/findById`, options);
  }

  // Method to send a new message
  sendMessage(message: any) { 
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message}),
    };

    return fetch(`${this.msgsApiUrl}/messages`, options);
  }

  // Method to delete a message by ID
  deleteMessage(id: string) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id}),
    };

    return fetch(`${this.msgsApiUrl}/messages`, options);
  } 
  
}
