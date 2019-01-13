import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  order: any;

  constructor() { }

  getUser() {
    let localUser = window.localStorage.getItem('user');
    if (!localUser) {
      window.alert('请登录!')
      return {}
    }
    return JSON.parse(localUser)
  }

  setUser(user) {
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    window.localStorage.removeItem('user');
  }  
}

export const loginService = new UtilService();